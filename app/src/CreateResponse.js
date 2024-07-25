import React, { useState } from 'react';
import './form.css';

function CreateResponse() {
    const [donation, setDonation] = useState('');
    const [donationDescription, setDonationDescription] = useState('');
    const [donationQuantity, setDonationQuantity] = useState('');
    const [donationLocation, setDonationLocation] = useState('');
    const [donationDonor, setDonationDonor] = useState([]);
    const [donationRecipient, setDonationRecipient] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const IP = window.location.hostname;

    const handleSubmit = async () => {
        setErrorMessage('');
        const missingFields = [];
        if (!donation) missingFields.push('Donation Item(s)');
        if (!donationDescription) missingFields.push('Donation Description');
        if (!donationQuantity) missingFields.push('Donation Quantity');
        if (!donationLocation) missingFields.push('Where is donation shipping from?');
        if (!donationDonor) missingFields.push('Your Name (Donor)');
        if (!donationRecipient) missingFields.push('Recipient');
        
        if (missingFields.length > 0) {
            alert(`Please complete the following fields: ${missingFields.join(', ')}`);
            return;
        }

        const response = await fetch('http://' + IP + ':5000/create-response-to-request' ,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                donation,
                donationDescription,
                donationQuantity,
                donationLocation,
                donationDonor,
                donationRecipient
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
            <div className='Header'>
                <div className='Text'>Create Response to Request</div>
            </div>
            <div className='inputs'>
                <div className='input'>
                    <input type='text' placeholder='Donation Item(s)' value={donation} onChange={(e) => setDonation(e.target.value)}></input>
                </div>
                <div className='input'>
                    <input type='text' placeholder='Donation Description' value={donationDescription} onChange={(e) => setDonationDescription(e.target.value)} />
                </div>
                <div className='input'>
                    <input type='text' placeholder='Donation Quantity' value={donationQuantity} onChange={(e) => setDonationQuantity(e.target.value)} />
                </div>
                <div className='input'>
                    <input type='text' placeholder='Where is the donation shipping from?' value={donationLocation} onChange={(e) => setDonationLocation(e.target.value)} />
                </div>
                <div className='input'>
                    <input type='text' placeholder='Your name (donor)' value={donationDonor} onChange={(e) => setDonationDonor(e.target.value)} />
                </div>
                <div className='input'>
                    <input type='text' placeholder='Recipient' value={donationRecipient} onChange={(e) => setDonationRecipient(e.target.value)} />
                </div>
            </div>
            <div className='submit-container'>
                <div className='submit' onClick={handleSubmit}>Submit</div>
            </div>
        </div>
    )
}
export default CreateResponse;