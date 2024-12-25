import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './contestDetails.css';

const ContestDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contest, setContest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContestDetails = async () => {
      console.log('Fetching contest details...');
      try {
        const response = await axios.get('https://codeforces.com/api/contest.list');
        console.log('API Response:', response.data);
        if (response.data && response.data.result) {
          const contestData = response.data.result.find((c) => c.id === parseInt(id));
          console.log('Matching Contest:', contestData);
          if (contestData) {
            setContest(contestData);
          } else {
            setError('Contest not found.');
          }
        } else {
          setError('No data available from the API.');
        }
      } catch (err) {
        console.error('API Error:', err);
        setError('Failed to fetch contest details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchContestDetails();
  }, [id]);

  const handleBackClick = () => {
    navigate('/');
  };

  if (loading) {
    return(
      <div className="loaderContainer"><div className="loading-spinner"></div> </div>
     
    )
  }

  if (error) {
    return (
      <div>
        <p>{error}</p>
        <button onClick={handleBackClick}>Back to Contest List</button>
      </div>
    );
  }

  return (
    <div className="contest-details">
      <button onClick={handleBackClick} className="back-button">
        Back to Contest List
      </button>
      <h1>{contest.name}</h1>
      <p>
        <strong>Type:</strong> {contest.type}
      </p>
      <p>
        <strong>Phase:</strong> {contest.phase}
      </p>
      <p>
        <strong>Duration:</strong> {contest.durationSeconds / 3600} hours
      </p>
      <p>
        <strong>Start Time:</strong>{' '}
        {new Date(contest.startTimeSeconds * 1000).toLocaleString()}
      </p>
      <p>
        <strong>Relative Time:</strong> {contest.relativeTimeSeconds / 3600} hours ago
      </p>
      <p>
        <strong>Official Link:</strong>{' '}
        <a
          href={`https://codeforces.com/contest/${contest.id}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          View Contest on Codeforces
        </a>
      </p>
    </div>
  );
};

export default ContestDetails;
