import React, { useState, useEffect } from 'react';
import './App.css';

function DisasterEvents() {
    const [disasterEvents, setEvents] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const IP = window.location.hostname;

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch('http://' + IP + ':5000/create-disaster-events');
                const eventData = await response.json();
                setEvents(eventData);
            } catch (error) {
                setErrorMessage('Failed to fetch disaster events from backend');
            }
        }
        fetchEvents();
    }, []);


    return (
        <div className='HomePage'>
            <h1>Disaster Events</h1>
            {errorMessage && <p>{errorMessage}</p>}
            <div className='table-scroll'>
                <table className='table'>
                    <thead>
                        <tr>
                            <th>Event Title</th>
                            <th>Event Type</th>
                            <th>Event Location</th>
                            <th>Event Description</th>
                            <th>Event Assistance Needed</th>
                            <th>Event Items Needed</th>
                        </tr>
                    </thead>
                    <tbody>
                        {disasterEvents.map(event => (
                            <tr key={event.id}>
                                <td>{event.eventTitle}</td>
                                <td>{event.eventType}</td>
                                <td>{event.eventLocation}</td>
                                <td>{event.eventDescription}</td>
                                <td>{event.eventAssistanceNeeded}</td>
                                <td>{event.eventItemsNeeded}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
export default DisasterEvents;