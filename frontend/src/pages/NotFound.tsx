import React from 'react';
import { Link } from 'react-router-dom';
import { Microscope, Home } from 'lucide-react';
import Button from '../components/ui/Button';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', textAlign: 'center',
      padding: 32, background: 'var(--gray-50)',
    }}>
      <div style={{
        width: 64, height: 64, background: 'var(--teal)',
        borderRadius: 16, display: 'flex', alignItems: 'center',
        justifyContent: 'center', marginBottom: 24,
      }}>
        <Microscope size={32} color="#fff" />
      </div>

      <div style={{ fontSize: '4rem', fontWeight: 800, color: 'var(--navy)', lineHeight: 1, marginBottom: 8 }}>
        404
      </div>
      <h1 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--navy)', marginBottom: 10 }}>
        Page not found
      </h1>
      <p style={{ fontSize: '0.9375rem', color: 'var(--gray-500)', maxWidth: 360, lineHeight: 1.6, marginBottom: 32 }}>
        The page you're looking for doesn't exist. It may have been moved or the URL may be incorrect.
      </p>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link to="/dashboard">
          <Button icon={<Home size={15} />}>Go to dashboard</Button>
        </Link>
        <Link to="/">
          <Button variant="outline">Back to home</Button>
        </Link>
      </div>
    </div>
  );
}
