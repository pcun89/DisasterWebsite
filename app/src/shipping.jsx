import React, { useState } from 'react';

const ShipmentStatusUpdate = ({ shipmentId }) => {
  const [shipmentDetails, setShipmentDetails] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const fetchShipmentDetails = async () => {
    try {
      const response = await fetch(`/api/shipments/${shipmentId}`);
      const data = await response.json();
      setShipmentDetails(data);
    } catch (error) {
      console.error('Error fetching shipment details:', error);
    }
  };

  const handleStatusUpdate = async () => {
    try {

      await fetch(`/api/shipments/${shipmentId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newStatus, notes }),
      });
      setUpdateSuccess(true);
    } catch (error) {
      console.error('Error updating shipment status:', error);
    }
  };

  useEffect(() => {
    fetchShipmentDetails();
  }, []);

  return (
    <div className="shipment-status-update">
      {shipmentDetails ? (
        <>
          <h2>Shipment Details</h2>
          <div>Shipment ID: {shipmentDetails.id}</div>
          <div>Description: {shipmentDetails.description}</div>
          <div>Quantity: {shipmentDetails.quantity}</div>
          {/* Other shipment details */}
          <h2>Update Status</h2>
          <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
            <option value="">Select Status</option>
            <option value="Preparing">Preparing</option>
            <option value="Shipped">Shipped</option>
            <option value="In Transit">In Transit</option>
            <option value="Delivered">Delivered</option>
          </select>
          <textarea
            placeholder="Enter notes..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          ></textarea>
          <button onClick={handleStatusUpdate}>Update Status</button>
          {updateSuccess && <p>Status updated successfully!</p>}
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ShipmentStatusUpdate;
