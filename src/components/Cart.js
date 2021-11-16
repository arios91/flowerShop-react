
import { useState, useEffect, useContext, Fragment } from 'react';
import Currency from 'react-currency-formatter';
import { MyContext } from '../Contexts/MyContext';

const Cart = () => {
    const {} = useContext
    const {cartItems} = useContext(MyContext);
    console.log('hi from cart')
    console.log(cartItems);

    return (
        <div className='container'>
            {!cartItems || cartItems.length == 0 ? 
            <div className="row text-center mt-5 mb-5">
                <div className="col-12">
                    You have no items in your cart
                </div>
            </div>
            :
            <Fragment className='mt-3'>
                {cartItems.map(item => (
                    <div className="row">
                        <div className="col-4 p-0">
                            <img src={item.imageUrl} alt={item.name} width='130px'/>
                        </div>
                        <div className="col-4">
                            <h4>{item.name}</h4>
                            {item.productAddons && item.productAddons.length > 0 ?
                            <Fragment>
                                <div>Along with:</div>
                                {item.productAddons.map(addon => (
                                    <div>{addon.name}</div>
    
                                ))}
                            </Fragment> 
                            :<Fragment/>}
                        </div>
                        <div className="col-4">
                            <h4>
                                Price: <Currency quantity={item.price} currency="USD"/>
                            </h4>
                        </div>
                        <div className="col-12">
                            test
                        </div>
                    </div>
                ))}
            </Fragment>
            }
        </div>
    )
}

export default Cart
