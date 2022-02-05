import React from 'react';
import './Header.css'

export default function Header() {
    return (
        <div className='header'>
            <div className='headerTitles'>
                <span className='headerTitleSmall'>Sachin's</span>
                <span className='headerTitleLarge'>Blog</span>
            </div>
            <img
                className="headerImg"
                src="https://assets.planday.com/wp-content/uploads/2021/09/08095248/blog-background-image-update-on-brexit-v2.png"
                alt=""
            />
        </div>
    );
}
