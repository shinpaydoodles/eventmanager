import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { users } from './assets/User';


const Login = ({ setIsAuthenticated, setIsAdmin }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = (e) => {
    e.preventDefault();

    const user = users.find(
      (user) => user.email === formData.email && user.password === formData.password
    );

    if (formData.email === userCredentials.email && formData.password === userCredentials.password) {
      setIsAuthenticated(true);
      setIsAdmin(false);
      setModalMessage('User login successful!');
      setShowModal(true);
      setTimeout(() => navigate('/user'), 2000);
    } else if (formData.email === adminCredentials.email && formData.password === adminCredentials.password) {
      setIsAuthenticated(true);
      setIsAdmin(true);
      setModalMessage('Admin login successful!');
      setShowModal(true);
      setTimeout(() => navigate('/admin'), 2000);
    } else {
      setModalMessage('Login failed: Invalid credentials');
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="container">
  <div className="signin-form">
    <h2 className="title">Login</h2>
    <form onSubmit={handleLogin}>
      <div className="input-field">
        <i className="fas fa-user"></i>
        <input
          type="text"
          name="email"
          placeholder="Email"
          onChange={handleInputChange}
        />
      </div>
      <div className="input-field">
        <i className="fas fa-lock"></i>
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleInputChange}
        />
      </div>
      <input type="submit" className="btn" value="Login" />
    </form>
  </div>

      {showModal && (
        <div className="modallogin">
          <div className="modal-content-login">
            <span className="closelogin" onClick={closeModal}>&times;</span>
            <p className='modal-content-loginto'>{modalMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
