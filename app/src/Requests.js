import React, { useState, useEffect} from 'react';
import './App.css';

function Requests() {
    const IP = window.location.hostname;
    const [requestItems, setItems] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await fetch(`http://${IP}:5000/create-request`);
                const requestData = await response.json();
                if (Array.isArray(requestData) && requestData.length === 1) {
                    const innerArray = requestData[0];
                    setItems(innerArray);
                } else {
                    setErrorMessage('Invalid data received from backend');
                }
            } catch (error) {
                setErrorMessage('Failed to fetch requests from backend');
            }
        };
        fetchRequests();
    }, []);

    return (
        <div className='HomePage'>
            <h1>Requests</h1>
            {errorMessage && <p>{errorMessage}</p>}
            <div className='table-scroll'>
                <table className='table'>
                    <thead>
                        <tr>
                            <th>Request Title</th>
                            <th>Description</th>
                            <th>Category</th>
                            <th>Quantity Needed</th>
                            <th>Urgency</th>
                            <th>Location</th>
                            <th>Contact Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Preferred Contact Method</th>
                            <th>Deadline</th>
                            <th>Instructions for Donors</th>
                            <th>Additional Comments</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requestItems.map(request => (
                            <tr key={request.id}>
                            <td>{request.title}</td>
                            <td>{request.description}</td>
                            <td>{request.category}</td>
                            <td>{request.quantity}</td>
                            <td>{request.urgency}</td>
                            <td>{request.location}</td>
                            <td>{request.contact}</td>
                            <td>{request.email}</td>
                            <td>{request.phone}</td>
                            <td>{request.preferred}</td>
                            <td>{request.deadline}</td>
                            <td>{request.instructions}</td>
                            <td>{request.additional}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Requests;