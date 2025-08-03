from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from flask_migrate import Migrate
from extensions import db
from model import User, Doctor, Appointment, PregnancyInfo, Message, Admin
from reports_api import reports_bp
from health_tracker_api import health_tracker_bp
from datetime import datetime, timedelta
import os 
from sqlalchemy import func, or_, and_
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://localhost:5174", "http://localhost:5175", "http://127.0.0.1:5174", "http://127.0.0.1:5175"]}})
app.register_blueprint(reports_bp)
app.register_blueprint(health_tracker_bp)

# File upload configuration
UPLOAD_FOLDER = 'uploads/doctor_photos'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Create upload directory if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Create chat images upload directory
CHAT_UPLOAD_FOLDER = 'uploads/chat_images'
os.makedirs(CHAT_UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(basedir, 'instance', 'Pregnify.db')}"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
migrate = Migrate(app, db)



@app.route('/')
def home():
    return "Welcome to Pregnify!"

# Create user profile photos upload directory
USER_UPLOAD_FOLDER = 'uploads/user_photos'
os.makedirs(USER_UPLOAD_FOLDER, exist_ok=True)

# Route to serve uploaded user photos
@app.route('/uploads/user_photos/<filename>')
def uploaded_user_photo(filename):
    return send_from_directory(USER_UPLOAD_FOLDER, filename)

# Route to serve public assets (like default avatar)
@app.route('/assets/<filename>')
def serve_assets(filename):
    return send_from_directory('../public', filename)

