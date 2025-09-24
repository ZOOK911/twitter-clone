import '../styles/globals.css';
import { UserProvider } from '../context/UserContext';

// Custom App component wraps all pages with the UserProvider so that
// authentication and data state is available globally. It also
// imports global styles.
export default function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  );
}
