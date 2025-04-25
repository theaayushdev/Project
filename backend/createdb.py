from flask import Flask
from app import app, db
from model import Admin

with app.app_context():
    db.create_all()
    if not Admin.query.filter_by(username="Admin").first():
        default_admin = Admin(username="Admin", password="Admin")
        db.session.add(default_admin)
        db.session.commit()
        print("✅ Default Admin added.")
    print("✅ Tables created successfully!")
