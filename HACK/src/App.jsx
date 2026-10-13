import React from 'react';
import { Link, Navigate, Route, Routes } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Camera, ChartNoAxesCombined, ShieldCheck, UserCircle2 } from 'lucide-react';
import Navbar from './components/Navbar';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import StudentDashboard from './pages/student/StudentDashboard';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import { useApp } from './context/AppContext';

const HomePage = () => {
  const { state } = useApp();
  const user = state?.user;
  const dashboardPath = user?.role ? `/${user.role}/dashboard` : '/login';

  return (
    <div className="home-page">
      <Navbar />
      <main className="home-main">
        <div className="home-orb home-orb-one" aria-hidden="true" />
        <div className="home-orb home-orb-two" aria-hidden="true" />
        <section className="home-hero">
          <motion.div
            className="home-copy"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: 'easeOut' }}
          >
            <span className="home-eyebrow">
              <span className="home-eyebrow-dot" />
              UNIVERSITY ATTENDANCE, REIMAGINED
            </span>
            <h1>
              Attendance made
              <span> smarter and simpler.</span>
            </h1>
            <p className="home-description">
              Bring face recognition, class activity, and attendance insights together in one clear dashboard.
            </p>
            <div className="home-actions">
              {user ? (
                <Link to={dashboardPath} className="btn btn-primary home-primary-action">
                  Open dashboard <ArrowRight size={18} />
                </Link>
              ) : (
                <>
                  <Link to="/login" className="btn btn-primary home-primary-action">
                    Login <ArrowRight size={18} />
                  </Link>
                  <Link to="/register" className="btn btn-secondary home-secondary-action">Register</Link>
                </>
              )}
            </div>
            <div className="home-trust-note">
              <ShieldCheck size={17} />
              <span>Role-based access for students, teachers, and administrators</span>
            </div>
            {user && (
              <Link to={dashboardPath} className="home-user-card">
                <span className="home-user-avatar"><UserCircle2 size={23} /></span>
                <span className="home-user-details">
                  <small>YOUR ACCOUNT · SIGNED IN</small>
                  <strong>{user.name || 'User'}</strong>
                  {user.email && <span>{user.email}</span>}
                </span>
                <span className="home-user-role">{user.role || 'Member'}</span>
                <ArrowRight className="home-user-arrow" size={18} />
              </Link>
            )}
          </motion.div>

          <motion.div
            className="home-visual"
            initial={{ opacity: 0, scale: 0.94, x: 16 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: 'easeOut' }}
          >
            <div className="home-visual-glow" />
            <div className="home-dashboard-card">
              <div className="home-dashboard-head">
                <div>
                  <span className="home-card-kicker">LIVE OVERVIEW</span>
                  <h2>Class attendance</h2>
                </div>
                <span className="home-live-pill"><span /> Live</span>
              </div>
              <div className="home-attendance-ring">
                <div>
                  <strong>92%</strong>
                  <span>attendance</span>
                </div>
              </div>
              <div className="home-visual-stats">
                <div><span className="home-stat-dot present" /><span>Present</span><strong>32</strong></div>
                <div><span className="home-stat-dot absent" /><span>Absent</span><strong>3</strong></div>
              </div>
              <div className="home-scan-banner">
                <span className="home-scan-icon"><Camera size={18} /></span>
                <span><strong>Face scan active</strong><small>Room 204 · Computer Science</small></span>
                <ChartNoAxesCombined className="home-scan-chart" size={21} />
              </div>
            </div>
            <motion.div
              className="home-float-card"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              <span className="home-float-check">✓</span>
              <span><strong>Attendance recorded</strong><small>Recognition complete</small></span>
            </motion.div>
          </motion.div>
        </section>

        <motion.section
          className="home-features"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55 }}
        >
          <div className="home-feature">
            <span className="home-feature-icon"><Camera size={20} /></span>
            <div><strong>Fast face recognition</strong><p>Make everyday attendance quick and convenient.</p></div>
          </div>
          <div className="home-feature">
            <span className="home-feature-icon"><ChartNoAxesCombined size={20} /></span>
            <div><strong>Clear attendance insights</strong><p>See class trends and attendance at a glance.</p></div>
          </div>
          <div className="home-feature">
            <span className="home-feature-icon"><ShieldCheck size={20} /></span>
            <div><strong>One place for every role</strong><p>Simple, role-specific access for your campus.</p></div>
          </div>
        </motion.section>
      </main>
    </div>
  );
};

const App = () => {
  const { state } = useApp();

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/admin/dashboard" element={state?.user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" replace />} />
      <Route path="/teacher/dashboard" element={state?.user?.role === 'teacher' ? <TeacherDashboard /> : <Navigate to="/login" replace />} />
      <Route path="/student/dashboard" element={state?.user?.role === 'student' ? <StudentDashboard /> : <Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
