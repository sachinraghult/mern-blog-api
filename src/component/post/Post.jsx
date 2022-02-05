import React from 'react';
import { Link } from 'react-router-dom';
import './Post.css'

export default function Post({post}) {

    const folder =  `https://lh3.googleusercontent.com/d/`;

    return (
        <div className='post'>
            {post.photo ? (
                <img 
                    className='postImg'
                    src={folder + post.photo}
                    referrerPolicy="no-referrer"
                    alt=''
                />
            ) : (
                <img 
                    className='postImg'
                    src='https://images.squarespace-cdn.com/content/v1/5aa2b4985b409b6f2d85fc73/1541861898559-NWCVHNCYX1QDPQ97OVLS/trail.jpg?format=1500w'
                    alt=''
                />
            )}
            
            <div className="postInfo">
                <div className="postCats">
                {post.categories.length ? (
                    post.categories.map((c) => (
                        <span className="postCat">{c}</span>
                ))
                ) : (
                    <span className="postCat">General</span>
                )}  
                </div>
                <Link to={`/post/${post._id}`} className='link'>
                    <span className="postTitle">
                        {post.title}
                    </span>
                </Link>
                <hr/>
                <span className="postDate">{new Date(post.createdAt).toDateString()}</span>
            </div>
            <p className="postDesc">
                {post.desc}
            </p>
        </div>
    );
}