import { createContext, useContext, useEffect, useState } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [followers, setFollowers] = useState({});

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const storedPosts = JSON.parse(localStorage.getItem('posts') || '[]');
    const storedFollowers = JSON.parse(localStorage.getItem('followers') || '{}');
    const storedUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    setUsers(storedUsers);
    setPosts(storedPosts);
    setFollowers(storedFollowers);
    setUser(storedUser);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') localStorage.setItem('users', JSON.stringify(users));
  }, [users]);
  useEffect(() => {
    if (typeof window !== 'undefined') localStorage.setItem('posts', JSON.stringify(posts));
  }, [posts]);
  useEffect(() => {
    if (typeof window !== 'undefined') localStorage.setItem('followers', JSON.stringify(followers));
  }, [followers]);
  useEffect(() => {
    if (typeof window !== 'undefined') localStorage.setItem('currentUser', JSON.stringify(user));
  }, [user]);

  const registerUser = (username, password) => {
    if (!username || !password || users.some(u => u.username === username)) return false;
    setUsers(prev => [...prev, { username, password }]);
    setFollowers(prev => ({ ...prev, [username]: [] }));
    return true;
  };

  const loginUser = (username, password) => {
    const account = users.find(u => u.username === username && u.password === password);
    if (account) { setUser({ username }); return true; }
    return false;
  };

  const logoutUser = () => setUser(null);

  const createPost = (content) => {
    if (!user || !content) return;
    const newPost = { id: Date.now(), author: user.username, content: content.trim(), timestamp: new Date().toISOString() };
    setPosts(prev => [newPost, ...prev]);
  };

  const followUser = (usernameToFollow) => {
    if (!user || !usernameToFollow || user.username === usernameToFollow) return;
    setFollowers(prev => {
      const list = prev[user.username] || [];
      if (list.includes(usernameToFollow)) return prev;
      return { ...prev, [user.username]: [...list, usernameToFollow] };
    });
  };

  const unfollowUser = (usernameToUnfollow) => {
    if (!user) return;
    setFollowers(prev => {
      const list = prev[user.username] || [];
      return { ...prev, [user.username]: list.filter(u => u !== usernameToUnfollow) };
    });
  };

  const getFollowedUsers = () => {
    if (!user) return [];
    return followers[user.username] || [];
  };

  const getFeedPosts = () => {
    if (!user) return [];
    const followed = getFollowedUsers();
    return posts.filter(p => p.author === user.username || followed.includes(p.author))
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };

  const getUserPosts = (username) => {
    return posts.filter(p => p.author === username).sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));
  };

  const searchPosts = (query) => {
    if (!query) return [];
    const lower = query.toLowerCase();
    return posts.filter(p => p.content.toLowerCase().includes(lower))
      .sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));
  };

  const getTrendingTags = () => {
    const counts = {};
    posts.forEach(p => {
      p.content.split(/\s+/).forEach(word => {
        if (word.startsWith('#')) {
          const t = word.toLowerCase();
          counts[t] = (counts[t] || 0) + 1;
        }
      });
    });
    return Object.entries(counts).sort((a,b) => b[1] - a[1]).slice(0,10).map(([tag]) => tag);
  };

  return (
    <UserContext.Provider value={{
      user, users, followers,
      registerUser, loginUser, logoutUser,
      createPost, followUser, unfollowUser,
      getFollowedUsers, getFeedPosts, getUserPosts,
      searchPosts, getTrendingTags
    }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
