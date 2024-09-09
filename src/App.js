import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ContactPage from './components/Contact.js'
import SignUpPage from './components/SignUp.js'
import LoginPage from './components/Login';
import HomePage from './components/Home.js'
import Layout from './components/Layout.js';
import NoPage from './components/NoPage.js';
import Dashboard from './components/dashboard.js';
import { useAuth } from './components/AuthContext';



function App() {
  const { isAuthenticated, logout } = useAuth();
  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="signup" element={<SignUpPage />} />
        {isAuthenticated ? (
        <>
        <Route path="contact" element={<ContactPage />} />
        <Route path="dashboard" element={<Dashboard />} />
        </> ):
      (
        <>
     <Route path="login" element={<LoginPage />} />
        <Route path="*" element={<NoPage />} />
        </>)
       }
      </Route>
    </Routes>
  </BrowserRouter>
 
  </>

  );
}

export default App;