# Route to serve uploaded doctor photos
@app.route('/uploads/doctor_photos/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# Route to serve uploaded chat images
@app.route('/uploads/chat_images/<filename>')
def chat_image_file(filename):
    return send_from_directory(CHAT_UPLOAD_FOLDER, filename)

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
    
@app.route('/remove_doctor/<int:doctor_id>', methods=['PUT'])
def toggle_doctor_status(doctor_id):
    doctor = Doctor.query.get_or_404(doctor_id)
    
    if doctor.status == 'on':
        doctor.status = 'off'
        action = 'removed'
        new_status = 'off'
    else:
        doctor.status = 'on'
        action = 'restored'
        new_status = 'on'
    
    db.session.commit()
    return jsonify({
        'message': f'Doctor {doctor.firstname} {doctor.lastname} {action} successfully',
        'new_status': new_status
    }), 200

@app.route('/register', methods=['POST'])
def register():
    try:
        # Handle profile photo upload if present
        profile_photo_url = None
        if 'profile_photo' in request.files:
            file = request.files['profile_photo']
            if file and file.filename != '' and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                # Add timestamp to avoid filename conflicts
                timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
                filename = f"user_{timestamp}_{filename}"
                file_path = os.path.join(USER_UPLOAD_FOLDER, filename)
                file.save(file_path)
                profile_photo_url = filename  # Store only filename, not full URL

        # Get form data (works with both form-data and JSON)
        if request.content_type and 'multipart/form-data' in request.content_type:
            # Form data with file upload
            data = request.form.to_dict()
        else:
            # JSON data (backward compatibility)
            data = request.json or {}
            
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
            age=int(data.get('age')) if data.get('age') else None,
            guardian_name=data.get('guardian_name'),
            guardian_contact=data.get('guardian_contact'),
            bloodtype=data.get('bloodtype'),
            email=email,
            password=password,
            profile_photo=profile_photo_url,
            status='active'
        )
        db.session.add(new_user)
        db.session.commit()

        return jsonify({
            'message': 'User registered successfully.',
            'profile_photo': profile_photo_url
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

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
    try:
        # Handle file upload
        profile_photo_path = None
        if 'profile_photo' in request.files:
            file = request.files['profile_photo']
            if file and file.filename != '' and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                # Add timestamp to avoid filename conflicts
                filename = f"{datetime.now().strftime('%Y%m%d_%H%M%S')}_{filename}"
                file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                file.save(file_path)
                # Store URL path instead of file path
                profile_photo_path = f"http://127.0.0.1:5000/uploads/doctor_photos/{filename}"

        # Get form data
        doctor = Doctor(
            firstname=request.form.get('firstname'),
            lastname=request.form.get('lastname'),
            phone_number=request.form.get('phone_number'),
            gender=request.form.get('gender'),
            email=request.form.get('email'),
            medical_license_number=request.form.get('medical_license_number'),
            specialty=request.form.get('specialty'),
            department=request.form.get('department'),
            age=int(request.form.get('age')) if request.form.get('age') else None,
            years_of_experience=int(request.form.get('years_of_experience')) if request.form.get('years_of_experience') else None,
            profile_photo=profile_photo_path,
            password=request.form.get('password')
        )
        db.session.add(doctor)
        db.session.commit()
        return jsonify({'message': 'Doctor added successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

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
        'email': d.email,
        'age': d.age,
        'years_of_experience': d.years_of_experience,
        'profile_photo': d.profile_photo,
        'gender': d.gender,
        'medical_license_number': d.medical_license_number,
        'status': d.status
    } for d in doctors]), 200

@app.route('/all-doctors', methods=['GET'])
def get_all_doctors():
    doctors = Doctor.query.all()  # Get all doctors regardless of status
    return jsonify([{
        'id': d.id,
        'firstname': d.firstname,
        'lastname': d.lastname,
        'phone_number': d.phone_number,
        'specialty': d.specialty,
        'department': d.department,
        'email': d.email,
        'age': d.age,
        'years_of_experience': d.years_of_experience,
        'profile_photo': d.profile_photo,
        'gender': d.gender,
        'medical_license_number': d.medical_license_number,
        'status': d.status
    } for d in doctors]), 200

@app.route('/appointment', methods=['POST'])
def create_appointment():
    data = request.get_json()
    
    # Validation
    if not data.get('user_id'):
        return jsonify({'error': 'User ID is required'}), 400
    if not data.get('doctor_id'):
        return jsonify({'error': 'Doctor ID is required'}), 400
    if not data.get('appointment_date'):
        return jsonify({'error': 'Appointment date is required'}), 400
    if not data.get('appointment_time'):
        return jsonify({'error': 'Appointment time is required'}), 400
    
    try:
        # Parse appointment date and time
        appointment_date_str = data['appointment_date']
        appointment_time_str = data['appointment_time']
        
        # Combine date and time into a datetime object
        appointment_datetime_str = f"{appointment_date_str} {appointment_time_str}:00"
        appointment_datetime = datetime.strptime(appointment_datetime_str, '%Y-%m-%d %H:%M:%S')
        
        # Validate that appointment datetime is not in the past
        if appointment_datetime < datetime.now():
            return jsonify({'error': 'Appointment date and time cannot be in the past'}), 400
        
        # Check if user exists
        user = User.query.get(data['user_id'])
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Check if doctor exists and is active
        doctor = Doctor.query.get(data['doctor_id'])
        if not doctor:
            return jsonify({'error': 'Doctor not found'}), 404
        if doctor.status != 'on':
            return jsonify({'error': 'Doctor is not available'}), 400
        
        # Check for conflicting appointments (same doctor, same date and time)
        existing_appointment = Appointment.query.filter_by(
            doctor_id=data['doctor_id'],
            appointment_date=appointment_datetime
        ).first()
        
        if existing_appointment:
            return jsonify({'error': 'An appointment already exists for this date and time with this doctor'}), 409
        
        new_appointment = Appointment(
            user_id=data['user_id'],
            doctor_id=data['doctor_id'],
            appointment_date=appointment_datetime,
            status=data.get('status', 'pending')
        )
        db.session.add(new_appointment)
        db.session.commit()
        
        return jsonify({
            'message': 'Appointment created successfully',
            'appointment': {
                'id': new_appointment.id,
                'appointment_date': new_appointment.appointment_date.strftime('%Y-%m-%d'),
                'appointment_time': new_appointment.appointment_date.strftime('%H:%M'),
                'appointment_datetime': new_appointment.appointment_date.strftime('%Y-%m-%d %H:%M:%S'),
                'status': new_appointment.status,
                'doctor_name': f"Dr. {doctor.firstname} {doctor.lastname}",
                'user_name': f"{user.firstname} {user.lastname}"
            }
        }), 201
    except ValueError as e:
        return jsonify({'error': 'Invalid date or time format. Use YYYY-MM-DD for date and HH:MM for time'}), 400
    except Exception as e:
        db.session.rollback()
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
        'appointment_date': a.appointment_date.strftime('%Y-%m-%d') if a.appointment_date else None,
        'appointment_time': a.appointment_date.strftime('%H:%M') if a.appointment_date else None,
        'appointment_datetime': a.appointment_date.strftime('%Y-%m-%d %H:%M:%S') if a.appointment_date else None,
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
        result = []
        
        for p in patients:
            # Check if patient has pregnancy info
            pregnancy_info = PregnancyInfo.query.filter_by(user_id=p.patient_id).first() 
            has_pregnancy_info = pregnancy_info is not None
            
            patient_data = {
                'id': p.patient_id,
                'firstname': p.firstname,
                'lastname': p.lastname,
                'email': p.email,
                'contact': p.contact,
                'age': p.age,
                'bloodtype': p.bloodtype,
                'profile_photo': p.profile_photo,
                'location': p.location,
                'has_pregnancy_info': has_pregnancy_info
            }
            result.append(patient_data)
            
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
        'profile_photo': user.profile_photo,
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
                'department': d.department,
                'profile_photo': d.profile_photo,
                'status': d.status
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
            # Get sender info with profile photo
            if msg.sender_type == 'doctor':
                sender = db.session.query(Doctor).filter(Doctor.id == msg.sender_id).first()
                profile_photo = sender.profile_photo if sender else None
            else:
                sender = db.session.query(User).filter(User.patient_id == msg.sender_id).first()
                profile_photo = sender.profile_photo if sender else None
            
            message_data = {
                'id': msg.id,
                'content': msg.content,
                'timestamp': msg.timestamp.isoformat() if msg.timestamp else None,
                'is_read': msg.is_read,
                'sender_type': msg.sender_type,
                'sender': {
                    'id': sender.id if sender else None,
                    'firstname': sender.firstname if sender else None,
                    'lastname': sender.lastname if sender else None,
                    'profile_photo': profile_photo
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

# ============= CHAT API ENDPOINTS =============

@app.route('/chat/conversations/<user_type>/<int:user_id>', methods=['GET'])
def get_chat_conversations(user_type, user_id):
    """Get all conversations for a user or doctor"""
    try:
        if user_type == 'user':
            # Get all doctors this user has chatted with
            conversations = db.session.query(Message.receiver_id, Doctor.firstname, Doctor.lastname, Doctor.profile_photo, Doctor.specialty)\
                .join(Doctor, Message.receiver_id == Doctor.id)\
                .filter(Message.sender_id == user_id, Message.sender_type == 'user', Message.receiver_type == 'doctor')\
                .distinct().all()
            
            # Also get doctors who have sent messages to this user
            incoming_conversations = db.session.query(Message.sender_id, Doctor.firstname, Doctor.lastname, Doctor.profile_photo, Doctor.specialty)\
                .join(Doctor, Message.sender_id == Doctor.id)\
                .filter(Message.receiver_id == user_id, Message.receiver_type == 'user', Message.sender_type == 'doctor')\
                .distinct().all()
            
        else:  # doctor
            # Get all users this doctor has chatted with
            conversations = db.session.query(Message.receiver_id, User.firstname, User.lastname, User.email, User.profile_photo)\
                .join(User, Message.receiver_id == User.patient_id)\
                .filter(Message.sender_id == user_id, Message.sender_type == 'doctor', Message.receiver_type == 'user')\
                .distinct().all()
            
            # Also get users who have sent messages to this doctor
            incoming_conversations = db.session.query(Message.sender_id, User.firstname, User.lastname, User.email, User.profile_photo)\
                .join(User, Message.sender_id == User.patient_id)\
                .filter(Message.receiver_id == user_id, Message.receiver_type == 'doctor', Message.sender_type == 'user')\
                .distinct().all()

        # Combine and deduplicate conversations
        all_conversations = {}
        
        for conv in conversations + incoming_conversations:
            conv_id = conv[0]
            if conv_id not in all_conversations:
                if user_type == 'user':
                    all_conversations[conv_id] = {
                        'id': conv_id,
                        'name': f"Dr. {conv[1]} {conv[2]}",
                        'avatar': conv[3] or "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=50&h=50&fit=crop&crop=face",
                        'specialty': conv[4] if len(conv) > 4 else '',
                        'type': 'doctor'
                    }
                else:
                    # Handle both full URLs and filenames for profile photos
                    if conv[4]:
                        if conv[4].startswith('http'):
                            # Already a full URL
                            avatar_url = conv[4]
                        else:
                            # Just a filename, construct full URL
                            avatar_url = f'http://127.0.0.1:5000/uploads/user_photos/{conv[4]}'
                    else:
                        # No profile photo, use default
                        avatar_url = 'http://127.0.0.1:5000/assets/default-avatar.svg'
                    
                    all_conversations[conv_id] = {
                        'id': conv_id,
                        'name': f"{conv[1]} {conv[2]}",
                        'avatar': avatar_url,
                        'email': conv[3] if len(conv) > 3 else '',
                        'type': 'user'
                    }
        
        # Get last message for each conversation
        for conv_id, conv in all_conversations.items():
            if user_type == 'user':
                last_message = Message.query.filter(
                    or_(
                        and_(Message.sender_id == user_id, Message.receiver_id == conv_id),
                        and_(Message.sender_id == conv_id, Message.receiver_id == user_id)
                    )
                ).order_by(Message.timestamp.desc()).first()
            else:
                last_message = Message.query.filter(
                    or_(
                        and_(Message.sender_id == user_id, Message.receiver_id == conv_id),
                        and_(Message.sender_id == conv_id, Message.receiver_id == user_id)
                    )
                ).order_by(Message.timestamp.desc()).first()
            
            if last_message:
                conv['lastMessage'] = last_message.content or 'Image'
                conv['lastMessageTime'] = last_message.timestamp.strftime('%H:%M')
                conv['unreadCount'] = 0  # We can implement this later
        
        return jsonify(list(all_conversations.values())), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/chat/messages', methods=['GET'])
def get_chat_messages():
    """Get messages between two users"""
    try:
        sender_id = int(request.args.get('sender_id'))
        receiver_id = int(request.args.get('receiver_id'))
        sender_type = request.args.get('sender_type')
        receiver_type = request.args.get('receiver_type')
        
        messages = Message.query.filter(
            or_(
                and_(Message.sender_id == sender_id, Message.receiver_id == receiver_id, 
                     Message.sender_type == sender_type, Message.receiver_type == receiver_type),
                and_(Message.sender_id == receiver_id, Message.receiver_id == sender_id,
                     Message.sender_type == receiver_type, Message.receiver_type == sender_type)
            )
        ).order_by(Message.timestamp.asc()).all()
        
        # Mark messages as read
        Message.query.filter(
            Message.sender_id == receiver_id,
            Message.receiver_id == sender_id,
            Message.sender_type == receiver_type,
            Message.receiver_type == sender_type,
            Message.is_read == False
        ).update({'is_read': True})
        db.session.commit()
        
        message_list = []
        for msg in messages:
            message_list.append({
                'id': msg.id,
                'content': msg.content,
                'image_url': msg.image_url,
                'message_type': msg.message_type,
                'timestamp': msg.timestamp.strftime('%Y-%m-%d %H:%M:%S'),
                'sender_id': msg.sender_id,
                'sender_type': msg.sender_type,
                'is_own': msg.sender_id == sender_id and msg.sender_type == sender_type
            })
        
        return jsonify(message_list), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/chat/send', methods=['POST'])
def send_message():
    """Send a new message"""
    try:
        # Handle image upload if present
        image_url = None
        message_type = 'text'
        
        if 'image' in request.files:
            file = request.files['image']
            if file and file.filename != '' and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                filename = f"{datetime.now().strftime('%Y%m%d_%H%M%S')}_{filename}"
                file_path = os.path.join(CHAT_UPLOAD_FOLDER, filename)
                file.save(file_path)
                image_url = f"http://127.0.0.1:5000/uploads/chat_images/{filename}"
                message_type = 'image'
        
        # Get form data
        content = request.form.get('content', '').strip()
        sender_id = int(request.form.get('sender_id'))
        receiver_id = int(request.form.get('receiver_id'))
        sender_type = request.form.get('sender_type')
        receiver_type = request.form.get('receiver_type')
        
        # Determine message type
        if content and image_url:
            message_type = 'mixed'
        elif not content and not image_url:
            return jsonify({'error': 'Message cannot be empty'}), 400
        
        # Create new message
        message = Message(
            sender_id=sender_id,
            receiver_id=receiver_id,
            sender_type=sender_type,
            receiver_type=receiver_type,
            content=content if content else None,
            image_url=image_url,
            message_type=message_type
        )
        
        db.session.add(message)
        db.session.commit()
        
        return jsonify({
            'id': message.id,
            'content': message.content,
            'image_url': message.image_url,
            'message_type': message.message_type,
            'timestamp': message.timestamp.strftime('%Y-%m-%d %H:%M:%S'),
            'sender_id': message.sender_id,
            'sender_type': message.sender_type
        }), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/chat/doctors', methods=['GET'])
def get_available_doctors():
    """Get all available doctors for users to start new conversations"""
    try:
        doctors = Doctor.query.filter_by(status='on').all()
        doctor_list = []
        for doctor in doctors:
            doctor_list.append({
                'id': doctor.id,
                'name': f"Dr. {doctor.firstname} {doctor.lastname}",
                'specialty': doctor.specialty,
                'department': doctor.department,
                'avatar': doctor.profile_photo or "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=50&h=50&fit=crop&crop=face"
            })
        return jsonify(doctor_list), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/pregnancy-info/<int:user_id>', methods=['GET'])
def fetch_user_pregnancy_info(user_id):
    """Get pregnancy information for a specific user"""
    try:
        pregnancy_info = PregnancyInfo.query.filter_by(user_id=user_id).first()
        
        if not pregnancy_info:
            return jsonify({
                'success': False,
                'message': 'No pregnancy information found for this user'
            }), 404
        
        # Calculate weeks pregnant from LMC (Last Menstrual Cycle)
        if pregnancy_info.lmc:
            today = datetime.now().date()
            weeks_pregnant = (today - pregnancy_info.lmc).days // 7
            due_date = pregnancy_info.lmc + timedelta(days=280)  # 40 weeks
            trimester = 1 if weeks_pregnant <= 12 else (2 if weeks_pregnant <= 27 else 3)
        else:
            weeks_pregnant = None
            due_date = None
            trimester = None
        
        pregnancy_data = {
            'id': pregnancy_info.id,
            'user_id': pregnancy_info.user_id,
            'lmc': pregnancy_info.lmc.isoformat() if pregnancy_info.lmc else None,
            'height': pregnancy_info.height,
            'weight': pregnancy_info.weight,
            'profession': pregnancy_info.profession,
            'gravida': pregnancy_info.gravida,
            'allergies': pregnancy_info.allergies,
            'conditions': pregnancy_info.conditions,
            'notes': pregnancy_info.notes,
            'weeks_pregnant': weeks_pregnant,
            'due_date': due_date.isoformat() if due_date else None,
            'trimester': trimester,
            'user': {
                'firstname': pregnancy_info.user.firstname,
                'lastname': pregnancy_info.user.lastname,
                'email': pregnancy_info.user.email,
                'contact': pregnancy_info.user.contact,
                'age': pregnancy_info.user.age
            } if pregnancy_info.user else None
        }
        
        return jsonify({
            'success': True,
            'data': pregnancy_data
        }), 200
        
    except Exception as e:
        print(f"Error fetching pregnancy info: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Internal server error'
        }), 500

@app.route('/doctor/patients-with-pregnancy/<int:doctor_id>', methods=['GET'])
def get_patients_with_pregnancy_info(doctor_id):
    """Get all patients for a doctor with their pregnancy information"""
    try:
        # Get all appointments for this doctor to find patients
        appointments = Appointment.query.filter_by(doctor_id=doctor_id).all()
        patient_ids = list(set([apt.user_id for apt in appointments]))
        
        patients_with_pregnancy = []
        
        for patient_id in patient_ids:
            # Get patient info
            patient = User.query.get(patient_id)
            if not patient:
                continue
            
            # Get pregnancy info if exists
            pregnancy_info = PregnancyInfo.query.filter_by(user_id=patient_id).first()
            
            patient_data = {
                'id': patient.patient_id,
                'firstname': patient.firstname,
                'lastname': patient.lastname,
                'email': patient.email,
                'contact': patient.contact,
                'age': patient.age,
                'location': patient.location,
                'has_pregnancy_info': pregnancy_info is not None,
                'pregnancy_info': None
            }
            
            if pregnancy_info:
                # Calculate weeks pregnant and due date
                weeks_pregnant = None
                due_date = None
                trimester = None
                if pregnancy_info.lmc:
                    today = datetime.now().date()
                    weeks_pregnant = (today - pregnancy_info.lmc).days // 7
                    due_date = pregnancy_info.lmc + timedelta(days=280)
                    trimester = 1 if weeks_pregnant <= 12 else (2 if weeks_pregnant <= 27 else 3)
                
                patient_data['pregnancy_info'] = {
                    'id': pregnancy_info.id,
                    'lmc': pregnancy_info.lmc.isoformat() if pregnancy_info.lmc else None,
                    'height': pregnancy_info.height,
                    'weight': pregnancy_info.weight,
                    'profession': pregnancy_info.profession,
                    'gravida': pregnancy_info.gravida,
                    'allergies': pregnancy_info.allergies,
                    'conditions': pregnancy_info.conditions,
                    'notes': pregnancy_info.notes,
                    'weeks_pregnant': weeks_pregnant,
                    'due_date': due_date.isoformat() if due_date else None,
                    'trimester': trimester
                }
            
            patients_with_pregnancy.append(patient_data)
        
        return jsonify({
            'success': True,
            'data': patients_with_pregnancy
        }), 200
        
    except Exception as e:
        print(f"Error fetching patients with pregnancy info: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Internal server error'
        }), 500

@app.route('/pregnancy-info', methods=['POST'])
def create_pregnancy_info():
    """Create new pregnancy information"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['user_id', 'lmc', 'height', 'weight', 'profession', 'gravida']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'success': False,
                    'message': f'Missing required field: {field}'
                }), 400
        
        # Check if pregnancy info already exists for this user
        existing_info = PregnancyInfo.query.filter_by(user_id=data['user_id']).first()
        if existing_info:
            return jsonify({
                'success': False,
                'message': 'Pregnancy information already exists for this user'
            }), 400
        
        # Parse LMC date
        try:
            lmc_date = datetime.strptime(data['lmc'], '%Y-%m-%d').date()
        except ValueError:
            return jsonify({
                'success': False,
                'message': 'Invalid LMC date format. Use YYYY-MM-DD'
            }), 400
        
        # Create new pregnancy info
        pregnancy_info = PregnancyInfo(
            user_id=data['user_id'],
            lmc=lmc_date,
            height=float(data['height']),
            weight=float(data['weight']),
            profession=data['profession'],
            gravida=int(data['gravida']),
            allergies=data.get('allergies', ''),
            conditions=data.get('conditions', ''),
            notes=data.get('notes', '')
        )
        
        db.session.add(pregnancy_info)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Pregnancy information created successfully',
            'data': {
                'id': pregnancy_info.id,
                'user_id': pregnancy_info.user_id
            }
        }), 201
        
    except ValueError as e:
        return jsonify({
            'success': False,
            'message': f'Invalid data type: {str(e)}'
        }), 400
    except Exception as e:
        print(f"Error creating pregnancy info: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Internal server error'
        }), 500

@app.route('/pregnancy-info/<int:user_id>', methods=['PUT'])
def update_pregnancy_info(user_id):
    """Update pregnancy information for a specific user"""
    try:
        pregnancy_info = PregnancyInfo.query.filter_by(user_id=user_id).first()
        
        if not pregnancy_info:
            return jsonify({
                'success': False,
                'message': 'No pregnancy information found for this user'
            }), 404
        
        data = request.get_json()
        
        # Update fields if provided
        if 'lmc' in data:
            try:
                pregnancy_info.lmc = datetime.strptime(data['lmc'], '%Y-%m-%d').date()
            except ValueError:
                return jsonify({
                    'success': False,
                    'message': 'Invalid LMC date format. Use YYYY-MM-DD'
                }), 400
        
        if 'height' in data:
            pregnancy_info.height = float(data['height'])
        
        if 'weight' in data:
            pregnancy_info.weight = float(data['weight'])
        
        if 'profession' in data:
            pregnancy_info.profession = data['profession']
        
        if 'gravida' in data:
            pregnancy_info.gravida = int(data['gravida'])
        
        if 'allergies' in data:
            pregnancy_info.allergies = data['allergies']
        
        if 'conditions' in data:
            pregnancy_info.conditions = data['conditions']
        
        if 'notes' in data:
            pregnancy_info.notes = data['notes']
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Pregnancy information updated successfully'
        }), 200
        
    except ValueError as e:
        return jsonify({
            'success': False,
            'message': f'Invalid data type: {str(e)}'
        }), 400
    except Exception as e:
        print(f"Error updating pregnancy info: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Internal server error'
        }), 500

if __name__ == '__main__':
    app.run(debug=True)
