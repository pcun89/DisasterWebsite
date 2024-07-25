import React from 'react';
import { Link } from 'react-router-dom';
import './Nav.css'; 

function NavPanel() {
  return (
    <nav className= 'navPanel'>
        <ul className= 'navTitle'>
          <li><Link to='/' data-testid= 'home_link'> DAMS </Link></li></ul>
        
        <ul>
          <li><Link to= '/login' data-testid= 'login_link'> Login/Sign up </Link></li>
          <li><Link to= '/forgot-password' data-testid='forgotpassword_link'> Forgot Password </Link></li>
        </ul>
    </nav>
  );
}
export default NavPanel;