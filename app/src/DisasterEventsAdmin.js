import React, { useState, useEffect } from 'react';
import './App.css';

function DisasterEventsAdmin() {
    const IP = window.location.hostname;
    const [disasterEvents, setEvents] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [editingEventId, setEditingEventId] = useState(null);
    const [editedEventData, setEditedEventData] = useState({
        eventTitle: '',
        eventType: '',
        eventLocation: '',
        eventDescription: '',
        eventAssistanceNeeded: '',
        eventItemsNeeded: ''
    });
    

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch(`http://${IP}:5000/create-disaster-events`);
                const eventData = await response.json();
                setEvents(eventData);
            } catch (error) {
                setErrorMessage('Failed to fetch disaster events from backend');
            }
        }
        fetchEvents();
    }, []);

    const handleEditClick = (eventId) => {
        setEditingEventId(eventId);
        const eventToEdit = disasterEvents.find(event => event.eventID === eventId);
        setEditedEventData(eventToEdit);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedEventData({ ...editedEventData, [name]: value });
    };

    const saveEditedEvent = async () => {
        try {
            await fetch(`http://${IP}:5000/edit-event/${editingEventId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editedEventData),
            });
            const response = await fetch(`http://${IP}:5000/create-disaster-events`);
            const eventData = await response.json();
            setEvents(eventData);
            alert('Event edited successfully.');
            setEditingEventId(null);
        } catch (error) {
            setErrorMessage('Failed to save event');
        }
    };

    const deleteEvent = async (eventId) => {
        console.log('Deleting event with ID:', eventId);
        try {
            const response = await fetch(`http://${IP}:5000/disaster-events-admin/${eventId}`, {
            method: 'DELETE',
            });
            if (response.ok) {
                console.log('Event deleted successfully.');
                setEvents(disasterEvents.filter(event => event.id !== eventId));
                alert('Event deleted successfully.');
            } else {
                console.error('Failed to delete event:', response.status);
                setErrorMessage('Failed to delete event');
            }
        } catch (error) {
            console.error('Error deleting event:', error);
            setErrorMessage('Failed to delete event');
        }
    };

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
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {disasterEvents.map(event => (
                            <tr key={event.eventID}>
                                <td>{editingEventId === event.eventID ? 
                                    <input 
                                        type="text" 
                                        name="eventTitle" 
                                        value={editedEventData.eventTitle} 
                                        onChange={handleInputChange} /> : event.eventTitle}</td>
                                <td>{editingEventId === event.eventID ? 
                                    <input 
                                        type="text" 
                                        name="eventType" 
                                        value={editedEventData.eventType} 
                                        onChange={handleInputChange} /> : event.eventType}</td>
                                <td>{editingEventId === event.eventID ? 
                                    <input 
                                        type="text" 
                                        name="eventLocation" 
                                        value={editedEventData.eventLocation} 
                                        onChange={handleInputChange} /> : event.eventLocation}</td>
                                <td>{editingEventId === event.eventID ? 
                                    <input 
                                        type="text" 
                                        name="eventDescription" 
                                        value={editedEventData.eventDescription} 
                                        onChange={handleInputChange} /> : event.eventDescription}</td>
                                <td>{editingEventId === event.eventID ? 
                                    <input 
                                        type="text" 
                                        name="eventAssistanceNeeded" 
                                        value={editedEventData.eventAssistanceNeeded} 
                                        onChange={handleInputChange} /> : event.eventAssistanceNeeded}</td>
                                <td>{editingEventId === event.eventID ? 
                                    <input 
                                        type="text" 
                                        name="eventItemsNeeded" 
                                        value={editedEventData.eventItemsNeeded} 
                                        onChange={handleInputChange} /> : event.eventItemsNeeded}</td>
                                <td>{editingEventId === event.eventID ? 
                                    <button className='button1' onClick={saveEditedEvent}>Save</button> : <button className='button1' onClick={() => handleEditClick(event.eventID)}>Edit</button>}
                                    <button className='button1' onClick={() => deleteEvent(event.eventID)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default DisasterEventsAdmin;