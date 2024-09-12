import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { useParams } from 'react-router-dom';
import './CssFolder/ElectionOption.css';

function ElectionOption() {
  const [agenda, setAgenda] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [voteSuccess, setVoteSuccess] = useState(false);
  const [voteError, setVoteError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchAgenda = async () => {
      const token = localStorage.getItem('authToken');

      if (!token) {
        console.error('No token found');
        setIsAuthenticated(false);
        return;
      }

      try {
        const response = await fetch(`http://127.0.0.1:8000/agendas/${id}/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            setIsAuthenticated(false);
            console.error('Unauthorized access. Please log in.');
            return;
          }
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setAgenda(data);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Fetch error:', error);
        setIsAuthenticated(false);
      }
    };

    fetchAgenda();
  }, [id]);

  const handleVote = async (optionId) => {
    let username = localStorage.getItem('username');
    const token = localStorage.getItem('authToken');

    if (!token || !username) {
      console.error('No token or username found');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/voting/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify({
          username: username,
          agenda: id,
          option: optionId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setVoteError(errorData.detail || 'Failed to vote');
        setVoteSuccess(false);
        return;
      }

      setVoteSuccess(true);
      setVoteError(null);
    } catch (error) {
      console.error('Vote error:', error);
      setVoteError('An error occurred while submitting your vote.');
      setVoteSuccess(false);
    }
  };

  if (!agenda) {
    return <p>Loading...</p>;
  }

  return (
    <Container className="election-option-container mt-4">
      <h2 className="election-option-title text-center mb-4">Candidates for {agenda.name}</h2>
      {voteError && <p className="election-option-text-danger">{voteError}</p>}
      {voteSuccess && <p className="election-option-text-success">Your vote has been successfully submitted!</p>}
      <Row className="g-4">
        {agenda.options.length > 0 ? (
          agenda.options.map((option) => (
            <Col md={6} lg={4} key={option.id}>
              <Card className="election-option-card">
                <Card.Body className="election-option-card-body">
                  <Card.Title>{option.name}</Card.Title>
                  <button
                    className="election-option-btn"
                    onClick={() => handleVote(option.id)}
                  >
                    Vote for {option.name}
                  </button>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col>
            <Card>
              <Card.Body>
                <Card.Text>No options available.</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>
    </Container>
  );
}

export default ElectionOption;
