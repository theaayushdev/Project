from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_migrate import Migrate
from extensions import db
from model import User, Doctor

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
    contact = data.get('contact')
    password = data.get('password')

    if not contact or not password:
        return jsonify({'error': 'Contact and password are required.'}), 400

    if User.query.filter_by(contact=contact).first():
        return jsonify({'error': 'User with this contact already exists.'}), 409

    new_user = User(
        firstname=data.get('firstname'),
        lastname=data.get('lastname'),
        contact=contact,
        location=data.get('location'),
        age=data.get('age'),
        guardian_name=data.get('guardian_name'),
        guardian_contact=data.get('guardian_contact'),
        bloodtype=data.get('bloodtype'),
        email=data.get('email'),
        password=password,
        status='active'
    )
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully.'}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    contact = data.get('contact')
    password = data.get('password')

    if not contact or not password:
        return jsonify({'error': 'Contact and password are required.'}), 400

    user = User.query.filter_by(contact=contact, password=password).first()

    if user:
        return jsonify({'message': 'Loginsuccessful.'}), 200
    else:
        return jsonify({'error': 'Invalid contact or password.'}), 401

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
        department=data['department']
    )
    db.session.add(doctor)
    db.session.commit()
    return jsonify({'message': 'Doctor added successfully'}), 201

# ✅ NEW ROUTES to fetch data
@app.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    user_list = [{
        'patient_id': u.patient_id,
        'firstname': u.firstname,
        'lastname': u.lastname,
        'contact': u.contact,
        'location': u.location,
        'age': u.age,
        'bloodtype': u.bloodtype,
        'email': u.email
    } for u in users]
    return jsonify(user_list)

@app.route('/doctors', methods=['GET'])
def get_doctors():
    doctors = Doctor.query.all()
    doctor_list = [{
        'id': d.id,
        'firstname': d.firstname,
        'lastname': d.lastname,
        'phone_number': d.phone_number,
        'specialty': d.specialty,
        'department': d.department,
        'email': d.email
    } for d in doctors]
    return jsonify(doctor_list)

if __name__ == '__main__':
    app.run(debug=True)
