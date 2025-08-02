from flask import Blueprint

# Create the reports blueprint
reports_bp = Blueprint("reports", __name__)

@reports_bp.route("/api/reports", methods=["GET"])
def get_reports():
    """Get all reports for the current user"""
    return {"message": "Reports endpoint - coming soon"}

@reports_bp.route("/api/reports", methods=["POST"])
def create_report():
    """Create a new report"""
    return {"message": "Create report endpoint - coming soon"}
