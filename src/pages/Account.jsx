import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Account.css';

const Account = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const defaultAvatar = "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png";
  const [profileImage, setProfileImage] = useState(defaultAvatar);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      setUser(userData);
      // If user has a profile image in their data, use it
      if (userData.profileImage) {
        setProfileImage(userData.profileImage);
      }
    }
  }, []);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const imageDataUrl = reader.result;
        try {
          // Save to backend
          await axios.put('http://localhost:5000/api/users/profile-image', {
            email: user.email,
            imageData: imageDataUrl
          });

          // Update local state
          setProfileImage(imageDataUrl);
          
          // Update user data in localStorage
          const updatedUser = { ...user, profileImage: imageDataUrl };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          setUser(updatedUser);

        } catch (error) {
          console.error('Error updating profile image:', error);
          alert('Failed to update profile image. Please try again.');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddAboutMe = async () => {
    try {
      // Update the about me section
      // This is where you would make an API call to update the user's about me
      alert('About Me section updated!');
    } catch (error) {
      console.error('Error updating about me:', error);
    }
  };

  const handleLogout = () => {
    // Only remove user data from localStorage, not the profile image
    localStorage.removeItem('user');
    navigate('/');
    window.location.reload();
  };

  if (!user) {
    return (
      <div className="account-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="account-container">
      <div className="account-content">
        <h2>My Profile</h2>
        <div className="profile-section">
          <div className="profile-image-container">
            <img
              src={profileImage}
              alt="Profile"
              className="profile-image"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = defaultAvatar;
              }}
            />
            <label htmlFor="image-upload" className="image-upload-label">
              Change Photo
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
            </label>
          </div>
          <div className="user-info">
            <p>User Name: {user.name}</p>
            <p>User age: {user.age}</p>
            <p>User gender: {user.gender}</p>
            <p>Email id: {user.email}</p>
          </div>
        </div>

        <div className="about-section">
          <h3>About Me</h3>
          <div className="about-content">
            <p>{user.aboutMe || "I haven't filled this out yet."}</p>
            <button className="add-on-btn" onClick={handleAddAboutMe}>
              Add On
            </button>
          </div>
        </div>

        <div className="friends-section">
          <h3>Friends</h3>
          <div className="friends-content">
            <p>Does not have any friends yet.</p>
            <button className="add-on-btn">Add On</button>
          </div>
        </div>
      </div>
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
      <footer className="account-footer">
        @All Rights Reserved By Ag
      </footer>
    </div>
  );
};

export default Account;
