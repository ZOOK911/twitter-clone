import Link from 'next/link';
import { useUser } from '../context/UserContext';
import { useRouter } from 'next/router';

// Top navigation bar. Displays links to the home feed, profile and search
// pages. When a user is logged in it shows their profile link and a
// logout button. Otherwise login and sign up links are shown.
export default function Navigation() {
  const { user, logoutUser } = useUser();
  const router = useRouter();

  const handleLogout = () => {
    logoutUser();
    router.push('/login');
  };

  return (
    <header className="nav-container">
      <nav className="nav-bar">
        <Link href="/" className="nav-item">
          Home
        </Link>
        {user && (
          <Link href={`/profile/${user.username}`} className="nav-item">
            Profile
          </Link>
        )}
        <Link href="/search" className="nav-item">
          Search
        </Link>
        <div className="nav-spacer" />
        {user ? (
          <button onClick={handleLogout} className="nav-button">
            Logout
          </button>
        ) : (
          <>
            <Link href="/login" className="nav-item">
              Login
            </Link>
            <Link href="/signup" className="nav-item">
              Sign\u00a0Up
            </Link>
          </>
        )}
      </nav>
      <style jsx>{`
        .nav-container {
          width: 100%;
          background: #0f1419;
          color: #f7f9f9;
          padding: 0.5rem 1rem;
          position: sticky;
          top: 0;
          z-index: 1000;
        }
        .nav-bar {
          display: flex;
          align-items: center;
        }
        .nav-item {
          margin-right: 1rem;
          color: inherit;
          text-decoration: none;
        }
        .nav-item:hover {
          text-decoration: underline;
        }
        .nav-spacer {
          flex: 1;
        }
        .nav-button {
          background: transparent;
          border: 1px solid #f7f9f9;
          color: #f7f9f9;
          padding: 0.25rem 0.75rem;
          border-radius: 4px;
          cursor: pointer;
        }
        .nav-button:hover {
          background: #f7f9f9;
          color: #0f1419;
        }
      `}</style>
    </header>
  );
}
