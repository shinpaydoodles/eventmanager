import React, { useState, useEffect, useRef } from 'react'; 
import { Link, useNavigate } from 'react-router-dom';
import './SidebarAdmin.css'; 

const SidebarAdmin = ({ userName, userEmail }) => { 
  const [isActive, setIsActive] = useState(false);
  const [isMenuIcon, setIsMenuIcon] = useState(true); 
  const navigate = useNavigate();
  

  const sidebarRef = useRef(null);

  const toggleSidebar = () => {
    setIsActive(!isActive);
    setIsMenuIcon(!isMenuIcon); 
  };

  const handleLogout = () => {
    navigate("/"); 
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsActive(false); 
        setIsMenuIcon(true); 
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className='sidebar-container' onClick={toggleSidebar}>
      <div className='sidebarbuttonnn' onClick={toggleSidebar}>
        <div className={`icon ${isMenuIcon ? 'menu' : 'close'}`} onClick={toggleSidebar}></div>
      </div>
      <h1 className='maintitle'>School Event Manager</h1>
      {isActive && ( 
        <nav className={`sidebar active`} ref={sidebarRef}>
          <div className='sbt'>
            <div className='profile'>
              <img 
                src='https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3396.jpg'
                alt='Profile' 
                className='profile-image'
              />
            </div>
            <p className='profile-name'>{userName}</p>
            <p className='profile-email'>{userEmail}</p>
          </div> 
          <ul className='sidebar-link'>
            <Link to="dashboard"><li className='dashboard' id='sidebar-hover'>
              <img src="https://toppng.com/uploads/thumbnail/dashboard-svg-icon-free-dashboard-icon-11553444664xujck0vrug.png" alt="Dashboard" className='sidebar-icon' />Dashboard</li></Link>
            <Link to="home"><li className='homeadmin' id='sidebar-hover'>
              <img src="https://cdn-icons-png.flaticon.com/512/25/25694.png" alt="Home" className='sidebar-icon' />Home</li></Link>
            <Link to="calendaradmin"><li className='calendaradmin' id='sidebar-hover'>
              <img src="https://w7.pngwing.com/pngs/162/843/png-transparent-computer-icons-calendar-date-others-miscellaneous-text-calendar-thumbnail.png" alt="Calendar" className='sidebar-icon' />Calendar</li></Link>
            <li className='divideradmin'></li>

            <li className='divider2admin'></li>
            <div className='iconbgadmin'>  
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnHbRsZ-AWHOSjc-r0hcNEAv3iSyppF4v_Fw&s" alt="School Logo" />
            </div>
            <li className='divider3admin'></li>
            <li className='logoutadmin' id='sidebar-hover' onClick={handleLogout}>Logout</li>
            <li className='visitadmin' id='visit-hover'> Visit Us
              <a href="https://www.facebook.com/CIC.Cabanatuan" target="_blank" rel="noopener noreferrer">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/768px-Facebook_Logo_%282019%29.png" alt="facebook logo" className='fblogo'/>
              </a>
              <a href="https://www.cic.edu.ph" target="_blank" rel="noopener noreferrer">
                <img src="https://www.freeiconspng.com/uploads/world-wide-web-icon-15.png" alt="web portal logo" className='portallogo'/>
              </a>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default SidebarAdmin;
