import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';

function UpcomingElection() {
  const [elections, setElections] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Adjust as needed

  useEffect(() => {
    const fetchElections = async () => {
      const token = localStorage.getItem('authToken');

      if (!token) {
        console.error('No token found');
        setIsAuthenticated(false); // Set as not authenticated if no token
        return;
      }

      try {
        const response = await fetch('http://127.0.0.1:8000/agendas/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
          },
        });

        if (!response.ok) {
          // Handle unauthorized status or any other error
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

        // Filter elections to include only those whose start date is in the future
        const upcomingElections = data.filter(election => new Date(election.start_date) > new Date(today));

        setElections(upcomingElections);
        setIsAuthenticated(true); // Set as authenticated
      } catch (error) {
        console.error('Fetch error:', error);
        setIsAuthenticated(false); // Set as not authenticated in case of error
      }
    };

    fetchElections();
  }, []); // Empty dependency array means this runs once on component mount

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Upcoming Elections</h2>
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
                  {isAuthenticated ? (
                    <Link to={`/voting/${election.id}`} className="btn btn-primary">Vote Details</Link>
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
                <Card.Text>No upcoming elections available.</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>
    </Container>
  );
}

export default UpcomingElection;
