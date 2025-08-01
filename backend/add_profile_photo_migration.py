from flask import Flask
from extensions import db
from model import User
import os

# Initialize Flask app with database
app = Flask(__name__)
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(basedir, 'instance', 'Pregnify.db')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

def add_profile_photo_column():
    """Add profile_photo column to User table if it doesn't exist"""
    with app.app_context():
        try:
            # Try to add the column if it doesn't exist
            db.session.execute(db.text('ALTER TABLE user ADD COLUMN profile_photo VARCHAR(255)'))
            db.session.commit()
            print("Successfully added profile_photo column to User table")
        except Exception as e:
            if "duplicate column name" in str(e).lower() or "already exists" in str(e).lower():
                print("profile_photo column already exists in User table")
            else:
                print(f"Error adding profile_photo column: {e}")

if __name__ == '__main__':
    add_profile_photo_column()
