
import { useContext, Fragment, useState } from 'react';
import Currency from 'react-currency-formatter';
import { MyContext } from '../Contexts/MyContext';

const Cart = () => {
    const {} = useContext
    const {cartItems, setCartItems} = useContext(MyContext);
    const [isDelivery, setIsDelivery] = useState(true);


    let remove = indexToRemove => {
        setCartItems(cartItems.filter((item, index) => {
            return index !== indexToRemove;
        }));
    }

    let submitForm = e => {
        e.preventDefault();
        console.log('submit form');
    }

    let onDeliveryChange = e => {
        console.log('changed')
        console.log(e.target.value);
        if(e.target.value === 'pickup'){
            setIsDelivery(false);
        }else{
            setIsDelivery(true);
        }
    }

    return (
        <div className='wrapper container'>
            {!cartItems || cartItems.length == 0 ? 
            <div className="row text-center mt-5 mb-5">
                <div className="col-12">
                    You have no items in your cart
                </div>
            </div>
            :
            <Fragment>
                {cartItems.map((item, index) => (
                    <div className="mt-3" key={item.name}>
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

                <div className="mt-5">
                    <form onSubmit={submitForm}>
                        <div className="row">
                            <div className="col-12 col-md-6">
                                <h4>1. Your Info</h4>
                                <div className="form-group">
                                    <label htmlFor="firstName">First Name</label>
                                    <input type="text" name="firstName" id="firstNameInput" className='form-control' required/>

                                </div>
                                <div className="form-group">
                                    <label htmlFor="lastName">Last Name</label>
                                    <input type="text" name="lastName" id="lastNameInput" className='form-control' required/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="phoneNumber">Phone Number</label>
                                    <input type="text" name="phoneNumber" id="phoneNumberInput" className='form-control' required/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <input type="email" name="email" id="emailInput" className='form-control' required/>
                                </div>
                            </div>
                            <div className="col-12 col-md-6">
                                <h4>2. Their Info</h4>
                                <div className="form-group">
                                    <label htmlFor="recipientName">First Name</label>
                                    <input type="text" name="recipientName" id="recipientNameInput" className='form-control' required/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="recipientLastName">Last Name</label>
                                    <input type="text" name="recipientLastName" id="recipientLastNameInput" className='form-control' required/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="recipientPhoneNumber">Phone Number (optional)</label>
                                    <input type="text" name="recipientPhoneNumber" id="recipientPhoneNumberInput" className='form-control'/>
                                </div>

                            </div>

                        </div>
                        <div className="row text-center">
                            <div className="col-12">
                                <h4>3. Delivery Options</h4>
                            </div>
                            <div className="col-12 form-control remove-height">
                                <div className="radio">
                                    <label>
                                        <input type="radio" name="deliveryOption" value="delivery"
                                            onChange={(e) => onDeliveryChange(e)}
                                            checked={isDelivery}/> Delivery
                                    </label>
                                    <label>
                                        <input type="radio" name="deliveryOption" value="pickup"
                                            onChange={(e) => onDeliveryChange(e)}
                                            checked={!isDelivery}/> Pickup
                                    </label>
                                </div>
                                
                    
                    
                                {isDelivery ? 
                                <div>Delivery</div>
                                :
                                <span>
                                    You will be alerted via phone call when your product is ready for pick up.<br/> 
                                    If you have any questions or concerns regarding pickup just call us at 956-607-6047
                                </span>}
                            </div>

                        </div>
                        <input type="submit" value="Submit"/>
                    </form>
                </div>
            </Fragment>
            }
        </div>
    )
}

export default Cart
