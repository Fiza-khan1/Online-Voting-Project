import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from 'react-router-dom';
import './Footer.css'; // Add custom CSS file for additional styling

function Footer() {
  return (
    <footer className="footer bg-dark text-light py-4">
      <Container>
        <Row>
          <Col md={4} className="mb-3">
            <h5>About Us</h5>
            <p>
              We are committed to providing a secure and user-friendly voting system that empowers
              citizens to make their voices heard in a fair and transparent manner.
            </p>
          </Col>
          <Col md={4} className="mb-3">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><Link to="/" className="text-light">Home</Link></li>
              <li><Link to="/about" className="text-light">About</Link></li>
              <li><Link to="/contact" className="text-light">Contact</Link></li>
              <li><Link to="/privacy" className="text-light">Privacy Policy</Link></li>
            </ul>
          </Col>
          <Col md={4} className="mb-3">
            <h5>Contact Us</h5>
            <p>
              <i className="bi bi-envelope"></i> email@example.com<br />
              <i className="bi bi-phone"></i> (123) 456-7890<br />
              <i className="bi bi-geo-alt"></i> 123 Main Street, Anytown, USA
            </p>
          </Col>
        </Row>
        <Row>
          <Col className="text-center">
            <small>&copy; {new Date().getFullYear()} Your Company Name. All rights reserved.</small>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
