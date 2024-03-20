import React from 'react';
import './Header.css';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
    return (
        <header className="header-login-signup">
            <div className='header-limiter'>
                <h1><a href='/'>Chatter<span>App</span></a></h1>
                <nav>
                    <Link to='/'>Home</Link>
                    <Link to='/about'>About App</Link>
                    <Link to='/contact'>Contact Us</Link>
                </nav>
                <ul>
                    <li><Link to='/login'>Login</Link></li>
                    <li><Link to='/signup'>Sign Up</Link></li>
                </ul>
            </div>
        </header>
    );
};

export default Header;