import React from 'react';
import '../App.css';
import spinner from '../img/Walk.gif';


const LoadingSpinner = () => {
  return (
    <div className="loading-spinner">
      <img src={spinner} alt="Loading..." />
    </div>
  );
};

export default LoadingSpinner;
