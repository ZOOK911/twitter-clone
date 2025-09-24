import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navigation from '../components/Navigation';
import { useUser } from '../context/UserContext';

// Search page. Allows users to search posts by keyword or hashtag. It
// also displays trending tags to quickly explore popular topics.
export default function SearchPage() {
  const router = useRouter();
  const { q } = router.query;
  const { searchPosts, getTrendingTags } = useUser();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [trending, setTrending] = useState([]);

  useEffect(() => {
    setTrending(getTrendingTags());
  }, [getTrendingTags]);

  useEffect(() => {
    if (q) {
      setQuery(q.toString());
      const res = searchPosts(q.toString());
      setResults(res);
    }
  }, [q, searchPosts]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    // Navigate to same page with query param for shareable links
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    const res = searchPosts(query.trim());
    setResults(res);
  };

  const renderContent = (text) => {
    const words = text.split(/(#[^\s]+)/g);
    return words.map((word, idx) => {
      if (/^#\w+/.test(word)) {
        const tag = word.toLowerCase();
        return (
          <span
            key={idx}
            className="hashtag"
            onClick={() => {
              setQuery(tag);
              router.push(`/search?q=${encodeURIComponent(tag)}`);
              setResults(searchPosts(tag));
            }}
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
        <h1>Search</h1>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search posts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="nav-button" style={{ marginTop: '0.5rem' }}>
            Search
          </button>
        </form>
        {results.length > 0 ? (
          <div style={{ marginTop: '1rem' }}>
            {results.map((post) => (
              <div key={post.id} className="post">
                <div className="post-author">{post.author}</div>
                <div className="post-content">{renderContent(post.content)}</div>
                <div className="post-timestamp">
                  {new Date(post.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ marginTop: '1rem' }}>No results found.</p>
        )}
        {trending.length > 0 && (
          <section className="trending">
            <h3>Trending</h3>
            <ul className="trending-list">
              {trending.map((tag, index) => (
                <li
                  key={index}
                  className="trending-item"
                  onClick={() => {
                    setQuery(tag);
                    router.push(`/search?q=${encodeURIComponent(tag)}`);
                    setResults(searchPosts(tag));
                  }}
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
