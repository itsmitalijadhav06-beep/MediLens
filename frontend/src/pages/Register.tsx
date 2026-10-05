import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Microscope, Eye, EyeOff, AlertCircle } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/auth';

interface FormValues {
  username: string;
  phoneNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>();

  const passwordValue = watch('password');

  const onSubmit = async (data: FormValues) => {
    setApiError('');
    setLoading(true);
    try {
      const res = await authApi.register({
        username: data.username,
        phoneNumber: data.phoneNumber,
        email: data.email,
        password: data.password,
      });
      login(res.token, res.user);
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setApiError(err?.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy-mid) 100%)',
    }}>
      {/* Left panel */}
      <div style={{
        flex: 1, display: 'none', alignItems: 'center', justifyContent: 'center',
        padding: 48, borderRight: '1px solid rgba(255,255,255,0.06)',
      }} className="auth-panel-left">
        <div style={{ maxWidth: 380 }}>
          <div style={{
            width: 52, height: 52, background: 'var(--teal)',
            borderRadius: 14, display: 'flex', alignItems: 'center',
            justifyContent: 'center', marginBottom: 28,
          }}>
            <Microscope size={26} color="#fff" />
          </div>
          <h2 style={{ color: '#fff', fontSize: '1.75rem', fontWeight: 700, marginBottom: 14, letterSpacing: '-0.02em' }}>
            Start understanding<br />your health data.
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.9375rem', lineHeight: 1.7, margin: 0 }}>
            Create an account to upload reports, view explained parameters, and keep all your results organised in one place.
          </p>
        </div>
      </div>

      {/* Form panel */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '32px 24px', background: 'var(--gray-50)',
      }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32 }} className="mobile-brand">
            <div style={{
              width: 32, height: 32, background: 'var(--teal)',
              borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Microscope size={16} color="#fff" />
            </div>
            <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--navy)' }}>MediLens</span>
          </div>

          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--navy)', marginBottom: 4 }}>
            Create account
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginBottom: 28 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--teal)', fontWeight: 500 }}>Sign in</Link>
          </p>

          {apiError && (
            <div role="alert" style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 14px', marginBottom: 20,
              background: 'var(--danger-bg)', border: '1px solid var(--danger-border)',
              borderRadius: 'var(--radius-sm)', fontSize: '0.875rem', color: 'var(--danger)',
            }}>
              <AlertCircle size={16} aria-hidden />
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Input
              label="Username"
              type="text"
              autoComplete="username"
              required
              error={errors.username?.message}
              {...register('username', {
                required: 'Username is required',
                minLength: { value: 3, message: 'Username must be at least 3 characters' },
              })}
            />

            <Input
              label="Phone number"
              type="tel"
              autoComplete="tel"
              required
              error={errors.phoneNumber?.message}
              {...register('phoneNumber', {
                required: 'Phone number is required',
                pattern: { value: /^[0-9+\s-]{7,15}$/, message: 'Enter a valid phone number' },
              })}
            />

            <Input
              label="Email address"
              type="email"
              autoComplete="email"
              required
              error={errors.email?.message}
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email address' },
              })}
            />

            <div style={{ position: 'relative' }}>
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                error={errors.password?.message}
                hint="Minimum 8 characters"
                style={{ paddingRight: 44 }}
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 8, message: 'Password must be at least 8 characters' },
                })}
              />
              <button
                type="button"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', right: 12, top: 32,
                  background: 'none', border: 'none', color: 'var(--gray-400)',
                  cursor: 'pointer', padding: 2,
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <Input
              label="Confirm password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              error={errors.confirmPassword?.message}
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (v) => v === passwordValue || 'Passwords do not match',
              })}
            />

            <Button type="submit" fullWidth loading={loading} size="lg" style={{ marginTop: 4 }}>
              Create account
            </Button>
          </form>

          <p style={{ marginTop: 20, fontSize: '0.75rem', color: 'var(--gray-400)', lineHeight: 1.6 }}>
            MediLens is an educational tool. It does not provide medical advice, diagnosis, or treatment.
          </p>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .auth-panel-left { display: flex !important; }
          .mobile-brand { display: none !important; }
        }
      `}</style>
    </div>
  );
}
