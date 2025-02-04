import axios from 'axios';
import React, { useState } from 'react'
import { useLocation } from 'react-router-dom';


const LeafIcon = () => (
    <svg 
      viewBox="0 0 24 24" 
      width="24" 
      height="24" 
      className="inline-block"
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M2 22c1.25-1.25 2.5-2.5 3.75-3.75C3.5 14 3.75 10 4.25 7.5 4.75 5 5.5 3.5 7.5 2.5c1-.5 2-.75 3-.75 4.25 0 7 2.25 8.5 4.75C20.75 9.75 22 14 21.25 18c-4-.25-8.25.75-11.25 3.75" />
      <path d="M14 18c-1-1-2-2-3-2" />
    </svg>
  );
  

const VerifyEmail = () => {
    const location = useLocation();
  const { formData, otp } = location.state || {};
    const [enterotp, setEnterOtp] = useState(['', '', '', '', '', '']);
    const [status, setStatus] = useState('idle');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

  
    const handleOtpChange = (index, value) => {
      if (isNaN(value)) return;
      
      const newOtp = [...enterotp];
      newOtp[index] = value;
      setEnterOtp(newOtp);
  
      if (value && index < 5) {
        const nextInput = document.getElementById(`enterotp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    };
  
    const handleKeyDown = (index, e) => {
      if (e.key === 'Backspace' && !enterotp[index] && index > 0) {
        const prevInput = document.getElementById(`otp-${index - 1}`);
        if (prevInput) {
          prevInput.focus();
          const newOtp = [...enterotp];
          newOtp[index - 1] = '';
          setEnterOtp(newOtp);
        }
      }
    };
  
    const handleSubmit = async(e) => {
      e.preventDefault();

      try {
        
     
      const otpString = enterotp.join('');
      
      if (otpString.length !== 6) {
        setStatus('error');
        setMessage('Please enter the complete verification code');
        return;
      }
  
      setStatus('verifying');
      setMessage('Verifying your code...');
  
      // Simulate API call
     
        if (otpString === otp) {
          setStatus('success');
          setMessage('Verification successful!');
           
               setLoading(true)
          // Redirect to dashboard after successful verification
          console.log("conferm password",formData.confirmPassword)
          let response =await axios.post("http://localhost:4000/api/v1/auth/signup",{
            email: formData.email,
            password: formData.password,
            confermPassword: formData.confirmPassword,
            Name: formData.fullName,
            accountType:formData.accountType,
            otp: otpString,
          
          })
          setLoading(false)
           window.location.href="/login"
          console.log("response of signup",response);
          
        } else {
          setStatus('error');
          setMessage('Invalid verification code. Please try again.');
        }
     
    } catch (error) {
      console.error(error);
      setStatus('error');
      setMessage('Failed to verify your code. Please try again.');
        
    }
    };
  
    const handleResend = () => {
      setStatus('idle');
      setMessage('New verification code sent');
      setEnterOtp(['', '', '', '', '', '']);
    };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-green-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <div className="bg-green-700 text-white py-4 px-4 rounded-t-lg -mx-6 -mt-6 mb-6">
          <h2 className="text-xl font-semibold text-center flex items-center justify-center gap-2">
            <LeafIcon />
            AgriTech Verification
          </h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="text-center mb-6 text-gray-600">
            Please enter the 6-digit verification code sent to your email
          </div>

          <div className="flex justify-center gap-2 mb-6">
            {enterotp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength={1}
                className="w-12 h-12 text-center text-xl border rounded-md focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                disabled={status === 'verifying' || status === 'success'}
              />
            ))}
          </div>

          {message && (
            <div className={`mb-4 p-3 rounded-md flex items-center gap-2 ${
              status === 'success' ? 'bg-green-50 text-green-700' :
              status === 'error' ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'
            }`}>
              {status === 'success' && (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              )}
              {status === 'error' && (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              {message}
            </div>
          )}

          <div className="flex flex-col gap-3">
            <button
              type="submit"
              className={`w-full py-2 px-4 rounded-md text-white font-semibold transition-colors
                ${status === 'verifying' || status === 'success'
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-700 hover:bg-green-800'}`}
              disabled={status === 'verifying' || status === 'success'}
            >
              {status === 'verifying' ? 'Verifying...' : 'Verify Code'}
            </button>

            <button
              type="button"
              onClick={handleResend}
              className={`w-full py-2 px-4 rounded-md border border-green-700 text-green-700 font-semibold transition-colors
                ${status === 'verifying' ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-50'}`}
              disabled={status === 'verifying'}
            >
              Resend Code
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default VerifyEmail