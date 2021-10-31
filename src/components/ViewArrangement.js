import React from 'react'
import {useContext } from 'react';
import { Link } from 'react-router-dom';
import {MyContext} from '../Contexts/MyContext';
import { useHistory, browserHistory, Redirect   } from 'react-router-dom';

const ViewArrangement = () => {
    const {currentArrangement} = useContext(MyContext);


    if(!currentArrangement.name){
        console.log('nothing to display');
        return <Redirect to='/'/>
    }


    return (
        <div>
            {currentArrangement.name}
        </div>
    )
}

export default ViewArrangement
