'use client';

import { useState, useEffect } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

export default function ContactForm() {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState('');
  const [startTime, setStartTime] = useState(0);

  useEffect(() => {
    setStartTime(Date.now());
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!executeRecaptcha) {
      alert('reCAPTCHA not ready');
      return;
    }

    setStatus('loading');

    try {
      const token = await executeRecaptcha('contact_form');
      const formData = new FormData(e.target);
      
      const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message'),
        honeypot: formData.get('website'), // Honeypot field
        startTime: startTime,
        recaptchaToken: token,
      };

      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setStatus('success');
      } else {
        const err = await res.json();
        setErrorMessage(err.message || 'Something went wrong');
        setStatus('error');
      }
    } catch (error) {
      setErrorMessage('Network error. Please try again later.');
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="py-20 text-center animate-fade-in">
        <h2 className="text-3xl font-bold mb-6 italic">Message Sent.</h2>
        <p className="text-[10px] font-bold tracking-[0.4em] text-secondary uppercase px-6">
          Thank you for reaching out. We will respond to tomo81222chapu@gmail.com shortly.
        </p>
        <button 
          onClick={() => setStatus('idle')}
          className="mt-12 text-[10px] font-bold tracking-[0.5em] text-accent uppercase hover:opacity-50 transition-opacity"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-12 animate-fade-in" style={{ animationDelay: '0.2s' }}>
      {/* Honeypot for spam bots */}
      <div className="hidden" aria-hidden="true">
        <input type="text" name="website" tabIndex="-1" autoComplete="off" />
      </div>

      <div className="space-y-2 group">
        <label className="text-[10px] font-bold tracking-[0.3em] text-secondary uppercase">Full Name</label>
        <input
          required
          name="name"
          type="text"
          placeholder="Enter your name"
          className="w-full bg-transparent border-b border-gray-100 py-4 focus:border-accent outline-none transition-colors duration-500 font-medium placeholder:text-gray-200"
        />
      </div>

      <div className="space-y-2 group">
        <label className="text-[10px] font-bold tracking-[0.3em] text-secondary uppercase">Email Address</label>
        <input
          required
          name="email"
          type="email"
          placeholder="your@email.com"
          className="w-full bg-transparent border-b border-gray-100 py-4 focus:border-accent outline-none transition-colors duration-500 font-medium placeholder:text-gray-200"
        />
      </div>

      <div className="space-y-2 group">
        <label className="text-[10px] font-bold tracking-[0.3em] text-secondary uppercase">Message</label>
        <textarea
          required
          name="message"
          rows="5"
          placeholder="How can we help you?"
          className="w-full bg-transparent border-b border-gray-100 py-4 focus:border-accent outline-none transition-colors duration-500 font-medium placeholder:text-gray-200 resize-none"
        ></textarea>
      </div>

      {status === 'error' && (
        <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest bg-red-50 p-4 rounded-sm">
          Error: {errorMessage}
        </p>
      )}

      <button
        disabled={status === 'loading'}
        type="submit"
        className="group relative w-full py-6 bg-primary text-white font-bold text-[10px] uppercase tracking-[0.6em] overflow-hidden transition-all hover:bg-black active:scale-[0.98] disabled:opacity-50"
      >
        <span className="relative z-10">
          {status === 'loading' ? 'Encrypting & Sending...' : 'Dispatch Message'}
        </span>
        <div className="absolute inset-0 bg-accent translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
      </button>

      <p className="text-[8px] text-gray-300 text-center tracking-widest uppercase italic">
        Protected by Google reCAPTCHA v3 & Honeypot Logic
      </p>
    </form>
  );
}
