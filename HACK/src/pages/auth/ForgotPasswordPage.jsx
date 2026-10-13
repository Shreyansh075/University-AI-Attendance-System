import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { 
  Mail, 
  ArrowLeft, 
  CheckCircle, 
  Clock,
  Shield,
  Key
} from 'lucide-react';
import Navbar from '../../components/Navbar';

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: Code, 3: Reset, 4: Success
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const watchPassword = watch('password');

  // Start countdown timer
  const startTimer = () => {
    setTimer(60);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const onSubmitEmail = async (data) => {
    setIsLoading(true);
    setEmail(data.email);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Verification code sent to your email!');
      setStep(2);
      startTimer();
    } catch (error) {
      toast.error('Failed to send verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitCode = async (data) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock verification (accept any 6-digit code for demo)
      if (data.code.length === 6) {
        toast.success('Code verified successfully!');
        setStep(3);
      } else {
        toast.error('Invalid verification code. Please try again.');
      }
    } catch (error) {
      toast.error('Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitNewPassword = async (data) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Password reset successfully!');
      setStep(4);
    } catch (error) {
      toast.error('Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resendCode = async () => {
    if (timer > 0) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Verification code resent!');
      startTimer();
    } catch (error) {
      toast.error('Failed to resend code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      <Navbar />
      
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-md w-full"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8">
            
            {/* Header */}
            <div className="text-center mb-8">
              <div className="bg-primary-600 text-white p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                {step === 4 ? (
                  <CheckCircle className="h-8 w-8" />
                ) : (
                  <Key className="h-8 w-8" />
                )}
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {step === 1 && 'Forgot Password'}
                {step === 2 && 'Verify Email'}
                {step === 3 && 'Reset Password'}
                {step === 4 && 'Password Reset'}
              </h2>
              <p className="text-gray-600">
                {step === 1 && 'Enter your email to receive a verification code'}
                {step === 2 && 'Enter the 6-digit code sent to your email'}
                {step === 3 && 'Create a new secure password'}
                {step === 4 && 'Your password has been successfully reset'}
              </p>
            </div>

            {/* Progress Indicator */}
            {step < 4 && (
              <div className="flex items-center justify-center mb-8">
                <div className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                    {step > 1 ? <CheckCircle className="h-5 w-5" /> : '1'}
                  </div>
                  <div className={`w-16 h-1 mx-2 ${step >= 2 ? 'bg-primary-600' : 'bg-gray-200'}`}></div>
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                    {step > 2 ? <CheckCircle className="h-5 w-5" /> : '2'}
                  </div>
                  <div className={`w-16 h-1 mx-2 ${step >= 3 ? 'bg-primary-600' : 'bg-gray-200'}`}></div>
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 3 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                    3
                  </div>
                </div>
              </div>
            )}

            {/* Step 1: Email Input */}
            {step === 1 && (
              <form onSubmit={handleSubmit(onSubmitEmail)} className="space-y-6">
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
                      placeholder="Enter your registered email"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary w-full disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="loading-spinner mr-2"></div>
                      Sending Code...
                    </div>
                  ) : (
                    'Send Verification Code'
                  )}
                </button>
              </form>
            )}

            {/* Step 2: Code Verification */}
            {step === 2 && (
              <form onSubmit={handleSubmit(onSubmitCode)} className="space-y-6">
                <div className="text-center mb-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <Mail className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                      <div className="text-sm text-blue-800">
                        <p className="font-medium mb-1">Verification code sent</p>
                        <p>We've sent a 6-digit code to <strong>{email}</strong></p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                    Verification Code
                  </label>
                  <input
                    {...register('code', {
                      required: 'Verification code is required',
                      pattern: {
                        value: /^\d{6}$/,
                        message: 'Please enter a valid 6-digit code'
                      }
                    })}
                    type="text"
                    maxLength={6}
                    className="input-field text-center text-2xl tracking-widest"
                    placeholder="000000"
                  />
                  {errors.code && (
                    <p className="text-red-500 text-sm mt-1">{errors.code.message}</p>
                  )}
                </div>

                <div className="text-center">
                  {timer > 0 ? (
                    <div className="flex items-center justify-center text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>Resend code in {timer}s</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={resendCode}
                      disabled={isLoading}
                      className="text-primary-600 hover:text-primary-500 text-sm font-medium"
                    >
                      Resend verification code
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary w-full disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="loading-spinner mr-2"></div>
                      Verifying...
                    </div>
                  ) : (
                    'Verify Code'
                  )}
                </button>
              </form>
            )}

            {/* Step 3: New Password */}
            {step === 3 && (
              <form onSubmit={handleSubmit(onSubmitNewPassword)} className="space-y-6">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
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
                    type="password"
                    className="input-field"
                    placeholder="Enter new password"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    {...register('confirmPassword', {
                      required: 'Please confirm your password',
                      validate: value => value === watchPassword || 'Passwords do not match'
                    })}
                    type="password"
                    className="input-field"
                    placeholder="Confirm new password"
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                  )}
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <Shield className="h-5 w-5 text-gray-600 mt-0.5 mr-2 flex-shrink-0" />
                    <div className="text-sm text-gray-700">
                      <p className="font-medium mb-1">Password Requirements:</p>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>At least 8 characters long</li>
                        <li>Contains uppercase and lowercase letters</li>
                        <li>Contains at least one number</li>
                        <li>Avoid common passwords</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary w-full disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="loading-spinner mr-2"></div>
                      Resetting Password...
                    </div>
                  ) : (
                    'Reset Password'
                  )}
                </button>
              </form>
            )}

            {/* Step 4: Success */}
            {step === 4 && (
              <div className="text-center space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-green-900 mb-2">Password Reset Successful!</h3>
                  <p className="text-green-700">
                    Your password has been successfully reset. You can now log in with your new password.
                  </p>
                </div>

                <Link to="/login" className="btn-primary w-full">
                  Continue to Login
                </Link>
              </div>
            )}

            {/* Back to Login */}
            {step < 4 && (
              <div className="mt-8 text-center">
                <Link 
                  to="/login" 
                  className="inline-flex items-center text-sm text-gray-600 hover:text-primary-600 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to login
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;