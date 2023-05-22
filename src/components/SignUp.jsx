import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignUp.css';
import axios from 'axios';
import { baseURL } from '../api/constants';
import Input from './Input/Input';
import Button from './Button/Button';


const SignUp = () => {

    const [signUpData, setSignUpData] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleInput = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        setSignUpData({ ...signUpData, [name]: value })
    }
    const [record, setRecord] = useState([]);

    // handleSubmit
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!signUpData.name || !signUpData.email || !signUpData.password || !signUpData.confirmPassword) {
            setErrorMessage('Please fill all the fields!');
            return;
        }

        if (signUpData.password !== signUpData.confirmPassword) {
            setErrorMessage('Passwords do not match!');
            return;
        }

        try {
            const { data } = await axios.post(`${baseURL}/user/signup`, signUpData)
            console.log(data);
            navigate('/');
        } catch (error) {
            console.log(error);
            setErrorMessage('Error signing up, please try again.');
        };


        setRecord([...record, signUpData]);
        setSignUpData({ name: '', email: '', username: '', password: '', confirmPassword: '' });
    }



    const handleSignInClick = () => {
        navigate('/signin');
    }

    return (
        <div className='signup-page-container'>
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
            <div className='form-container' >
                <h2>Registeration Form</h2>
                <form className='registration-form' onSubmit={handleSubmit} >
                    <label htmlFor='name'>Full Name</label>
                    <Input type='text' autoComplete='off'
                        value={signUpData.name}
                        onChange={handleInput}
                        name='name' id='name' placeholder='Enter your full name' />
                    <label htmlFor='username'>Username</label>
                    <Input type='text' autoComplete='off'
                        value={signUpData.username}
                        onChange={handleInput}
                        name='username' placeholder='Enter Username' />

                    <label htmlFor='email'>Email</label>
                    <Input type='email' autoComplete='off'
                        value={signUpData.email}
                        onChange={handleInput}
                        name='email' placeholder='Email' />
                    <label htmlFor='password'>Password</label>
                    <Input type='password' autoComplete='off'
                        value={signUpData.password}
                        onChange={handleInput}
                        name='password' placeholder='Password' />
                    <label htmlFor='confirmPassword'>Confirm Password</label>
                    <Input type='password' autoComplete='off'
                        value={signUpData.confirmPassword}
                        onChange={handleInput}
                        name='confirmPassword' placeholder='Confirm Password' />
                    <Button type='submit' >Register</Button>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                </form>
                <span>
                    Already have an account?
                    <span onClick={handleSignInClick} className="sign-in-text"> Sign In</span>
                </span>
            </div>
        </div>
    )
}

export default SignUp