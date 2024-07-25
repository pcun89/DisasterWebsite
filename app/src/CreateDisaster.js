import React, { useState } from 'react';
import './form.css';

function CreateDisaster() {
    const [event, setEvent] = useState('');
    const [eventType, setEventType] = useState('');
    const [eventLocation, setEventLocation] = useState('');
    const [eventDescription, setEventDescription] = useState('');
    const [eventAssistanceNeeded, setEventAssistanceNeeded] = useState([]);
    const [eventItemsNeeded, setEventItemsNeeded] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const IP = window.location.hostname;
 
    const handleSubmit = async () => {
        setErrorMessage('');
        const missingFields = [];
        if (!event) missingFields.push('Event');
        if (!eventType) missingFields.push('Event Type');
        if (!eventLocation) missingFields.push('Event Location');
        if (!eventDescription) missingFields.push('Event Description');
        if (!eventAssistanceNeeded) missingFields.push('Assistance Needed');
        if (!eventItemsNeeded) missingFields.push('Items Needed');
        
        if (missingFields.length > 0) {
            alert(`Please complete the following fields: ${missingFields.join(', ')}`);
            return;
        }

        const response = await fetch('http://' + IP + ':5000/create-disaster-event' ,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                event,
                eventType,
                eventLocation,
                eventDescription,
                eventAssistanceNeeded,
                eventItemsNeeded
            }),
        });
        const data = await response.json();
        if (!response.ok) {
            setErrorMessage(data.message);
        } else {
            alert(data.message);
        }
    };
    
    return (
        <div className='container1'>
            <div className='header'>
                <div className='header-text'>Create Disaster Event</div>
            </div>
            <div className='inputs'>
                <div className='input'>
                    <input type='text' 
                        placeholder='Event Title' 
                        value={event} onChange={(e) => setEvent(e.target.value)}></input>
                </div>
                <div className='input'>
                    <select value={eventType} onChange={(e) => setEventType(e.target.value)}>
                        <option value=''>Select Event Type</option>
                        <option value='Flood'>Flood</option>
                        <option value='Hurricane'>Hurricane</option>
                        <option value='Tsunami'>Tsunami</option>
                        <option value='Tornado'>Tornado</option>
                        <option value='Earthquake'>Earthquake</option>
                        <option value='Other'>Other</option>
                    </select>
                </div>
                <div className='input'>
                    <input 
                        type='text' 
                        placeholder='Event Location' 
                        value={eventLocation} 
                        onChange={(e) => setEventLocation(e.target.value)} />
                </div>
                <div className='input'>
                    <input 
                        type='text' 
                        placeholder='Event Description' 
                        value={eventDescription} onChange={(e) => setEventDescription(e.target.value)} />
                </div>
                <div className='input'>
                    <input type='text' 
                        placeholder='Assistance Needed' 
                        value={eventAssistanceNeeded} onChange={(e) => setEventAssistanceNeeded(e.target.value)} />
                </div>
                <div className='input'>
                    <input type='text' 
                        placeholder='Items Needed' 
                        value={eventItemsNeeded} onChange={(e) => setEventItemsNeeded(e.target.value)} />
                </div>
            </div>
            <div className='submit-container'>
                <div className='submit' onClick={handleSubmit}>Submit</div>
            </div>
        </div>
    )
}
export default CreateDisaster;