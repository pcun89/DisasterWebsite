import React, { useState } from 'react';

function CreateRequestForDonation() {
  const [requestData, setRequestData] = useState({
    title: '',
    description: '',
    category: '',
    quantityNeeded: '',
    urgency: '',
    location: '',
    contactName: '',
    email: '',
    phone: '',
    preferredContactMethod: 'email',
    deadline: '',
    instructionsForDonors: '',
    additionalComments: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
  
    if (name === 'title' || name === 'contactName') {
      const re = /^[A-Za-z ]*$/; 
      if (value === '' || re.test(value)) {
        setRequestData(prevData => ({
            ...prevData,
            [name]: value
        }));
      }
    } 

    else if (name === 'quantityNeeded') {
      const num = parseInt(value, 10);
      if (!isNaN(num) && num >= 0) {
        setRequestData(prevData => ({
            ...prevData,
            [name]: value
        }));
      }
    }
  
    else if (name === 'phone') {
      const re = /^[0-9+-]*$/; 
      if (value === '' || re.test(value)) {
        setRequestData(prevData => ({
            ...prevData,
            [name]: value
        }));
      }
    } else {
      setRequestData(prevData => ({
          ...prevData,
          [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/create-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.message);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while processing your request.');
    }
  };

return (
    <div>
      <div className="content-container">
        <h2 className="form-title">Create Request for Donation</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Title:</label>
            <input type="text" className="form-input" name="title" value={requestData.title} onChange={handleChange} pattern="[A-Za-z ]*" title="Only letters and spaces are allowed" />
          </div>
          <div className="form-group">
            <label className="form-label">Description:</label>
            <textarea className="form-textarea" name="description" value={requestData.description} onChange={handleChange}></textarea>
          </div>
          <div className="form-group">
            <label className="form-label">Category:</label>
            <select className="form-input" name="category" value={requestData.category} onChange={handleChange}>
              <option value="">Select Category</option>
              <option value="food">Food</option>
              <option value="shelter">Shelter</option>
              <option value="medical">Medical Supplies</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Quantity Needed:</label>
            <input type="number" className="form-input" name="quantityNeeded" min="0" value={requestData.quantityNeeded} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Urgency Level:</label>
            <select className="form-input" name="urgency" value={requestData.urgency} onChange={handleChange}>
              <option value="">Select Urgency</option>
              <option value="immediate">Immediate</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Location:</label>
            <input type="text" className="form-input" name="location" value={requestData.location} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Contact Name:</label>
            <input type="text" className="form-input" name="contactName" value={requestData.contactName} onChange={handleChange} pattern="[A-Za-z ]*" title="Only letters and spaces are allowed" />
          </div>
          <div className="form-group">
            <label className="form-label">Email:</label>
            <input type="email" className="form-input" name="email" value={requestData.email} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Phone:</label>
            <input type="tel" className="form-input" name="phone" value={requestData.phone} onChange={handleChange} pattern="[0-9]*" title="Only numeric values are allowed" />
          </div>
          <div className="form-group">
            <label className="form-label">Preferred Contact Method:</label>
            <select className="form-input" name="preferredContactMethod" value={requestData.preferredContactMethod} onChange={handleChange}>
              <option value="">Select Preferred Contact Method</option>
              <option value="email">Email</option>
              <option value="phone">Phone</option>
              <option value="mail">Mail</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Deadline:</label>
            <input type="date" className="form-input" name="deadline" value={requestData.deadline} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Instructions for Donors:</label>
            <textarea className="form-textarea" name="instructionsForDonors" value={requestData.instructionsForDonors} onChange={handleChange}></textarea>
          </div>
          <div className="form-group">
            <label className="form-label">Additional Comments:</label>
            <textarea className="form-textarea" name="additionalComments" value={requestData.additionalComments} onChange={handleChange}></textarea>
          </div>
          <div className="form-group">
            <button type="submit" className="form-button">Submit Request</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateRequestForDonation;