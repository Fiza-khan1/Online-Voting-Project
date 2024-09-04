import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';

function CurrentElection() {
  const [elections, setElections] = useState([]);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const fetchElections = async () => {
      try {
        // Retrieve the token
        const token = localStorage.getItem('authToken');
        setToken(token);

        // Fetch data from API
        const response = await fetch('http://127.0.0.1:8000/agendas/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Network response was not ok: ${errorData.detail}`);
        }
        
        const data = await response.json();
        const today = new Date().toISOString().split('T')[0];
        const validElections = data.filter(election => new Date(election.end_date) >= new Date(today));

        setElections(validElections);
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error.message);
        setError(error.message);
      }
    };

    fetchElections();
  }, []);

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Current Elections</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <Row className="g-4">
        {elections.length > 0 ? (
          elections.map((election) => (
            <Col md={6} lg={4} key={election.id}>
              <Card className="custom-card">
                <Card.Body>
                  <Card.Title>{election.name}</Card.Title>
                  <Card.Text>{election.description}</Card.Text>
                  {token ? (
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
