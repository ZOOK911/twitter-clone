import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navigation from '../components/Navigation';
import { useUser } from '../context/UserContext';

// Sign up page. Allows new users to create an account with a
// username and password. Usernames must be unique. Upon
// successful registration the user is automatically logged in
// and redirected to the home feed. If already logged in, redirect.
export default function Signup() {
  const { user, registerUser, loginUser } = useUser();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    const success = registerUser(username.trim(), password.trim());
    if (success) {
      // Auto login after registration
      loginUser(username.trim(), password.trim());
      router.push('/');
    } else {
      setError('Username already exists');
    }
  };

  return (
    <>
      <Navigation />
      <main>
        <h1>Sign Up</h1>
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
          <label style={{ display: 'block', marginTop: '0.5rem' }}>
            Confirm Password
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </label>
          <button type="submit" className="nav-button" style={{ marginTop: '0.5rem' }}>
            Sign Up
          </button>
          {error && <div className="error">{error}</div>}
        </form>
        <p style={{ marginTop: '1rem' }}>
          Already have an account?{' '}
          <a href="/login" style={{ color: '#1da1f2' }}>Log in</a>
        </p>
      </main>
    </>
  );
}
