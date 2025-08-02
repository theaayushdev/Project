from flask import Blueprint, request, jsonify
from extensions import db
from model import HealthRecord, User
from datetime import datetime, date
from sqlalchemy import desc

health_tracker_bp = Blueprint('health_tracker', __name__)

@health_tracker_bp.route('/api/health/record', methods=['POST'])
def save_health_record():
    """Save or update health record for a specific date"""
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        record_date = data.get('date', date.today().isoformat())
        
        if not user_id:
            return jsonify({'error': 'User ID is required'}), 400
            
        # Parse date
        try:
            record_date = datetime.strptime(record_date, '%Y-%m-%d').date()
        except ValueError:
            record_date = date.today()
        
        # Check if record exists for this date
        existing_record = HealthRecord.query.filter_by(
            user_id=user_id, 
            date=record_date
        ).first()
        
        if existing_record:
            # Update existing record
            if 'mood_score' in data:
                existing_record.mood_score = data['mood_score']
            if 'mood_notes' in data:
                existing_record.mood_notes = data['mood_notes']
            if 'water_intake' in data:
                existing_record.water_intake = data['water_intake']
            if 'sleep_hours' in data:
                existing_record.sleep_hours = data['sleep_hours']
            if 'sleep_quality' in data:
                existing_record.sleep_quality = data['sleep_quality']
            if 'heart_rate' in data:
                existing_record.heart_rate = data['heart_rate']
            if 'systolic_bp' in data:
                existing_record.systolic_bp = data['systolic_bp']
            if 'diastolic_bp' in data:
                existing_record.diastolic_bp = data['diastolic_bp']
            
            existing_record.updated_at = datetime.utcnow()
            record = existing_record
        else:
            # Create new record
            record = HealthRecord(
                user_id=user_id,
                date=record_date,
                mood_score=data.get('mood_score'),
                mood_notes=data.get('mood_notes'),
                water_intake=data.get('water_intake', 0),
                sleep_hours=data.get('sleep_hours'),
                sleep_quality=data.get('sleep_quality'),
                heart_rate=data.get('heart_rate'),
                systolic_bp=data.get('systolic_bp'),
                diastolic_bp=data.get('diastolic_bp')
            )
            db.session.add(record)
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'record': {
                'id': record.id,
                'date': record.date.isoformat(),
                'mood_score': record.mood_score,
                'mood_notes': record.mood_notes,
                'water_intake': record.water_intake,
                'sleep_hours': record.sleep_hours,
                'sleep_quality': record.sleep_quality,
                'heart_rate': record.heart_rate,
                'systolic_bp': record.systolic_bp,
                'diastolic_bp': record.diastolic_bp
            }
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@health_tracker_bp.route('/api/health/records/<int:user_id>', methods=['GET'])
def get_health_records(user_id):
    """Get health records for a user"""
    try:
        # Get query parameters
        limit = request.args.get('limit', 30, type=int)
        
        records = HealthRecord.query.filter_by(user_id=user_id)\
                                  .order_by(desc(HealthRecord.date))\
                                  .limit(limit)\
                                  .all()
        
        return jsonify({
            'records': [{
                'id': record.id,
                'date': record.date.isoformat(),
                'mood_score': record.mood_score,
                'mood_notes': record.mood_notes,
                'water_intake': record.water_intake,
                'sleep_hours': record.sleep_hours,
                'sleep_quality': record.sleep_quality,
                'heart_rate': record.heart_rate,
                'systolic_bp': record.systolic_bp,
                'diastolic_bp': record.diastolic_bp,
                'created_at': record.created_at.isoformat() if record.created_at else None,
                'updated_at': record.updated_at.isoformat() if record.updated_at else None
            } for record in records]
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@health_tracker_bp.route('/api/health/today/<int:user_id>', methods=['GET'])
def get_today_record(user_id):
    """Get today's health record for a user"""
    try:
        today = date.today()
        record = HealthRecord.query.filter_by(
            user_id=user_id, 
            date=today
        ).first()
        
        if record:
            return jsonify({
                'record': {
                    'id': record.id,
                    'date': record.date.isoformat(),
                    'mood_score': record.mood_score,
                    'mood_notes': record.mood_notes,
                    'water_intake': record.water_intake,
                    'sleep_hours': record.sleep_hours,
                    'sleep_quality': record.sleep_quality,
                    'heart_rate': record.heart_rate,
                    'systolic_bp': record.systolic_bp,
                    'diastolic_bp': record.diastolic_bp
                }
            })
        else:
            return jsonify({
                'record': {
                    'date': today.isoformat(),
                    'mood_score': None,
                    'mood_notes': '',
                    'water_intake': 0,
                    'sleep_hours': None,
                    'sleep_quality': None,
                    'heart_rate': None,
                    'systolic_bp': None,
                    'diastolic_bp': None
                }
            })
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@health_tracker_bp.route('/api/health/analytics/<int:user_id>', methods=['GET'])
def get_health_analytics(user_id):
    """Get health analytics and trends"""
    try:
        # Get last 7 days of records
        records = HealthRecord.query.filter_by(user_id=user_id)\
                                  .order_by(desc(HealthRecord.date))\
                                  .limit(7)\
                                  .all()
        
        if not records:
            return jsonify({
                'analytics': {
                    'avg_mood': 0,
                    'avg_water': 0,
                    'avg_sleep': 0,
                    'avg_heart_rate': 0,
                    'trend': 'No data available'
                }
            })
        
        # Calculate averages
        mood_scores = [r.mood_score for r in records if r.mood_score is not None]
        water_intakes = [r.water_intake for r in records if r.water_intake is not None]
        sleep_hours = [r.sleep_hours for r in records if r.sleep_hours is not None]
        heart_rates = [r.heart_rate for r in records if r.heart_rate is not None]
        
        analytics = {
            'avg_mood': round(sum(mood_scores) / len(mood_scores), 1) if mood_scores else 0,
            'avg_water': round(sum(water_intakes) / len(water_intakes), 1) if water_intakes else 0,
            'avg_sleep': round(sum(sleep_hours) / len(sleep_hours), 1) if sleep_hours else 0,
            'avg_heart_rate': round(sum(heart_rates) / len(heart_rates), 1) if heart_rates else 0,
            'total_records': len(records),
            'date_range': f"{records[-1].date.isoformat()} to {records[0].date.isoformat()}" if records else None
        }
        
        return jsonify({'analytics': analytics})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
