// components/SearchInput.jsx

import React, { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { searchTermAtom } from '../state/atoms';

function SearchInput() {
    
    const [localTerm, setLocalTerm] = useState('');
    const [globalTerm, setGlobalTerm] = useRecoilState(searchTermAtom);

    useEffect(() => {
        // Set up a timer
        const timer = setTimeout(() => {
            setGlobalTerm(localTerm);
        }, 300); // delay

        // Cleanup function, if the user types again, we clear previous timer
        return () => {
            clearTimeout(timer);
        }
    }, [localTerm, setGlobalTerm]);

    return(
        <input type="text" placeholder='Search Todos...' value={localTerm} onChange={e => setLocalTerm(e.target.value)} style={{marginRight: '10px'}}/>
    );
}

export default SearchInput;