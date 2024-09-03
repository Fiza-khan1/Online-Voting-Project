import React from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './CssFolder/Dashboard.css'; // Add custom CSS file for additional styling

function Dashboard({ isAdmin }) {  // Pass an isAdmin prop to determine if the user is an admin
  return (
    <Container className="mt-4">
      <h1 className="text-center mb-4">Welcome to the Voting System</h1>
      <Row className="g-4">
        {isAdmin && (  // Only show this card if the user is an admin
          <Col md={6} lg={4}>
            <Card className="custom-card">
              <Card.Img variant="top" src="https://picsum.photos/id/870/200/300?grayscale&blur=2" />
              <Card.Body>
                <Card.Title>Manage Agendas</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">Admin Access Only</Card.Subtitle>
                <Card.Text>
                  Create and manage voting agendas for the platform.
                </Card.Text>
                <Card.Link href="/agendas" className="btn btn-primary">Create Agenda</Card.Link>
              </Card.Body>
            </Card>
          </Col>
        )}
        <Col md={6} lg={4}>
          <Card className="custom-card">
            <Card.Img variant="top" src="https://picsum.photos/id/870/200/300?grayscale&blur=2" />
            <Card.Body>
              <Card.Title>Upcoming Elections</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">Get Ready</Card.Subtitle>
              <Card.Text>
                Stay updated with the upcoming elections and make sure you are prepared to vote.
              </Card.Text>
              <Card.Link href="/current-elections" className="btn btn-primary">View Current Elections</Card.Link>

            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={4}>
          <Card className="custom-card">
            <Card.Img variant="top" src="https://picsum.photos/seed/picsum/200/300" />
            <Card.Body>
              <Card.Title>Current Voting</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">Participate Now</Card.Subtitle>
              <Card.Text>
                Explore the ongoing voting sessions and make your voice heard.
              </Card.Text>
              <Card.Link href="/see-votes" className="btn btn-primary">View Upcomming Elections</Card.Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={4}>
          <Card className="custom-card">
            <Card.Img variant="top" src="https://picsum.photos/200/300?grayscale" />
            <Card.Body>
              <Card.Title>Results & Analytics</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">Review and Analyze</Card.Subtitle>
              <Card.Text>
                Check out the results from previous votes and analyze the data.
              </Card.Text>
              <Card.Link href="/results" className="btn btn-primary">View Results</Card.Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Dashboard;
