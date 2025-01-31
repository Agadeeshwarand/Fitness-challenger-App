import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Challenge.css';

const Challenge = () => {
  const [user, setUser] = useState(null);
  const [friends, setFriends] = useState([]);
  const [challengeData, setChallengeData] = useState({
    name: '',
    duration: '',
    startDate: '',
    challengerName: ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [searchEmail, setSearchEmail] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      setUser(userData);
      setCurrentUser(userData);
      fetchFriends(userData._id);
    }
  }, []);

  const fetchFriends = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/users/friends/${userId}`);
      setFriends(response.data);
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchEmail.trim()) {
      setMessage('Please enter an email to search');
      return;
    }

    setLoading(true);
    setMessage('');
    try {
      const response = await axios.get(`http://localhost:5000/api/users/search`, {
        params: {
          email: searchEmail,
          currentUserId: currentUser._id
        }
      });
      setSearchResults(response.data);
      if (response.data.length === 0) {
        setMessage('No users found with this email');
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error searching for users');
    } finally {
      setLoading(false);
    }
  };

  const sendFriendRequest = async (receiverEmail) => {
    try {
      await axios.post('http://localhost:5000/api/users/friend-request', {
        senderId: currentUser._id,
        receiverEmail
      });
      setMessage('Friend added successfully!');
      fetchFriends(currentUser._id); // Refresh friends list
      setSearchResults([]); // Clear search results
      setSearchEmail(''); // Clear search input
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error sending friend request');
    }
  };

  const handleChange = (e) => {
    setChallengeData({
      ...challengeData,
      [e.target.name]: e.target.value
    });
  };

  const handleInviteChallenge = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/challenges', {
        ...challengeData,
        creator: user._id,
        participants: [{ user: challengeData.challengerName }]
      });
      alert('Challenge created successfully!');
      setChallengeData({
        name: '',
        duration: '',
        startDate: '',
        challengerName: ''
      });
    } catch (error) {
      console.error('Error creating challenge:', error);
      alert('Error creating challenge');
    }
  };

  const handleSocialShare = (platform) => {
    const shareUrl = window.location.origin;
    const shareText = 'Join me in the Fitness Challenger App!';
    
    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`);
        break;
      case 'instagram':
        window.open('https://instagram.com');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`);
        break;
    }
  };

  return (
    <div className="challenge-container">
      <div className="challenge-content">
        <div className="challenge-form-section">
          <h2>Invite Challenge</h2>
          <form onSubmit={handleInviteChallenge}>
            <div className="form-group">
              <label>Challenge Name:</label>
              <input
                type="text"
                name="name"
                value={challengeData.name}
                onChange={handleChange}
                placeholder="Challenge name get from user"
                required
              />
            </div>
            <div className="form-group">
              <label>Challenge Duration:</label>
              <input
                type="text"
                name="duration"
                value={challengeData.duration}
                onChange={handleChange}
                placeholder="Challenge duration get from user"
                required
              />
            </div>
            <div className="form-group">
              <label>Challenge Start:</label>
              <input
                type="date"
                name="startDate"
                value={challengeData.startDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Challenger Name:</label>
              <input
                type="text"
                name="challengerName"
                value={challengeData.challengerName}
                onChange={handleChange}
                placeholder="Challenger name get from user"
                required
              />
            </div>
            <button type="submit" className="invite-button">
              Invite Challenge
            </button>
          </form>
        </div>

        <div className="friends-section">
          <h2>Friends</h2>
          <div className="search-container">
            <input
              type="email"
              placeholder="Search friend by email"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
            />
            <button onClick={handleSearch} disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>

          {message && <div className="message">{message}</div>}

          {searchResults.length > 0 && (
            <div className="search-results">
              <h3>Search Results</h3>
              {searchResults.map(user => (
                <div key={user._id} className="search-result-item">
                  <span>{user.name} ({user.email})</span>
                  <button onClick={() => sendFriendRequest(user.email)}>
                    Add Friend
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="friends-list">
            {friends.length > 0 ? (
              friends.map(friend => (
                <div key={friend._id} className="friend-item">
                  <span>{friend.name}</span>
                  <span className="friend-email">({friend.email})</span>
                </div>
              ))
            ) : (
              <p>Does not have any friends yet.</p>
            )}
          </div>
        </div>
      </div>

      <footer className="challenge-footer">
        <div className="social-share">
          <span>Invite Friends:</span>
          <div className="social-icons">
            <i className="fab fa-whatsapp" onClick={() => handleSocialShare('whatsapp')}></i>
            <i className="fab fa-instagram" onClick={() => handleSocialShare('instagram')}></i>
            <i className="fab fa-linkedin" onClick={() => handleSocialShare('linkedin')}></i>
          </div>
        </div>
        <button className="track-progress-btn">Track Progress</button>
      </footer>
    </div>
  );
};

export default Challenge;
