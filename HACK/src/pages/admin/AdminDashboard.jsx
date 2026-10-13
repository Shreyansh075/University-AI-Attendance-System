import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Camera,
  BarChart3,
  Settings,
  Monitor,
  Bell,
  AlertTriangle,
  CheckCircle,
  UserPlus,
  Download,
  Wifi,
  WifiOff,
  Cpu,
  HardDrive,
  Network,
  Video,
  Upload,
  ExternalLink,
  Activity,
  ArrowRight,
  CalendarDays,
  Clock3,
  FileText,
  Percent,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Navbar from '../../components/Navbar';
import VideoUpload from '../../components/VideoUpload';

const AdminDashboard = () => {
  const { state } = useApp();
  const [activeTab, setActiveTab] = useState('dashboard');
  const videoRef = useRef(null);
  const cameraStreamRef = useRef(null);
  const [cameraError, setCameraError] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [settingsError, setSettingsError] = useState('');
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('admin-dashboard-settings');
      return saved ? JSON.parse(saved) : {
        institution: 'University AI Attendance',
        attendanceThreshold: 75,
        emailAlerts: true,
        cameraMonitoring: true,
        faceRecognition: true
      };
    } catch (error) {
      console.error('Could not load admin settings:', error);
      return {
        institution: 'University AI Attendance',
        attendanceThreshold: 75,
        emailAlerts: true,
        cameraMonitoring: true,
        faceRecognition: true
      };
    }
  });
  const [cameras, setCameras] = useState([
    { id: 'CAM-101', name: 'Room 101', building: 'Science Block', online: true },
    { id: 'CAM-204', name: 'Room 204', building: 'Main Building', online: true },
    { id: 'CAM-305', name: 'Room 305', building: 'Engineering', online: false },
    { id: 'CAM-110', name: 'Room 110', building: 'Science Block', online: true }
  ]);
  const onlineCameraCount = cameras.filter((camera) => camera.online).length;
  const offlineCameraCount = cameras.length - onlineCameraCount;
  const [adminUsers, setAdminUsers] = useState(() => {
    const registered = state.registeredUsers || [];
    const normalized = registered.map((user) => ({
      id: user.id || user.email,
      name: user.name || 'New user',
      email: user.email || '',
      role: user.role || 'student',
      department: user.department || user.course || '—',
      active: true
    }));
    return normalized.length ? normalized : [
      { id: 'STU-2101', name: 'Ravi Kumar', email: 'ravi.kumar@university.edu', role: 'student', department: 'Computer Science', active: true },
      { id: 'TCH-1001', name: 'Dr. Sarah Wilson', email: 'sarah.wilson@university.edu', role: 'teacher', department: 'Computer Science', active: true }
    ];
  });
  const [showAddUser, setShowAddUser] = useState(false);
  const [userNotice, setUserNotice] = useState('');

  useEffect(() => () => {
    cameraStreamRef.current?.getTracks().forEach((track) => track.stop());
  }, []);

  const stats = {
    totalUsers: 152,
    activeCameras: onlineCameraCount,
    attendanceToday: { present: 89, absent: 11, total: 100 },
    alerts: 3
  };

  const weeklyAttendance = [
    { day: 'Mon', percentage: 90 },
    { day: 'Tue', percentage: 94 },
    { day: 'Wed', percentage: 88 },
    { day: 'Thu', percentage: 97 },
    { day: 'Fri', percentage: 93 }
  ];

  const attendanceByDepartment = [
    { name: 'Computer Science', rate: 94, present: 47, total: 50, tone: 'blue' },
    { name: 'Engineering', rate: 91, present: 41, total: 45, tone: 'violet' },
    { name: 'Business', rate: 86, present: 31, total: 36, tone: 'green' },
    { name: 'Arts & Humanities', rate: 84, present: 21, total: 25, tone: 'amber' }
  ];

  const cameraFleet = [
    { name: 'Room 101', building: 'Science Block', status: 'Online', lastSeen: 'Live now' },
    { name: 'Room 204', building: 'Main Building', status: 'Online', lastSeen: 'Live now' },
    { name: 'Room 305', building: 'Engineering', status: 'Offline', lastSeen: '12 min ago' }
  ];

  const recentActivity = [
    { icon: Users, title: 'New user registrations reviewed', detail: 'Student accounts · 6 users', time: '10 min ago', tone: 'blue' },
    { icon: Camera, title: 'Camera connection interrupted', detail: 'Room 305 · Engineering Block', time: '18 min ago', tone: 'amber' },
    { icon: CheckCircle, title: 'Attendance report generated', detail: 'Campus daily summary', time: '42 min ago', tone: 'green' }
  ];

  const quickActions = [
    { label: 'Manage users', description: 'Review students and teachers', icon: Users, tab: 'users', tone: 'blue' },
    { label: 'Camera fleet', description: 'Check classroom connections', icon: Camera, tab: 'cameras', tone: 'violet' },
    { label: 'View reports', description: 'Explore attendance analytics', icon: FileText, tab: 'reports', tone: 'green' },
    { label: 'System settings', description: 'Configure campus preferences', icon: Settings, tab: 'settings', tone: 'amber' }
  ];

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'users', label: 'Users Management', icon: Users },
    { id: 'cameras', label: 'Cameras Management', icon: Camera },
    { id: 'videos', label: 'Demo Videos', icon: Video },
    { id: 'live', label: 'Live Monitor', icon: Monitor },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'support', label: 'Support & Help', icon: Bell }
  ];

  const handleVideoUpload = (videoData) => {
    console.log('Video uploaded:', videoData);
    // Here you could send the video to a server or perform additional processing
    // For now, we'll just log it and the component handles local storage
  };

  const startAdminCamera = async () => {
    setCameraError('');
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError('Camera access is unavailable. Use HTTPS or localhost and a supported browser.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      cameraStreamRef.current = stream;
      if (!videoRef.current) throw new Error('Camera preview could not be displayed.');
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      setCameraActive(true);
    } catch (error) {
      console.error('Admin live monitor camera failed:', error);
      cameraStreamRef.current?.getTracks().forEach((track) => track.stop());
      cameraStreamRef.current = null;
      setCameraActive(false);
      setCameraError(
        error.name === 'NotAllowedError'
          ? 'Camera permission was denied. Allow camera access in your browser settings and try again.'
          : error.name === 'NotFoundError'
            ? 'No camera was found on this device.'
            : error.message || 'Could not start the camera.'
      );
    }
  };

  const stopAdminCamera = () => {
    cameraStreamRef.current?.getTracks().forEach((track) => track.stop());
    cameraStreamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraActive(false);
  };

  const saveAdminSettings = () => {
    try {
      localStorage.setItem('admin-dashboard-settings', JSON.stringify(settings));
      setSettingsSaved(true);
      setSettingsError('');
    } catch (error) {
      console.error('Could not save admin settings:', error);
      setSettingsSaved(false);
      setSettingsError('Could not save settings in this browser. Check storage permissions and try again.');
    }
  };

  const exportAdminReport = () => {
    const rows = [
      ['Department', 'Present', 'Total', 'Attendance rate'],
      ...attendanceByDepartment.map(({ name, present, total, rate }) => [name, present, total, `${rate}%`])
    ];
    const csv = rows.map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'campus-attendance-report.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const renderDashboard = () => (
    <div className="space-y-6 role-dashboard-content admin-dashboard-content">
      <div className="admin-demo-notice">
        <span><Activity size={15} /> DEMO OVERVIEW</span>
        <p>These campus figures are sample data for preview. Live system metrics are not connected in this demo.</p>
      </div>
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 admin-kpi-grid">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card bg-gradient-to-r from-blue-500 to-blue-600 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">📊 Total Users</p>
              <p className="text-3xl font-bold">{stats.totalUsers}</p>
              <p className="text-sm text-blue-100">Students & Teachers</p>
            </div>
            <Users className="h-12 w-12 text-blue-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card bg-gradient-to-r from-green-500 to-green-600 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">📷 Active Cameras</p>
              <p className="text-3xl font-bold">{stats.activeCameras}</p>
              <p className="text-sm text-green-100">Online · {offlineCameraCount} needs attention</p>
            </div>
            <Camera className="h-12 w-12 text-green-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card bg-gradient-to-r from-purple-500 to-purple-600 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">✅ Today's Attendance</p>
              <p className="text-3xl font-bold">{stats.attendanceToday.present}/{stats.attendanceToday.total}</p>
              <p className="text-sm text-purple-100">{Math.round((stats.attendanceToday.present/stats.attendanceToday.total)*100)}% Present</p>
            </div>
            <CheckCircle className="h-12 w-12 text-purple-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card bg-gradient-to-r from-red-500 to-red-600 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100">🚨 Active Alerts</p>
              <p className="text-3xl font-bold">{stats.alerts}</p>
              <p className="text-sm text-red-100">Need Attention</p>
            </div>
            <AlertTriangle className="h-12 w-12 text-red-200" />
          </div>
        </motion.div>
      </div>

      {/* Analytics & Alerts */}
      <div className="admin-analytics-grid">
        <section className="role-panel admin-trend-panel">
          <div className="role-panel-heading">
            <div>
              <span className="role-section-kicker">CAMPUS OVERVIEW</span>
              <h3>Weekly attendance trends</h3>
            </div>
            <span className="role-panel-icon"><TrendingUp size={19} /></span>
          </div>
          <div className="admin-trend-chart" role="img" aria-label="Weekly attendance rates: Monday 90%, Tuesday 94%, Wednesday 88%, Thursday 97%, Friday 93%">
            {weeklyAttendance.map(({ day, percentage }) => (
              <div className="admin-trend-column" key={day}>
                <strong>{percentage}%</strong>
                <div className="admin-trend-track"><span style={{ height: `${percentage}%` }} /></div>
                <small>{day}</small>
              </div>
            ))}
          </div>
          <div className="admin-trend-summary">
            <span><CalendarDays size={15} /> This week</span>
            <strong><Activity size={15} /> 92% <small>campus average</small></strong>
          </div>
        </section>

        <section className="role-panel admin-alerts-panel">
          <div className="role-panel-heading">
            <div>
              <span className="role-section-kicker">REQUIRES ATTENTION</span>
              <h3>Recent alerts</h3>
            </div>
            <span className="role-panel-icon role-panel-icon-amber"><Bell size={19} /></span>
          </div>
          <div className="space-y-3">
            <div className="p-3 rounded-lg border-l-4 border-red-500 bg-red-50">
              <p className="text-sm font-medium text-gray-900">Camera 3 - Classroom A offline since 2:30 PM</p>
              <p className="text-xs text-gray-500 mt-1">10 mins ago</p>
            </div>
            <div className="p-3 rounded-lg border-l-4 border-yellow-500 bg-yellow-50">
              <p className="text-sm font-medium text-gray-900">5 students not detected in Room 101</p>
              <p className="text-xs text-gray-500 mt-1">25 mins ago</p>
            </div>
            <div className="p-3 rounded-lg border-l-4 border-blue-500 bg-blue-50">
              <p className="text-sm font-medium text-gray-900">Storage usage above 80%</p>
              <p className="text-xs text-gray-500 mt-1">1 hour ago</p>
            </div>
          </div>
        </section>
      </div>

      {/* System Health */}
      <section className="role-panel admin-health-panel">
        <div className="role-panel-heading">
          <div>
            <span className="role-section-kicker">INFRASTRUCTURE</span>
            <h3>System health</h3>
          </div>
          <span className="role-panel-icon role-panel-icon-green"><ShieldCheck size={19} /></span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'CPU Usage', value: 65, icon: Cpu, tone: 'blue' },
            { label: 'Storage', value: 78, icon: HardDrive, tone: 'purple' },
            { label: 'Network', value: 95, icon: Network, tone: 'green' }
          ].map(({ label, value, icon: Icon, tone }) => (
            <div className={`admin-health-item admin-health-${tone}`} key={label}>
              <div className="admin-health-label">
                <div className="flex items-center">
                  <Icon className="h-6 w-6 mr-3" />
                  <span className="font-medium">{label}</span>
                </div>
                <strong>{value}%</strong>
              </div>
              <div className="admin-health-track" role="img" aria-label={`${label}: ${value}%`}>
                <span style={{ width: `${value}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="admin-operations-grid">
        <section className="role-panel admin-department-panel">
          <div className="role-panel-heading">
            <div>
              <span className="role-section-kicker">TODAY · DEPARTMENT VIEW</span>
              <h3>Attendance by department</h3>
            </div>
            <span className="role-panel-icon"><Percent size={19} /></span>
          </div>
          <div className="admin-department-list">
            {attendanceByDepartment.map((department) => (
              <div className="admin-department-row" key={department.name}>
                <div className="admin-department-row-heading">
                  <span>{department.name}</span>
                  <strong>{department.rate}%</strong>
                </div>
                <div className={`admin-department-track admin-department-${department.tone}`} role="img" aria-label={`${department.name}: ${department.rate}% attendance`}>
                  <span style={{ width: `${department.rate}%` }} />
                </div>
                <small>{department.present} of {department.total} students present</small>
              </div>
            ))}
          </div>
          <button type="button" className="admin-panel-link" onClick={() => setActiveTab('reports')}>
            Open attendance analytics <ArrowRight size={15} />
          </button>
        </section>

        <section className="role-panel admin-camera-panel">
          <div className="role-panel-heading">
            <div>
              <span className="role-section-kicker">DEVICE STATUS</span>
              <h3>Camera fleet</h3>
            </div>
            <span className="role-panel-icon role-panel-icon-purple"><Camera size={19} /></span>
          </div>
          <div className="admin-camera-summary">
            <div className="admin-camera-summary-ring" style={{ '--camera-online-angle': `${(onlineCameraCount / cameras.length) * 100}%` }}><strong>{onlineCameraCount}<span>/{cameras.length}</span></strong></div>
            <div><strong>Most cameras are online</strong><small>{offlineCameraCount ? `${offlineCameraCount} device${offlineCameraCount === 1 ? '' : 's'} may need attention` : 'All demo devices are online'}</small></div>
          </div>
          <div className="admin-camera-list">
            {cameraFleet.map((camera) => (
              <div className="admin-camera-row" key={camera.name}>
                <span className={`admin-camera-indicator ${camera.status === 'Online' ? 'is-online' : 'is-offline'}`} />
                <span className="admin-camera-name"><strong>{camera.name}</strong><small>{camera.building}</small></span>
                <span className={`admin-camera-state ${camera.status === 'Online' ? 'is-online' : 'is-offline'}`}>{camera.status}</span>
                <small className="admin-camera-last-seen">{camera.lastSeen}</small>
              </div>
            ))}
          </div>
          <button type="button" className="admin-panel-link" onClick={() => setActiveTab('cameras')}>
            Manage cameras <ArrowRight size={15} />
          </button>
        </section>
      </div>

      <section className="role-panel admin-quick-actions">
        <div className="role-panel-heading">
          <div>
            <span className="role-section-kicker">ADMIN TOOLS</span>
            <h3>Quick actions</h3>
          </div>
          <span className="role-panel-icon role-panel-icon-amber"><Activity size={19} /></span>
        </div>
        <div className="admin-action-grid">
          {quickActions.map(({ label, description, icon: Icon, tab, tone }) => (
            <button type="button" className="admin-action-card" key={tab} onClick={() => setActiveTab(tab)}>
              <span className={`admin-action-icon admin-action-${tone}`}><Icon size={19} /></span>
              <span><strong>{label}</strong><small>{description}</small></span>
              <ArrowRight size={16} />
            </button>
          ))}
        </div>
      </section>

      <section className="role-panel admin-activity-panel">
        <div className="role-panel-heading">
          <div>
            <span className="role-section-kicker">CAMPUS PULSE</span>
            <h3>Recent activity</h3>
          </div>
          <span className="role-panel-icon role-panel-icon-green"><Clock3 size={19} /></span>
        </div>
        <div className="admin-activity-list">
          {recentActivity.map(({ icon: Icon, title, detail, time, tone }) => (
            <div className="admin-activity-row" key={title}>
              <span className={`admin-activity-icon admin-activity-${tone}`}><Icon size={17} /></span>
              <span className="admin-activity-copy"><strong>{title}</strong><small>{detail}</small></span>
              <small className="admin-activity-time">{time}</small>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  const renderVideosManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">🎥 Demo Videos Management</h2>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
            📌 <strong>How to test:</strong> Upload a video below and it will appear on the website's demo section!
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Upload videos for website demo section</span>
            <Upload className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-green-800 mb-2">🚀 Ready for Video Upload Test!</h3>
            <div className="text-sm text-green-700 space-y-1">
              <p>• Upload any video file (MP4, AVI, MOV) up to 200MB and 15 minutes</p>
              <p>• Choose a category (e.g., "yolo-demo", "classroom-session")</p>
              <p>• Video will be automatically marked as "Demo" and appear on website</p>
              <p>• Visit the landing page to see your uploaded video in the demo section!</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <a 
              href="/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <ExternalLink className="h-4 w-4" />
              View Demo Section
            </a>
            <span className="text-xs text-gray-500 text-center">Opens in new tab</span>
          </div>
        </div>
      </div>
      
      <VideoUpload 
        onUpload={handleVideoUpload}
        maxSize={200}
        maxDuration={900}
      />
    </div>
  );

  const renderUsersManagement = () => (
    <div className="admin-workspace">
      <div className="admin-section-heading">
        <div><h2>User management</h2><p>Manage demo accounts in this browser session.</p></div>
        <button type="button" className="btn btn-primary" onClick={() => setShowAddUser((open) => !open)}>
          <UserPlus size={17} /> {showAddUser ? 'Cancel' : 'Add user'}
        </button>
      </div>
      <div className="admin-demo-notice"><span><Activity size={15} /> DEMO USERS</span><p>User records are local preview data. No backend user directory is connected.</p></div>
      {userNotice && <p className="admin-inline-notice" role="status">{userNotice}</p>}
      {showAddUser && (
        <form
          className="role-panel admin-add-user-form"
          onSubmit={(event) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            const email = String(data.get('email')).trim();
            if (adminUsers.some((user) => user.email.toLowerCase() === email.toLowerCase())) {
              setUserNotice('A user with that email already exists.');
              return;
            }
            setAdminUsers((users) => [...users, {
              id: `DEMO-${Date.now()}`,
              name: String(data.get('name')).trim(),
              email,
              role: String(data.get('role')),
              department: String(data.get('department')).trim() || '—',
              active: true
            }]);
            setUserNotice('Demo user added to this page.');
            event.currentTarget.reset();
            setShowAddUser(false);
          }}
        >
          <label><span>Full name</span><input name="name" required /></label>
          <label><span>Email</span><input name="email" type="email" required /></label>
          <label><span>Role</span><select name="role"><option value="student">Student</option><option value="teacher">Teacher</option><option value="admin">Admin</option></select></label>
          <label><span>Department</span><input name="department" placeholder="Department (optional)" /></label>
          <button type="submit" className="btn btn-primary">Add demo user</button>
        </form>
      )}
      <section className="role-panel admin-users-panel">
        <div className="role-panel-heading"><div><span className="role-section-kicker">CAMPUS DIRECTORY</span><h3>Users <span className="admin-count-pill">{adminUsers.length}</span></h3></div><span className="role-panel-icon"><Users size={19} /></span></div>
        <div className="overflow-x-auto">
          <table className="admin-data-table">
            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Department</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {adminUsers.map((user) => (
                <tr key={user.id}>
                  <td><strong>{user.name}</strong></td><td>{user.email}</td>
                  <td><span className="admin-role-badge">{user.role}</span></td><td>{user.department}</td>
                  <td><span className={`admin-user-status ${user.active ? 'is-active' : 'is-disabled'}`}>{user.active ? 'Active' : 'Disabled'}</span></td>
                  <td><button type="button" className="admin-table-action" onClick={() => setAdminUsers((users) => users.map((item) => item.id === user.id ? { ...item, active: !item.active } : item))}>{user.active ? 'Disable' : 'Enable'}</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );

  const renderActiveTabContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'users':
        return renderUsersManagement();
      case 'videos':
        return renderVideosManagement();
      case 'cameras':
        return (
          <div className="admin-workspace">
            <div className="admin-section-heading"><div><h2>Camera management</h2><p>Review and control the demo camera fleet.</p></div><button type="button" className="btn btn-primary" onClick={() => setActiveTab('live')}><Monitor size={17} /> Open live monitor</button></div>
            <div className="admin-demo-notice"><span><Activity size={15} /> DEMO DEVICES</span><p>Camera states are local preview controls and are not connected to physical CCTV devices.</p></div>
            <div className="admin-camera-management-grid">
              {cameras.map((camera) => (
                <article className="role-panel admin-camera-management-card" key={camera.id}>
                  <div className="admin-camera-card-top"><span className={`admin-camera-indicator ${camera.online ? 'is-online' : 'is-offline'}`} /><span className={`admin-camera-state ${camera.online ? 'is-online' : 'is-offline'}`}>{camera.online ? 'Online' : 'Offline'}</span><Camera size={19} /></div>
                  <span className="role-section-kicker">{camera.id}</span><h3>{camera.name}</h3><p>{camera.building}</p>
                  <button type="button" className="admin-camera-toggle" onClick={() => setCameras((items) => items.map((item) => item.id === camera.id ? { ...item, online: !item.online } : item))}>{camera.online ? <><WifiOff size={15} /> Simulate offline</> : <><Wifi size={15} /> Set online</>}</button>
                </article>
              ))}
            </div>
          </div>
        );
      case 'live':
        return (
          <div className="admin-workspace">
            <div className="admin-section-heading"><div><h2>Live monitor</h2><p>Preview a local camera feed. Face detection is not connected in this demo.</p></div><span className={`admin-live-status ${cameraActive ? 'is-live' : ''}`}><i />{cameraActive ? 'Camera active' : 'Camera stopped'}</span></div>
            <div className="admin-demo-notice"><span><Monitor size={15} /> LOCAL CAMERA PREVIEW</span><p>This uses your device camera only after you grant permission; it does not access campus CCTV.</p></div>
            <section className="role-panel admin-live-panel">
              <div className="admin-live-toolbar">
                <div><strong>Device preview</strong><small>Browser camera</small></div>
                {cameraActive
                  ? <button type="button" className="admin-live-stop" onClick={stopAdminCamera}><WifiOff size={15} /> Stop camera</button>
                  : <button type="button" className="btn btn-primary" onClick={startAdminCamera}><Camera size={16} /> Enable camera</button>}
              </div>
              <div className="admin-live-view">
                <video ref={videoRef} autoPlay muted playsInline aria-label="Local camera preview" />
                {!cameraActive && <div className="admin-live-placeholder"><Camera size={40} /><strong>Camera preview is off</strong><span>Enable the camera to show a live preview here.</span></div>}
                {cameraActive && <span className="admin-live-tag"><i /> LIVE PREVIEW</span>}
              </div>
              {cameraError && <p className="admin-live-error" role="alert">{cameraError}</p>}
            </section>
          </div>
        );
      case 'reports':
        return (
          <div className="admin-workspace">
            <div className="admin-section-heading"><div><h2>Reports & analytics</h2><p>Review sample attendance by department and export the current summary.</p></div><button type="button" className="btn btn-primary" onClick={exportAdminReport}><Download size={16} /> Download CSV</button></div>
            <div className="admin-demo-notice"><span><BarChart3 size={15} /> DEMO REPORT</span><p>These figures are sample data and should not be used as official attendance records.</p></div>
            <section className="role-panel admin-report-table-panel">
              <div className="role-panel-heading"><div><span className="role-section-kicker">TODAY</span><h3>Department attendance summary</h3></div><span className="role-panel-icon"><TrendingUp size={19} /></span></div>
              <div className="overflow-x-auto"><table className="admin-data-table"><thead><tr><th>Department</th><th>Present</th><th>Total</th><th>Attendance</th><th>Rate</th></tr></thead><tbody>
                {attendanceByDepartment.map((item) => <tr key={item.name}><td><strong>{item.name}</strong></td><td>{item.present}</td><td>{item.total}</td><td><span className="admin-report-bar"><i style={{ width: `${item.rate}%` }} /></span></td><td><strong>{item.rate}%</strong></td></tr>)}
              </tbody></table></div>
            </section>
            <section className="role-panel admin-report-chart-panel"><div className="role-panel-heading"><div><span className="role-section-kicker">WEEK AT A GLANCE</span><h3>Daily attendance rate</h3></div><span className="role-panel-icon role-panel-icon-purple"><Activity size={19} /></span></div>
              <div className="admin-report-week">{weeklyAttendance.map(({ day, percentage }) => <div key={day}><strong>{percentage}%</strong><span><i style={{ height: `${percentage}%` }} /></span><small>{day}</small></div>)}</div>
            </section>
          </div>
        );
      case 'settings':
        return (
          <div className="admin-workspace">
            <div className="admin-section-heading"><div><h2>System settings</h2><p>Adjust preferences for this demo in your current browser.</p></div><span className="role-panel-icon"><Settings size={19} /></span></div>
            <div className="admin-demo-notice"><span><Settings size={15} /> LOCAL SETTINGS</span><p>Saved to this browser only. These preferences are not applied to a backend service.</p></div>
            <section className="role-panel admin-settings-panel">
              <label className="admin-setting-field"><span><strong>Institution name</strong><small>Shown in this administration workspace.</small></span><input value={settings.institution} onChange={(event) => { setSettings((current) => ({ ...current, institution: event.target.value })); setSettingsSaved(false); }} /></label>
              <label className="admin-setting-field"><span><strong>Attendance alert threshold</strong><small>Flag attendance below this percentage.</small></span><span className="admin-threshold-input"><input type="number" min="1" max="100" value={settings.attendanceThreshold} onChange={(event) => { setSettings((current) => ({ ...current, attendanceThreshold: Math.min(100, Math.max(1, Number(event.target.value))) })); setSettingsSaved(false); }} /><b>%</b></span></label>
              {[
                { key: 'emailAlerts', title: 'Email alerts', description: 'Enable notifications for urgent system events.' },
                { key: 'cameraMonitoring', title: 'Camera monitoring', description: 'Allow camera status monitoring in this demo.' },
                { key: 'faceRecognition', title: 'Face recognition', description: 'Enable face recognition preference for this demo.' }
              ].map((preference) => <label className="admin-setting-field" key={preference.key}><span><strong>{preference.title}</strong><small>{preference.description}</small></span><input type="checkbox" checked={settings[preference.key]} onChange={(event) => { setSettings((current) => ({ ...current, [preference.key]: event.target.checked })); setSettingsSaved(false); }} /></label>)}
              <div className="admin-settings-actions"><span role={settingsError ? 'alert' : 'status'}>{settingsError || (settingsSaved ? 'Preferences saved on this device.' : 'Changes are not saved yet.')}</span><button type="button" className="btn btn-primary" onClick={saveAdminSettings}>Save preferences</button></div>
            </section>
          </div>
        );
      case 'support':
        return (
          <div className="admin-workspace">
            <section className="teacher-support-hero">
              <div className="teacher-support-hero-copy"><span className="teacher-support-kicker"><ShieldCheck size={14} /> ADMIN HELP CENTER</span><h2>Need help with setup?</h2><p>Reach the product team for assistance with your dashboard and demo configuration.</p><a href="mailto:support@university.edu?subject=Admin%20dashboard%20support" className="teacher-support-contact">Email support <ArrowRight size={16} /></a></div>
              <div className="teacher-support-hero-art" aria-hidden="true"><div className="teacher-support-art-card teacher-support-art-back"><span /><span /><span /></div><div className="teacher-support-art-card teacher-support-art-front"><ShieldCheck size={33} /><strong>Admin<br />support</strong><small>We can help</small></div></div>
            </section>
            <div className="admin-demo-notice"><span><Bell size={15} /> SUPPORT</span><p>Backend support tickets are not configured. Use email support to send a request.</p></div>
          </div>
        );
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="role-dashboard-shell max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="role-dashboard-hero admin-dashboard-hero">
          <div>
            <span className="role-dashboard-eyebrow">SYSTEM ADMINISTRATION</span>
            <h1>Welcome back, {state.user?.name || 'Administrator'}</h1>
            <p>Monitor campus attendance, manage your workspace, and keep every system healthy.</p>
          </div>
          <div className="role-hero-summary">
            <span className="role-hero-summary-icon"><ShieldCheck size={20} /></span>
            <div><small>System status</small><strong><span className={`admin-status-dot ${offlineCameraCount ? 'admin-status-warning' : ''}`} /> {offlineCameraCount ? `${offlineCameraCount} camera${offlineCameraCount === 1 ? '' : 's'} need attention` : 'All demo cameras online'}</strong></div>
          </div>
        </div>

        <div className="role-tab-menu-wrap">
          <nav className="role-tab-menu admin-tab-menu" aria-label="Admin dashboard sections">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  aria-current={activeTab === tab.id ? 'page' : undefined}
                  className={`role-tab-button ${
                    activeTab === tab.id
                      ? 'is-active'
                      : ''
                  }`}
                >
                  <Icon size={17} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Active Tab Content */}
        <motion.div
          className="role-tab-content"
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderActiveTabContent()}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;