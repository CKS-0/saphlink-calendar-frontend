import React from 'react'
import { useState } from 'react';
import './SignIn.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { baseURL } from '../api/constants';
import Input from './Input/Input';
import Button from './Button/Button';

const SignIn = () => {
    const [loading, setLoading] = useState(false);
    const [signInData, setSignInData] = useState({
        username: '',
        password: ''
    });
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleInput = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setSignInData({ ...signInData, [name]: value });
    }

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        if (!signInData.username || !signInData.password) {
            setErrorMessage('Please fill all the fields!');
            return;
        }
        console.log(signInData);

        try {
            const { data } = await axios.post(`${baseURL}/user/signin`, signInData)
            console.log(data);
            if (data.token) {
                localStorage.setItem("token", data.token);
                navigate('/');
            } else {
                alert('Error: No token found in response');
            }
        } catch (error) {
            console.log(error);
            setErrorMessage('Invalid username or password!');
        }

    }

    const handleSignUpClick = () => {
        navigate('/signup');
    }

    return (
        <div className='signin-page-container'>
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="form-container">
                <h2>Sign In Form</h2>
                <form className="sign-in-form" onSubmit={handleSubmit}>
                    <label htmlFor="username">Username</label>
                    <Input type="text" autoComplete="off"
                        value={signInData.username}
                        onChange={handleInput}
                        name="username" id="username" placeholder="Enter your username" />
                    <label htmlFor="password">Password</label>
                    <Input type="password" autoComplete="off"
                        value={signInData.password}
                        onChange={handleInput}
                        name="password" placeholder="Password" />
                    {errorMessage && <div className="error-message">{errorMessage}</div>}
                    <Button loading={loading} type="submit" >Sign In</Button>
                </form>
                <span>
                    Don't have an account?
                    <span onClick={handleSignUpClick} className="sign-up-text">
                        Sign Up
                    </span>
                </span>
            </div>
        </div>
    )
}

export default SignIn