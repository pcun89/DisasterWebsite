import React, { useState } from 'react';
import axios from 'axios';
import SubPageNav from './SubPageNav'; 

function MakePledge() {
    const [pledge, setPledge] = useState({
        pledgeType: '',
        amount: '',
        supplies: '',
        services: '',
        disasterType: '',
        region: '',
        name: '',
        email: '',
        phone: '',
        address: '',
        preferredContactMethod: 'email',
        anonymity: false,
        recurring: false,
        comments: ''
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        if (name === 'name') {
            const re = /^[A-Za-z ]*$/; 
            if (value === '' || re.test(value)) {
                setPledge(prevPledge => ({
                    ...prevPledge,
                    [name]: value
                }));
            }
        } else if (name === 'phone') {
            const re = /^[0-9+-]*$/; 
            if (value === '' || re.test(value)) {
                setPledge(prevPledge => ({
                    ...prevPledge,
                    [name]: value
                }));
            }
        } else {
            setPledge(prevPledge => ({
                ...prevPledge,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            
            const response = await axios.post('http://localhost:5000/make-pledge', pledge);
            console.log(response.data); // Log response data
            alert('Pledge submitted successfully');
            
        } catch (error) {
            console.error('Error submitting pledge:', error);
            alert('An error occurred while submitting the pledge');
        }
    };

    return (
        <div>
            <SubPageNav />
            <div className="content-container">
                <h2 className="form-title">Make a Pledge</h2>
                <form onSubmit={handleSubmit}>
                    {/* Pledge Type */}
                    <div className="form-group">
                        <label className="form-label">Pledge Type:</label>
                        <select name="pledgeType" value={pledge.pledgeType} onChange={handleChange} className="form-input">
                            <option value="">Select Type</option>
                            <option value="monetary">Monetary</option>
                            <option value="supplies">Supplies</option>
                            <option value="services">Services</option>
                        </select>
                    </div>

                    {/* Amount (if monetary) */}
                    {pledge.pledgeType === 'monetary' && (
                        <div className="form-group">
                            <label className="form-label">Amount:</label>
                            <input type="number" name="amount" value={pledge.amount} onChange={handleChange} className="form-input" />
                        </div>
                    )}

                    {/* Supplies (if supplies) */}
                    {pledge.pledgeType === 'supplies' && (
                        <div className="form-group">
                            <label className="form-label">Supplies:</label>
                            <input type="text" name="supplies" value={pledge.supplies} onChange={handleChange} className="form-input" placeholder="List of supplies" />
                        </div>
                    )}

                    {/* Services (if services) */}
                    {pledge.pledgeType === 'services' && (
                        <div className="form-group">
                            <label className="form-label">Services:</label>
                            <textarea name="services" value={pledge.services} onChange={handleChange} className="form-textarea" placeholder="Describe the services you are offering"></textarea>
                        </div>
                    )}

                    {/* Disaster Type */}
                    <div className="form-group">
                        <label className="form-label">Disaster Type:</label>
                        <select name="disasterType" value={pledge.disasterType} onChange={handleChange} className="form-input">
                            <option value="">Select Disaster</option>
                            <option value="hurricane">Hurricane</option>
                            <option value="earthquake">Earthquake</option>
                            {/* ... other options ... */}
                        </select>
                    </div>

                    {/* Region */}
                    <div className="form-group">
                        <label className="form-label">Region:</label>
                        <input type="text" name="region" value={pledge.region} onChange={handleChange} className="form-input" placeholder="Region you wish to support" />
                    </div>

                    {/* Name/Organization */}
                    <div className="form-group">
                        <label className="form-label">Name/Organization:</label>
                        <input type="text" name="name" value={pledge.name} onChange={handleChange} className="form-input" />
                    </div>

                    {/* Contact Information */}
                    <div className="form-group">
                        <label className="form-label">Email:</label>
                        <input type="email" name="email" value={pledge.email} onChange={handleChange} className="form-input" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Phone:</label>
                        <input type="tel" name="phone" value={pledge.phone} onChange={handleChange} className="form-input" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Address:</label>
                        <input type="text" name="address" value={pledge.address} onChange={handleChange} className="form-input" placeholder="Your address" />
                    </div>

                    {/* Preferred Contact Method */}
                    <div className="form-group">
                        <label className="form-label">Preferred Contact Method:</label>
                        <select name="preferredContactMethod" value={pledge.preferredContactMethod} onChange={handleChange} className="form-input">
                            <option value="email">Email</option>
                            <option value="phone">Phone</option>
                            <option value="mail">Mail</option>
                        </select>
                    </div>

                    {/* Anonymity */}
                    <div className="form-group">
                        <label className="form-label">
                            <input type="checkbox" name="anonymity" checked={pledge.anonymity} onChange={handleChange} />
                            I wish to remain anonymous
                        </label>
                    </div>

                    {/* Recurring Pledge */}
                    <div className="form-group">
                        <label className="form-label">
                            <input type="checkbox" name="recurring" checked={pledge.recurring} onChange={handleChange} />
                            Make this a recurring pledge
                        </label>
                    </div>

                    {/* Comments */}
                    <div className="form-group">
                        <label className="form-label">Comments:</label>
                        <textarea name="comments" value={pledge.comments} onChange={handleChange} className="form-textarea"></textarea>
                    </div>

                    {/* Submit Button */}
                    <div className="form-group">
                        <button type="submit" className="form-button">Submit Pledge</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default MakePledge;