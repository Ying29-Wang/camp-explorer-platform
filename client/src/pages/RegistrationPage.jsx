import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Header from '../components/layout/Header';
import './RegistrationPage.css';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUB_KEY);

const PaymentForm = ({ camp, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    
    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
      });

      if (error) throw error;

      const response = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentMethodId: paymentMethod.id,
          campId: camp._id,
          amount: camp.price * 100,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Payment failed');

      onSuccess(data.receipt);
    } catch (err) {
      onError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="payment-section">
      <h3>Payment Information</h3>
      <form onSubmit={handleSubmit}>
        <CardElement className="stripe-card" />
        <button 
          type="submit" 
          disabled={!stripe || processing}
          className="submit-button payment-button"
        >
          {processing ? 'Processing...' : `Pay $${camp.price}`}
        </button>
      </form>
    </div>
  );
};

const RegistrationPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'parent',
    selectedCamp: null,
  });
  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
    role: ''
  });
  const [submitError, setSubmitError] = useState('');
  const [registrationStep, setRegistrationStep] = useState('form');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  // Mock camp data - replace with your actual camp selection logic
  const demoCamp = {
    _id: 'camp123',
    name: 'Summer Adventure Camp',
    price: 299,
    description: 'Weekly summer camp for kids ages 8-12'
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      username: '',
      email: '',
      password: '',
      role: ''
    };

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
      isValid = false;
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
      isValid = false;
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!validateForm()) return;

    try {
      // First complete registration
      await register(formData);
      
      // If camp owner, skip payment
      if (formData.role === 'camp_owner') {
        navigate('/profile');
      } else {
        // For parents, proceed to payment
        setRegistrationStep('payment');
      }
    } catch (err) {
      setSubmitError(err.message || 'Registration failed. Please try again.');
    }
  };

  const handlePaymentSuccess = (receipt) => {
    setPaymentSuccess(true);
    setTimeout(() => navigate('/profile'), 2000);
  };

  return (
    <div className="registration-page">
      <Header />
      <div className="registration-container">
        <h2>Create Account</h2>
        {submitError && <div className="error-message">{submitError}</div>}
        
        {registrationStep === 'form' ? (
          <form onSubmit={handleFormSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                name="username"
                autoComplete="username"
                value={formData.username}
                onChange={handleChange}
                className={errors.username ? 'error-border' : ''}
                aria-describedby={errors.username ? 'username-error' : undefined}
              />
              {errors.username && <div id="username-error" className="field-error">{errors.username}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error-border' : ''}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              {errors.email && <div id="email-error" className="field-error">{errors.email}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                name="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? 'error-border' : ''}
                aria-describedby={errors.password ? 'password-error' : undefined}
              />
              {errors.password && <div id="password-error" className="field-error">{errors.password}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="role">Account Type</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                aria-describedby={errors.role ? 'role-error' : undefined}
              >
                <option value="parent">Parent</option>
                <option value="camp_owner">Camp Owner</option>
              </select>
              {errors.role && <div id="role-error" className="field-error">{errors.role}</div>}
            </div>

            <button type="submit" className="submit-button">
              Continue
            </button>

            <p className="login-link">
              Already have an account? <Link to="/login">Login here</Link>
            </p>
          </form>
        ) : (
          <div className="payment-step">
            {paymentSuccess ? (
              <div className="success-message">
                <h3>Payment Successful!</h3>
                <p>Your registration is complete. Redirecting to your profile...</p>
              </div>
            ) : (
              <>
                <h3>Complete Your Registration</h3>
                <p>You're registering for: <strong>{demoCamp.name}</strong> (${demoCamp.price})</p>
                
                <Elements stripe={stripePromise}>
                  <PaymentForm 
                    camp={demoCamp}
                    onSuccess={handlePaymentSuccess}
                    onError={setSubmitError}
                  />
                </Elements>

                <button 
                  className="back-button"
                  onClick={() => setRegistrationStep('form')}
                >
                  Back to Registration
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RegistrationPage;