import React, { useState, useEffect } from 'react'; 
import { Link, useNavigate } from 'react-router-dom';
import { users, admins } from '../../backend/routes/users';
import './SidebarUser.css'; 

const SidebarUser = ({ changeView }) => { 
  const [isActive, setIsActive] = useState(false);
  const [isMenuIcon, setIsMenuIcon] = useState(true); 
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate();

  const loggedInEmail = localStorage.getItem('loggedInEmail'); 

  useEffect(() => {
    const currentUser = users.find(user => user.email === loggedInEmail);
    const currentAdmin = admins.find(admin => admin.email === loggedInEmail);

    if (currentUser) {
      setUserName(currentUser.userName); 
      setUserEmail(currentUser.userEmail); 
    } else if (currentAdmin) {
      setUserName(currentAdmin.userName); 
      setUserEmail(currentAdmin.userEmail); 
    }
  }, [loggedInEmail]); 

  const toggleSidebar = () => {
    setIsActive(!isActive);
    setIsMenuIcon(!isMenuIcon); 
  };

  const handleLogout = () => {
    localStorage.removeItem('loggedInEmail'); // Optional: Remove email from localStorage on logout
    navigate("/"); // Navigate to login page or another page
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsActive(false); // Close sidebar if click is outside
        setIsMenuIcon(true); // Reset menu icon to 'menu' state
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className='sidebar-container'onClick={toggleSidebar}>
      <div className={`icon ${isMenuIcon ? 'menu' : 'close'}`} onClick={toggleSidebar}></div>

      {isActive && ( 
        <nav className={`sidebar active`} id=''>
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
            <Link to="home"><li className='homeuser' id='sidebar-hover'>
              <img src="https://cdn-icons-png.flaticon.com/512/25/25694.png" alt="Home" className='sidebar-icon' />Home
            </li></Link>
            <Link to="calendaruser"><li className='weekliuser' id='sidebar-hover'>
              <img src="https://w7.pngwing.com/pngs/162/843/png-transparent-computer-icons-calendar-date-others-miscellaneous-text-calendar-thumbnail.png" alt="Calendar" className='sidebar-icon' />  Month
            </li></Link>
            <Link to="week"><li className='monthliuser' id='sidebar-hover'>
              <img src="https://w7.pngwing.com/pngs/162/843/png-transparent-computer-icons-calendar-date-others-miscellaneous-text-calendar-thumbnail.png" alt="Week" className='sidebar-icon' />  Week
            </li></Link>
            <li className='divideruser'></li>
            <li className='eventsuser' id='filter-hover'>
              <span className='eventyellow'></span>  Holidays
            </li>
            <li className='holidaysuser' id='filter-hover'>
              <span className='holidayred'></span>  Events
            </li>
            <li className='divider2user'></li>
            <div className='iconbg'>  
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnHbRsZ-AWHOSjc-r0hcNEAv3iSyppF4v_Fw&s" alt="School Logo" />
            </div>
            <li className='divider3user'></li>
            <li className='logoutuser' id='sidebar-hover' onClick={handleLogout}>
              Logout
            </li>
            <li className='visituser' id='visit-hover'> Visit Us
              <a href="https://www.facebook.com/CIC.Cabanatuan" target="_blank" rel="noopener noreferrer">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/768px-Facebook_Logo_%282019%29.png" alt="Facebook logo" className='fblogo'/>
              </a>
              <a href="https://www.cic.edu.ph.com" target="_blank" rel="noopener noreferrer">
                <img src="https://www.freeiconspng.com/uploads/world-wide-web-icon-15.png" alt="Website logo" className='portallogo'/>
              </a>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default SidebarUser;
