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
    const [syncedAccounts, setSyncedAccounts] = useState([]);
    const [googleAccounts, setGoogleAccounts] = useState([]);
    const [outlookAccounts, setOutlookAccounts] = useState([]);

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

    useEffect(() => {
        const getSyncedAccounts = async () => {
            try {
                const response = await axiosInstance.get(`${baseURL}/user/calendar/synced`);
                const syncedAccounts = response.data;

                const googleSyncedAccounts = syncedAccounts.filter(
                    (account) => account.profile.email.includes('gmail.com')
                );
                const outlookSyncedAccounts = syncedAccounts.filter(
                    (account) => !account.profile.email.includes('gmail.com')
                );

                setSyncedAccounts(syncedAccounts);
                setGoogleAccounts(googleSyncedAccounts);
                setOutlookAccounts(outlookSyncedAccounts);
            } catch (error) {
                console.error(error);
            }
        };

        getSyncedAccounts();
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

    const handleGoogleSignOut = async (account) => {
        try {
            console.log(account.calendarId)
            const payload = {
                calendarId: account.calendarId,
                resourceId: account.resourceId
            }

            const response = await axiosInstance.delete(`${baseURL}/user/google/calendar/unsync`, {
                data: payload
            });

        } catch (error) {
            console.error(error);

        }
    };

    const handleOutlookSignOut = async (account) => {
        try {
            const response = await axiosInstance.delete(
                `${baseURL}/user/outlook/calendar/unsync`,
                {
                    resourceId: account.resourceId,
                    calendarId: account.calendarId,
                }
            );

        } catch (error) {
            console.error(error);

        }
    };

    return (
        <div className="settings-page-container">
            <NavigationBar />
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="form-container">
                <h2>Settings</h2>
                <form className="user-update-form" onSubmit={handleSubmit}>
                    <label htmlFor="name">Name:</label>
                    <Input type="text" name="name" value={userData.name} onChange={handleInput} />
                    <label htmlFor="username">Username:</label>
                    <Input
                        type="text"
                        name="username"
                        value={userData.username}
                        onChange={handleInput}
                    />
                    <label htmlFor="password">New Password:</label>
                    <Input
                        type="password"
                        name="password"
                        value={userData.password}
                        onChange={handleInput}
                    />
                    <Button type="submit">Update</Button>
                    {message && <p className="error-message">{message}</p>}
                </form>
            </div>

            {/* Display synced Google accounts */}
            {googleAccounts.length > 0 ? (
                <div className="synced-accounts-container">
                    <h2>Synced Google Accounts</h2>
                    {googleAccounts.map((account) => (
                        <div key={account._id} className="account-item">
                            <p>Name: {account.profile.name}</p>
                            <p>Email: {account.profile.email}</p>
                            <Button onClick={() => handleGoogleSignOut(account)}>Sign Out</Button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="button-container">
                    <Button
                        onClick={async () => {
                            const { data } = await axiosInstance.get(`${baseURL}/user/google`);
                            window.location.href = data.message;
                        }}
                    >
                        Verify with Google
                    </Button>
                </div>
            )}

            {/* Display synced Outlook accounts */}
            {outlookAccounts.length > 0 ? (
                <div className="synced-accounts-container">
                    <h2>Synced Outlook Accounts</h2>
                    {outlookAccounts.map((account) => (
                        <div key={account._id} className="account-item">
                            <p>Email: {account.profile.email}</p>
                            <Button onClick={() => handleOutlookSignOut(account)}>Sign Out</Button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="button-container">
                    <Button
                        onClick={async () => {
                            const { data } = await axiosInstance.get(`${baseURL}/user/outlook`);
                            window.location.href = data.message;
                        }}
                    >
                        Verify with Outlook
                    </Button>
                </div>
            )}
        </div>
    );
};

export default Settings;
