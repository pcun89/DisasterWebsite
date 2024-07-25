import React, { useState, useEffect} from 'react';
import './App.css';

function DonateMaintenance() {
    const IP = window.location.hostname;
    const [donationItems, setItems] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [editingDonationId, setEditingDonationId] = useState(null);
    const [editedDonationData, setEditedDonationData] = useState({
        donationTitle: '',
        donationDescription: '',
        donationQuantity: '',
        donationLocation: '',
        donationDonor: '',
        donationRecipient: '',
        eventItemsNeeded: ''
    });
    

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await fetch(`http://${IP}:5000/create-response-to-request`);
                const donationData = await response.json();
                setItems(donationData);
                console.log(donationData);
            } catch (error) {
                setErrorMessage('Failed to fetch donation items from backend');
            }
        }
        fetchItems();
    }, []);


    const handleEditClick = (donationId) => {
        setEditingDonationId(donationId);
        const donationToEdit = donationItems.find(donation => donation.donationID === donationId);
        setEditedDonationData(donationToEdit);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedDonationData({ ...editedDonationData, [name]: value });
    };

    const saveEditedDonation = async () => {
        try {
            await fetch(`http://${IP}:5000/edit-donation/${editingDonationId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editedDonationData),
            });
            const response = await fetch(`http://${IP}:5000/create-response-to-request`);
            const donationData = await response.json();
            setItems(donationData);
            alert('Donation edited successfully.');
            setEditingDonationId(null);
        } catch (error) {
            setErrorMessage('Failed to save donation');
        }
    };

    const deleteDonation = async (donationId) => {
        console.log('Deleting donation with ID:', donationId);
        try {
            const response = await fetch(`http://${IP}:5000/donate-maintenance/${donationId}`, {
            method: 'DELETE',
            });
            if (response.ok) {
                console.log('Donation deleted successfully.');
                setItems(donationItems.filter(donation => donation.id !== donationId));
                alert('Donation deleted successfully.');
            } else {
                console.error('Failed to delete donation:', response.status);
                setErrorMessage('Failed to delete donation');
            }
        } catch (error) {
            console.error('Error deleting donation:', error);
            setErrorMessage('Failed to delete donation');
        }
    };

    return (
        <div className = 'HomePage' >
            <h1>Donation Item Maintenance</h1>
                {errorMessage && <p>{errorMessage}</p>}
                <div className='table-scroll'>
                <table className= 'table'>
                <thead>
                    <tr>
                       <th>Donation Item(s)</th>
                       <th>Donation Description</th>
                       <th>Donation Quantity</th>
                       <th>Donation Location</th>
                       <th>Donation Donor</th>
                       <th>Donation Recipient</th>
                       <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                       {donationItems.map(donation => (
                        <tr key= {donation.id}>
                            <td>{editingDonationId === donation.donationID ? 
                                <input 
                                    type="text" 
                                    name="donationTitle" 
                                    value={editedDonationData.donationTitle} 
                                    onChange={handleInputChange} /> : donation.donationTitle}</td>
                            <td>{editingDonationId === donation.donationID ? 
                                <input 
                                    type="text" 
                                    name="donationDescription" 
                                    value={editedDonationData.donationDescription} 
                                    onChange={handleInputChange} /> : donation.donationDescription}</td>
                            <td>{editingDonationId === donation.donationID ? 
                                <input 
                                    type="text" 
                                    name="donationQuantity" 
                                    value={editedDonationData.donationQuantity} 
                                    onChange={handleInputChange} /> : donation.donationQuantity}</td>
                            <td>{editingDonationId === donation.donationID ? 
                                <input 
                                    type="text" 
                                    name="donationLocation" 
                                    value={editedDonationData.donationLocation} 
                                    onChange={handleInputChange} /> : donation.donationLocation}</td>
                            <td>{editingDonationId === donation.donationID ? 
                                <input 
                                    type="text" 
                                    name="donationDonor" 
                                    value={editedDonationData.donationDonor} 
                                    onChange={handleInputChange} /> : donation.donationDonor}</td>
                            <td>{editingDonationId === donation.donationID ? 
                                <input 
                                    type="text" 
                                    name="donationRecipient" 
                                    value={editedDonationData.donationRecipient} 
                                    onChange={handleInputChange} /> : donation.donationRecipient}</td>
                            <td>{editingDonationId === donation.donationID ? 
                                    <button className='button1' onClick={saveEditedDonation}>Save</button> : <button className='button1' onClick={() => handleEditClick(donation.donationID)}>Edit</button>}
                                    <button className='button1' onClick={() => deleteDonation(donation.donationID)}>Delete</button>
                            </td> 
                        </tr>
                       ))}
                    </tbody> 
                </table>
            </div>
        </div>
    )
   
}
export default DonateMaintenance;