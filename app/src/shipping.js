import React, { useState, useEffect } from 'react';

const ShipmentStatusUpdate = ({ shipmentId }) => {
    const [shipmentDetails, setShipmentDetails] = useState(null);
    const [newStatus, setNewStatus] = useState('');
    const [notes, setNotes] = useState('');
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchShipmentDetails = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/shipments/${shipmentId}`);
            const data = await response.json();
            setShipmentDetails(data);
        } catch (error) {
            console.error('Error fetching shipment details:', error);
            setError('Failed to fetch shipment details');
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchShipmentDetails();
    }, [shipmentId]); 
    
    const handleStatusUpdate = async (e) => {
        e.preventDefault();
        try {
            await fetch(`/api/shipments/${shipmentId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ newStatus, notes }),
            });
            setUpdateSuccess(true);
        } catch (error) {
            console.error('Error updating shipment status:', error);
            setError('Failed to update shipment status');
        }
    };

    return (
        <div className="content-container">
            <header className="homepage-header">
                <h1>Update Shipment Status</h1>
            </header>
            <div>
                {isLoading ? (
                    <p>Loading shipment details...</p>
                ) : shipmentDetails ? (
                    <form onSubmit={handleStatusUpdate} className="donation-maintenance-form">
                        <div className="form-group">
                            <label className="form-label">Shipment ID:</label>
                            <input type="text" className="form-input" value={shipmentDetails.id} readOnly />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Description:</label>
                            <input type="text" className="form-input" value={shipmentDetails.description} readOnly />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Quantity:</label>
                            <input type="text" className="form-input" value={shipmentDetails.quantity} readOnly />
                        </div>
                        <div className="form-group">
                            <label className="form-label">New Status:</label>
                            <select className="form-input" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                                <option value="">Select Status</option>
                                <option value="Preparing">Preparing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="In Transit">In Transit</option>
                                <option value="Delivered">Delivered</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Notes:</label>
                            <textarea className="form-textarea" placeholder="Enter notes..." value={notes} onChange={(e) => setNotes(e.target.value)}></textarea>
                        </div>
                        <div className="form-group">
                            <button type="submit" className="form-button">Update Status</button>
                        </div>
                        {updateSuccess && <p className="success-message">Status updated successfully!</p>}
                        {error && <p className="error-message">{error}</p>}
                    </form>
                ) : (
                    <p>{error || "No shipment details available."}</p>
                )}
            </div>
        </div>
    );
};

export default ShipmentStatusUpdate;
