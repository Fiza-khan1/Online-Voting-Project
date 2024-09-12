import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';

function CurrentElection() {
  const [elections, setElections] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Adjust as needed

  useEffect(() => {
    const fetchElections = async () => {
      const token = localStorage.getItem('authToken');

      if (token) {
        setIsAuthenticated(true); // Set as authenticated if token exists
      } else {
        setIsAuthenticated(false); // Set as not authenticated if no token
      }

      try {
        const response = await fetch('http://127.0.0.1:8000/agendass/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(isAuthenticated && { 'Authorization': `Token ${token}` }), // Add token header if authenticated
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            setIsAuthenticated(false); // Handle unauthorized
            console.error('Unauthorized access. Please log in.');
            return;
          }
          throw new Error('Network response was not ok');
        }

        const data = await response.json();

        // Get today's date in YYYY-MM-DD format
        const today = new Date().toISOString().split('T')[0];

        // Filter elections to include only those whose start date is today or earlier
        // and end date is today or later
        const currentElections = data.filter(election => 
          new Date(election.start_date) <= new Date(today) &&
          new Date(election.end_date) >= new Date(today)
        );

        setElections(currentElections);
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };

    fetchElections();
  }, []); // Empty dependency array means this runs once on component mount

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Current Elections</h2>
      <Row className="g-4">
        {elections.length > 0 ? (
          elections.map((election) => (
            <Col md={6} lg={4} key={election.id}>
              <Card className="custom-card">
                <Card.Body>
                  <Card.Title>{election.name}</Card.Title>
                  <Card.Text>{election.description}</Card.Text>
                  <Card.Text><strong>Start Date:</strong> {new Date(election.start_date).toLocaleDateString()}</Card.Text>
                  <Card.Text><strong>End Date:</strong> {new Date(election.end_date).toLocaleDateString()}</Card.Text>
                  {/* Show different button based on authentication status */}
                  {isAuthenticated ? (
                    <Link to={`/vote/${election.id}`} className="btn btn-primary">Vote Now</Link>
                  ) : (
                    <Link to="/login" className="btn btn-primary">Login to Vote</Link>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col>
            <Card>
              <Card.Body>
                <Card.Text>No current elections available.</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>
    </Container>
  );
}

export default CurrentElection;
