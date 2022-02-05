import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './SinglePost.css';
import axios from 'axios';
import { Context } from '../../context/Context';

export default function Single() {

    const folder =  `https://lh3.googleusercontent.com/d/`

    
    const location = useLocation();
    const path = location.pathname.split("/")[2];

    const {user} = useContext(Context);

    const [post, setPost] = useState({});
    const [deleteError, setDeleteError] = useState(false);
    
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [file, setFile] = useState(null);
    const [mode, setMode] = useState(false);

    const [uploadError, setUploadError] = useState(false);
    const [error, setError] = useState(false);
    const [disable, setDisable] = useState(false);

    useEffect(() => {
        const getPost = async () => {
            const res = await axios.get("/posts/" + path);
            setPost(res.data);
            setTitle(res.data.title);
            setDesc(res.data.desc);
        };
        getPost();
    }, [path])
    
    const handleDelete = async () => {
        try {
            await axios.delete("/posts/" + path, 
            {
                headers: {authorization: "Bearer " + user.accessToken},
                data: {username: user.username}
            });
            window.location.replace("/");
        } catch (err) {
            setDeleteError(true);
        }
    }

    const handleUpdate = async (e) => {
        e.preventDefault();
        setDisable(true);
        const newPost = {
            username: user.username,
            title,
            desc,
        }
        if(file) {
            const data = new FormData();
            const filename = Date.now() + file.name;
            data.append("name", filename);
            data.append("file", file);
            newPost.photo = filename;

            try {
                await axios.post("/upload", data, {headers: {authorization: "Bearer " + user.accessToken}})
                .then((res) => (newPost.photo = res.data.fileId));
            } catch (err) {
                setUploadError(true);
            }
        }
        try {
            await axios.put("/posts/" + post._id, newPost, {
                headers: {authorization: "Bearer " + user.accessToken}}
            );
            setMode(false);
            window.location.replace("/post/" + post._id);
        } catch (err) {
            setError(true);
        }
        setDisable(false);
    };

    return (
        <div className='singlePost'>
            <div className="singlePostWrapper">
                {!file ? 
                (
                    post.photo ? (
                        <img
                            className="singlePostImg"
                            src={folder + post.photo}
                            referrerPolicy="no-referrer"
                            alt=""
                        />
                    ) : (
                        <img
                            className="singlePostImg"
                            src="https://images.squarespace-cdn.com/content/v1/5aa2b4985b409b6f2d85fc73/1541861898559-NWCVHNCYX1QDPQ97OVLS/trail.jpg?format=1500w"
                            alt=""
                        />
                    )
                ) 
                : 
                (
                    <img
                        className="singlePostImg"
                        src={URL.createObjectURL(file)}
                        alt=""
                    />
                )
                }
                {
                    !mode ? 
                    (
                        <>
                        <h1 className="singlePostTitle">
                            {post.title}
                            {post.username === user?.username && 
                                <div className="singlePostEdit">
                                    <i className="singlePostIcon far fa-edit" onClick={()=>setMode(true)} ></i>
                                    <i className="singlePostIcon far fa-trash-alt" onClick={handleDelete} ></i>
                                </div>
                            }
                            
                        </h1>
                        <div className="singlePostInfo">
                            <Link to={`/?user=${post.username}`} className='link'>
                                <span className='singlePostAuthor'>
                                    Author : <b>{post.username}</b>
                                </span>
                            </Link>
                            <span className='singlePostDate'>{new Date(post.createdAt).toDateString()}</span>
                        </div>
                        <p className="singlePostDesc">
                            {deleteError && <span className='deleteError'>Invalid post!</span>}
                            {post.desc}
                        </p>
                        </>
                    )
                    :
                    (
                        <form className='writeForm' onSubmit={handleUpdate}>
                            {uploadError && <span className='uploadError'>Upload failed!</span>}
                            {error && <span className='postError'>Invalid post!</span>}
                            <div className="writeFormGroup">
                                <label htmlFor='fileInput'>
                                    <i class="writeIcon fas fa-plus"></i>
                                </label>
                                <input 
                                    type='file' 
                                    id='fileInput' 
                                    style={{display: "none"}} 
                                    onChange={(e) => setFile(e.target.files[0])} 
                                />
                                <input 
                                    type='text' 
                                    className='writeInput' 
                                    autoFocus
                                    placeholder='Title' 
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)} 
                                />
                            </div>
                            <div className="writeFormGroup">
                                <textarea 
                                    placeholder='Tell your story...' 
                                    type='text' 
                                    className='writeInput writeText' 
                                    value={desc}
                                    onChange={(e) => setDesc(e.target.value)} >
                                </textarea>
                            </div>
                            <button className="writeSubmit" type='submit' disabled={disable}>Update</button>
                        </form>
                    )
                }
                
            </div>
        </div>
    );
}