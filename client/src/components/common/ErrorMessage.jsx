import React from 'react';

const ErrorMessage = ({ message }) => {
    return (
        <div style={{
            padding: '1rem',
            margin: '1rem',
            backgroundColor: '#fee',
            color: '#c00',
            borderRadius: '4px'
        }}>
            {message}
        </div>
    );
};

export default ErrorMessage;