#!/usr/bin/env python3

from app import app, db

def recreate_database():
    with app.app_context():
        print("Dropping all tables...")
        db.drop_all()
        print("Creating all tables...")
        db.create_all()
        print("Database recreated successfully!")

if __name__ == "__main__":
    recreate_database()
