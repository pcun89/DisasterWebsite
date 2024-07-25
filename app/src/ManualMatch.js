import React, { useState, useEffect } from 'react';
import './form.css';

function ManualMatch() {
    const [request, setRequest] = useState('');
    const [response1, setResponse] = useState('');
    const [error, setErrorMessage] = useState('');
    const IP = window.location.hostname;

    const handleSubmit = async () => {
        setErrorMessage('');
        const missingFields = [];
        if (!request) missingFields.push('Request ID');
        if (!response1) missingFields.push('Response ID');

        if (missingFields.length > 0) {
            alert(`Please complete the following fields: ${missingFields.join(', ')}`);
            return;
        }
        
        const response = await fetch(`http://${IP}:5000/manual-match`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                request,
                response1
            }),
        });
        const data = await response.json();
        if (!response.ok) {
            setErrorMessage(error.message);
        } else {
            alert(data.message);
        }
    };

    return (
      <div className='container1'>
          <div className='header'>
              <div className='header-text'>Manual Match</div>
          </div>
          <div className='inputs'>
              <div className='input'>
                  <input type='text' 
                      placeholder='Request ID' 
                      value={request} onChange={(e) => setRequest(e.target.value)}></input>
              </div>
              <div className='input'>
                  <input 
                      type='text' 
                      placeholder='Response ID' 
                      value={response1} onChange={(e) => setResponse(e.target.value)} />
              </div>
              
          </div>
          <div className='submit-container'>
              <div className='submit' onClick={handleSubmit}>Match</div>
          </div>
      </div>
  )
}
export default ManualMatch;