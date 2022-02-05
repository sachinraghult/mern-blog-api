import React, { useEffect, useState } from 'react';
import Header from '../../component/header/Header';
import Posts from '../../component/posts/Posts';
import Sidebar from '../../component/sidebar/Sidebar';
import './Home.css'
import axios from "axios";
import { useLocation } from 'react-router-dom';

export default function Home() {

    const [posts, setPosts] = useState([]);
    const {search} = useLocation();

    useEffect(() => {
        const fetchPosts = async () => {
            const res = await axios.get("/posts" + search);
            setPosts(res.data);
        }
        fetchPosts();
    },[search]);

    return (
        <div className='home'>
            <Header/>
            <div className='homeContainer'>
                <Posts posts={posts}/>
                <Sidebar/>
            </div>
        </div>
    );
}
