import React from 'react';
import './Button.css';
import Loader from '../Loader';

const Button = ({ onClick, children, type, loading }) => {
    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <button type={type} onClick={onClick} >
                    {children}
                </button>
            )}

        </>
    )
}

export default Button