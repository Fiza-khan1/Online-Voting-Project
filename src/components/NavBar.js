import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button'; // Import Button for authentication
import {  Link,useNavigate } from "react-router-dom";
import { useAuth } from './AuthContext';

function NavBarComponent() {
  const { isAuthenticated, logout } = useAuth();
  const navigate=useNavigate()
  const handleLogout = () => {
    logout(); 
    navigate('/login'); 
  };
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>

        {/* Navbar Brand with Placeholder Text */}
        <Navbar.Brand href="#home">Voting-App</Navbar.Brand>
        
        {/* Toggle Button for Mobile View */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        {/* Navbar Links and Buttons */}
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {/* Navigation Links */}
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#about">About</Nav.Link>
            <Nav.Link href="#contact">Contact</Nav.Link>
          </Nav>
          
          {/* Authentication Buttons */}
          <Nav>
          {isAuthenticated ? (
             <>
             <li><Link to="/dashboard">
             <Button variant="outline-light" className="me-2">Dashboard</Button>
             
             </Link></li>
             <Button variant="outline-light" onClick={handleLogout}>Logout</Button>
           
             
           </>
         ) :(
          <>
          <Link to="/signup">
              <Button variant="outline-light" className="me-2">Sign Up</Button>
              </Link>
              <Link to="login">
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

export default NavBarComponent;
