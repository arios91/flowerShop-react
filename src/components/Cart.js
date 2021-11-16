
import { useState, useEffect, useContext, Fragment } from 'react';
import Currency from 'react-currency-formatter';
import { MyContext } from '../Contexts/MyContext';

const Cart = () => {
    const {} = useContext
    const {cartItems, setCartItems} = useContext(MyContext);
    console.log('hi from cart')
    console.log(cartItems);

    let remove = indexToRemove => {
        setCartItems(cartItems.filter((item, index) => {
            return index !== indexToRemove;
        }));
    }

    return (
        <div className='container'>
            {!cartItems || cartItems.length == 0 ? 
            <div className="row text-center mt-5 mb-5">
                <div className="col-12">
                    You have no items in your cart
                </div>
            </div>
            :
            <Fragment>
                {cartItems.map((item, index) => (
                    <div className="row mt-3" key={item.name}>
                        <div className="col-4 p-0">
                            <img src={item.imageUrl} alt={item.name} className='w-130'/>
                        </div>
                        <div className="col-4">
                            <h4>{item.name}</h4>
                            {index}
                            {item.productAddons && item.productAddons.length > 0 ?
                            <Fragment>
                                <div>Along with:</div>
                                {item.productAddons.map(addon => (
                                    <div key={addon.name}>{addon.name}</div>
                                ))}
                            </Fragment> 
                            :<Fragment/>}
                        </div>
                        <div className="col-4">
                            <h4>
                                Price: <Currency quantity={item.totalPrice} currency="USD"/>
                            </h4>
                        </div>
                        <div className="col-4 p-0 mt-1">
                            <button className="btn btn-outline-secondary w-130" onClick={e => remove(index)}>Remove</button>
                        </div>
                    </div>
                ))}

                <div className="row mt-5">
                    <div className="col-12 col-lg-6 row">
                        <h4>1. Your Info</h4>
                    </div>
                    <div className="col-12 col-lg-6 row">
                        <h4>2. Their Info</h4>
                    </div>
                </div>
            </Fragment>
            }
        </div>
    )
}

export default Cart
