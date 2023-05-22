import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { baseURL } from '../api/constants';
import './Settings.css';
import NavigationBar from './NavigationBar';
import Input from './Input/Input';
import Button from './Button/Button';

const Settings = () => {
    const [userData, setUserData] = useState({
        name: '',
        username: '',
        password: '',
    });
    const [message, setMessage] = useState('');

    useEffect(() => {
        const getUserData = async () => {
            try {
                const response = await axiosInstance.get(`${baseURL}/user/me`);
                const { name, username } = response.data;
                setUserData({ name, username });
            } catch (error) {
                console.error(error);
            }
        };

        getUserData();
    }, []);

    const handleInput = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        try {
            const updatedUserData = {};
            if (userData.name) updatedUserData.name = userData.name;
            if (userData.username) updatedUserData.username = userData.username;
            if (userData.password) updatedUserData.password = userData.password;

            const response = await axiosInstance.patch(`${baseURL}/user/update`, updatedUserData);
            setMessage('User information updated successfully!');
        } catch (error) {
            console.error(error);
            setMessage('Error updating user information!');
        }
    };

    return (
        <div className='settings-page-container'>
            <NavigationBar />
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
            <div className='form-container'>
                <h2>Settings</h2>
                <form className='user-update-form' onSubmit={handleSubmit}>

                    <label htmlFor="name">Name:</label>
                    <Input type="text" name="name"
                        value={userData.name}
                        onChange={handleInput} />
                    <label htmlFor="username">Username:</label>
                    <Input type="text" name="username"
                        value={userData.username}
                        onChange={handleInput} />
                    <label htmlFor="password">New Password:</label>
                    <Input type="password" name="password"
                        value={userData.password}
                        onChange={handleInput} />
                    <Button type="submit">Update</Button>
                    {message && <p className="error-message">{message}</p>}
                </form>
            </div>
            {/* todo check if the user already has synced calendar */}
            <div className="button-container">
                <Button
                    onClick={async () => {
                        const { data } = await axiosInstance.get(`${baseURL}/user/google`);
                        window.location.href = data.message;
                    }}
                >
                    Verify with Google
                </Button>
                <Button
                    onClick={async () => {
                        const { data } = await axiosInstance.get(`${baseURL}/user/outlook`);
                        window.location.href = data.message;
                    }}
                >
                    Verify with Outlook
                </Button>

            </div>
        </div>
    );
};

export default Settings;
