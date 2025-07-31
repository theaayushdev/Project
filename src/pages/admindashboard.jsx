import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Users, UserCheck, Calendar, MessageSquare, Activity, TrendingUp, Eye, BarChart3, PieChart as PieChartIcon, LineChart as LineChartIcon } from 'lucide-react';

// Sidebar Component
const AdminSidebar = ({ activeSection, setActiveSection }) => {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'User Analytics', icon: Users },
    { id: 'doctors', label: 'Doctor Analytics', icon: UserCheck },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'pregnancy', label: 'Pregnancy Data', icon: Activity },
    { id: 'reports', label: 'Reports', icon: TrendingUp }
  ];

  return (
    <div className="sidebar" style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <div className="sidebar-header" style={{ flexShrink: 0 }}>
        <h2>Admin Panel</h2>
      </div>
      <nav className="sidebar-nav" style={{ flexGrow: 1 }}>
        {menuItems.map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
              onClick={() => setActiveSection(item.id)}
              style={{ width: "100%", textAlign: "left" }}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

// Statistics Card Component
const StatCard = ({ title, value, icon: Icon, trend, color = "blue" }) => {
  return (
    <div className={`stat-card stat-card-${color}`}>
      <div className="stat-card-header">
        <div className="stat-card-icon">
          <Icon size={24} />
        </div>
        <div className="stat-card-trend">
          {trend && <span className={`trend ${trend > 0 ? 'positive' : 'negative'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>}
        </div>
      </div>
      <div className="stat-card-content">
        <h3>{value}</h3>
        <p>{title}</p>
      </div>
    </div>
  );
};

// Chart Colors
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1', '#d084d0'];

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [users, setUsers] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [pregnancyInfo, setPregnancyInfo] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [usersRes, doctorsRes, appointmentsRes, pregnancyRes] = await Promise.all([
          axios.get('http://localhost:5000/users'),
          axios.get('http://localhost:5000/doctors'),
          axios.get('http://localhost:5000/appointments'),
          axios.get('http://localhost:5000/pregnancy-info')
        ]);

        setUsers(usersRes.data);
        setDoctors(doctorsRes.data);
        setAppointments(appointmentsRes.data);
        setPregnancyInfo(pregnancyRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Data processing functions
  const getAgeDistribution = () => {
    const ageRanges = { '18-25': 0, '26-35': 0, '36-45': 0, '46+': 0 };
    users.forEach(user => {
      const age = parseInt(user.age);
      if (age >= 18 && age <= 25) ageRanges['18-25']++;
      else if (age >= 26 && age <= 35) ageRanges['26-35']++;
      else if (age >= 36 && age <= 45) ageRanges['36-45']++;
      else if (age >= 46) ageRanges['46+']++;
    });
    return Object.entries(ageRanges).map(([range, count]) => ({ range, count }));
  };

  const getBloodTypeDistribution = () => {
    const bloodTypes = {};
    users.forEach(user => {
      if (user.bloodtype) {
        bloodTypes[user.bloodtype] = (bloodTypes[user.bloodtype] || 0) + 1;
      }
    });
    return Object.entries(bloodTypes).map(([type, count]) => ({ type, count }));
  };

  const getDoctorSpecialtyDistribution = () => {
    const specialties = {};
    doctors.forEach(doctor => {
      if (doctor.specialty) {
        specialties[doctor.specialty] = (specialties[doctor.specialty] || 0) + 1;
      }
    });
    return Object.entries(specialties).map(([specialty, count]) => ({ specialty, count }));
  };

  const getAppointmentStatusDistribution = () => {
    const statuses = {};
    appointments.forEach(appointment => {
      if (appointment.status) {
        statuses[appointment.status] = (statuses[appointment.status] || 0) + 1;
      }
    });
    return Object.entries(statuses).map(([status, count]) => ({ status, count }));
  };

  const getMonthlyAppointments = () => {
    const monthly = {};
    appointments.forEach(appointment => {
      if (appointment.appointment_date) {
        const month = new Date(appointment.appointment_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        monthly[month] = (monthly[month] || 0) + 1;
      }
    });
    return Object.entries(monthly).map(([month, count]) => ({ month, count }));
  };

  const getGravidaDistribution = () => {
    const gravida = {};
    pregnancyInfo.forEach(info => {
      if (info.gravida !== null && info.gravida !== undefined) {
        const key = `G${info.gravida}`;
        gravida[key] = (gravida[key] || 0) + 1;
      }
    });
    return Object.entries(gravida).map(([gravida, count]) => ({ gravida, count }));
  };

  // Render functions for different sections
  const renderOverview = () => (
    <div className="overview-section">
      <div className="stats-grid">
        <StatCard
          title="Total Users"
          value={users.length}
          icon={Users}
          trend={12}
          color="blue"
        />
        <StatCard
          title="Active Doctors"
          value={doctors.length}
          icon={UserCheck}
          trend={8}
          color="green"
        />
        <StatCard
          title="Total Appointments"
          value={appointments.length}
          icon={Calendar}
          trend={-3}
          color="purple"
        />
        <StatCard
          title="Pregnancy Records"
          value={pregnancyInfo.length}
          icon={Activity}
          trend={15}
          color="orange"
        />
      </div>

      <div className="charts-grid">
        <div className="chart-container">
          <h3>Monthly Appointments Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={getMonthlyAppointments()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="count" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3>Appointment Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={getAppointmentStatusDistribution()}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
                label={({ status, count }) => `${status}: ${count}`}
              >
                {getAppointmentStatusDistribution().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderUserAnalytics = () => (
    <div className="analytics-section">
      <div className="section-header">
        <h2>User Analytics</h2>
        <p>Comprehensive analysis of user demographics and patterns</p>
      </div>

      <div className="charts-grid">
        <div className="chart-container">
          <h3>Age Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={getAgeDistribution()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3>Blood Type Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={getBloodTypeDistribution()}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#82ca9d"
                dataKey="count"
                label={({ type, count }) => `${type}: ${count}`}
              >
                {getBloodTypeDistribution().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="data-table">
        <h3>User Details</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Age</th>
                <th>Blood Type</th>
                <th>Location</th>
                <th>Contact</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {users.slice(0, 10).map(user => (
                <tr key={user.patient_id}>
                  <td>{user.firstname} {user.lastname}</td>
                  <td>{user.age}</td>
                  <td><span className="blood-type-badge">{user.bloodtype}</span></td>
                  <td>{user.location}</td>
                  <td>{user.contact}</td>
                  <td>{user.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderDoctorAnalytics = () => (
    <div className="analytics-section">
      <div className="section-header">
        <h2>Doctor Analytics</h2>
        <p>Analysis of medical staff distribution and specialties</p>
      </div>

      <div className="charts-grid">
        <div className="chart-container">
          <h3>Doctor Specialties</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={getDoctorSpecialtyDistribution()} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="specialty" type="category" width={100} />
              <Tooltip />
              <Bar dataKey="count" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="data-table">
        <h3>Doctor Details</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Specialty</th>
                <th>Department</th>
                <th>Phone</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map(doctor => (
                <tr key={doctor.id}>
                  <td>Dr. {doctor.firstname} {doctor.lastname}</td>
                  <td><span className="specialty-badge">{doctor.specialty}</span></td>
                  <td>{doctor.department}</td>
                  <td>{doctor.phone_number}</td>
                  <td>{doctor.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAppointments = () => (
    <div className="analytics-section">
      <div className="section-header">
        <h2>Appointment Management</h2>
        <p>Track and analyze appointment patterns</p>
      </div>

      <div className="charts-grid">
        <div className="chart-container">
          <h3>Monthly Appointments</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={getMonthlyAppointments()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3>Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={getAppointmentStatusDistribution()}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#ff7c7c"
                dataKey="count"
                label={({ status, count }) => `${status}: ${count}`}
              >
                {getAppointmentStatusDistribution().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderPregnancyData = () => (
    <div className="analytics-section">
      <div className="section-header">
        <h2>Pregnancy Data Analytics</h2>
        <p>Insights into pregnancy information and trends</p>
      </div>

      <div className="charts-grid">
        <div className="chart-container">
          <h3>Gravida Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={getGravidaDistribution()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="gravida" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#d084d0" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="data-table">
        <h3>Pregnancy Records</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>User ID</th>
                <th>Height (cm)</th>
                <th>Weight (kg)</th>
                <th>Profession</th>
                <th>Gravida</th>
                <th>LMP</th>
              </tr>
            </thead>
            <tbody>
              {pregnancyInfo.slice(0, 10).map(info => (
                <tr key={info.id}>
                  <td>{info.user_id}</td>
                  <td>{info.height}</td>
                  <td>{info.weight}</td>
                  <td>{info.profession}</td>
                  <td><span className="gravida-badge">G{info.gravida}</span></td>
                  <td>{info.lmc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="analytics-section">
      <div className="section-header">
        <h2>System Reports</h2>
        <p>Comprehensive system analytics and insights</p>
      </div>

      <div className="report-cards">
        <div className="report-card">
          <h4>User Growth</h4>
          <div className="report-metric">
            <span className="metric-value">{users.length}</span>
            <span className="metric-label">Total Users</span>
          </div>
          <div className="metric-trend positive">+12% this month</div>
        </div>

        <div className="report-card">
          <h4>Doctor Utilization</h4>
          <div className="report-metric">
            <span className="metric-value">{Math.round((appointments.length / doctors.length) * 100) / 100}</span>
            <span className="metric-label">Avg Appointments per Doctor</span>
          </div>
        </div>

        <div className="report-card">
          <h4>System Health</h4>
          <div className="report-metric">
            <span className="metric-value">98.5%</span>
            <span className="metric-label">Uptime</span>
          </div>
          <div className="metric-trend positive">+0.3% this week</div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="admin-dashboard">
        <AdminSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
        <div className="main-content">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading dashboard data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <AdminSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <div className="main-content">
        <div className="content-header">
          <h1>Admin Dashboard</h1>
          <p>Comprehensive analytics and management system</p>
        </div>

        <div className="dashboard-content">
          {activeSection === 'overview' && renderOverview()}
          {activeSection === 'users' && renderUserAnalytics()}
          {activeSection === 'doctors' && renderDoctorAnalytics()}
          {activeSection === 'appointments' && renderAppointments()}
          {activeSection === 'pregnancy' && renderPregnancyData()}
          {activeSection === 'reports' && renderReports()}
        </div>
      </div>

      <style jsx>{`
        .admin-dashboard {
          display: flex;
          min-height: 100vh;
          background-color: #f8fafc;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .sidebar {
          display: flex;
          flex-direction: column;
          height: 100vh;
          width: 280px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 0;
          box-shadow: 2px 0 10px rgba(0,0,0,0.1);
          position: sticky;
          top: 0;
          left: 0;
        }

        .sidebar-header {
          padding: 2rem 1.5rem;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          flex-shrink: 0;
        }

        .sidebar-nav {
          padding: 1rem 0;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          width: 100%;
          padding: 1rem 1.5rem;
          background: none;
          border: none;
          color: rgba(255,255,255,0.8);
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 0.95rem;
          text-align: left;
        }

        .nav-item:hover {
          background: rgba(255,255,255,0.1);
          color: white;
        }

        .nav-item.active {
          background: rgba(255,255,255,0.15);
          color: white;
          border-right: 3px solid #fbbf24;
        }

        .main-content {
          flex: 1;
          padding: 2rem;
          overflow-y: auto;
        }

        .content-header {
          margin-bottom: 2rem;
        }

        .content-header h1 {
          font-size: 2rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 0.5rem 0;
        }

        .content-header p {
          color: #6b7280;
          margin: 0;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 400px;
          gap: 1rem;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #e5e7eb;
          border-top: 4px solid #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          border-left: 4px solid;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .stat-card-blue { border-left-color: #3b82f6; }
        .stat-card-green { border-left-color: #10b981; }
        .stat-card-purple { border-left-color: #8b5cf6; }
        .stat-card-orange { border-left-color: #f59e0b; }

        .stat-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .stat-card-icon {
          padding: 0.5rem;
          border-radius: 8px;
          background: #f3f4f6;
          color: #6b7280;
        }

        .trend {
          font-size: 0.875rem;
          font-weight: 600;
        }

        .trend.positive { color: #10b981; }
        .trend.negative { color: #ef4444; }

        .stat-card-content h3 {
          font-size: 2rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 0.25rem 0;
        }

        .stat-card-content p {
          color: #6b7280;
          margin: 0;
          font-size: 0.875rem;
        }

        .charts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .chart-container {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .chart-container h3 {
          margin: 0 0 1rem 0;
          color: #1f2937;
          font-size: 1.125rem;
          font-weight: 600;
        }

        .section-header {
          margin-bottom: 2rem;
        }

        .section-header h2 {
          font-size: 1.75rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 0.5rem 0;
        }

        .section-header p {
          color: #6b7280;
          margin: 0;
        }

        .data-table {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .data-table h3 {
          margin: 0 0 1rem 0;
          color: #1f2937;
          font-size: 1.125rem;
          font-weight: 600;
        }

        .table-container {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th, td {
          text-align: left;
          padding: 0.75rem;
          border-bottom: 1px solid #e5e7eb;
        }

        th {
          background: #f9fafb;
          font-weight: 600;
          color: #374151;
          font-size: 0.875rem;
        }

        td {
          color: #6b7280;
          font-size: 0.875rem;
        }

        .blood-type-badge, .specialty-badge, .gravida-badge {
          display: inline-block;
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 600;
          background: #ddd6fe;
          color: #7c3aed;
        }

        .report-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .report-card {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          text-align: center;
        }

        .report-card h4 {
          margin: 0 0 1rem 0;
          color: #1f2937;
          font-size: 1.125rem;
          font-weight: 600;
        }

        .report-metric {
          margin-bottom: 0.5rem;
        }

        .metric-value {
          display: block;
          font-size: 2.5rem;
          font-weight: 700;
          color: #1f2937;
          line-height: 1;
        }

        .metric-label {
          display: block;
          color: #6b7280;
          font-size: 0.875rem;
          margin-top: 0.25rem;
        }

        .metric-trend {
          font-size: 0.875rem;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;