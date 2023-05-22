import React from 'react'
import { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom'

const PrivateRoutes = () => {

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/signin');
        }
    }, [navigate]);

    return <Outlet />;
}

export default PrivateRoutes