import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { users, admins } from '../backend/routes/users';
import { Icon } from 'react-icons-kit';
import { eyeOff } from 'react-icons-kit/feather/eyeOff';
import { eye } from 'react-icons-kit/feather/eye';

const Login = ({ setIsAuthenticated, setIsAdmin }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false); 
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
    const admin = admins.find(
      (admin) => admin.email === formData.email && admin.password === formData.password
    );

    if (user) {
      setIsAuthenticated(true);
      setIsAdmin(false);
      setModalMessage('User login successful!');
      setShowModal(true);
      setTimeout(() => navigate('/user'), 2000);
    } else if (admin) {
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); 
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="container">    
      <div className="signin-form">
        <h2 className="title">Welcome</h2>
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
          <div className="input-field password-field">
            <i className="fas fa-lock"></i>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              onChange={handleInputChange}
              autoComplete="current-password"
            />
            <span
              className="password-toggle"
              onClick={togglePasswordVisibility}
            >
              <Icon icon={showPassword ? eye : eyeOff} size={20} />
            </span>
          </div>
          <input type="submit" className="btn" value="Login" />
        </form>
      </div>

      {showModal && (
        <div className={`modallogin ${showModal ? 'show' : ''}`}>
          <div className="modal-content-login">
            <span className="closelogin" onClick={closeModal}>
              &times;
            </span>
            <p className="modal-content-loginto">{modalMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
