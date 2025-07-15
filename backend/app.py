from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_migrate import Migrate
from extensions import db
from model import User, Doctor, Appointment, PregnancyInfo
from datetime import datetime
from model import Admin

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://localhost:5174"]}})
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///Pregnify.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
migrate = Migrate(app, db)

@app.route('/')
def home():
    return "Welcome to Pregnify!"

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Email and password are required.'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'User with this email already exists.'}), 409

    new_user = User(
        firstname=data.get('firstname'),
        lastname=data.get('lastname'),
        contact=data.get('contact'),
        location=data.get('location'),
        age=data.get('age'),
        guardian_name=data.get('guardian_name'),
        guardian_contact=data.get('guardian_contact'),
        bloodtype=data.get('bloodtype'),
        email=email,
        password=password,
        status='active'
    )
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully.'}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Email and password are required.'}), 400

    user = User.query.filter_by(email=email, password=password).first()
    if user:
        return jsonify({'message': 'Login successful.'}), 200
    else:
        return jsonify({'error': 'Invalid email or password.'}), 401

@app.route('/add-doctor', methods=['POST'])
def add_doctor():
    data = request.get_json()
    doctor = Doctor(
        firstname=data['firstname'],
        lastname=data['lastname'],
        phone_number=data['phone_number'],
        gender=data['gender'],
        email=data['email'],
        medical_license_number=data['medical_license_number'],
        specialty=data['specialty'],
        department=data['department'],
        password=data['password']
    )
    db.session.add(doctor)
    db.session.commit()
    return jsonify({'message': 'Doctor added successfully'}), 201

@app.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([{
        'patient_id': u.patient_id,
        'firstname': u.firstname,
        'lastname': u.lastname,
        'contact': u.contact,
        'location': u.location,
        'age': u.age,
        'bloodtype': u.bloodtype,
        'email': u.email
    } for u in users])

@app.route('/doctors', methods=['GET'])
def get_doctors():
    doctors = Doctor.query.filter_by(status='on').all()
    return jsonify([{
        'id': d.id,
        'firstname': d.firstname,
        'lastname': d.lastname,
        'phone_number': d.phone_number,
        'specialty': d.specialty,
        'department': d.department,
        'email': d.email
    } for d in doctors]), 200

@app.route('/appointment', methods=['POST'])
def create_appointment():
    data = request.get_json()
    try:
        appointment_date = datetime.strptime(data['appointment_date'], '%Y-%m-%d').date()
        new_appointment = Appointment(
            user_id=data['user_id'],
            doctor_id=data['doctor_id'],
            appointment_date=appointment_date,
            status=data.get('status', 'pending')
        )
        db.session.add(new_appointment)
        db.session.commit()
        return jsonify({'message': 'Appointment created successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ✅ New Route to handle pregnancy info
@app.route('/pregnancy-info', methods=['POST'])
def submit_pregnancy_info():
    data = request.get_json()
    email = data.get('email')

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'error': 'User with this email not found.'}), 404

    try:
        new_info = PregnancyInfo(
            user_id=user.patient_id,
            lmc=datetime.strptime(data['lmc'], '%Y-%m-%d').date(),
            height=float(data['height']),
            weight=float(data['weight']),
            profession=data['profession'],
            gravida=int(data['gravida']),
            allergies=data.get('allergies', ''),
            conditions=data.get('conditions', ''),
            notes=data.get('notes', '')
        )
        db.session.add(new_info)
        db.session.commit()
        return jsonify({'message': 'Pregnancy info submitted successfully.'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400
@app.route('/pregnancy-info', methods=['GET'])
def get_pregnancy_info():
    try:
        info_list = PregnancyInfo.query.all()
        result = [{
            'id': info.id,
            'user_id': info.user_id,
            'height': info.height,
            'weight': info.weight,
            'profession': info.profession,
            'gravida': info.gravida,
            'allergies': info.allergies,
            'conditions': info.conditions,
            'notes': info.notes,
            'lmc': info.lmc.strftime('%Y-%m-%d') if info.lmc else None
        } for info in info_list]
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/appointments', methods=['GET'])
def get_appointments():
    all_appointments = Appointment.query.all()
    result = [{
        'id': a.id,
        'user_id': a.user_id,
        'doctor_id': a.doctor_id,
        'appointment_date': a.appointment_date.strftime('%Y-%m-%d'),
        'status': a.status
    } for a in all_appointments]
    return jsonify(result)


@app.route('/admin-login', methods=['POST'])
def admin_login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'error': 'Username and password are required.'}), 400

    admin = Admin.query.filter_by(username=username, password=password).first()
    if admin:
        return jsonify({'message': 'Login successful'}), 200
    else:
        return jsonify({'error': 'Invalid username or password'}), 401


if __name__ == '__main__':
    app.run(debug=True)
