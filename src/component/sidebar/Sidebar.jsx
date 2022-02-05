import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css'

export default function Sidebar() {

    const [cats, setCats] = useState([]);

    useEffect(() => {
        const getCats = async () => {
            const res = await axios.get("/categories");
            setCats(res.data);
        };
        getCats();
    })

    return (
        <div className='sidebar'>
            <div className="sidebarItem">
                <span className="sidebarTitle">ABOUT ME</span>
                <img
                    src="https://i.pinimg.com/originals/dd/d5/b2/ddd5b2f90e660eb4f881a59c416f3ac9.jpg"
                    alt=""
                />
                <p>
                    A blog site to just make it simple and have an interesting 
                    rapo with friends in an informal style.
                </p>
            </div>
            <div className="sidebarItem">
                <span className="sidebarTitle">CATEGORIES</span>
                <ul className="sidebarList">
                    {
                        cats.map((c) => (
                            <Link to={`/?cat=${c.name}`} className='link'>
                                <li className="sidebarListItem">{c.name}</li>
                            </Link>
                        ))
                    } 
                </ul>
            </div>
            <div className="sidebarItem">
                <div className="sidebarTitle">FOLLOW US</div>
                <div className="sidebarSocial">
                    <a href="https://www.facebook.com/sachinraghul.thirumeni"><i className="sidebarIcon fab fa-facebook-square"></i></a>
                    <a href="https://twitter.com/sachin_raghul"><i className="sidebarIcon fab fa-twitter-square"></i></a>
                    <a href="https://www.instagram.com/sach1n_t20/"><i className="sidebarIcon fab fa-instagram-square"></i></a>
                    <a href="https://www.linkedin.com/in/sachinraghult"><i className="sidebarIcon fab fa-linkedin"></i></a>
            </div>
            </div>
        </div>
    );
}