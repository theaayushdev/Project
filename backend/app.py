from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_migrate import Migrate
from extensions import db
from model import User, Doctor, Appointment, PregnancyInfo, Message, Admin
from datetime import datetime
import os 
from sqlalchemy import func, or_, and_

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://localhost:5174", "http://localhost:5175", "http://127.0.0.1:5174", "http://127.0.0.1:5175"]}})


basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(basedir, 'instance', 'Pregnify.db')}"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
migrate = Migrate(app, db)



@app.route('/')
def home():
    return "Welcome to Pregnify!"

@app.route('/doctor/<int:doctor_id>', methods=['GET'])
def get_doctor(doctor_id):
    doctor = Doctor.query.get(doctor_id)
    if doctor:
        return jsonify({
            'id': doctor.id,
            'firstname': doctor.firstname,
            'lastname': doctor.lastname,
            'email': doctor.email,
            'phone_number': doctor.phone_number,
            'specialty': doctor.specialty,
            'department': doctor.department,
            'gender': doctor.gender,
            'medical_license_number': doctor.medical_license_number
        }), 200
    else:
        return jsonify({'error': 'Doctor not found'}), 404

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

@app.route('/doctor-appointments/<int:doctor_id>', methods=['GET'])
def get_doctor_appointments(doctor_id):
    try:
        appointments = Appointment.query.filter_by(doctor_id=doctor_id).all()
        result = []
        for appointment in appointments:
            user = User.query.get(appointment.user_id)
            result.append({
                'id': appointment.id,
                'appointment_date': appointment.appointment_date.strftime('%Y-%m-%d %H:%M:%S') if appointment.appointment_date else None,
                'status': appointment.status,
                'patient': {
                    'id': user.patient_id,
                    'firstname': user.firstname,
                    'lastname': user.lastname,
                    'email': user.email,
                    'contact': user.contact,
                    'age': user.age,
                    'bloodtype': user.bloodtype
                } if user else None
            })
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/doctor/patients/<int:doctor_id>', methods=['GET'])
def get_doctor_patients(doctor_id):
    try:
        appointments = Appointment.query.filter_by(doctor_id=doctor_id).all()
        patient_ids = set([appt.user_id for appt in appointments])
        patients = User.query.filter(User.patient_id.in_(patient_ids)).all()
        result = [
            {
                'id': p.patient_id,
                'firstname': p.firstname,
                'lastname': p.lastname,
                'email': p.email,
                'contact': p.contact,
                'age': p.age,
                'bloodtype': p.bloodtype
            }
            for p in patients
        ]
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/doctor-login', methods=['POST'])
def doctor_login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Email and password are required.'}), 400

    doctor = Doctor.query.filter_by(email=email, password=password).first()
    if doctor:
        return jsonify({
            'message': 'Login successful',
            'doctor': {
                'id': doctor.id,
                'firstname': doctor.firstname,
                'lastname': doctor.lastname,
                'specialty': doctor.specialty,
                'department': doctor.department,
                'email': doctor.email
            }
        }), 200
    else:
        return jsonify({'error': 'Invalid username or password'}), 401

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

