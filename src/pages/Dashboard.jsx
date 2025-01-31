import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import axios from 'axios';
import './Dashboard.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      navigate('/login');
      return;
    }
    setUserData(user);
    fetchChallenges(user._id);
  }, [navigate]);

  const fetchChallenges = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/challenges/user/${userId}`);
      setChallenges(response.data);
    } catch (error) {
      console.error('Error fetching challenges:', error);
    }
  };

  const chartData = {
    labels: ['Challenger 1', 'Challenger 2', 'Challenger 3'],
    datasets: [
      {
        label: 'Series 1',
        data: [5, 8, 12],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Series 2',
        data: [7, 11, 15],
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'white'
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'white'
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          color: 'white'
        }
      }
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <h1>Welcome, {userData?.name}!</h1>
        
        <div className="stats-container">
          <div className="stat-item">
            <h3>Total Challenges Completed</h3>
            <p>{challenges.filter(c => c.completed).length}</p>
          </div>
          <div className="stat-item">
            <h3>Ongoing Challenges</h3>
            <p>{challenges.filter(c => !c.completed).length}</p>
          </div>
          <div className="stat-item">
            <h3>Win/Loss Ratio</h3>
            <p>Coming soon</p>
          </div>
        </div>

        <button 
          className="create-challenge-btn"
          onClick={() => navigate('/challenge')}
        >
          Create Challenge
        </button>

        <div className="leaderboard">
          <h2>Leaderboard</h2>
          <div className="chart-container">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
