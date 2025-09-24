import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navigation from '../components/Navigation';
import { useUser } from '../context/UserContext';

// Home feed page. Shows the logged in user's feed with a form to
// compose new posts and a sidebar with trending hashtags. If the
// user isn't authenticated it redirects to the login page.
export default function Home() {
  const router = useRouter();
  const {
    user,
    createPost,
    getFeedPosts,
    getTrendingTags,
  } = useUser();
  const [content, setContent] = useState('');
  const [feed, setFeed] = useState([]);
  const [trending, setTrending] = useState([]);

  // Redirect to login if not logged in
  useEffect(() => {
    if (user === null) {
      router.push('/login');
    }
  }, [user, router]);

  // Load feed and trending when posts or followers change
  useEffect(() => {
    if (user) {
      setFeed(getFeedPosts());
      setTrending(getTrendingTags());
    }
  }, [user, getFeedPosts, getTrendingTags]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    createPost(content);
    setContent('');
    // Refresh feed and trending after posting
    setFeed(getFeedPosts());
    setTrending(getTrendingTags());
  };

  // Helper to convert hashtags into clickable spans. When clicked,
  // they navigate to the search page with the hashtag query.
  const renderContent = (text) => {
    const words = text.split(/(#[^\s]+)/g);
    return words.map((word, idx) => {
      if (/^#\w+/.test(word)) {
        const tag = word.toLowerCase();
        return (
          <span
            key={idx}
            className="hashtag"
            onClick={() => router.push(`/search?q=${encodeURIComponent(tag)}`)}
          >
            {word}
          </span>
        );
      }
      return <span key={idx}>{word}</span>;
    });
  };

  return (
    <>
      <Navigation />
      <main>
        <h1>Home</h1>
        {user && (
          <form onSubmit={handleSubmit}>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={3}
              placeholder="What's happening?"
            />
            <button type="submit" className="nav-button" style={{ marginTop: '0.5rem' }}>
              Post
            </button>
          </form>
        )}
        {feed.length === 0 ? (
          <p>No posts to show. Follow users or create your first post!</p>
        ) : (
          feed.map((post) => (
            <div key={post.id} className="post">
              <div className="post-author">
                {post.author}
              </div>
              <div className="post-content">
                {renderContent(post.content)}
              </div>
              <div className="post-timestamp">
                {new Date(post.timestamp).toLocaleString()}
              </div>
            </div>
          ))
        )}
        {trending.length > 0 && (
          <section className="trending">
            <h3>Trending</h3>
            <ul className="trending-list">
              {trending.map((tag, index) => (
                <li
                  key={index}
                  className="trending-item"
                  onClick={() => router.push(`/search?q=${encodeURIComponent(tag)}`)}
                >
                  {tag}
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </>
  );
}
