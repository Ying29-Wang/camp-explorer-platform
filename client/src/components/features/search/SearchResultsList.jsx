import React from 'react';

const SearchResultsList = ({ results }) => {
    return (
        <ul>
            {results.map((result, index) => (
                <li key={index}>{result.title}</li>
            ))}
        </ul>
    );
};

export default SearchResultsList;