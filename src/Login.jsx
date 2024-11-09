import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

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

    const userCredentials = { email: 'luisbenico', password: '12345' };
    const adminCredentials = { email: 'hanyzelcenon', password: 'qwerty' };

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
    <div className={`container ${isSignUpMode ? 'sign-up-mode' : ''}`}>
      <div className="user-admin">
      <div className='usersignin'>
        <form onSubmit={handleLogin} className="sign-in-form">
          <h2 className="title1">User</h2>
          <div className="input-field">
            <i className="fas fa-user"></i>
            <input type="text" name="email" placeholder="Email" onChange={handleInputChange} />
          </div>
          <div className="input-field">
            <i className="fas fa-lock"></i>
            <input type="password" name="password" placeholder="Password" onChange={handleInputChange} />
          </div>
          <input type="submit" className="btn" value="Login" />
          <p className="account-text">
            <a href="#" onClick={() => setIsSignUpMode(true)}>Admin</a>
          </p>
        </form>
        </div>
      <div className='adminsignin'>
        <form onSubmit={handleLogin} className="sign-up-form">
          <h2 className="title2">Admin</h2>
          <div className="input-field">
            <i className="fas fa-user"></i>
            <input type="text" name="email" placeholder="Email" onChange={handleInputChange} />
          </div>
          <div className="input-field">
            <i className="fas fa-lock"></i>
            <input type="password" name="password" placeholder="Password" onChange={handleInputChange} />
          </div>
          <input type="submit" className="btn" value="Login" />
          <p className="account-text">
            <a href="#" onClick={() => setIsSignUpMode(false)}>User</a>
          </p>
        </form>
        </div>
      </div>

      <div className="panels-container">
  <div className="panel left-panel">
    <div className="content">
      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnHbRsZ-AWHOSjc-r0hcNEAv3iSyppF4v_Fw&s" alt="User Icon" className="panel-image" />
      <h5 className="companyname">COLLEGE OF THE IMMACULATE CONCEPTION</h5>
      <button className="btn" onClick={() => setIsSignUpMode(false)}>User</button>
    </div>
  </div>
  <div className="panel right-panel">
    <div className="content">
      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnHbRsZ-AWHOSjc-r0hcNEAv3iSyppF4v_Fw&s" alt="Admin Icon" className="panel-image" />
      <h5 className="companyname">COLLEGE OF THE IMMACULATE CONCEPTION</h5>
      <button className="btn" onClick={() => setIsSignUpMode(true)}>Admin</button>
    </div>
  </div>
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