# Messaging endpoints
@app.route('/send-message', methods=['POST'])
def send_message():
    data = request.get_json()
    try:
        # Ensure timestamp is always set
        new_message = Message(
            sender_id=data['sender_id'],
            receiver_id=data['receiver_id'],
            sender_type=data['sender_type'],
            receiver_type=data['receiver_type'],
            content=data['content'],
            timestamp=datetime.utcnow()
        )
        db.session.add(new_message)
        db.session.commit()
        return jsonify({'message': 'Message sent successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/get-messages/<sender_type>/<int:sender_id>/<receiver_type>/<int:receiver_id>', methods=['GET'])
def get_messages(sender_type, sender_id, receiver_type, receiver_id):
    try:
        # Fetch messages in both directions
        messages = Message.query.filter(
            (
                (Message.sender_type == sender_type) & (Message.sender_id == sender_id) &
                (Message.receiver_type == receiver_type) & (Message.receiver_id == receiver_id)
            ) | (
                (Message.sender_type == receiver_type) & (Message.sender_id == receiver_id) &
                (Message.receiver_type == sender_type) & (Message.receiver_id == sender_id)
            )
        ).order_by(Message.timestamp.asc()).all()

        result = []
        for msg in messages:
            result.append({
                'id': msg.id,
                'content': msg.content,
                'timestamp': msg.timestamp.strftime('%Y-%m-%d %H:%M:%S'),
                'sender_type': msg.sender_type,
                'sender_id': msg.sender_id,
                'receiver_type': msg.receiver_type,
                'receiver_id': msg.receiver_id,
                'is_read': msg.is_read
            })
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/get-conversations/<user_type>/<int:user_id>', methods=['GET'])
def get_conversations(user_type, user_id):
    try:
        # Get all unique conversations for a user
        if user_type == 'user':
            conversations = db.session.query(Message).filter(
                (Message.sender_type == 'user') & (Message.sender_id == user_id) |
                (Message.receiver_type == 'user') & (Message.receiver_id == user_id)
            ).all()
        else:
            conversations = db.session.query(Message).filter(
                (Message.sender_type == 'doctor') & (Message.sender_id == user_id) |
                (Message.receiver_type == 'doctor') & (Message.receiver_id == user_id)
            ).all()
        
        # Extract unique conversation partners
        partners = set()
        for msg in conversations:
            if msg.sender_type == user_type and msg.sender_id == user_id:
                partners.add((msg.receiver_type, msg.receiver_id))
            else:
                partners.add((msg.sender_type, msg.sender_id))
        
        result = []
        for partner_type, partner_id in partners:
            if partner_type == 'user':
                partner = User.query.get(partner_id)
                if partner:
                    result.append({
                        'id': partner.patient_id,
                        'name': f"{partner.firstname} {partner.lastname}",
                        'type': 'user',
                        'avatar': partner.firstname[0] + partner.lastname[0]
                    })
            else:
                partner = Doctor.query.get(partner_id)
                if partner:
                    result.append({
                        'id': partner.id,
                        'name': f"Dr. {partner.firstname} {partner.lastname}",
                        'type': 'doctor',
                        'specialty': partner.specialty,
                        'avatar': partner.firstname[0] + partner.lastname[0]
                    })
        
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/user/dashboard', methods=['GET'])
def user_dashboard():
    email = request.args.get('email')
    if not email:
        return jsonify({'error': 'Email is required as a query parameter.'}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'error': 'User not found.'}), 404

    # Pregnancy Info (may be missing)
    preg_info = PregnancyInfo.query.filter_by(user_id=user.patient_id).first()
    pregnancy = None
    if preg_info:
        pregnancy = {
            'id': preg_info.id,
            'height': preg_info.height,
            'weight': preg_info.weight,
            'profession': preg_info.profession,
            'gravida': preg_info.gravida,
            'allergies': preg_info.allergies,
            'conditions': preg_info.conditions,
            'notes': preg_info.notes,
            'lmc': preg_info.lmc.strftime('%Y-%m-%d') if preg_info.lmc else None
        }

    # Appointments (may be empty)
    appointments = Appointment.query.filter_by(user_id=user.patient_id).all()
    appt_list = []
    for appt in appointments:
        doctor = Doctor.query.get(appt.doctor_id)
        appt_list.append({
            'id': appt.id,
            'appointment_date': appt.appointment_date.strftime('%Y-%m-%d %H:%M') if appt.appointment_date else None,
            'status': appt.status,
            'doctor': {
                'id': doctor.id if doctor else None,
                'firstname': doctor.firstname if doctor else None,
                'lastname': doctor.lastname if doctor else None,
                'specialty': doctor.specialty if doctor else None
            } if doctor else None
        })

    # User info
    user_info = {
        'patient_id': user.patient_id,
        'firstname': user.firstname,
        'lastname': user.lastname,
        'contact': user.contact,
        'location': user.location,
        'age': user.age,
        'guardian_name': user.guardian_name,
        'guardian_contact': user.guardian_contact,
        'bloodtype': user.bloodtype,
        'email': user.email,
        'status': user.status
    }

    return jsonify({
        'user': user_info,
        'pregnancy': pregnancy,
        'appointments': appt_list
    }), 200

