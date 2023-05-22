import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NavigationBar.css';
import userIcon from '../assets/icons/icons8-test-account-48.png';


const NavigationBar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Performs logout actions, such as deleting the saved token
        localStorage.removeItem('token');
        // Redirect the user to the sign-in page
        navigate('/signin');
    };

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                {/* Insert logo image here */}
            </div>
            <div className="navbar-menu">
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <span className="nav-link" onClick={() => navigate('/')}>
                            Dashboard
                        </span>
                    </li>
                </ul>
                <div className="navbar-user">

                    <div className="user-dropdown">
                        <div className="user-icon">
                            <img src={userIcon} alt="User Logo" />
                        </div>
                        <div className="dropdown-content">
                            <span className="dropdown-link" onClick={() => navigate('/settings')}>
                                Settings
                            </span>
                            <span className="dropdown-link" onClick={handleLogout}>
                                Logout
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default NavigationBar;
