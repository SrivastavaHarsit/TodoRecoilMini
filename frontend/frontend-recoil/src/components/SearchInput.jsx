import React from 'react';
import { useRecoilState } from 'recoil';
import { searchTermAtom } from '../state/atoms';

function SearchInput() {
    const [term, setTerm] = useRecoilState(searchTermAtom);

    return(
        <input type="text" placeholder='Search Todos...' value={term} onChange={e => setTerm(e.target.value)} style={{marginRight: '10px'}}/>
    );
}

export default SearchInput;