import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Import the useAuth hook

function CurrentElection() {
  const { isAuthenticated } = useAuth(); // Get the authentication status from context

  // Dummy data for upcoming elections
  const [elections, setElections] = useState([]);

  useEffect(() => {
    // Replace with your data fetching logic
    const fetchElections = () => {
      setElections([
        { id: 1, title: 'Election 1', description: 'Details about Election 1' },
        { id: 2, title: 'Election 2', description: 'Details about Election 2' },
        { id: 3, title: 'Election 3', description: 'Details about Election 3' },
      ]);
    };

    fetchElections();
  }, []);

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Current Elections</h2>
      <Row className="g-4">
        {elections.map((election) => (
          <Col md={6} lg={4} key={election.id}>
            <Card className="custom-card">
              <Card.Body>
                <Card.Title>{election.title}</Card.Title>
                <Card.Text>{election.description}</Card.Text>
                {isAuthenticated ? (
                  <Link to={`/vote/${election.id}`} className="btn btn-primary">Vote Now</Link>
                ) : (
                  <Link to="/login" className="btn btn-primary">Login to Vote</Link>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default CurrentElection;
