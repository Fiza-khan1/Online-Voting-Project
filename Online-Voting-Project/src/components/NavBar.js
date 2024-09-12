import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { FaBell } from 'react-icons/fa';
import { Badge } from 'react-bootstrap';

function NavBar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showNotificationCount, setShowNotificationCount] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      const token = localStorage.getItem('authToken');
      console.log("ghfghgfh",token)
      const wsUrl = `ws://127.0.0.1:9000/ws/notification/?token=${token}`;
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log("WebSocket connection established.");
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log('Received WebSocket message:', data);

        if (data.type === 'user_vote_notification') {
          // Display specific vote registration confirmation to the user
          console.log('Vote registration notification received:', data.message); // Log the message
          // alert(data.message);
          setNotifications((prevNotifications) => [
            ...prevNotifications,
            data.message,
          ]);

        } else if (data.type === 'new_vote_notification') {
          // Add new notifications
          setNotifications((prevNotifications) => [
            ...prevNotifications,
            data.message,
          ]);
          // Show notification count when a new notification is received
          setShowNotificationCount(true);
        } else {
          console.warn('Unknown notification type:', data.type); // Log unknown types
        }
      };

      ws.onclose = () => {
        console.log("WebSocket connection closed.");
      };

      return () => {
        ws.close();
      };
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDropdownClick = () => {
    // Hide the notification count when the dropdown is clicked
    setShowNotificationCount(false);
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
                <Dropdown align="end" onClick={handleDropdownClick}>
                  <Dropdown.Toggle variant="outline-light" id="dropdown-notifications">
                    <FaBell />
                    {showNotificationCount && notifications.length > 0 && (
                      <Badge bg="danger" pill style={{ position: 'absolute', top: '0', right: '0' }}>
                        {notifications.length}
                      </Badge>
                    )}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {notifications.length > 0 ? (
                      notifications.map((notification, index) => (
                        <Dropdown.Item key={index}>{notification}</Dropdown.Item>
                      ))
                    ) : (
                      <Dropdown.Item>No new notifications</Dropdown.Item>
                    )}
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
