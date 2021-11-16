
import { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { MyContext } from '../Contexts/MyContext';

const Cart = () => {
    const {} = useContext
    const {cartItems} = useContext(MyContext);
    console.log('hi from cart')
    console.log(cartItems);

    return (
        <div>
            {!cartItems || cartItems.length == 0 ? 
            <div>no items in your cart</div>
            :
            <div>
                {cartItems.length}
            </div>
            
            }
        </div>
    )
}

export default Cart