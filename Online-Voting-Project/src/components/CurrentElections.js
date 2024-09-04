import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Import the useAuth hook

function CurrentElection() {
  const { isAuthenticated, token } = useAuth(); // Get the authentication status and token from context

  const [elections, setElections] = useState([]);

  useEffect(() => {
    // Replace with your actual data fetching logic
    const fetchElections = async () => {
      try {
        // Fetch data from your API
        const response = await fetch('http://127.0.0.1:8000/agendas/', {
          method: 'GET',
          headers: {
            'Authorization': `Token ${token}`, // Include token in request headers
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();

        // Get today's date in YYYY-MM-DD format
        const today = new Date().toISOString().split('T')[0];

        // Filter elections to include only those whose end date is today or later
        const validElections = data.filter(election => new Date(election.end_date) >= new Date(today));

        setElections(validElections);
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
      }
    };

    fetchElections();
  }, [token]); // Include token in dependency array to re-fetch if token changes

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
                <Card.Text>No upcoming elections available.</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>
    </Container>
  );
}

export default CurrentElection;
