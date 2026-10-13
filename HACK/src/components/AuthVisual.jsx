import React from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  ArrowUpRight,
  BadgeCheck,
  Camera,
  ChartNoAxesCombined,
  ScanFace,
  ShieldCheck,
  Sparkles,
  Users
} from 'lucide-react';

const AuthVisual = ({ mode = 'login' }) => {
  const isRegister = mode === 'register';

  return (
    <motion.aside
      className={`auth-visual auth-visual-${mode}`}
      initial={{ opacity: 0, x: -18 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.65, ease: 'easeOut' }}
      aria-label="AI attendance platform overview"
    >
      <div className="auth-visual-noise" />
      <div className="auth-visual-orbit auth-visual-orbit-one" />
      <div className="auth-visual-orbit auth-visual-orbit-two" />
      <div className="auth-visual-content">
        <div className="auth-visual-brand">
          <span className="auth-visual-brand-icon"><ShieldCheck size={19} /></span>
          <span>Campus<span>IQ</span></span>
        </div>
        <p className="auth-visual-eyebrow"><Sparkles size={14} /> SMARTER CAMPUS, BETTER FLOW</p>
        <h1>
          {isRegister ? 'Your campus, ' : 'A clearer view of '}
          <span>{isRegister ? 'in sync.' : 'every class.'}</span>
        </h1>
        <p className="auth-visual-description">
          {isRegister
            ? 'Set up your profile and bring a more connected attendance experience to your campus.'
            : 'A simple, secure space for attendance, class activity, and the people behind every number.'}
        </p>

        <div className="auth-visual-scene" aria-hidden="true">
          <motion.div
            className="auth-scene-card"
            animate={{ y: [0, -7, 0], rotateY: [-3, 1, -3] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="auth-scene-top">
              <span className="auth-scene-mark"><Activity size={15} /></span>
              <span className="auth-scene-dots"><i /><i /><i /></span>
            </div>
            <div className="auth-scene-title">
              <span>Attendance overview</span>
              <small>THIS WEEK <ArrowUpRight size={12} /></small>
            </div>
            <div className="auth-scene-chart">
              <div className="auth-scene-chart-label"><strong>94.8%</strong><small>+6.2% this month</small></div>
              <div className="auth-chart-bars">
                {[39, 59, 47, 76, 61, 91, 71].map((height, index) => (
                  <i key={index} style={{ height: `${height}%`, animationDelay: `${index * 90}ms` }} />
                ))}
              </div>
              <div className="auth-chart-days"><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span></div>
            </div>
            <div className="auth-scene-footer">
              <span><i className="auth-scene-dot auth-scene-dot-blue" /> Present <strong>286</strong></span>
              <span><i className="auth-scene-dot auth-scene-dot-violet" /> Classes <strong>08</strong></span>
            </div>
          </motion.div>

          <motion.div
            className="auth-float-chip auth-float-scan"
            animate={{ y: [0, -9, 0], rotate: [0, 2, 0] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span className="auth-float-icon"><ScanFace size={18} /></span>
            <span><strong>Face match</strong><small>Verified securely</small></span>
            <BadgeCheck className="auth-float-check" size={18} />
          </motion.div>

          <motion.div
            className="auth-float-chip auth-float-users"
            animate={{ y: [0, 7, 0] }}
            transition={{ duration: 4.8, delay: .4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span className="auth-float-users-icon"><Users size={16} /></span>
            <span><strong>{isRegister ? 'All roles welcome' : '286 students'}</strong><small>{isRegister ? 'One connected platform' : 'Checked in today'}</small></span>
          </motion.div>

          <div className="auth-scene-camera"><Camera size={17} /></div>
          <div className="auth-scene-sparkle"><ChartNoAxesCombined size={17} /></div>
        </div>

        <div className="auth-visual-trust">
          <span><ShieldCheck size={16} /> Built for your campus community</span>
          <span className="auth-trust-separator" />
          <span>Student · Teacher · Admin</span>
        </div>
      </div>
    </motion.aside>
  );
};

export default AuthVisual;
