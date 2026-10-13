import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  CalendarDays,
  BarChart3,
  BookOpen,
  Camera,
  ChartNoAxesCombined,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  Clock3,
  ClipboardList,
  Download,
  FileText,
  LifeBuoy,
  LayoutDashboard,
  Mail,
  MessageCircle,
  Percent,
  PlayCircle,
  Send,
  Settings,
  ShieldCheck,
  UserRound,
  Video,
  Users
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import { useApp } from '../../context/AppContext';
// Import libraries for PDF and Excel generation
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
// Import the AdvancedFaceDetectionCamera component for photo capture
import AdvancedFaceDetectionCamera from '../../components/AdvancedFaceDetectionCamera';

const StudentDashboard = () => {
  const { state } = useApp();
  const { user } = state;
  const [activeTab, setActiveTab] = useState('dashboard');
  const [reportFilters, setReportFilters] = useState({
    dateRange: 'all',
    subject: 'all',
    status: 'all'
  });
  const [supportTicket, setSupportTicket] = useState({
    subject: '',
    description: '',
    priority: 'medium'
  });
  const [supportPanel, setSupportPanel] = useState(null);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [openFaq, setOpenFaq] = useState(0);
  const [ticketId, setTicketId] = useState('');
  const [supportMessage, setSupportMessage] = useState('');
  // Add state for captured photos
  const [capturedPhotos, setCapturedPhotos] = useState([]);

  // Mock student data
  const studentData = {
    rollNo: user?.rollNo || 'CS2021001',
    name: user?.name || 'Roushan Kumar',
    email: user?.email || 'roushan.kumar@university.edu',
    department: user?.department || 'Computer Science',
    contact: user?.mobile || '+91 9876543210',
    monthlyPercentage: 87.5,
    todayStatus: 'Present'
  };

  const attendanceDate = (daysAgo) => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${date.getFullYear()}-${month}-${day}`;
  };

  // Mock upcoming classes
  const upcomingClasses = [
    { time: '10:00 AM', subject: 'Machine Learning', teacher: 'Dr. Sarah Wilson', room: 'Lab 201' },
    { time: '02:00 PM', subject: 'Database Systems', teacher: 'Prof. Michael Brown', room: 'Room 105' },
    { time: '04:00 PM', subject: 'Software Engineering', teacher: 'Dr. Emily Davis', room: 'Room 302' }
  ];

  // Mock correction logs
  const correctionLogs = [
    { date: '2024-01-14', subject: 'Computer Science', originalStatus: 'Absent', correctedStatus: 'Present', correctedBy: 'Dr. Sarah Wilson', reason: 'Technical issue with face detection', time: '10:30 AM' },
    { date: '2024-01-12', subject: 'Data Structures', originalStatus: 'Present', correctedStatus: 'Absent', correctedBy: 'Prof. Michael Brown', reason: 'Student left early', time: '02:15 PM' }
  ];

  const attendanceStats = {
    subjects: [
      { name: 'Computer Science', percentage: 92, present: 23, total: 25 },
      { name: 'Data Structures', percentage: 88, present: 22, total: 25 },
      { name: 'Database Systems', percentage: 84, present: 21, total: 25 },
      { name: 'Algorithms', percentage: 80, present: 20, total: 25 }
    ]
  };

  const totalClasses = attendanceStats.subjects.reduce((sum, subject) => sum + subject.total, 0);
  const totalPresent = attendanceStats.subjects.reduce((sum, subject) => sum + subject.present, 0);
  const overallSubjectPercentage = totalClasses
    ? Math.round((totalPresent / totalClasses) * 100)
    : 0;

  const dashboardMenuItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'reports', label: 'Reports', icon: ClipboardList },
    { id: 'profile', label: 'Profile', icon: UserRound },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'support', label: 'Support', icon: CircleHelp },
    { id: 'photo-capture', label: 'Photo Capture', icon: Camera }
  ];

  const notifications = [
    { id: 1, type: 'warning', message: 'Your attendance is below 75% in Computer Science', time: '2 hours ago' },
    { id: 2, type: 'info', message: 'Please upload more face samples for better recognition', time: '1 day ago' },
    { id: 3, type: 'success', message: 'Attendance marked for Database Systems class', time: '2 days ago' }
  ];

  const attendanceHistory = [
    { date: attendanceDate(0), subject: 'Computer Science', status: 'Present', teacher: 'Dr. Sarah Wilson', time: '09:00 AM' },
    { date: attendanceDate(0), subject: 'Data Structures', status: 'Present', teacher: 'Prof. Michael Brown', time: '11:00 AM' },
    { date: attendanceDate(1), subject: 'Computer Science', status: 'Present', teacher: 'Dr. Sarah Wilson', time: '09:00 AM' },
    { date: attendanceDate(1), subject: 'Database Systems', status: 'Present', teacher: 'Dr. Emily Davis', time: '02:00 PM' },
    { date: attendanceDate(2), subject: 'Algorithms', status: 'Absent', teacher: 'Prof. John Smith', time: '04:00 PM' },
    { date: attendanceDate(3), subject: 'Machine Learning', status: 'Present', teacher: 'Dr. Sarah Wilson', time: '10:00 AM' }
  ];

  useEffect(() => {
    // Component mounted - no mock data needed anymore
  }, []);

  // Function to handle photo capture
  const handlePhotoCapture = (photo) => {
    setCapturedPhotos(prev => [photo, ...prev]);
    console.log('Photo captured:', photo);
  };

  // Function to generate PDF report
  const generatePDFReport = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text('Attendance Report', 105, 20, null, null, 'center');
    
    // Add student info
    doc.setFontSize(12);
    doc.text(`Student Name: ${studentData.name}`, 20, 35);
    doc.text(`Roll Number: ${studentData.rollNo}`, 20, 45);
    doc.text(`Department: ${studentData.department}`, 20, 55);
    doc.text(`Report Generated: ${new Date().toLocaleDateString()}`, 20, 65);
    
    // Filter attendance history based on selected filters
    const filteredHistory = attendanceHistory.filter(record => {
      const dateMatch = reportFilters.dateRange === 'all' || 
        (reportFilters.dateRange === 'week' && new Date(record.date) >= new Date(Date.now() - 7*24*60*60*1000)) ||
        (reportFilters.dateRange === 'month' && new Date(record.date) >= new Date(Date.now() - 30*24*60*60*1000));
      const subjectMatch = reportFilters.subject === 'all' || record.subject.toLowerCase().includes(reportFilters.subject.toLowerCase());
      const statusMatch = reportFilters.status === 'all' || record.status.toLowerCase() === reportFilters.status.toLowerCase();
      return dateMatch && subjectMatch && statusMatch;
    });
    
    // Add table
    doc.autoTable({
      startY: 75,
      head: [['Date', 'Subject', 'Teacher', 'Time', 'Status']],
      body: filteredHistory.map(record => [
        record.date,
        record.subject,
        record.teacher,
        record.time,
        record.status
      ]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [22, 160, 133] },
      alternateRowStyles: { fillColor: [240, 240, 240] }
    });
    
    // Save the PDF
    doc.save(`attendance-report-${studentData.rollNo}.pdf`);
  };

  // Function to generate Excel report
  const generateExcelReport = () => {
    // Filter attendance history based on selected filters
    const filteredHistory = attendanceHistory.filter(record => {
      const dateMatch = reportFilters.dateRange === 'all' || 
        (reportFilters.dateRange === 'week' && new Date(record.date) >= new Date(Date.now() - 7*24*60*60*1000)) ||
        (reportFilters.dateRange === 'month' && new Date(record.date) >= new Date(Date.now() - 30*24*60*60*1000));
      const subjectMatch = reportFilters.subject === 'all' || record.subject.toLowerCase().includes(reportFilters.subject.toLowerCase());
      const statusMatch = reportFilters.status === 'all' || record.status.toLowerCase() === reportFilters.status.toLowerCase();
      return dateMatch && subjectMatch && statusMatch;
    });
    
    // Prepare data for Excel
    const excelData = filteredHistory.map(record => ({
      'Date': record.date,
      'Subject': record.subject,
      'Teacher': record.teacher,
      'Time': record.time,
      'Status': record.status
    }));
    
    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(excelData);
    
    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Attendance Report');
    
    // Save the Excel file
    XLSX.writeFile(wb, `attendance-report-${studentData.rollNo}.xlsx`);
  };

  // Function to generate CSV report
  const generateCSVReport = () => {
    // Filter attendance history based on selected filters
    const filteredHistory = attendanceHistory.filter(record => {
      const dateMatch = reportFilters.dateRange === 'all' || 
        (reportFilters.dateRange === 'week' && new Date(record.date) >= new Date(Date.now() - 7*24*60*60*1000)) ||
        (reportFilters.dateRange === 'month' && new Date(record.date) >= new Date(Date.now() - 30*24*60*60*1000));
      const subjectMatch = reportFilters.subject === 'all' || record.subject.toLowerCase().includes(reportFilters.subject.toLowerCase());
      const statusMatch = reportFilters.status === 'all' || record.status.toLowerCase() === reportFilters.status.toLowerCase();
      return dateMatch && subjectMatch && statusMatch;
    });
    
    // Prepare CSV data
    let csvContent = 'Date,Subject,Teacher,Time,Status\n';
    filteredHistory.forEach(record => {
      csvContent += `"${record.date}","${record.subject}","${record.teacher}","${record.time}","${record.status}"\n`;
    });
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `attendance-report-${studentData.rollNo}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderDashboard = () => (
    <div className="space-y-6 student-dashboard-content">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div className="bg-white p-6 rounded-lg shadow-md" whileHover={{ scale: 1.02 }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Status</p>
              <p className={`text-2xl font-bold ${studentData.todayStatus === 'Present' ? 'text-green-600' : 'text-red-600'}`}>
                {studentData.todayStatus}
              </p>
            </div>
            <div className={`p-3 rounded-full ${studentData.todayStatus === 'Present' ? 'bg-green-100' : 'bg-red-100'}`}>
              <svg className={`w-6 h-6 ${studentData.todayStatus === 'Present' ? 'text-green-600' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={studentData.todayStatus === 'Present' ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"} />
              </svg>
            </div>
          </div>
        </motion.div>

        <motion.div className="bg-white p-6 rounded-lg shadow-md" whileHover={{ scale: 1.02 }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Attendance</p>
              <p className="text-2xl font-bold text-blue-600">{studentData.monthlyPercentage}%</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </motion.div>

        <motion.div className="bg-white p-6 rounded-lg shadow-md" whileHover={{ scale: 1.02 }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Face Training</p>
              <p className="text-2xl font-bold text-orange-600">AI Ready</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
          </div>
        </motion.div>

        <motion.div className="bg-white p-6 rounded-lg shadow-md" whileHover={{ scale: 1.02 }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Subjects</p>
              <p className="text-2xl font-bold text-purple-600">{attendanceStats.subjects.length}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Subject-wise Breakdown & Upcoming Classes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="student-panel student-subject-panel">
          <div className="student-panel-heading">
            <div>
              <span className="student-section-kicker">ACADEMIC PERFORMANCE</span>
              <h3>Subject-wise attendance</h3>
            </div>
            <span className="student-heading-icon"><ChartNoAxesCombined size={19} /></span>
          </div>

          <div className="subject-chart-overview">
            <div
              className="subject-donut"
              role="img"
              aria-label={`Overall subject attendance ${overallSubjectPercentage}%`}
              style={{ '--attendance-rate': `${overallSubjectPercentage}%` }}
            >
              <div className="subject-donut-center">
                <strong>{overallSubjectPercentage}%</strong>
                <span>overall</span>
              </div>
            </div>
            <div className="subject-chart-summary">
              <span className="subject-chart-label"><i /> Classes attended</span>
              <strong>{totalPresent} <small>of {totalClasses} classes</small></strong>
              <p><Activity size={14} /> Attendance across {attendanceStats.subjects.length} subjects</p>
            </div>
          </div>

          <div className="subject-chart-legend">
            <span><i className="subject-legend-present" /> Attended</span>
            <span><i className="subject-legend-missed" /> Missed</span>
          </div>

          <div className="subject-chart-list">
            {attendanceStats.subjects.map((subject, index) => (
              <div key={subject.name} className="subject-chart-row">
                <div className="subject-chart-row-top">
                  <span className="subject-rank">{String(index + 1).padStart(2, '0')}</span>
                  <span className="subject-name">{subject.name}</span>
                  <strong className={subject.percentage >= 90 ? 'subject-score-high' : 'subject-score'}>
                    {subject.percentage}%
                  </strong>
                </div>
                <div
                  className="subject-bar-track"
                  role="img"
                  aria-label={`${subject.name}: ${subject.present} attended out of ${subject.total} classes, ${subject.percentage}%`}
                >
                  <span
                    className={`subject-bar-fill ${subject.percentage >= 90 ? 'subject-bar-excellent' : ''}`}
                    style={{ width: `${subject.percentage}%` }}
                  />
                </div>
                <p>{subject.present} attended <span>·</span> {subject.total - subject.present} missed</p>
              </div>
            ))}
          </div>
          <div className="subject-chart-footnote">
            <ShieldCheck size={15} />
            Keep your attendance above 75% in every subject.
          </div>
        </section>

        <section className="student-panel student-classes-panel">
          <div className="student-panel-heading">
            <div>
              <span className="student-section-kicker">YOUR SCHEDULE</span>
              <h3>Upcoming classes</h3>
            </div>
            <span className="student-heading-icon student-heading-icon-violet"><BookOpen size={19} /></span>
          </div>
          <div className="space-y-3">
            {upcomingClasses.map((class_, index) => (
              <div key={index} className="student-class-row">
                <div className="student-class-time">{class_.time}</div>
                <div>
                  <p className="font-medium text-gray-900">{class_.subject}</p>
                  <p className="text-sm text-gray-600">{class_.teacher} • {class_.room}</p>
                </div>
                <span className="student-class-arrow">↗</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Notifications */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Notifications</h3>
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div key={notification.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className={`p-2 rounded-full ${
                notification.type === 'warning' ? 'bg-yellow-100' :
                notification.type === 'info' ? 'bg-blue-100' : 'bg-green-100'
              }`}>
                <svg className={`w-4 h-4 ${
                  notification.type === 'warning' ? 'text-yellow-600' :
                  notification.type === 'info' ? 'text-blue-600' : 'text-green-600'
                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d={notification.type === 'warning' ? "M12 9v2m0 4h.01" : 
                       notification.type === 'info' ? "M13 16h-1v-4h-1m1-4h.01" : "M5 13l4 4L19 7"} />
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

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            to="/photo-capture"
            className="flex items-center space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Photo Capture</h4>
              <p className="text-sm text-gray-600">Take photos with your camera</p>
            </div>
          </Link>
          
          <div 
            className="flex items-center space-x-3 p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors cursor-pointer"
            onClick={generatePDFReport}
          >
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Download Report</h4>
              <p className="text-sm text-gray-600">Export attendance data</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors cursor-pointer">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Face Training</h4>
              <p className="text-sm text-gray-600">Improve recognition accuracy</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReports = () => {
    // Filter attendance history based on selected filters
    const filteredHistory = attendanceHistory.filter(record => {
      const dateMatch = reportFilters.dateRange === 'all' || 
        (reportFilters.dateRange === 'week' && new Date(record.date) >= new Date(Date.now() - 7*24*60*60*1000)) ||
        (reportFilters.dateRange === 'month' && new Date(record.date) >= new Date(Date.now() - 30*24*60*60*1000));
      const subjectMatch = reportFilters.subject === 'all' || record.subject.toLowerCase().includes(reportFilters.subject.toLowerCase());
      const statusMatch = reportFilters.status === 'all' || record.status.toLowerCase() === reportFilters.status.toLowerCase();
      return dateMatch && subjectMatch && statusMatch;
    });
    const presentCount = filteredHistory.filter((record) => record.status === 'Present').length;
    const attendanceRate = filteredHistory.length ? Math.round((presentCount / filteredHistory.length) * 100) : 0;
    const attendanceByDate = Object.values(filteredHistory.reduce((groups, record) => {
      const group = groups[record.date] || { date: record.date, present: 0, total: 0 };
      group.total += 1;
      if (record.status === 'Present') group.present += 1;
      groups[record.date] = group;
      return groups;
    }, {})).sort((first, second) => first.date.localeCompare(second.date));

    return (
      <div className="student-reports-view">
        <section className="student-report-hero">
          <div>
            <span className="role-dashboard-eyebrow">YOUR ATTENDANCE, AT A GLANCE</span>
            <h2>Personal reports</h2>
            <p>Explore your recent class activity, filter your records, and download a report when you need it.</p>
          </div>
          <span className="student-report-hero-icon"><ClipboardList size={31} /></span>
        </section>

        <div className="student-report-metrics">
          <article><span className="student-report-metric-icon student-report-blue"><Percent size={19} /></span><span><small>Attendance in view</small><strong>{attendanceRate}%</strong></span></article>
          <article><span className="student-report-metric-icon student-report-green"><CheckCircle2 size={19} /></span><span><small>Present sessions</small><strong>{presentCount}<em> of {filteredHistory.length}</em></strong></span></article>
          <article><span className="student-report-metric-icon student-report-violet"><CalendarDays size={19} /></span><span><small>Records in view</small><strong>{filteredHistory.length}<em> class sessions</em></strong></span></article>
        </div>

        <section className="role-panel student-report-trend">
          <div className="role-panel-heading"><div><span className="role-section-kicker">SESSION TREND</span><h3>Attendance over time</h3></div><span className="role-panel-icon role-panel-icon-purple"><ChartNoAxesCombined size={19} /></span></div>
          {attendanceByDate.length ? (
            <>
              <div className="student-report-chart" role="img" aria-label={`Attendance rate by date: ${attendanceByDate.map(({ date, present, total }) => `${date}, ${Math.round((present / total) * 100)}%`).join('; ')}`}>
                {attendanceByDate.map(({ date, present, total }) => {
                  const rate = Math.round((present / total) * 100);
                  return <div className="student-report-chart-column" key={date}><strong>{rate}%</strong><span><i style={{ height: `${rate}%` }} /></span><small>{new Date(`${date}T00:00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</small></div>;
                })}
              </div>
              <p className="student-report-chart-note"><span /> Attendance rate for each recorded class day</p>
            </>
          ) : (
            <div className="student-report-empty"><CalendarDays size={22} /><strong>No sessions match these filters</strong><span>Try widening the date range or changing the selected subject/status.</span></div>
          )}
        </section>

        {/* Search & Filter */}
        <div className="role-panel student-report-filter-panel">
          <div className="role-panel-heading"><div><span className="role-section-kicker">PERSONAL ATTENDANCE</span><h3>Filter your records</h3></div><span className="role-panel-icon"><Activity size={19} /></span></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
              <select 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={reportFilters.dateRange}
                onChange={(e) => setReportFilters({...reportFilters, dateRange: e.target.value})}
              >
                <option value="all">All Time</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <select 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={reportFilters.subject}
                onChange={(e) => setReportFilters({...reportFilters, subject: e.target.value})}
              >
                <option value="all">All Subjects</option>
                <option value="computer">Computer Science</option>
                <option value="data">Data Structures</option>
                <option value="database">Database Systems</option>
                <option value="algorithms">Algorithms</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={reportFilters.status}
                onChange={(e) => setReportFilters({...reportFilters, status: e.target.value})}
              >
                <option value="all">All Status</option>
                <option value="present">Present</option>
                <option value="absent">Absent</option>
              </select>
            </div>
          </div>
        </div>

        {/* Export Options */}
        <div className="role-panel student-report-export-panel">
          <div className="role-panel-heading"><div><span className="role-section-kicker">SAVE A COPY</span><h3>Export personal report</h3></div><span className="role-panel-icon role-panel-icon-purple"><Download size={19} /></span></div>
          <div className="flex flex-wrap gap-3">
            <button 
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              onClick={generatePDFReport}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a4 4 0 01-4-4V5a4 4 0 014-4h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a4 4 0 01-4 4z" />
              </svg>
              <span>PDF Report</span>
            </button>
            <button 
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              onClick={generateExcelReport}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a4 4 0 01-4-4V5a4 4 0 014-4h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a4 4 0 01-4 4z" />
              </svg>
              <span>Excel Report</span>
            </button>
            <button 
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              onClick={generateCSVReport}
            >
              <span>CSV Report</span>
            </button>
          </div>
        </div>

        {/* Attendance History */}
        <div className="role-panel student-report-table-panel">
          <div className="role-panel-heading"><div><span className="role-section-kicker">ATTENDANCE LOG</span><h3>Attendance history</h3></div><span className="teacher-record-count">{filteredHistory.length} records</span></div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Teacher</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredHistory.length ? filteredHistory.map((record, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.subject}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{record.teacher}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{record.time}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        record.status === 'Present' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                )) : <tr><td className="student-report-no-results" colSpan="5">No attendance records match the selected filters.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        {/* Correction Logs */}
        <div className="role-panel student-correction-panel">
          <div className="role-panel-heading"><div><span className="role-section-kicker">TEACHER / ADMIN CHANGES</span><h3>Correction history</h3></div><span className="role-panel-icon role-panel-icon-amber"><Clock3 size={19} /></span></div>
          <p className="text-sm text-gray-600 mb-4">Changes made to your attendance by teachers or admin</p>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Original</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Corrected</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Corrected By</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {correctionLogs.map((log, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.subject}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        log.originalStatus === 'Present' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {log.originalStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        log.correctedStatus === 'Present' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {log.correctedStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{log.correctedBy}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{log.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderProfile = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2" defaultValue={studentData.name} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Roll Number</label>
            <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2" defaultValue={studentData.rollNo} disabled />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" className="w-full border border-gray-300 rounded-lg px-3 py-2" defaultValue={studentData.email} />
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      {/* Profile Settings */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">👤 Profile Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" defaultValue={studentData.name} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Roll Number</label>
            <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100" defaultValue={studentData.rollNo} disabled />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" defaultValue={studentData.email} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
            <input type="tel" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" defaultValue={studentData.contact} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100" defaultValue={studentData.department} disabled />
          </div>
        </div>
        <div className="mt-6">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500">
            Update Profile
          </button>
        </div>
      </div>

      {/* Account Security */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🔐 Account Security</h3>
        <div className="space-y-4">
          <div>
            <button className="w-full text-left p-4 border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Update Password</p>
                  <p className="text-sm text-gray-600">Change your account password</p>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          </div>
          <div className="flex items-center justify-between p-4 border border-gray-300 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Two-Factor Authentication (2FA)</p>
              <p className="text-sm text-gray-600">Add extra security layer (if enabled by admin)</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">⚙️ Notification Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Email Notifications</p>
              <p className="text-sm text-gray-600">Receive attendance alerts via email</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">SMS Alerts</p>
              <p className="text-sm text-gray-600">Get important notifications via SMS</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Dashboard Popups</p>
              <p className="text-sm text-gray-600">Show notification popups in dashboard</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSupport = () => (
    <div className="student-support-view">
      <section className="student-support-hero">
        <div className="student-support-orbit student-support-orbit-one" />
        <div className="student-support-hero-copy">
          <span className="student-support-kicker"><LifeBuoy size={14} /> STUDENT HELP CENTER</span>
          <h2>Let’s get you back on track.</h2>
          <p>Find attendance guidance, learn how to use your student tools, or contact the support team.</p>
          <a href="mailto:support@university.edu?subject=Student%20dashboard%20support" className="student-support-contact"><Mail size={16} /> Contact support <ArrowRight size={16} /></a>
        </div>
        <div className="student-support-hero-art" aria-hidden="true"><div className="student-support-art-back"><span /><span /><span /></div><div className="student-support-art-front"><LifeBuoy size={32} /><strong>Student<br />support</strong><small>Here when you need us</small></div><span className="student-support-spark">✦</span></div>
      </section>

      <div className="student-support-actions">
        <button type="button" onClick={() => setSupportPanel(supportPanel === 'guide' ? null : 'guide')}><span className="student-support-action-icon student-support-blue"><BookOpen size={19} /></span><span><strong>User guide</strong><small>Step-by-step dashboard help</small></span><ChevronRight size={17} /></button>
        <button type="button" onClick={() => setSupportPanel(supportPanel === 'tutorial' ? null : 'tutorial')}><span className="student-support-action-icon student-support-violet"><Video size={19} /></span><span><strong>Video tutorial</strong><small>Visual walkthrough of student tools</small></span><ChevronRight size={17} /></button>
        <button type="button" onClick={() => { setTicketId(''); setSupportPanel(supportPanel === 'ticket' ? null : 'ticket'); }}><span className="student-support-action-icon student-support-green"><Send size={19} /></span><span><strong>Support ticket</strong><small>Tell us about an issue</small></span><ChevronRight size={17} /></button>
      </div>

      {supportPanel === 'guide' && (
        <section className="role-panel student-support-resource" aria-labelledby="student-guide-title">
          <div className="role-panel-heading"><div><span className="role-section-kicker">STUDENT QUICK START</span><h3 id="student-guide-title">Your dashboard guide</h3></div><span className="role-panel-icon"><BookOpen size={19} /></span></div>
          <div className="student-guide-grid">
            {[
              { number: '01', title: 'Check your attendance', text: 'Overview shows your attendance summary and subject-wise progress. Review low-attendance subjects regularly.' },
              { number: '02', title: 'Review class records', text: 'Open Reports, select a date range, subject, or status, then download your filtered history as PDF, Excel, or CSV.' },
              { number: '03', title: 'Keep your profile current', text: 'Use Profile and Settings to review your contact information and notification preferences.' },
              { number: '04', title: 'Capture a clear photo', text: 'Open Photo Capture, allow camera access, face good lighting, and keep your face centered in the frame.' }
            ].map((step) => <article key={step.number}><span>{step.number}</span><div><strong>{step.title}</strong><p>{step.text}</p></div></article>)}
          </div>
          <button type="button" className="student-support-inline-link" onClick={() => setActiveTab('reports')}>Go to attendance reports <ArrowRight size={15} /></button>
        </section>
      )}

      {supportPanel === 'tutorial' && (
        <section className="role-panel student-support-resource" aria-labelledby="student-tutorial-title">
          <div className="role-panel-heading"><div><span className="role-section-kicker">VISUAL WALKTHROUGH</span><h3 id="student-tutorial-title">Student dashboard tutorial</h3></div><span className="role-panel-icon role-panel-icon-purple"><Video size={19} /></span></div>
          <div className="student-tutorial-layout">
            <div className="student-tutorial-player">
              <div className="student-tutorial-window-bar"><i /><i /><i /><span>Student portal</span></div>
              <div className="student-tutorial-stage">
                <span>{tutorialStep === 0 ? <LayoutDashboard size={29} /> : tutorialStep === 1 ? <ChartNoAxesCombined size={29} /> : <Camera size={29} />}</span>
                <strong>{['Your attendance overview', 'Filter and export reports', 'Photo capture setup'][tutorialStep]}</strong>
                <p>{['See your attendance rate, subject progress, and upcoming classes.', 'Choose a date range, subject, or attendance status, then export your records.', 'Allow camera access and capture a clear, centered face image.'][tutorialStep]}</p>
                <div className="student-tutorial-mini-bars"><i /><i /><i /><i /><i /></div>
              </div>
              <div className="student-tutorial-player-footer"><span><PlayCircle size={16} /> Guided tutorial <small>{tutorialStep + 1} / 3</small></span><button type="button" onClick={() => setTutorialStep((step) => (step + 1) % 3)}>{tutorialStep === 2 ? 'Replay' : 'Next step'} <ArrowRight size={15} /></button></div>
              <div className="student-tutorial-progress"><span style={{ width: `${((tutorialStep + 1) / 3) * 100}%` }} /></div>
            </div>
            <div className="student-tutorial-chapters"><span className="role-section-kicker">CHAPTERS</span>{['Overview', 'Reports & exports', 'Photo capture'].map((chapter, index) => <button type="button" className={tutorialStep === index ? 'is-active' : ''} key={chapter} onClick={() => setTutorialStep(index)}><span>{String(index + 1).padStart(2, '0')}</span><strong>{chapter}</strong><ChevronRight size={15} /></button>)}<p>Interactive visual guide; no external video is required.</p></div>
          </div>
        </section>
      )}

      {supportPanel === 'ticket' && (
        <section className="role-panel student-support-resource" aria-labelledby="student-ticket-title">
          <div className="role-panel-heading"><div><span className="role-section-kicker">STUDENT SUPPORT</span><h3 id="student-ticket-title">Raise a support ticket</h3></div><span className="role-panel-icon role-panel-icon-green"><Send size={19} /></span></div>
          {ticketId ? (
            <div className="student-ticket-success" role="status"><CheckCircle2 size={23} /><div><strong>Demo ticket {ticketId} created</strong><p>This prototype does not send or store ticket details. Use Email support to contact the team.</p></div><button type="button" onClick={() => setTicketId('')}>Create another</button></div>
          ) : (
            <form className="student-ticket-form" onSubmit={(event) => { event.preventDefault(); event.currentTarget.reset(); setSupportTicket({ subject: '', description: '', priority: 'medium' }); setTicketId(`TKT-${Date.now().toString().slice(-6)}`); }}>
              <label><span>Issue type</span><select required value={supportTicket.subject} onChange={(event) => setSupportTicket((current) => ({ ...current, subject: event.target.value }))}><option value="">Select an issue type</option><option value="face-detection">Face not detected in class</option><option value="attendance-missing">Attendance missing or incorrect</option><option value="login-issues">Login problems</option><option value="upload-issues">Photo capture or upload issue</option><option value="report-issues">Report generation problem</option><option value="other">Other technical issue</option></select></label>
              <label><span>Priority</span><select value={supportTicket.priority} onChange={(event) => setSupportTicket((current) => ({ ...current, priority: event.target.value }))}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="urgent">Urgent</option></select></label>
              <label className="student-ticket-full"><span>Describe the issue</span><textarea required rows="4" placeholder="Include the class, date, and what happened…" value={supportTicket.description} onChange={(event) => setSupportTicket((current) => ({ ...current, description: event.target.value }))} /></label>
              <div className="student-ticket-submit-row"><small>Demo form · No details are sent to an external service.</small><button type="submit"><Send size={15} /> Submit ticket</button></div>
            </form>
          )}
        </section>
      )}

      <section className="role-panel student-support-faq" aria-labelledby="student-faq-title">
        <div className="role-panel-heading"><div><span className="role-section-kicker">QUICK ANSWERS</span><h3 id="student-faq-title">Frequently asked questions</h3></div><span className="role-panel-icon role-panel-icon-amber"><CircleHelp size={19} /></span></div>
        {[
          { question: 'My attendance shows absent, but I was in class. What should I do?', answer: 'Check the date and class in Reports, then contact your teacher to review or correct the attendance record. You can open a support ticket if you still need help.' },
          { question: 'How do I improve face recognition?', answer: 'Use Photo Capture in even lighting, face the camera directly, remove anything covering your face, and keep your face centered in the guide.' },
          { question: 'How do I download my attendance history?', answer: 'Open Reports, apply any filters you need, and choose PDF, Excel, or CSV under Export Personal Report.' }
        ].map((item, index) => <div className={`student-support-faq-item ${openFaq === index ? 'is-open' : ''}`} key={item.question}><button type="button" aria-expanded={openFaq === index} onClick={() => setOpenFaq(openFaq === index ? -1 : index)}><span><MessageCircle size={16} />{item.question}</span><ChevronRight size={17} /></button>{openFaq === index && <p>{item.answer}</p>}</div>)}
      </section>

      <div className="student-support-footer"><span><LifeBuoy size={19} /></span><div><strong>Still need help?</strong><small>Contact the student support team for account or attendance assistance.</small></div><a href="mailto:support@university.edu?subject=Student%20support%20request"><Mail size={15} /> Email support</a></div>

      {/* Student User Guide */}
      <div className="bg-white p-6 rounded-lg shadow-md student-legacy-support">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📘 Student User Guide</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-blue-200 rounded-lg hover:bg-blue-50 cursor-pointer">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Face Recognition Setup</h4>
                <p className="text-sm text-gray-600">Learn how to register face images correctly</p>
              </div>
            </div>
          </div>
          <div className="p-4 border border-green-200 rounded-lg hover:bg-green-50 cursor-pointer">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Attendance Reports</h4>
                <p className="text-sm text-gray-600">How to check and download your attendance</p>
              </div>
            </div>
          </div>
          <div className="p-4 border border-purple-200 rounded-lg hover:bg-purple-50 cursor-pointer">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Profile & Settings</h4>
                <p className="text-sm text-gray-600">Manage your profile and notification preferences</p>
              </div>
            </div>
          </div>
          <div className="p-4 border border-orange-200 rounded-lg hover:bg-orange-50 cursor-pointer">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Troubleshooting</h4>
                <p className="text-sm text-gray-600">Common issues and solutions</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tutorial Videos */}
      <div className="bg-white p-6 rounded-lg shadow-md student-legacy-support">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🎥 Tutorial Videos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
            <div className="aspect-video bg-gray-200 flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15M6 10a2 2 0 00-2 2v1a2 2 0 002 2h1m0 0h.01m2.99 0H14m6 0a2 2 0 002-2v-1a2 2 0 00-2-2H9.83" />
              </svg>
            </div>
            <div className="p-4">
              <h4 className="font-medium text-gray-900 mb-2">Uploading Face Images Correctly</h4>
              <p className="text-sm text-gray-600 mb-3">Learn best practices for capturing quality face images</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Duration: 3:45</span>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Watch Now</button>
              </div>
            </div>
          </div>
          <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
            <div className="aspect-video bg-gray-200 flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="p-4">
              <h4 className="font-medium text-gray-900 mb-2">Understanding Attendance Reports</h4>
              <p className="text-sm text-gray-600 mb-3">Navigate through your attendance data and filters</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Duration: 2:30</span>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Watch Now</button>
              </div>
            </div>
          </div>
          <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
            <div className="aspect-video bg-gray-200 flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div className="p-4">
              <h4 className="font-medium text-gray-900 mb-2">Security & Privacy Settings</h4>
              <p className="text-sm text-gray-600 mb-3">Manage your account security and privacy options</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Duration: 4:15</span>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Watch Now</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Raise Support Ticket */}
      <div className="bg-white p-6 rounded-lg shadow-md student-legacy-support">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🛠 Raise Support Ticket</h3>
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Issue Type</label>
              <select 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={supportTicket.subject}
                onChange={(e) => setSupportTicket({...supportTicket, subject: e.target.value})}
              >
                <option value="">Select an issue type</option>
                <option value="face-detection">Face not detected in class</option>
                <option value="attendance-missing">Attendance missing/incorrect</option>
                <option value="login-issues">Login problems</option>
                <option value="upload-issues">Face image upload issues</option>
                <option value="report-issues">Report generation problems</option>
                <option value="other">Other technical issue</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={supportTicket.priority}
                onChange={(e) => setSupportTicket({...supportTicket, priority: e.target.value})}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea 
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Please describe your issue in detail..."
              value={supportTicket.description}
              onChange={(e) => setSupportTicket({...supportTicket, description: e.target.value})}
            ></textarea>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              type="submit" 
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
            >
              Submit Ticket
            </button>
            <button 
              type="button" 
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
            >
              Save as Draft
            </button>
          </div>
        </form>
      </div>

      {/* Contact Options */}
      <div className="bg-white p-6 rounded-lg shadow-md student-legacy-support">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">💬 Contact Support</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Live Chat Support</h4>
                <p className="text-sm text-gray-600">Chat with IT team (Mon-Fri, 9AM-5PM)</p>
                <button className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium">Start Chat</button>
              </div>
            </div>
          </div>
          <div className="p-4 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Email Support</h4>
                <p className="text-sm text-gray-600">Get help via email (24-48 hour response)</p>
                <p className="mt-1 text-sm text-blue-600">support@university.edu</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Quick Links */}
      <div className="bg-white p-6 rounded-lg shadow-md student-legacy-support">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">❓ Frequently Asked Questions</h3>
        <div className="space-y-3">
          <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
            <p className="font-medium text-gray-900">Why is my face not being detected in class?</p>
            <p className="text-sm text-gray-600 mt-1">Check lighting conditions and ensure you've uploaded enough face samples</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
            <p className="font-medium text-gray-900">How many face images should I upload?</p>
            <p className="text-sm text-gray-600 mt-1">Upload 50-100 images with different angles and lighting for best results</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
            <p className="font-medium text-gray-900">My attendance shows as absent but I was present</p>
            <p className="text-sm text-gray-600 mt-1">Contact your teacher to correct the attendance or raise a support ticket</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
            <p className="font-medium text-gray-900">How can I export my attendance report?</p>
            <p className="text-sm text-gray-600 mt-1">Go to Reports tab and use the export options (PDF, Excel, or CSV)</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Photo Capture Tab
  const renderPhotoCapture = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📸 Photo Capture Studio</h3>
        <p className="text-gray-600 mb-6">
          Capture high-quality photos for face recognition and attendance verification.
        </p>
        
        {/* Photo Capture Camera */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 mb-6">
          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden relative">
            <AdvancedFaceDetectionCamera onCapture={handlePhotoCapture} />
          </div>
        </div>
        
        {/* Captured Photos */}
        {capturedPhotos.length > 0 && (
          <div className="mt-8">
            <h4 className="text-md font-semibold text-gray-900 mb-4">📷 Captured Photos ({capturedPhotos.length})</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {capturedPhotos.map((photo, index) => (
                <div key={index} className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                  <img 
                    src={photo.url} 
                    alt={`Captured ${index + 1}`} 
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-3">
                    <p className="text-xs text-gray-600 mb-2">
                      {new Date(photo.timestamp).toLocaleString()}
                    </p>
                    {photo.peopleCount !== undefined && (
                      <p className="text-xs text-gray-600">
                        People detected: {photo.peopleCount}
                      </p>
                    )}
                    <a 
                      href={photo.url} 
                      download={`photo_${index + 1}.jpg`}
                      className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                    >
                      Download
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Instructions */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">📸 How to use Photo Capture:</h4>
          <ul className="text-sm text-blue-800 list-disc pl-5 space-y-1">
            <li>Camera will start automatically when you open this tab</li>
            <li>Position yourself clearly in the frame</li>
            <li>Click "Capture Photo" to take a snapshot</li>
            <li>All captured photos will appear below for download</li>
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <div className="student-app">
      <Navbar />
      <main className="student-main">
        <section className="student-welcome">
          <div>
            <span className="student-section-kicker">STUDENT PORTAL</span>
            <h1>Hello, {studentData.name.split(' ')[0]} <span aria-hidden="true">✦</span></h1>
            <p>Here’s your attendance and class activity at a glance.</p>
          </div>
          <div className="student-welcome-meta">
            <span className="student-avatar">{studentData.name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase()}</span>
            <span><strong>{studentData.name}</strong><small>{studentData.rollNo} · {studentData.department}</small></span>
          </div>
        </section>

        <nav className="student-dashboard-menu" aria-label="Student dashboard sections">
          {dashboardMenuItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              className={`student-menu-item${activeTab === id ? ' student-menu-item-active' : ''}`}
              onClick={() => setActiveTab(id)}
              aria-current={activeTab === id ? 'page' : undefined}
            >
              <Icon size={17} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="student-content">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'reports' && renderReports()}
          {activeTab === 'profile' && renderProfile()}
          {activeTab === 'settings' && renderSettings()}
          {activeTab === 'support' && renderSupport()}
          {activeTab === 'photo-capture' && renderPhotoCapture()}
        </div>
      </main>
    </div>
  );

};

export default StudentDashboard;