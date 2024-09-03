// App.js
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ContactPage from './components/Contact';
import SignUpPage from './components/SignUp';
import LoginPage from './components/Login';
import HomePage from './components/Home';
import Layout from './components/Layout';
import NoPage from './components/NoPage';
import Dashboard from './components/dashboard';
import { useAuth } from './components/AuthContext';
import AgendasPage from './components/AgendasPage'; 
import VotePage from './components/VotingPage';
import CurrentElection from './components/CurrentElections';
import UserProfile from './components/ProfilePage'
import TopPart from './components/TopPart'
import CreateAgenda from './components/CreateAgenda';

function App() {
  const { isAuthenticated } = useAuth();  // Removed logout as it's not used
  const isAdmin = true;  // Assuming this value is based on your authentication logic
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="signup" element={<SignUpPage />} />
          <Route index element={<HomePage isAdmin={isAdmin} />} />
          <Route path="createagenda" element={<CreateAgenda />} />

          
          
          {isAuthenticated ? (
            <>
              <Route path="contact" element={<ContactPage />} />
              <Route path="top" element={<TopPart />} />
              <Route path="dashboard" element={<Dashboard isAdmin={isAdmin} />} />
              <Route path="agendas" element={<AgendasPage />} />      
              <Route path="vote/:id" element={<VotePage />} />
              <Route path="current-elections" element={<CurrentElection />} />
              <Route path="profile" element={<UserProfile />} />
              <Route path="*" element={<NoPage />} />

            </>
          ) : (
            <>
              <Route path="current-elections" element={<CurrentElection />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="*" element={<NoPage />} />
            </>
          )}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;