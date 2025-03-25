import { useEffect, useState } from 'react';
import { fetchSearchResults } from '../services/searchService';

const useSearchResults = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getResults = async () => {
            try {
                const data = await fetchSearchResults();
                setResults(data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        getResults();
    }, []);

    return { results, loading, error };
};

export default useSearchResults;