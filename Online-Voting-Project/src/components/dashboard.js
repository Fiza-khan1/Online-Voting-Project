import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './CssFolder/Dashboard.css'; // Your custom CSS

function Home() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [username, setUsername] = useState('');

  useEffect(() => {
    const fetchProfileData = async () => {
      const token = localStorage.getItem('authToken'); // Retrieve token from localStorage
  
      try {
        const response = await fetch('http://127.0.0.1:8000/profile/', {
          headers: {
            'Authorization': `Token ${token}`, // Include token in request headers
          },
        });
  
        if (response.ok) {
          const profileData = await response.json();
          console.log('Fetched profile data:', profileData);
          setUser(profileData);
          setFormData(profileData);
  
          // Store user's name and superuser status in localStorage and state
          localStorage.setItem('username', profileData.username);
          localStorage.setItem('is_superuser', profileData.is_superuser);  // Store superuser status
          setUsername(profileData.username);
        } else {
          console.error('Failed to fetch profile:', await response.json());
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
  
    fetchProfileData();
  }, []);
  
  return (
    <Container className="mt-4 custom-container">
      <h1 className="text-center mb-3 custom-heading">Welcome to the Voting System</h1>

    
   
          {localStorage.getItem('is_superuser') === 'true' && ( 
          
                 <Row className="mb-3 custom-row admin-row"> 
            <Col>
              <h2 className="row-heading">Create Agenda (Admin Access Only)</h2>
              <p>Create and manage voting agendas for the platform.</p>
              <a href="/agendas" className="btn custom-btn">Create Agenda</a>
            </Col>
            </Row>
          )}
    

        <Row className="mb-3 custom-row election-row">
          <Col md={6}>
            <h2 className="row-heading">Current Elections</h2>
            <p>Stay updated with the current elections and make sure you are prepared to vote.</p>
            <a href="/current-elections" className="btn custom-btn">View Current Elections</a>
          </Col>
          <Col md={6}>
            <h2 className="row-heading">Upcoming Elections</h2>
            <p>Explore the upcoming voting sessions and make your voice heard.</p>
            <a href="/upcoming" className="btn custom-btn">View Upcoming Elections</a>
          </Col>
        </Row>

        <Row className="mb-3 custom-row result-row">
          <Col>
            <h2 className="row-heading">Results & Analytics</h2>
            <p>Check out the results from previous votes and analyze the data.</p>
            <a href="/results" className="btn custom-btn">View Results</a>
          </Col>
        </Row>
 
    </Container>
  );
}

export default Home;
