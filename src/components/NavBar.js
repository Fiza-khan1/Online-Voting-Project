import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { FaBell } from 'react-icons/fa';



function NavBar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand href="#home">Voting-App</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#about">About</Nav.Link>
            <Nav.Link href="#contact">Contact</Nav.Link>
            {isAuthenticated && (
              <Nav.Link as={Link} to="/voting">Vote Now</Nav.Link> 
            )}
          </Nav>

          <Nav>
            {isAuthenticated ? (
              <>
                <Dropdown align="end">
                  <Dropdown.Toggle variant="outline-light" id="dropdown-notifications">
                    <FaBell />
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item href="#/action-1">New Election Announced</Dropdown.Item>
                    <Dropdown.Item href="#/action-2">You have 3 unread messages</Dropdown.Item>
                    <Dropdown.Item href="#/action-3">Your vote has been registered</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>

                <Link to="/dashboard">
                  <Button variant="outline-light" className="me-2">Dashboard</Button>
                </Link>
                <Link to="/profile">
                  <Button variant="outline-light" className="me-2">Profile</Button>
                </Link>
                <Button variant="outline-light" onClick={handleLogout}>Logout</Button>
               
              </>
            ) : (
              <>
                <Link to="/signup">
                  <Button variant="outline-light" className="me-2">Sign Up</Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline-light">Login</Button>
                </Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
