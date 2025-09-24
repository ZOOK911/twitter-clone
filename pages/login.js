import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navigation from '../components/Navigation';
import { useUser } from '../context/UserContext';

// Login page. Provides a form for users to authenticate with their
// username and password. Upon successful login they are redirected
// to the home feed. If already logged in, redirect immediately.
export default function Login() {
  const { user, loginUser } = useUser();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = loginUser(username.trim(), password.trim());
    if (success) {
      router.push('/');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <>
      <Navigation />
      <main>
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Username
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>
          <label style={{ display: 'block', marginTop: '0.5rem' }}>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <button type="submit" className="nav-button" style={{ marginTop: '0.5rem' }}>
            Login
          </button>
          {error && <div className="error">{error}</div>}
        </form>
        <p style={{ marginTop: '1rem' }}>
          Don't have an account?{' '}
          <a href="/signup" style={{ color: '#1da1f2' }}>Sign up</a>
        </p>
      </main>
    </>
  );
}
