import React from 'react';
import './App.css';
import { useNavigate } from 'react-router-dom';

function HomePage () {
    const navigate = useNavigate();
    return (
        <div className= 'HomePage'>
            <h1 className= 'HomeTitle'> Disaster Assistance Management System </h1>
            <button className = "button" data-testid= 'about_link' onClick={() => navigate('/about')}>
                About
            </button>
            <button className = "button" data-testid= 'view_disaster_link' onClick={() => navigate('/disaster-events-public')}>
                View Current Disasters
            </button>
        </div>
    )
}
export default HomePage;



