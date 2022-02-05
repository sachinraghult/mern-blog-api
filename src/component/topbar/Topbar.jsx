import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Context } from '../../context/Context';
import './Topbar.css'

export default function Topbar() {

    const {user, dispatch} = useContext(Context);

    const folder =  `https://lh3.googleusercontent.com/d/`;

    const handleLogout = () => {
        dispatch({
            type:"LOGOUT",
        });
    };

    return (
        <div className='top'>
            <div className='topLeft'>
            <a href="https://www.facebook.com/sachinraghul.thirumeni"><i className="topIcon fab fa-facebook-square"></i></a>
            <a href="https://twitter.com/sachin_raghul"><i className="topIcon fab fa-twitter-square"></i></a>
            <a href="https://www.instagram.com/sach1n_t20/"><i className="topIcon fab fa-instagram-square"></i></a>
            <a href="https://www.linkedin.com/in/sachinraghult"><i className="topIcon fab fa-linkedin"></i></a>
            </div>
            <div className='topCenter'>
                <ul className='topList'>
                    <li className='topListItem'>
                        <Link to="/" className='link'>HOME</Link>
                    </li>
                    <li className='topListItem'>
                        <Link to="/" className='link'>ABOUT</Link>
                    </li>
                    <li className='topListItem'>
                        <Link to="/" className='link'>CONTACT</Link>
                    </li>
                    <li className='topListItem'>
                        <Link to="/write" className='link'>WRITE</Link>
                    </li>
                    <li className='topListItem' onClick={handleLogout}>
                            {user && "LOGOUT"}
                    </li>
                </ul>
            </div>
            <div className='topRight'>
            {
                user ? (
                    <Link className="link" to="/settings">
                        {
                            (user.profilePic === "") ? (
                                <img 
                                    className='topImg' 
                                    src='https://res.cloudinary.com/bitcharge/image/upload/v1535940305/panda-avatar.png' 
                                    alt='' 
                                />
                            ) : (
                                <img 
                                    className='topImg' 
                                    src={folder + user.profilePic}
                                    referrerPolicy="no-referrer"
                                    alt='' 
                                />
                            )
                        }
                        
                    </Link>
                ) : (
                    <ul className='topList'>
                        <li className='topListItem'>
                            <Link to="/login" className='link'>LOGIN</Link>
                        </li>
                        <li className='topListItem'>
                            <Link to="/register" className='link'>REGISTER</Link>
                        </li>
                    </ul>
                )
            }
            <i className="topSearchIcon fas fa-search"></i> 
            </div>
        </div>
    );
}
