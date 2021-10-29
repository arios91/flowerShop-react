
import { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { MyContext } from '../Contexts/MyContext';

const Cart = () => {
    const {} = useContext
    const {testContext} = useContext(MyContext);

    return (
        <div>
            {testContext}
        </div>
    )
}

export default Cart