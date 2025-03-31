import React from 'react';

const Spinner = () => {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100px'
        }}>
            <div>Loading...</div>
        </div>
    );
};

export default Spinner;