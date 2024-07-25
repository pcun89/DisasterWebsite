import React from 'react';
import { Link } from 'react-router-dom';
import { AiFillHome } from "react-icons/ai"; 
import './App1.css'; 

function SubPageNav() {
  return (
    <div className="subpage-nav">
      <Link to="/" className="home-button">
        <AiFillHome /> Home 
      </Link>
    </div>
  );
}

export default SubPageNav;
