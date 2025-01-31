import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="home-content">
        <h1>FITNESS CHALLENGER</h1>
        <div className="button-container">
          <button 
            className="action-button"
            onClick={() => navigate('/challenge')}
          >
            Create Challenge
          </button>
          <button 
            className="action-button"
            onClick={() => navigate('/dashboard')}
          >
            Track Progress
          </button>
        </div>
        <p className="description">
          The Fitness Challenges App is an interactive platform that allows users to set, join, and track fitness challenges with their friends. Users can create personalized fitness goals, track progress with dynamic visualizations, and engage with friends through leaderboards and challenge notifications
        </p>
      </div>
      <footer className="home-footer">
        @All Rights Reserved By Ag
      </footer>
    </div>
  );
};

export default Home;