@app.route('/user/doctors/<int:user_id>', methods=['GET'])
def get_user_doctors(user_id):
    try:
        appointments = Appointment.query.filter_by(user_id=user_id).all()
        doctor_ids = set([appt.doctor_id for appt in appointments])
        doctors = Doctor.query.filter(Doctor.id.in_(doctor_ids)).all()
        result = [
            {
                'id': d.id,
                'firstname': d.firstname,
                'lastname': d.lastname,
                'email': d.email,
                'specialty': d.specialty,
                'department': d.department
            }
            for d in doctors
        ]
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Doctor Dashboard Stats Endpoint
@app.route('/doctor/stats/<int:doctor_id>', methods=['GET'])
def get_doctor_stats(doctor_id):
    try:
        # Get total patients
        total_patients = db.session.query(User).join(Appointment).filter(Appointment.doctor_id == doctor_id).distinct().count()
        
        # Get today's appointments
        today = datetime.now().date()
        today_appointments = db.session.query(Appointment).filter(
            Appointment.doctor_id == doctor_id,
            func.date(Appointment.appointment_date) == today
        ).count()
        
        # Get pending appointments
        pending_appointments = db.session.query(Appointment).filter(
            Appointment.doctor_id == doctor_id,
            Appointment.status == 'pending'
        ).count()
        
        # Get unread messages
        unread_messages = db.session.query(Message).filter(
            Message.receiver_id == doctor_id,
            Message.receiver_type == 'doctor',
            Message.is_read == False
        ).count()
        
        stats = {
            'total_patients': total_patients,
            'today_appointments': today_appointments,
            'pending_appointments': pending_appointments,
            'unread_messages': unread_messages
        }
        
        return jsonify(stats), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Doctor Recent Messages Endpoint
@app.route('/doctor/recent-messages/<int:doctor_id>', methods=['GET'])
def get_doctor_recent_messages(doctor_id):
    try:
        # Get recent messages for the doctor
        messages = db.session.query(Message).filter(
            or_(
                and_(Message.sender_id == doctor_id, Message.sender_type == 'doctor'),
                and_(Message.receiver_id == doctor_id, Message.receiver_type == 'doctor')
            )
        ).order_by(Message.timestamp.desc()).limit(10).all()
        
        message_list = []
        for msg in messages:
            # Get sender info
            if msg.sender_type == 'doctor':
                sender = db.session.query(Doctor).filter(Doctor.id == msg.sender_id).first()
            else:
                sender = db.session.query(User).filter(User.id == msg.sender_id).first()
            
            message_data = {
                'id': msg.id,
                'content': msg.content,
                'timestamp': msg.timestamp.isoformat() if msg.timestamp else None,
                'is_read': msg.is_read,
                'sender_type': msg.sender_type,
                'sender': {
                    'id': sender.id,
                    'firstname': sender.firstname,
                    'lastname': sender.lastname
                } if sender else None
            }
            message_list.append(message_data)
        
        return jsonify(message_list), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Doctor Calendar Events Endpoint
@app.route('/doctor/calendar-events/<int:doctor_id>', methods=['GET'])
def get_doctor_calendar_events(doctor_id):
    try:
        # Get appointments for the doctor
        appointments = db.session.query(Appointment).filter(
            Appointment.doctor_id == doctor_id
        ).order_by(Appointment.appointment_date).all()
        
        appointment_list = []
        for apt in appointments:
            # Get user info
            user = db.session.query(User).filter(User.id == apt.user_id).first()
            
            appointment_data = {
                'id': apt.id,
                'appointment_date': apt.appointment_date.isoformat() if apt.appointment_date else None,
                'status': apt.status,
                'user': {
                    'id': user.id,
                    'firstname': user.firstname,
                    'lastname': user.lastname
                } if user else None
            }
            appointment_list.append(appointment_data)
        
        return jsonify(appointment_list), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Doctor Notifications Endpoint
@app.route('/doctor/notifications/<int:doctor_id>', methods=['GET'])
def get_doctor_notifications(doctor_id):
    try:
        # Get recent appointments
        recent_appointments = Appointment.query.filter_by(doctor_id=doctor_id).order_by(Appointment.appointment_date.desc()).limit(5).all()
        
        notifications = []
        for appt in recent_appointments:
            user = User.query.get(appt.user_id)
            if user:
                notifications.append({
                    'id': appt.id,
                    'type': 'appointment',
                    'title': f'Appointment with {user.firstname} {user.lastname}',
                    'message': f'Appointment scheduled for {appt.appointment_date.strftime("%Y-%m-%d %H:%M")}',
                    'time': appt.appointment_date.strftime("%Y-%m-%d %H:%M"),
                    'status': appt.status
                })
        
        return jsonify(notifications), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
