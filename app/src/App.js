import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Loginform from './Components/LOGIN-SIGNUP/Loginsignup';
import ForgotPassword from './ForgotPassword';
import HomePage from './HomePage';
import NavPanel from './NavigationPanel';
import About from './About';
import DonateMaintenance from './DonationMaintenance';
import CreateDisaster from './CreateDisaster';
import DisasterEventsAdmin from './DisasterEventsAdmin';
import DisasterEventsPublic from './DisasterEventsPublic';
import CreateResponse from './CreateResponse';
import CreateRequestForDonation from './CreateRequestfordonation';
import MakePledge from './MakePledge';
import Dashboard from './dashboard';
import ManualMatch from './ManualMatch';
import Requests from './Requests';

function App() {
  return (
    <Router>
      <NavPanel />
        <Routes>
          <Route path= '/' element={<HomePage />} />
          <Route path= '/login' element={<Loginform />} />
          <Route path= '/forgot-password' element={<ForgotPassword />} />
          <Route path= '/about' element={<About />} />
          <Route path= '/donate-maintenance' element={<DonateMaintenance />} />
          <Route path= '/create-disaster-event' element={<CreateDisaster />} />
          <Route path= '/disaster-events-admin' element={<DisasterEventsAdmin />} />
          <Route path= '/disaster-events-public' element={<DisasterEventsPublic />} />
          <Route path= '/create-response-to-request' element={<CreateResponse />} />
          <Route path= '/create-request' element={<CreateRequestForDonation />} />
          <Route path= '/make-pledge' element={<MakePledge />} />
          <Route path= '/dashboard' element={<Dashboard />} />
          <Route path= '/manual-match' element={<ManualMatch />} />
          <Route path= '/requests' element={<Requests />} />
        </Routes>
    </Router>
  );
}
export default App;
