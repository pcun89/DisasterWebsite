import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';


const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const response = await fetch('http://127.0.0.1:5000/checklogin');
      if (!response.ok) {
        console.error('Failed to check login status:', response.statusText);
        setError('Failed to fetch user data');
   
        return;
      }
      
      const data = await response.json();
      console.log('User data:', data.user);
      if (data.logged_in) {
        setUser(data.user);
      }
    };
    fetchUserData();
  }, []);



  if (!user || !user.role) {
    return window.location.href ="/login";
  }


  const options = [
    { name: 'Donation Item Maintenance', roles: ['Admin'], securityLevel: 'S1', path: '/donation-item-maintenance' },
    { name: 'Create Disaster Event', roles: ['Admin'], securityLevel: 'S2', path: '/create-disaster-event' },
    { name: 'Create Request for Donation', roles: ['Recipient'], securityLevel: 'S2', path: '/create-request' },
    { name: 'Make a Pledge 2 donate items', roles: ['Donor'], securityLevel: 'S2', path: '/make-pledge' },
    { name: 'Create Response to a Request', roles: ['Donor'], securityLevel: 'S2', path: '/create-response-to-request' },
    { name: 'Item Shipped Status Update', roles: ['Donor'], securityLevel: 'S3', path: '/item-shipped-status' },
    { name: 'Donor – Disaster association', roles: ['Donor'], securityLevel: 'S3', path: '/donor-disaster-association' },
    { name: 'Match Request-Response- Manual', roles: ['Admin'], securityLevel: 'S3', path: '/match-request-response-manual' },
    { name: 'Match Request-Response- Auto', roles: ['Admin'], securityLevel: 'S3', path: '/match-request-response-auto' },
  ];

  return (
    <div className="content-container">
      {options.map((option, index) => (
        option.roles.includes(user.role) ? (
          <Link to={option.path} key={index} style={{ textDecoration: 'none' }}>
            <div 
              className="box"
              style={{ 
                backgroundColor: 'white',
                color: 'black',
                cursor: 'pointer'
              }}
            >
              {option.name}
            </div>
          </Link>
        ) : (
          <div 
            key={index} 
            className="box disabled"
            style={{ 
              cursor: 'not-allowed',
              backgroundColor: '#f9f9f9',
              color: '#ccc'
            }}
          >
            {option.name}
          </div>
        )
      ))}
    </div>
  );
};

export default Dashboard;