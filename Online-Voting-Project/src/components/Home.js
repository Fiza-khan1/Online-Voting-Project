import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './CssFolder/Dashboard.css'; // Your custom CSS

function Home() {
  const tokenuser = localStorage.getItem('authToken');
  console.log("Token of user is :", tokenuser);
  let username = localStorage.getItem('username');

  return (
    <Container className="mt-4 custom-container">
      <h1 className="text-center mb-3 custom-heading">Welcome to the Voting System</h1>
      <div className="large-box p-3">
   
          {username === 'admin' && ( 
            <>
               <Row className="mb-5 custom-row admin-row">
            <Col>
              <h2 className="row-heading">Create Agenda (Admin Access Only)</h2>
              <p>Create and manage voting agendas for the platform.</p>
              <a href="/agendas" className="btn custom-btn">Create Agenda</a>
            </Col>
            </Row>
           </>
          )}
           
    

        <Row className="mb-2 custom-row election-row">
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
      </div>
    </Container>
  );
}

export default Home;
