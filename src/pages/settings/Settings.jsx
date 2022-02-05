import React, { useContext, useState } from 'react';
import Sidebar from '../../component/sidebar/Sidebar';
import { Context } from '../../context/Context';
import { Link } from 'react-router-dom';
import './Settings.css'
import axios from "axios"

export default function Settings() {

    const {user, dispatch} = useContext(Context);
    console.log("This is user ", user);

    const [email, setEmail] = useState("");
    const [file, setFile] = useState(null);
    const [password, setPassword] = useState(false);
    const [success, setSuccess] = useState(false);
    const [disable, setDisable] = useState(false);

    const folder =  `https://lh3.googleusercontent.com/d/`;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setDisable(true);
        dispatch({ 
            type: "UPDATE_START" 
        });
        const updatedUser = {
            userId: user._id,
            user: user.username,
            email,
            password,
        }
        if(file) {
            const data = new FormData();
            const filename = Date.now() + file.name;
            data.append("name", filename);
            data.append("file", file);

            try {
                await axios.post("/upload", data, {headers: {authorization: "Bearer " + user.accessToken}})
                .then((res) => (updatedUser.profilePic = res.data.fileId));
            } catch (err) {
                
            }
        }
        try {
            const res = await axios.put("/users/" + user._id, updatedUser, {
                headers: {authorization: "Bearer " + user.accessToken}
            });
            setSuccess(true);
            dispatch({ 
                type: "UPDATE_SUCCESS", 
                payload: {...res.data, accessToken: user.accessToken}
            });
        } catch (err) {
            dispatch({ 
                type: "UPDATE_FAILURE" 
            });
        }
        setDisable(false);
    };

    return (
        <div className='settings'>
            <div className="settingsWrapper">
                <div className="settingsTitle">
                    <span className="settingsUpdateTitle">Update Your Account</span>
                    <Link to="/confirmation" className='link'>
                        <span className="settingsDeleteTitle">
                            <b>
                                <i className="settingsDeleteIcon far fa-trash-alt"></i>
                                Delete Account
                            </b>
                        </span>
                    </Link>
                </div>
                <form className="settingsForm" onSubmit={handleSubmit}>
                    <label>Profile Picture</label>
                    <div className="settingsPP">
                    {
                        file ? 
                        (
                            <img
                                src={URL.createObjectURL(file)}
                                alt=""
                            />
                        )
                        :
                        (
                            (user.profilePic === "") ? 
                            (
                                <img
                                    src="https://res.cloudinary.com/bitcharge/image/upload/v1535940305/panda-avatar.png"
                                    alt=""
                                />
                            )
                            :
                            (
                                <img
                                    src={folder + user.profilePic}
                                    referrerPolicy="no-referrer"
                                    alt=""
                                />
                            )
                        )
                    }
                    <label htmlFor="fileInput">
                        <div className="settingsProfileContainer">
                            <i className="settingsPPIcon far fa-user-circle"></i>
                            <span><i>Update Profile</i></span>
                        </div>
                    </label>
                    <input
                        id="fileInput"
                        type="file"
                        style={{ display: "none" }}
                        className="settingsPPInput"
                        onChange={(e) => setFile(e.target.files[0])}
                    />
                    </div>
                    <label>Username</label>
                    <input 
                        type="text"
                        value={user.username}
                        readonly="readonly"
                        required
                    />

                    <label>Email</label>
                    <input 
                        type="email"
                        placeholder={user.email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <label>Password</label>
                    <input 
                        type="password" 
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button className="settingsSubmit" type="submit" disabled={disable}>
                        Update
                    </button>
                    {success && (
                        <span
                        style={{ color: "green", textAlign: "center", marginTop: "20px" }}
                        >
                        Profile has been updated...
                        </span>
                    )}
                </form>
            </div>
            <Sidebar/>
        </div>
    );
}