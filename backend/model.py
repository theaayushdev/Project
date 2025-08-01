from flask import Flask
from extensions import db


class User(db.Model):
    patient_id = db.Column(db.Integer, primary_key=True)
    firstname = db.Column(db.String(100), nullable=False)
    lastname = db.Column(db.String(100), nullable=False)
    contact = db.Column(db.String(15), unique=True, nullable=False)
    location = db.Column(db.String(100))
    age = db.Column(db.Integer)
    guardian_name = db.Column(db.String(100))
    guardian_contact = db.Column(db.String(15))
    bloodtype = db.Column(db.String(3))
    email = db.Column(db.String(120), unique=True)
    password = db.Column(db.String(255), nullable=False)
    profile_photo = db.Column(db.String(255))  # Store file path or URL for user profile photo
    status = db.Column(db.String(10), default='active')

    __table_args__ = {'sqlite_autoincrement': True}

    def __repr__(self):
        return f'<User {self.firstname} {self.lastname}>'


class Admin(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), nullable=False, unique=True)
    password = db.Column(db.String(50), nullable=False)


class Doctor(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    firstname = db.Column(db.String(100), nullable=False)
    lastname = db.Column(db.String(100), nullable=False)
    phone_number = db.Column(db.String(15), nullable=False)
    gender = db.Column(db.String(10))
    email = db.Column(db.String(120), unique=True)
    medical_license_number = db.Column(db.String(50), unique=True)
    specialty = db.Column(db.String(100))
    department = db.Column(db.String(100))
    password = db.Column(db.String(255), nullable=False)
    age = db.Column(db.Integer)
    years_of_experience = db.Column(db.Integer)
    profile_photo = db.Column(db.String(255))  # Store file path or URL
    status = db.Column(db.String(10), nullable=False, default='on')  # new column


    def __repr__(self):
        return f'<Doctor {self.firstname} {self.lastname}>'


class PregnancyInfo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.patient_id'), nullable=False)

    lmc = db.Column(db.Date, nullable=False)
    height = db.Column(db.Float, nullable=False)
    weight = db.Column(db.Float, nullable=False)
    profession = db.Column(db.String(100), nullable=False)
    gravida = db.Column(db.Integer, nullable=False)
    allergies = db.Column(db.String(255))
    conditions = db.Column(db.String(255))
    notes = db.Column(db.Text)

    user = db.relationship('User', backref=db.backref('pregnancy_info', uselist=False))

    def __repr__(self):
        return f'<PregnancyInfo for user_id={self.user_id}>'


class Appointment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.patient_id'), nullable=False)
    doctor_id = db.Column(db.Integer, db.ForeignKey('doctor.id'), nullable=False)

    appointment_date = db.Column(db.DateTime)
    status = db.Column(db.String(20), nullable=True)  # e.g., pending, confirmed, etc.

    user = db.relationship('User', backref='appointments')
    doctor = db.relationship('Doctor', backref='appointments')

    def __repr__(self):
        return f'<Appointment user_id={self.user_id}, doctor_id={self.doctor_id}>'


class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sender_id = db.Column(db.Integer, nullable=False)  # Can be user or doctor ID
    receiver_id = db.Column(db.Integer, nullable=False)  # Can be user or doctor ID
    sender_type = db.Column(db.String(10), nullable=False)  # 'user' or 'doctor'
    receiver_type = db.Column(db.String(10), nullable=False)  # 'user' or 'doctor'
    content = db.Column(db.Text, nullable=True)  # Text content (can be null for image-only messages)
    image_url = db.Column(db.String(255), nullable=True)  # URL for uploaded images
    message_type = db.Column(db.String(10), default='text')  # 'text', 'image', or 'mixed'
    timestamp = db.Column(db.DateTime, default=db.func.current_timestamp())
    is_read = db.Column(db.Boolean, default=False)

    def __repr__(self):
        return f'<Message from {self.sender_type}:{self.sender_id} to {self.receiver_type}:{self.receiver_id}>'
