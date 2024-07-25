import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/PassWord-reset', { email });
            setMessage('Check your email for further instructions'); // handle success
            setError(''); // clear any previous errors
        } catch (error) {
            setError(error.response && error.response.data ? error.response.data : 'An error occurred while resetting the password'); // handle error
            setMessage(''); // clear any previous messages
        }
    };

    return (
        <div className='HomePage'>
            <h1>Forgot Password</h1>
            <form onSubmit={handleSubmit}>
                <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} required />
                <button type='submit'>Reset Password</button>
            </form>
            {message && <p>{message}</p>}
            {error && <p>{error}</p>}
        </div>
    );
}

export default ForgotPassword;