import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useApp } from '../../context/AppContext';
import toast from 'react-hot-toast';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  Camera, 
  Smartphone,
  Chrome,
  User,
  Shield
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import AuthVisual from '../../components/AuthVisual';
// Import the FaceDetectionCamera component for face login
import FaceDetectionCamera from '../../components/FaceDetectionCamera';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState('email'); // 'email', 'face'
  const [isLoading, setIsLoading] = useState(false);
  const [faceLoginActive, setFaceLoginActive] = useState(false);
  const [faceLoginError, setFaceLoginError] = useState('');
  
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const { state, login } = useApp();
  const navigate = useNavigate();

  // Mock user data for demo
  const mockUsers = {
    'admin@university.edu': { 
      password: 'admin123', 
      role: 'admin', 
      name: 'Admin User',
      profilePhoto: '/api/placeholder/150/150'
    },
    'teacher@university.edu': { 
      password: 'teacher123', 
      role: 'teacher', 
      name: 'Dr. Sarah Wilson',
      profilePhoto: '/api/placeholder/150/150'
    },
    'student@university.edu': { 
      password: 'student123', 
      role: 'student', 
      name: 'Alice Johnson',
      rollNo: 'CS2021001',
      profilePhoto: '/api/placeholder/150/150'
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // First check if user is in registered users
      const registeredUser = state.registeredUsers.find(user => user.email === data.email);
      
      let user = null;
      let role = null;
      
      if (registeredUser && registeredUser.password === data.password) {
        // Use registered user data
        user = registeredUser;
        role = registeredUser.role;
      } else if (mockUsers[data.email] && mockUsers[data.email].password === data.password) {
        // Use mock user data
        user = mockUsers[data.email];
        role = mockUsers[data.email].role;
      } else {
        toast.error('Invalid credentials. Please try again.');
        setIsLoading(false);
        return;
      }

      // Successful login
      login(user, role);
      toast.success(`Welcome back, ${user.name}!`);
      
      // Redirect based on role
      switch (role) {
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'teacher':
          navigate('/teacher/dashboard');
          break;
        case 'student':
          navigate('/student/dashboard');
          break;
        default:
          navigate('/');
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle face recognition login
  const handleFaceLogin = async () => {
    setFaceLoginActive(true);
    setIsLoading(true);
    setFaceLoginError('');
    
    try {
      // Simulate face recognition process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Check if there are any registered users
      if (state.registeredUsers.length > 0) {
        // For demo purposes, let's find a student user or use the first registered user
        let user = state.registeredUsers.find(u => u.role === 'student');
        if (!user) {
          user = state.registeredUsers[0];
        }
        
        // Successful login with actual registered user data
        login(user, user.role);
        toast.success(`Face recognition successful! Welcome, ${user.name}`);
        
        // Redirect based on role
        switch (user.role) {
          case 'admin':
            navigate('/admin/dashboard');
            break;
          case 'teacher':
            navigate('/teacher/dashboard');
            break;
          case 'student':
            navigate('/student/dashboard');
            break;
          default:
            navigate('/');
        }
      } else {
        // If no registered users, fall back to random mock user
        const userKeys = Object.keys(mockUsers);
        const randomUser = mockUsers[userKeys[Math.floor(Math.random() * userKeys.length)]];
        
        login(randomUser, randomUser.role);
        toast.success(`Face recognition successful! Welcome, ${randomUser.name}`);
        
        // Redirect based on role
        switch (randomUser.role) {
          case 'admin':
            navigate('/admin/dashboard');
            break;
          case 'teacher':
            navigate('/teacher/dashboard');
            break;
          case 'student':
            navigate('/student/dashboard');
            break;
          default:
            navigate('/');
        }
      }
    } catch (error) {
      setFaceLoginError('Face recognition failed. Please try again or use email login.');
      toast.error('Face recognition failed. Please try again or use email login.');
    } finally {
      setIsLoading(false);
      // Don't set faceLoginActive to false here to keep the camera active for retry
    }
  };

  // Handle face capture for recognition
  const handleFaceCapture = (photo) => {
    console.log('Face captured for recognition:', photo);
    // In a real implementation, we would send this to a face recognition API
    // For now, we'll just trigger the recognition process
    handleFaceLogin();
  };

  const handleSSOLogin = (provider) => {
    toast.info(`${provider} SSO integration coming soon!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      <Navbar />
      
      <main className="auth-shell">
        <div className="auth-layout">
          <AuthVisual mode="login" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="auth-form-wrap"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8 auth-form-card">
            <div className="text-center mb-8">
              <div className="bg-primary-600 text-white p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <User className="h-8 w-8" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
              <p className="text-gray-600">Sign in to access your dashboard</p>
            </div>

            {/* Login Method Selector */}
            <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setLoginMethod('email')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  loginMethod === 'email'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Mail className="h-4 w-4 inline mr-2" />
                Email Login
              </button>
              <button
                onClick={() => setLoginMethod('face')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  loginMethod === 'face'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Camera className="h-4 w-4 inline mr-2" />
                Face Login 🆕
              </button>
            </div>

            {loginMethod === 'email' ? (
              /* Email Login Form */
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^\S+@\S+$/i,
                          message: 'Please enter a valid email'
                        }
                      })}
                      type="email"
                      className="pl-10 input-field"
                      placeholder="Enter your email"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      {...register('password', {
                        required: 'Password is required',
                        minLength: {
                          value: 6,
                          message: 'Password must be at least 6 characters'
                        }
                      })}
                      type={showPassword ? 'text' : 'password'}
                      className="pl-10 pr-10 input-field"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                      Remember me
                    </label>
                  </div>
                  <Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-500">
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary w-full disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="loading-spinner mr-2"></div>
                      Signing in...
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>
            ) : (
              /* Face Login Interface */
              <div className="space-y-6">
                <div className="text-center">
                  <div className="bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl p-8 mb-6">
                    {faceLoginActive ? (
                      <div className="space-y-4">
                        <div className="relative mx-auto w-32 h-32 bg-primary-600 rounded-full flex items-center justify-center">
                          <Camera className="h-16 w-16 text-white" />
                          <div className="absolute inset-0 border-4 border-primary-400 rounded-full animate-pulse"></div>
                        </div>
                        <div className="space-y-2">
                          <p className="text-lg font-semibold text-gray-900">Processing...</p>
                          <p className="text-sm text-gray-600">Please look at the camera</p>
                          <div className="flex justify-center">
                            <div className="loading-spinner"></div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="mx-auto w-32 h-32 bg-primary-600 rounded-full flex items-center justify-center">
                          <Camera className="h-16 w-16 text-white" />
                        </div>
                        <div className="space-y-2">
                          <p className="text-lg font-semibold text-gray-900">Face Recognition Login</p>
                          <p className="text-sm text-gray-600">
                            Position your face in front of the camera for secure authentication
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Face Detection Camera for Login */}
                  <div className="mb-6">
                    <FaceDetectionCamera onCapture={handleFaceCapture} showControls={false} />
                  </div>

                  {faceLoginError && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                      {faceLoginError}
                    </div>
                  )}

                  <button
                    onClick={handleFaceLogin}
                    disabled={isLoading}
                    className="btn-primary w-full disabled:opacity-50"
                  >
                    {isLoading ? 'Scanning...' : 'Start Face Recognition'}
                  </button>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <Shield className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">Secure Face Recognition</p>
                      <p>Your biometric data is encrypted and stored securely. Face login uses YOLOv11 technology for 99.5% accuracy.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Demo Credentials */}
            <div className="demo-account-panel">
              <div className="demo-account-heading">
                <div>
                  <p className="demo-account-title">Explore with a demo account</p>
                  <p className="demo-account-description">Select a role to fill in its sign-in details.</p>
                </div>
                <span className="demo-badge">DEMO</span>
              </div>
              <div className="demo-account-list">
                {Object.entries(mockUsers).map(([email, demoUser]) => (
                  <button
                    key={email}
                    type="button"
                    className="demo-account-option"
                    onClick={() => {
                      setValue('email', email, { shouldValidate: true });
                      setValue('password', demoUser.password, { shouldValidate: true });
                    }}
                    aria-label={`Fill ${demoUser.role} demo credentials`}
                  >
                    <span className={`demo-role-icon demo-role-${demoUser.role}`}>
                      {demoUser.role === 'admin' ? <Shield size={17} /> : <User size={17} />}
                    </span>
                    <span className="demo-account-copy">
                      <strong>{demoUser.role.charAt(0).toUpperCase() + demoUser.role.slice(1)}</strong>
                      <small>{email}</small>
                    </span>
                    <span className="demo-account-password">{demoUser.password}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* SSO Options */}
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleSSOLogin('Google')}
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  <Chrome className="h-5 w-5 text-red-500" />
                  <span className="ml-2">Google</span>
                </button>

                <button
                  onClick={() => handleSSOLogin('Microsoft')}
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  <Smartphone className="h-5 w-5 text-blue-500" />
                  <span className="ml-2">Microsoft</span>
                </button>
              </div>
            </div>

            {/* Sign Up Link */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
                  Sign up now
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;