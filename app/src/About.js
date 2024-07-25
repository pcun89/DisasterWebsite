import React from 'react';
import './App.css';

function About() {
    return(
        <div className= 'HomePage'>
            <h1>
                About
            </h1>
            <p className= 'para'> DAMS (Disaster Assistance Managment Systems) is an online System
                that allows users to donate and request items. It is meant to provide
                relief and assistance in disaster areas. <br></br>

                This webpage module is created by Team 8 - Amy, Phillipp, Sai. <br></br>

                You can click to view current disasters or request for a current disaster to be displayed.
                This request will be viewed by an admin and will get published if approved.
                In order to donate or request, you will need to create an account.
            
            </p>
        </div>
    )
}
export default About;