import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useApp } from '../../context/AppContext';
import toast from 'react-hot-toast';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Eye, 
  EyeOff, 
  Camera, 
  Upload,
  CheckCircle,
  Building,
  GraduationCap,
  UserPlus,
  FileText
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import AuthVisual from '../../components/AuthVisual';
// Import the AdvancedFaceDetectionCamera component instead of SimpleCamera
import AdvancedFaceDetectionCamera from '../../components/AdvancedFaceDetectionCamera';

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState('student');
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); // Multi-step registration
  // Add state for captured photos in registration
  const [capturedPhotos, setCapturedPhotos] = useState([]);
  // Remove autoStartCamera state as AdvancedFaceDetectionCamera auto-starts
  
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm();
  const { login, registerUser } = useApp(); // Add registerUser from context
  const navigate = useNavigate();

  const watchPassword = watch('password');

  const roles = [
    {
      id: 'student',
      title: 'Student',
      description: 'Access attendance records, upload training images',
      icon: GraduationCap,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      id: 'teacher',
      title: 'Teacher',
      description: 'Monitor classes, manage attendance, view reports',
      icon: User,
      color: 'bg-green-100 text-green-600'
    },
    {
      id: 'admin',
      title: 'Admin',
      description: 'Full system access, user management, settings',
      icon: Building,
      color: 'bg-purple-100 text-purple-600'
    }
  ];

  const sampleRegistrationProfiles = [
    { role: 'student', name: 'Demo Student', email: 'review.student@example.com' },
    { role: 'teacher', name: 'Demo Teacher', email: 'review.teacher@example.com' },
    { role: 'admin', name: 'Demo Administrator', email: 'review.admin@example.com' }
  ];

  const fillSampleRegistration = (profile) => {
    setSelectedRole(profile.role);
    setValue('name', profile.name, { shouldValidate: true });
    setValue('email', profile.email, { shouldValidate: true });
    setValue('mobile', '+1 555 010 2026', { shouldValidate: true });
    setValue('department', 'Computer Science', { shouldValidate: true });
    setValue('course', 'B.Tech CS', { shouldValidate: true });
    setValue('batch', '2024-2028', { shouldValidate: true });
    setValue('rollNo', 'DEMO2026001', { shouldValidate: true });
    setValue('password', 'Review123', { shouldValidate: true });
    setValue('confirmPassword', 'Review123', { shouldValidate: true });
    setValue('terms', true, { shouldValidate: true });
    setStep(2);
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePhoto(e.target.result);
      };
      reader.readAsDataURL(file);
      toast.success('Profile photo uploaded successfully!');
    }
  };

  // Handle photo capture from camera
  const handlePhotoCapture = (photo) => {
    setProfilePhoto(photo.url);
    setCapturedPhotos(prev => [photo, ...prev]);
    toast.success('Photo captured. You can now finish creating your account.');
  };

  const onSubmit = async (data) => {
    if (step === 1) {
      // Validate first step and proceed to next
      setStep(2);
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create new user object
      const newUser = {
        id: `${selectedRole.toUpperCase()}${Date.now()}`,
        name: data.name,
        email: data.email,
        mobile: data.mobile,
        role: selectedRole,
        profilePhoto: profilePhoto || '/api/placeholder/150/150',
        department: data.department,
        course: data.course,
        batch: data.batch,
        rollNo: data.rollNo,
        createdAt: new Date().toISOString(),
        // Include password for login verification
        password: data.password
      };

      // Register the user in the context
      registerUser(newUser);
      
      // Mock successful registration
      login(newUser, selectedRole);
      toast.success(`Registration successful! Welcome, ${data.name}!`);
      
      // Redirect based on role
      switch (selectedRole) {
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
      toast.error('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const generateRollNumber = () => {
    const department = watch('department')?.substring(0, 2).toUpperCase() || 'CS';
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 999).toString().padStart(3, '0');
    const rollNo = `${department}${year}${random}`;
    setValue('rollNo', rollNo);
    toast.success('Roll number generated automatically!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      <Navbar />
      
      <main className="auth-shell">
        <div className="auth-layout auth-layout-register">
          <AuthVisual mode="register" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="auth-form-wrap"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8 auth-form-card">
            
            {/* Header */}
            <div className="text-center mb-8">
              <div className="bg-primary-600 text-white p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <UserPlus className="h-8 w-8" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
              <p className="text-gray-600">Join the AI-powered attendance system</p>
            </div>

            {/* Progress Indicator */}
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                  {step > 1 ? <CheckCircle className="h-5 w-5" /> : '1'}
                </div>
                <div className={`w-16 h-1 mx-2 ${step >= 2 ? 'bg-primary-600' : 'bg-gray-200'}`}></div>
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                  2
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              {step === 1 ? (
                /* Step 1: Role Selection & Basic Info */
                <>
                  <div className="registration-demo-panel">
                    <div className="demo-account-heading">
                      <div>
                        <p className="demo-account-title">Want to try registration?</p>
                        <p className="demo-account-description">Load a sample profile, review the details, then create a demo account.</p>
                      </div>
                      <span className="demo-badge">QUICK FILL</span>
                    </div>
                    <div className="registration-demo-actions">
                      {sampleRegistrationProfiles.map((profile) => (
                        <button
                          key={profile.role}
                          type="button"
                          className="registration-demo-button"
                          onClick={() => fillSampleRegistration(profile)}
                        >
                          Try {profile.role}
                        </button>
                      ))}
                    </div>
                    <p className="registration-demo-hint">Sample password: <strong>Review123</strong> · You can edit the details before submitting.</p>
                  </div>

                  {/* Role Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Select Your Role
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {roles.map((role) => {
                        const Icon = role.icon;
                        return (
                          <div
                            key={role.id}
                            onClick={() => setSelectedRole(role.id)}
                            className={`cursor-pointer border-2 rounded-lg p-4 transition-all ${
                              selectedRole === role.id
                                ? 'border-primary-600 bg-primary-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="text-center">
                              <div className={`${role.color} p-3 rounded-lg w-12 h-12 mx-auto mb-3 flex items-center justify-center`}>
                                <Icon className="h-6 w-6" />
                              </div>
                              <h3 className="font-semibold text-gray-900 mb-1">{role.title}</h3>
                              <p className="text-sm text-gray-600">{role.description}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          {...register('name', {
                            required: 'Full name is required',
                            minLength: {
                              value: 2,
                              message: 'Name must be at least 2 characters'
                            }
                          })}
                          type="text"
                          className="pl-10 input-field"
                          placeholder="Enter your full name"
                        />
                      </div>
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
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
                      <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-2">
                        Mobile Number *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          {...register('mobile', {
                            required: 'Mobile number is required',
                            pattern: {
                              value: /^[+]?[\d\s-()]+$/,
                              message: 'Please enter a valid mobile number'
                            }
                          })}
                          type="tel"
                          className="pl-10 input-field"
                          placeholder="Enter your mobile number"
                        />
                      </div>
                      {errors.mobile && (
                        <p className="text-red-500 text-sm mt-1">{errors.mobile.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                        Department *
                      </label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <select
                          {...register('department', { required: 'Department is required' })}
                          className="pl-10 input-field"
                        >
                          <option value="">Select Department</option>
                          <option value="Computer Science">Computer Science</option>
                          <option value="Information Technology">Information Technology</option>
                          <option value="Electronics">Electronics</option>
                          <option value="Mechanical">Mechanical</option>
                          <option value="Civil">Civil</option>
                          <option value="Electrical">Electrical</option>
                        </select>
                      </div>
                      {errors.department && (
                        <p className="text-red-500 text-sm mt-1">{errors.department.message}</p>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn-primary w-full"
                  >
                    Continue to Step 2
                    <FileText className="ml-2 h-5 w-5" />
                  </button>
                </>
              ) : (
                /* Step 2: Role-specific Details & Security */
                <>
                  {/* Role-specific Fields */}
                  {selectedRole === 'student' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-2">
                          Course/Program *
                        </label>
                        <select
                          {...register('course', { required: 'Course is required' })}
                          className="input-field"
                        >
                          <option value="">Select Course</option>
                          <option value="B.Tech CS">B.Tech Computer Science</option>
                          <option value="B.Tech IT">B.Tech Information Technology</option>
                          <option value="M.Tech CS">M.Tech Computer Science</option>
                          <option value="MCA">Master of Computer Applications</option>
                          <option value="BCA">Bachelor of Computer Applications</option>
                        </select>
                        {errors.course && (
                          <p className="text-red-500 text-sm mt-1">{errors.course.message}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="batch" className="block text-sm font-medium text-gray-700 mb-2">
                          Batch/Year *
                        </label>
                        <select
                          {...register('batch', { required: 'Batch is required' })}
                          className="input-field"
                        >
                          <option value="">Select Batch</option>
                          <option value="2021-2025">2021-2025</option>
                          <option value="2022-2026">2022-2026</option>
                          <option value="2023-2027">2023-2027</option>
                          <option value="2024-2028">2024-2028</option>
                        </select>
                        {errors.batch && (
                          <p className="text-red-500 text-sm mt-1">{errors.batch.message}</p>
                        )}
                      </div>

                      <div className="md:col-span-2">
                        <label htmlFor="rollNo" className="block text-sm font-medium text-gray-700 mb-2">
                          Roll Number (Unique ID) *
                        </label>
                        <div className="flex">
                          <input
                            {...register('rollNo', { required: 'Roll number is required' })}
                            type="text"
                            className="flex-1 input-field rounded-r-none"
                            placeholder="Enter roll number"
                          />
                          <button
                            type="button"
                            onClick={generateRollNumber}
                            className="px-4 py-3 bg-primary-600 text-white rounded-r-lg hover:bg-primary-700 transition-colors"
                          >
                            Generate
                          </button>
                        </div>
                        {errors.rollNo && (
                          <p className="text-red-500 text-sm mt-1">{errors.rollNo.message}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Profile Photo Capture Studio */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      📸 Photo Capture Studio
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                      {profilePhoto ? (
                        <div className="captured-photo-studio">
                          <img
                            src={profilePhoto}
                            alt="Captured profile photo"
                            className="captured-photo-image"
                          />
                          <div className="captured-photo-caption">
                            <p>Photo captured successfully</p>
                            <button
                              type="button"
                              onClick={() => setProfilePhoto(null)}
                              className="btn btn-secondary"
                            >
                              Retake photo
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="mb-4">
                          {/* Use AdvancedFaceDetectionCamera instead of SimpleCamera */}
                          <div style={{ height: '400px' }}>
                            <AdvancedFaceDetectionCamera onCapture={handlePhotoCapture} showControls={true} />
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-center mt-4">
                        <div className="text-center">
                          <label htmlFor="photo-upload" className="btn-secondary cursor-pointer">
                            <Upload className="h-4 w-4 mr-2" />
                            {profilePhoto ? 'Replace Photo' : 'Upload Photo'}
                          </label>
                          <input
                            id="photo-upload"
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoUpload}
                            className="hidden"
                          />
                          <p className="text-sm text-gray-500 mt-2">
                            Or choose an image from your device
                          </p>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-500 mt-4 text-center">
                        Capture a clear photo for better face recognition accuracy
                      </p>
                    </div>
                  </div>

                  {/* Password Setup */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                        Password *
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          {...register('password', {
                            required: 'Password is required',
                            minLength: {
                              value: 8,
                              message: 'Password must be at least 8 characters'
                            },
                            pattern: {
                              value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                              message: 'Password must contain uppercase, lowercase and number'
                            }
                          })}
                          type={showPassword ? 'text' : 'password'}
                          className="pl-10 pr-10 input-field"
                          placeholder="Create a strong password"
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

                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm Password *
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          {...register('confirmPassword', {
                            required: 'Please confirm your password',
                            validate: value => value === watchPassword || 'Passwords do not match'
                          })}
                          type={showConfirmPassword ? 'text' : 'password'}
                          className="pl-10 pr-10 input-field"
                          placeholder="Confirm your password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Terms and Conditions */}
                  <div className="flex items-start">
                    <input
                      {...register('terms', { required: 'You must accept the terms and conditions' })}
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1"
                    />
                    <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                      I agree to the{' '}
                      <a href="#" className="text-primary-600 hover:text-primary-500">Terms of Service</a>{' '}
                      and{' '}
                      <a href="#" className="text-primary-600 hover:text-primary-500">Privacy Policy</a>
                    </label>
                  </div>
                  {errors.terms && (
                    <p className="text-red-500 text-sm mt-1">{errors.terms.message}</p>
                  )}

                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="btn-secondary flex-1"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="btn-primary flex-1 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <div className="loading-spinner mr-2"></div>
                          Creating Account...
                        </div>
                      ) : (
                        'Create Account'
                      )}
                    </button>
                  </div>
                </>
              )}
            </form>

            {/* Sign In Link */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
                  Sign in here
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

export default RegisterPage;