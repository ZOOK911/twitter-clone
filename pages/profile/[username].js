import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Navigation from '../../components/Navigation';
import { useUser } from '../../context/UserContext';

// Profile page. Displays information about a user including their
// posts, follower counts and follow/unfollow controls. The current
// logged in user can follow or unfollow other accounts from here.
export default function ProfilePage() {
  const router = useRouter();
  const { username } = router.query;
  const {
    user,
    users,
    followers,
    getUserPosts,
    followUser,
    unfollowUser,
    getFollowedUsers,
  } = useUser();
  const [posts, setPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (username) {
      setPosts(getUserPosts(username));
    }
  }, [username, getUserPosts]);

  useEffect(() => {
    if (!user || !username) {
      setIsFollowing(false);
      return;
    }
    const followed = getFollowedUsers();
    setIsFollowing(followed.includes(username));
  }, [user, username, followers, getFollowedUsers]);

  if (!username) {
    return null;
  }

  // Find the user object. If it doesn't exist display a message.
  const account = users.find(u => u.username === username);
  const followerCount = Object.values(followers).filter(list => list.includes(username)).length;
  const followingCount = followers[username] ? followers[username].length : 0;

  const handleFollow = () => {
    if (!user) {
      router.push('/login');
      return;
    }
    if (isFollowing) {
      unfollowUser(username);
    } else {
      followUser(username);
    }
    // update follow state
    setIsFollowing(!isFollowing);
  };

  return (
    <>
      <Navigation />
      <main>
        {!account ? (
          <p>User not found.</p>
        ) : (
          <>
            <h1>{account.username}</h1>
            <div style={{ marginBottom: '1rem' }}>
              <span><strong>{followerCount}</strong> Followers</span>{' '}
              <span style={{ marginLeft: '1rem' }}><strong>{followingCount}</strong> Following</span>
            </div>
            {user && user.username !== username && (
              <button onClick={handleFollow} className="nav-button" style={{ marginBottom: '1rem' }}>
                {isFollowing ? 'Unfollow' : 'Follow'}
              </button>
            )}
            <h2>Posts</h2>
            {posts.length === 0 ? (
              <p>No posts yet.</p>
            ) : (
              posts.map(post => (
                <div key={post.id} className="post">
                  <div className="post-content">
                    {post.content}
                  </div>
                  <div className="post-timestamp">
                    {new Date(post.timestamp).toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </>
        )}
      </main>
    </>
  );
}
