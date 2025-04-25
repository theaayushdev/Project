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
