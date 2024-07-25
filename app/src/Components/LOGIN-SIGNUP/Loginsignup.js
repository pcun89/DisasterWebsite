import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './loginsignup.css';
import email_icon from '../Assets/email.png';
import user_icon from '../Assets/person.png';
import password_icon from '../Assets/password.png';

const Loginform = () => {
    const navigate = useNavigate();
    const [action, setAction] = useState("Sign Up");
    const [username, setUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("");
    const [errorMessage, setErrorMessage] = useState(""); 

    
    const isValidEmail = email => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const handleSignUp = async () => {
        setErrorMessage(""); 
        const missingFields = [];
        if (!username) missingFields.push('Username');
        if (!firstName) missingFields.push('First Name');
        if (!lastName) missingFields.push('Last Name');
        if (!email) missingFields.push('Email');
        else if (!isValidEmail(email)) missingFields.push('Valid Email'); 
        if (!password) missingFields.push('Password');
        if (!confirmPassword) missingFields.push('Confirm Password');
        if (password !== confirmPassword) missingFields.push('Matching Passwords');
        if (!role) missingFields.push('Role');

        if (missingFields.length > 0) {
            alert(`Please complete the following fields: ${missingFields.join(', ')}`);
            return;
        }

        const response = await fetch('http://127.0.0.1:5000/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, firstName, lastName, email, password, role }),
        });
        const data = await response.json();
        if (!response.ok) {
            setErrorMessage(data.message);
        } else {
            alert(data.message); 
        }
    };

    const handleLogin = async () => {
        setErrorMessage(''); 
        const missingFields = [];
        if (!email) missingFields.push('Email');
        else if (!isValidEmail(email)) missingFields.push('Valid Email'); 
        if (!password) missingFields.push('Password');

        if (missingFields.length > 0) {
            alert(`Please complete the following fields: ${missingFields.join(', ')}`);
            return;
        }
        const response = await fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });
        const data = await response.json();
        if (!response.ok) {
            setErrorMessage(data.message);
            alert(data.message);
        } else {
            alert(data.message);
            window.location.href = '/dashboard';
        }
    };

    const handleSubmit = () => {
        if (action === "Sign Up") {
            handleSignUp();
        } else {
            handleLogin();
        }
    };

    const toggleAction = () => {
        setAction(prevAction => prevAction === "Sign Up" ? "Login" : "Sign Up");
        setErrorMessage(""); 
    };

    return (
        <div className='container1'>
            <div className="Header">
                <div className="Text">{action}</div>
            </div>
            <div className="inputs">
                {action === "Sign Up" && (
                    <>
                        <div className="input">
                            <img src={user_icon} alt="user icon" />
                            <input type="text" placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)} />
                        </div>
                        <div className="input">
                            <img src={user_icon} alt="user icon" />
                            <input type="text" placeholder='First Name' value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                        </div>
                        <div className="input">
                            <img src={user_icon} alt="user icon" />
                            <input type="text" placeholder='Last Name' value={lastName} onChange={(e) => setLastName(e.target.value)} />
                        </div>
                    </>
                )}
                <div className="input">
                    <img src={email_icon} alt="email icon" />
                    <input type="email" placeholder='Email Id' value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="input">
                    <img src={password_icon} alt="password icon" />
                    <input type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                {action === "Sign Up" && (
                    <>
                        <div className="input">
                            <img src={password_icon} alt="password icon" />
                            <input type="password" placeholder='Confirm Password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                        </div>
                        <div className="input">
                            <select value={role} onChange={(e) => setRole(e.target.value)}>
                                <option value="">Select Role</option>
                                <option value="donor">Donor</option>
                                <option value="recipient">Recipient</option>
                            </select>
                        </div>
                    </>
                )}
                {action === "Login" && (
                    <div className="forgot-password">Forgot Password? <span onClick={() => navigate('/forgot-password')}>Click Here!</span></div>
                )}
            </div>
            <div className="error-message">{errorMessage}</div> 
            {action === "Login" ? 
                <div className="account-change">Don't have an account? <span onClick={toggleAction}>Sign Up</span></div> : 
                <div className="account-change">Already have an account? <span onClick={toggleAction}>Login</span></div>
            }
            <div className="submit-container">
                {action === "Sign Up" ? (
                    <div className="submit" onClick={handleSubmit}>Sign Up</div>
                ) : (
                    <div className="submit" onClick={handleSubmit}>Login</div>
                )}
            </div>
        </div>
    );
};

export default Loginform;
