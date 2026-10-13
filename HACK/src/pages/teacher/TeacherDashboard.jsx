import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CheckCircle,
  Camera,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  Clock3,
  Download,
  FileBarChart,
  FileText,
  LayoutDashboard,
  LifeBuoy,
  Mail,
  MessageCircle,
  Monitor,
  PlayCircle,
  Settings,
  Send,
  ShieldCheck,
  TrendingUp,
  Users,
  Video,
  X
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import { useApp } from '../../context/AppContext';

const TeacherDashboard = () => {
  const { state } = useApp();
  const { user } = state;
  const [activeTab, setActiveTab] = useState('dashboard');
  const [openFaq, setOpenFaq] = useState(0);
  const [supportPanel, setSupportPanel] = useState(null);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [ticketId, setTicketId] = useState('');
  const [detectedStudents, setDetectedStudents] = useState([]);
  const [missedStudentAlert, setMissedStudentAlert] = useState(null);
  const [notifications] = useState([
    { id: 1, type: 'camera', message: 'Camera 2 - Room 101 is offline', time: '10:30 AM' },
    { id: 2, type: 'alert', message: '3 students missed in CS101', time: '11:15 AM' },
    { id: 3, type: 'admin', message: 'New attendance policy update', time: '09:45 AM' }
  ]);

  const stats = {
    todayPresent: 28,
    todayAbsent: 7,
    pendingAlerts: 3,
    classesAssigned: 5
  };

  const schedule = [
    { time: '09:00 AM', subject: 'Computer Science 101', room: 'Room 101', students: 35 },
    { time: '11:00 AM', subject: 'Data Structures', room: 'Room 203', students: 42 },
    { time: '02:00 PM', subject: 'Algorithms', room: 'Room 105', students: 38 }
  ];

  const mockStudents = [
    { id: 'CS2101', name: 'Ravi Kumar', status: 'present', confidence: 95, lastSeen: '11:23 AM' },
    { id: 'CS2102', name: 'Priya Singh', status: 'present', confidence: 92, lastSeen: '11:22 AM' },
    { id: 'CS2103', name: 'Amit Sharma', status: 'absent', confidence: 0, lastSeen: 'Not detected' },
    { id: 'CS2104', name: 'Neha Patel', status: 'present', confidence: 88, lastSeen: '11:21 AM' }
  ];

  const reportData = [
    { date: '2024-01-15', subject: 'CS101', present: 32, absent: 3, percentage: 91.4 },
    { date: '2024-01-14', subject: 'CS101', present: 30, absent: 5, percentage: 85.7 },
    { date: '2024-01-13', subject: 'CS101', present: 33, absent: 2, percentage: 94.3 }
  ];

  const subjectAttendance = [
    { name: 'Computer Science 101', percentage: 91, attended: 32, total: 35 },
    { name: 'Data Structures', percentage: 86, attended: 36, total: 42 },
    { name: 'Algorithms', percentage: 89, attended: 34, total: 38 }
  ];

  const teacherTabs = [
    { id: 'dashboard', name: 'Overview', icon: LayoutDashboard },
    { id: 'monitor', name: 'Live Monitor', icon: Monitor },
    { id: 'reports', name: 'Reports', icon: FileBarChart },
    { id: 'settings', name: 'Settings', icon: Settings },
    { id: 'support', name: 'Support', icon: CircleHelp }
  ];

  useEffect(() => {
    setDetectedStudents(mockStudents);
  }, []);

  useEffect(() => {
    if (detectedStudents.length === 0) return undefined;

    const alertInterval = setInterval(() => {
      const missedStudent = detectedStudents.find(student => student.status === 'absent');
      if (missedStudent && Math.random() > 0.8) {
        setMissedStudentAlert((currentAlert) => currentAlert || {
          student: missedStudent,
          timestamp: new Date().toLocaleTimeString()
        });
      }
    }, 15000);
    return () => clearInterval(alertInterval);
  }, [detectedStudents]);

  const toggleStudentAttendance = (studentId) => {
    setDetectedStudents(prev => 
      prev.map(student => 
        student.id === studentId 
          ? { ...student, status: student.status === 'present' ? 'absent' : 'present' }
          : student
      )
    );
  };

  const handleMissedStudentAction = (action) => {
    if (action === 'mark_present' && missedStudentAlert) {
      toggleStudentAttendance(missedStudentAlert.student.id);
    }
    setMissedStudentAlert(null);
  };

  const exportReport = (format) => {
    alert(`Exporting report in ${format.toUpperCase()} format...`);
  };

  const renderDashboard = () => (
    <div className="space-y-6 role-dashboard-content teacher-dashboard-content">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div className="bg-white p-6 rounded-lg shadow-md" whileHover={{ scale: 1.02 }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Present</p>
              <p className="text-3xl font-bold text-green-600">{stats.todayPresent}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </motion.div>

        <motion.div className="bg-white p-6 rounded-lg shadow-md" whileHover={{ scale: 1.02 }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Absent</p>
              <p className="text-3xl font-bold text-red-600">{stats.todayAbsent}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
        </motion.div>

        <motion.div className="bg-white p-6 rounded-lg shadow-md" whileHover={{ scale: 1.02 }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Alerts</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.pendingAlerts}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
              </svg>
            </div>
          </div>
        </motion.div>

        <motion.div className="bg-white p-6 rounded-lg shadow-md" whileHover={{ scale: 1.02 }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Classes Assigned</p>
              <p className="text-3xl font-bold text-blue-600">{stats.classesAssigned}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16" />
              </svg>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="teacher-analytics-grid">
        <section className="role-panel teacher-subject-panel">
          <div className="role-panel-heading">
            <div>
              <span className="role-section-kicker">CLASS PERFORMANCE</span>
              <h3>Attendance by subject</h3>
            </div>
            <span className="role-panel-icon"><TrendingUp size={19} /></span>
          </div>
          <div className="teacher-subject-list">
            {subjectAttendance.map((subject, index) => (
              <div className="teacher-subject-row" key={subject.name}>
                <div className="teacher-subject-heading">
                  <span className="teacher-subject-index">{String(index + 1).padStart(2, '0')}</span>
                  <span>{subject.name}</span>
                  <strong>{subject.percentage}%</strong>
                </div>
                <div
                  className="teacher-subject-track"
                  role="img"
                  aria-label={`${subject.name}: ${subject.percentage}% attendance`}
                >
                  <span style={{ width: `${subject.percentage}%` }} />
                </div>
                <small>{subject.attended} of {subject.total} students present today</small>
              </div>
            ))}
          </div>
          <div className="role-panel-footnote"><ShieldCheck size={15} /> Average attendance across your classes</div>
        </section>

        <section className="role-panel teacher-week-panel">
          <div className="role-panel-heading">
            <div>
              <span className="role-section-kicker">WEEKLY TREND</span>
              <h3>Attendance snapshot</h3>
            </div>
            <span className="role-panel-icon role-panel-icon-purple"><Activity size={19} /></span>
          </div>
          <div className="teacher-week-chart" role="img" aria-label="Weekly attendance snapshot">
            {[
              { day: 'Mon', value: 78 },
              { day: 'Tue', value: 89 },
              { day: 'Wed', value: 84 },
              { day: 'Thu', value: 96 },
              { day: 'Fri', value: 91 }
            ].map(({ day, value }) => (
              <div className="teacher-week-column" key={day}>
                <strong>{value}%</strong>
                <div className="teacher-week-track"><span style={{ height: `${value}%` }} /></div>
                <small>{day}</small>
              </div>
            ))}
          </div>
          <div className="teacher-week-summary">
            <span><CalendarDays size={15} /> This week</span>
            <strong><TrendingUp size={15} /> +4.2% <small>vs last week</small></strong>
          </div>
        </section>
      </div>

      {/* Schedule and Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="role-panel teacher-schedule-panel">
          <div className="role-panel-heading">
            <div>
              <span className="role-section-kicker">YOUR DAY</span>
              <h3>Today's schedule</h3>
            </div>
            <span className="role-panel-icon"><Clock3 size={19} /></span>
          </div>
          <div className="space-y-3">
            {schedule.map((class_, index) => (
              <div key={index} className="teacher-schedule-row">
                <span className="teacher-schedule-time">{class_.time}</span>
                <div className="teacher-schedule-details">
                  <p className="font-medium text-gray-900">{class_.subject}</p>
                  <p className="text-sm text-gray-600">{class_.room} • {class_.students} students</p>
                </div>
                <span className="teacher-schedule-arrow">↗</span>
              </div>
            ))}
          </div>
        </div>

        <div className="role-panel teacher-notifications-panel">
          <div className="role-panel-heading">
            <div>
              <span className="role-section-kicker">STAY INFORMED</span>
              <h3>Recent notifications</h3>
            </div>
            <span className="role-panel-icon role-panel-icon-amber"><Users size={19} /></span>
          </div>
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div key={notification.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className={`p-2 rounded-full ${
                  notification.type === 'camera' ? 'bg-red-100' :
                  notification.type === 'alert' ? 'bg-yellow-100' : 'bg-blue-100'
                }`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{notification.message}</p>
                  <p className="text-xs text-gray-500">{notification.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderLiveMonitor = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Live Camera Feed - Room 101</h3>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-600 font-medium">Live</span>
          </div>
        </div>
        
        <div className="relative bg-gray-900 rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
            <div className="text-white text-center">
              <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <p className="text-lg opacity-50">Camera Feed Simulation</p>
              <p className="text-sm opacity-30">YOLOv11 Detection Active</p>
            </div>
          </div>
          
          <div className="absolute top-4 left-4">
            <div className="bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
              ✓ Ravi Kumar (95%)
            </div>
          </div>
          <div className="absolute top-16 right-4">
            <div className="bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
              ✓ Priya Singh (92%)
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Detected Students</h3>
        <div className="space-y-3">
          {detectedStudents.map((student) => (
            <div key={student.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  student.status === 'present' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                }`}>
                  {student.status === 'present' ? '✓' : '✗'}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{student.name}</p>
                  <p className="text-sm text-gray-600">{student.id} • Last seen: {student.lastSeen}</p>
                  {student.confidence > 0 && (
                    <p className="text-xs text-blue-600">Confidence: {student.confidence}%</p>
                  )}
                </div>
              </div>
              <button
                onClick={() => toggleStudentAttendance(student.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  student.status === 'present'
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                Mark {student.status === 'present' ? 'Absent' : 'Present'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="teacher-reports-view">
      <section className="teacher-report-hero">
        <div className="teacher-report-hero-copy">
          <span className="role-dashboard-eyebrow">CLASSROOM INSIGHTS</span>
          <h2>Attendance reports</h2>
          <p>Review daily attendance and share a clear summary with your class team.</p>
        </div>
        <div className="teacher-report-hero-icon"><FileBarChart size={34} /></div>
      </section>

      <div className="teacher-report-metrics">
        <article className="teacher-report-metric">
          <span className="teacher-report-metric-icon teacher-report-blue"><Users size={19} /></span>
          <span><small>Average attendance</small><strong>{(reportData.reduce((total, report) => total + report.percentage, 0) / reportData.length).toFixed(1)}%</strong></span>
        </article>
        <article className="teacher-report-metric">
          <span className="teacher-report-metric-icon teacher-report-green"><CheckCircle2 size={19} /></span>
          <span><small>Students present today</small><strong>{reportData[0].present} <em>of {reportData[0].present + reportData[0].absent}</em></strong></span>
        </article>
        <article className="teacher-report-metric">
          <span className="teacher-report-metric-icon teacher-report-violet"><CalendarDays size={19} /></span>
          <span><small>Sessions recorded</small><strong>{reportData.length} <em>recent classes</em></strong></span>
        </article>
      </div>

      <div className="teacher-report-grid">
        <section className="role-panel teacher-report-chart-panel">
          <div className="role-panel-heading">
            <div>
              <span className="role-section-kicker">RECENT CLASS SESSIONS</span>
              <h3>Attendance trend</h3>
            </div>
            <span className="role-panel-icon"><TrendingUp size={19} /></span>
          </div>
          <div className="teacher-report-chart" role="img" aria-label={`Recent attendance percentages: ${reportData.map(({ date, percentage }) => `${date}, ${percentage}%`).join('; ')}`}>
            {[...reportData].reverse().map((report) => (
              <div className="teacher-report-chart-column" key={`${report.date}-${report.subject}`}>
                <strong>{report.percentage}%</strong>
                <div className="teacher-report-chart-track">
                  <span style={{ height: `${report.percentage}%` }} />
                </div>
                <small>{new Date(`${report.date}T00:00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</small>
              </div>
            ))}
          </div>
          <div className="teacher-report-chart-note"><span /> Attendance rate per class session</div>
        </section>

        <section className="role-panel teacher-export-panel">
          <div className="role-panel-heading">
            <div>
              <span className="role-section-kicker">TAKE YOUR DATA WITH YOU</span>
              <h3>Export a report</h3>
            </div>
            <span className="role-panel-icon role-panel-icon-purple"><Download size={19} /></span>
          </div>
          <p className="teacher-export-description">Choose a format to prepare your attendance summary.</p>
          <div className="teacher-export-options">
            <button onClick={() => exportReport('excel')} className="teacher-export-option teacher-export-excel">
              <span><FileText size={18} /></span><strong>Excel</strong><small>.xlsx spreadsheet</small><ChevronRight size={17} />
            </button>
            <button onClick={() => exportReport('pdf')} className="teacher-export-option teacher-export-pdf">
              <span><FileText size={18} /></span><strong>PDF</strong><small>Ready to share</small><ChevronRight size={17} />
            </button>
            <button onClick={() => exportReport('csv')} className="teacher-export-option teacher-export-csv">
              <span><FileText size={18} /></span><strong>CSV</strong><small>Raw attendance data</small><ChevronRight size={17} />
            </button>
          </div>
        </section>
      </div>

      <section className="role-panel teacher-report-table-panel">
        <div className="role-panel-heading">
          <div>
            <span className="role-section-kicker">ATTENDANCE LOG</span>
            <h3>Recent class records</h3>
          </div>
          <span className="teacher-record-count">{reportData.length} records</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th>Date</th>
                <th>Subject</th>
                <th>Present</th>
                <th>Absent</th>
                <th>Attendance rate</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reportData.map((report) => (
                <tr key={`${report.date}-${report.subject}`}>
                  <td>{new Date(`${report.date}T00:00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                  <td><span className="teacher-report-subject"><span />{report.subject}</span></td>
                  <td><strong className="teacher-report-present">{report.present}</strong></td>
                  <td><strong className="teacher-report-absent">{report.absent}</strong></td>
                  <td>
                    <span className={`teacher-report-rate ${report.percentage >= 90 ? 'is-high' : 'is-normal'}`}>
                      {report.percentage}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2" defaultValue={user?.name || 'Dr. Sarah Johnson'} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" className="w-full border border-gray-300 rounded-lg px-3 py-2" defaultValue={user?.email || 'sarah.johnson@university.edu'} />
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Email Notifications</span>
            <input type="checkbox" className="rounded" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">SMS Alerts</span>
            <input type="checkbox" className="rounded" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderSupport = () => (
    <div className="teacher-support-view">
      <section className="teacher-support-hero">
        <div className="teacher-support-orbit teacher-support-orbit-one" />
        <div className="teacher-support-orbit teacher-support-orbit-two" />
        <div className="teacher-support-hero-copy">
          <span className="teacher-support-kicker"><LifeBuoy size={14} /> TEACHER HELP CENTER</span>
          <h2>How can we help?</h2>
          <p>Find quick guidance for your classroom tools, attendance reports, and camera setup.</p>
          <a href="mailto:support@university.edu" className="teacher-support-contact">
            <Mail size={16} /> Contact support <ArrowRight size={16} />
          </a>
        </div>
        <div className="teacher-support-hero-art" aria-hidden="true">
          <div className="teacher-support-art-card teacher-support-art-back"><span /><span /><span /></div>
          <div className="teacher-support-art-card teacher-support-art-front"><LifeBuoy size={33} /><strong>We’re here<br />to help</strong><small>Teacher support</small></div>
          <span className="teacher-support-art-spark">✦</span>
        </div>
      </section>

      <div className="teacher-support-card-grid">
        <button type="button" className="teacher-support-card support-card-blue" onClick={() => setSupportPanel(supportPanel === 'guide' ? null : 'guide')}>
          <span className="teacher-support-card-icon"><FileText size={21} /></span>
          <span className="teacher-support-card-copy"><strong>User guide</strong><small>Step-by-step help for attendance, classes, and reports.</small><em>Open user guide <ChevronRight size={14} /></em></span>
        </button>
        <button type="button" className="teacher-support-card support-card-violet" onClick={() => setSupportPanel(supportPanel === 'tutorial' ? null : 'tutorial')}>
          <span className="teacher-support-card-icon"><Video size={21} /></span>
          <span className="teacher-support-card-copy"><strong>Video tutorial</strong><small>Follow a visual walkthrough of your teacher dashboard.</small><em>Start tutorial <ChevronRight size={14} /></em></span>
        </button>
        <button type="button" className="teacher-support-card support-card-green" onClick={() => { setSupportPanel(supportPanel === 'ticket' ? null : 'ticket'); setTicketId(''); }}>
          <span className="teacher-support-card-icon"><Send size={21} /></span>
          <span className="teacher-support-card-copy"><strong>Support ticket</strong><small>Tell us what went wrong and how to reach you.</small><em>Create a ticket <ChevronRight size={14} /></em></span>
        </button>
      </div>

      {supportPanel === 'guide' && (
        <section className="role-panel teacher-help-resource" aria-labelledby="teacher-guide-title">
          <div className="role-panel-heading">
            <div><span className="role-section-kicker">TEACHER QUICK START</span><h3 id="teacher-guide-title">User guide</h3></div>
            <span className="role-panel-icon"><BookOpen size={19} /></span>
          </div>
          <div className="teacher-guide-steps">
            {[
              { number: '01', title: 'Start with Overview', text: 'Check today’s attendance, class schedule, and recent notifications.' },
              { number: '02', title: 'Take attendance', text: 'Open Live Monitor to review camera status and each detected student. Verify any missed-student alert before changing attendance.' },
              { number: '03', title: 'Review and export', text: 'Use Reports to compare recent sessions and prepare an Excel, PDF, or CSV summary.' },
              { number: '04', title: 'Manage your preferences', text: 'Open Settings to review your profile and notification preferences.' }
            ].map((step) => (
              <article className="teacher-guide-step" key={step.number}>
                <span>{step.number}</span>
                <div><strong>{step.title}</strong><p>{step.text}</p></div>
              </article>
            ))}
          </div>
        </section>
      )}

      {supportPanel === 'tutorial' && (
        <section className="role-panel teacher-help-resource" aria-labelledby="teacher-tutorial-title">
          <div className="role-panel-heading">
            <div><span className="role-section-kicker">VISUAL WALKTHROUGH</span><h3 id="teacher-tutorial-title">Teacher dashboard tutorial</h3></div>
            <span className="role-panel-icon role-panel-icon-purple"><Video size={19} /></span>
          </div>
          <div className="teacher-tutorial-layout">
            <div className="teacher-tutorial-player">
              <div className="teacher-tutorial-window">
                <div className="teacher-tutorial-window-bar"><i /><i /><i /><span>Teacher workspace</span></div>
                <div className="teacher-tutorial-window-content">
                  <span className="teacher-tutorial-screen-icon">
                    {tutorialStep === 0 ? <LayoutDashboard size={29} /> : tutorialStep === 1 ? <Camera size={29} /> : <FileBarChart size={29} />}
                  </span>
                  <strong>{['Your daily overview', 'Live attendance monitor', 'Reports and exports'][tutorialStep]}</strong>
                  <span>{['Review class activity and upcoming sessions.', 'Check detected students and camera status.', 'Compare attendance rates and choose an export format.'][tutorialStep]}</span>
                  <div className="teacher-tutorial-mini-bars"><i /><i /><i /><i /><i /></div>
                </div>
              </div>
              <div className="teacher-tutorial-player-footer">
                <span><PlayCircle size={16} /> Guided tutorial <small>{tutorialStep + 1} / 3</small></span>
                <button type="button" onClick={() => setTutorialStep((step) => (step + 1) % 3)}>
                  {tutorialStep === 2 ? 'Replay' : 'Next step'} <ArrowRight size={15} />
                </button>
              </div>
              <div className="teacher-tutorial-progress"><span style={{ width: `${((tutorialStep + 1) / 3) * 100}%` }} /></div>
            </div>
            <div className="teacher-tutorial-chapters">
              <span className="role-section-kicker">CHAPTERS</span>
              {['Overview', 'Live attendance', 'Reports & exports'].map((chapter, index) => (
                <button
                  type="button"
                  className={tutorialStep === index ? 'is-active' : ''}
                  key={chapter}
                  onClick={() => setTutorialStep(index)}
                >
                  <span>{String(index + 1).padStart(2, '0')}</span><strong>{chapter}</strong><ChevronRight size={15} />
                </button>
              ))}
              <p>This built-in visual walkthrough is available without leaving your dashboard.</p>
            </div>
          </div>
        </section>
      )}

      {supportPanel === 'ticket' && (
        <section className="role-panel teacher-help-resource teacher-ticket-panel" aria-labelledby="teacher-ticket-title">
          <div className="role-panel-heading">
            <div><span className="role-section-kicker">WE’LL LOOK INTO IT</span><h3 id="teacher-ticket-title">Create a support ticket</h3></div>
            <span className="role-panel-icon role-panel-icon-green"><Send size={19} /></span>
          </div>
          {ticketId ? (
            <div className="teacher-ticket-success" role="status">
              <CheckCircle size={24} />
              <div><strong>Demo ticket {ticketId} created</strong><p>This prototype does not send or store ticket details. Use the Email support option below to contact the team.</p></div>
              <button type="button" onClick={() => setTicketId('')}>Submit another</button>
            </div>
          ) : (
            <form
              className="teacher-ticket-form"
              onSubmit={(event) => {
                event.preventDefault();
                event.currentTarget.reset();
                setTicketId(`TKT-${Date.now().toString().slice(-6)}`);
              }}
            >
              <label>
                <span>Your name</span>
                <input name="name" autoComplete="name" defaultValue={user?.name || ''} required />
              </label>
              <label>
                <span>Email for updates</span>
                <input name="email" type="email" autoComplete="email" defaultValue={user?.email || ''} required />
              </label>
              <label>
                <span>What do you need help with?</span>
                <select name="topic" defaultValue="" required>
                  <option value="" disabled>Select a topic</option>
                  <option>Attendance correction</option>
                  <option>Camera or live monitor</option>
                  <option>Reports and exports</option>
                  <option>Account or settings</option>
                  <option>Other</option>
                </select>
              </label>
              <label className="teacher-ticket-full">
                <span>Describe the issue</span>
                <textarea name="message" rows="4" placeholder="Include the class, room, and what happened…" required />
              </label>
              <div className="teacher-ticket-submit-row">
                <small>Demo ticket form · No message is sent to an external service.</small>
                <button type="submit"><Send size={15} /> Submit ticket</button>
              </div>
            </form>
          )}
        </section>
      )}

      <section className="role-panel teacher-faq-panel">
        <div className="role-panel-heading">
          <div><span className="role-section-kicker">QUICK ANSWERS</span><h3>Frequently asked questions</h3></div>
          <span className="role-panel-icon role-panel-icon-amber"><CircleHelp size={19} /></span>
        </div>
        {[
          { question: 'How do I correct a student’s attendance?', answer: 'Open Live Monitor, find the student in the detected list, then use the attendance action to update their status.' },
          { question: 'Where can I download my class report?', answer: 'Open Reports and choose Excel, PDF, or CSV in the export panel. Recent class records are shown below.' },
          { question: 'What should I do if the camera is offline?', answer: 'Check the camera connection and browser permission, then reopen Live Monitor. Contact support if it remains unavailable.' }
        ].map((item, index) => (
          <div className={`teacher-faq-item ${openFaq === index ? 'is-open' : ''}`} key={item.question}>
            <button type="button" aria-expanded={openFaq === index} onClick={() => setOpenFaq(openFaq === index ? -1 : index)}>
              <span><MessageCircle size={16} />{item.question}</span><ChevronRight size={17} />
            </button>
            {openFaq === index && <p>{item.answer}</p>}
          </div>
        ))}
      </section>

      <div className="teacher-support-footer">
        <span className="teacher-support-footer-icon"><PlayCircle size={19} /></span>
        <span><strong>Still need a hand?</strong><small>Send the support team a message and include your class or room number.</small></span>
        <a href="mailto:support@university.edu?subject=Teacher%20dashboard%20support"><Mail size={15} /> Email support</a>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Missed Student Alert Modal */}
      {missedStudentAlert && (
        <div
          className="student-missing-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) handleMissedStudentAction('dismiss');
          }}
        >
          <motion.div
            className="student-missing-dialog"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="student-missing-title"
            aria-describedby="student-missing-description"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="student-missing-topline">
              <div className="student-missing-symbol"><AlertTriangle size={22} /></div>
              <span className="student-missing-status"><span /> Attendance needs review</span>
              <button
                type="button"
                className="student-missing-close"
                onClick={() => handleMissedStudentAction('dismiss')}
                aria-label="Dismiss missing student alert"
              >
                <X size={18} />
              </button>
            </div>
            <span className="role-section-kicker">LIVE ATTENDANCE ALERT</span>
            <h2 id="student-missing-title">Student not detected</h2>
            <p className="student-missing-message" id="student-missing-description">
              The camera has not recognized this student in the current class session.
            </p>

            <div className="student-missing-person">
              <span className="student-missing-avatar">
                {missedStudentAlert.student.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}
              </span>
              <span className="student-missing-person-details">
                <strong>{missedStudentAlert.student.name}</strong>
                <small>Student ID · {missedStudentAlert.student.id}</small>
              </span>
              <span className="student-missing-absent">Not detected</span>
            </div>

            <div className="student-missing-meta">
              <span><Camera size={15} /> Room 101 · CS101</span>
              <span><Clock3 size={15} /> {missedStudentAlert.timestamp}</span>
            </div>

            <div className="student-missing-actions">
              <button
                type="button"
                className="student-missing-review"
                onClick={() => {
                  setActiveTab('monitor');
                  setMissedStudentAlert(null);
                }}
              >
                <Camera size={16} /> Review camera
              </button>
              <button
                type="button"
                className="student-missing-confirm"
                onClick={() => handleMissedStudentAction('mark_present')}
              >
                <CheckCircle2 size={16} /> Mark present
              </button>
            </div>
            <button
              type="button"
              className="student-missing-dismiss"
              onClick={() => handleMissedStudentAction('dismiss')}
            >
              Dismiss alert
            </button>
          </motion.div>
        </div>
      )}

      <div className="role-dashboard-shell max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="role-dashboard-hero teacher-dashboard-hero">
          <div>
            <span className="role-dashboard-eyebrow">FACULTY WORKSPACE</span>
            <h1>Good to see you, {user?.name || 'Dr. Sarah Johnson'}</h1>
            <p>Keep your classes on track with live attendance and clear performance insights.</p>
          </div>
          <div className="role-hero-summary">
            <span className="role-hero-summary-icon"><CalendarDays size={20} /></span>
            <div><small>Today</small><strong>{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</strong></div>
          </div>
        </div>

        <div className="role-tab-menu-wrap">
          <nav className="role-tab-menu" aria-label="Teacher dashboard sections">
            {teacherTabs.map((tab) => {
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
                <span>{tab.name}</span>
              </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="role-tab-content">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'monitor' && renderLiveMonitor()}
          {activeTab === 'reports' && renderReports()}
          {activeTab === 'settings' && renderSettings()}
          {activeTab === 'support' && renderSupport()}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;