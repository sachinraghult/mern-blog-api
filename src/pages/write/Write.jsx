import React, { useContext, useState } from 'react';
import { Context } from '../../context/Context';
import './Write.css'
import axios from "axios"

export default function Write() {

    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [file, setFile] = useState(null);
    const {user} = useContext(Context);
    const [uploadError, setUploadError] = useState(false);
    const [error, setError] = useState(false);
    const [disable, setDisable] = useState(false);

    const handleSubmit = async (e) => {
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

            try {
                await axios.post("/upload", data, {headers: {authorization: "Bearer " + user.accessToken}})
                .then((res) => (newPost.photo = res.data.fileId));
            } catch (err) {
                setUploadError(true);
            }
        }
        try {
            const res = await axios.post("/posts", newPost, {
                headers: {authorization: "Bearer " + user.accessToken}
            });
            window.location.replace("/post/" + res.data._id);
        } catch (err) {
            setError(true);
        }
        setDisable(false);
    };

    return (
        <div className='write'>
            <div className="writeContainer">
                <div className="writeTitle">Write a blog ✒️</div>
                {uploadError && <span className='uploadError'>Upload failed!</span>}
                {error && <span className='postError'>Invalid post!</span>}
            </div>
            {file && (
                <img
                    className="writeImg"
                    src={URL.createObjectURL(file)}
                    alt=""
                />
            )}
            <form className='writeForm' onSubmit={handleSubmit}>
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
                        autoFocus={true} 
                        placeholder='Title' 
                        onChange={(e) => setTitle(e.target.value)} 
                    />
                </div>
                <div className="writeFormGroup">
                    <textarea 
                        placeholder='Tell your story...' 
                        type='text' 
                        className='writeInput writeText' 
                        onChange={(e) => setDesc(e.target.value)} >
                    </textarea>
                </div>
                <button className="writeSubmit" type='submit' disabled={disable}>Publish</button>
            </form>
        </div>
    );
}