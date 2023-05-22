import React from 'react';
import './Input.css';

const Input = ({ type, autoComplete, value, onChange, name, id, placeholder }) => {
    return (
        <input className='Input'
            type={type}
            autoComplete={autoComplete}
            value={value}
            onChange={onChange}
            name={name} id={id} placeholder={placeholder} />
    )
}

export default Input