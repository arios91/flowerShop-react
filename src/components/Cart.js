
import { useContext, Fragment, useState, useEffect } from 'react';
import Currency from 'react-currency-formatter';
import MyContext from '../Contexts/MyContext';
import PhoneInput from 'react-phone-number-input/input'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Redirect } from 'react-router';


const Cart = () => {
    const {} = useContext
    const {cartItems, setCartItems, settings, away} = useContext(MyContext);
    const [redirect,  setRedirect] = useState(false);
    const [isDelivery, setIsDelivery] = useState(true);
    const [customerPhone, setCustomerPhone] = useState();
    const [recipientPhone, setRecipientPhone] = useState();

    useEffect(() => {
        if(away){
            setRedirect(true);
        }
    }, []);


    if(redirect){
        return <Redirect to='/'/>
    }

    const setDeliveryDate = date => {
        console.log(date);
    }



    /* const [startDate, setStartDate] = useState(() => {
        console.log('start')
        let daysToAdd = 0
        let currentDate = new Date();
        let currentDay = currentDate.getDay();
        //if sunday
        if(currentDay == 0){
            return currentDate.setDate(currentDate.getDate() + 1);
        }
        //if after cutoff time
        let currentHour = currentDate.getHours();
        let cutoffTime = settings.get('cutoffTime')
        console.log(currentHour);
        console.log(cutoffTime);
        if(currentHour >= cutoffTime){
            console.log('in here');
            //if saturday, add 2 to get to monday
            if(currentDay == 6){
                daysToAdd = 2;
            }else{
                daysToAdd = 1;
            }
        }
    
        return currentDate.setDate(currentDate.getDate() + daysToAdd);
    }); */


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

    let onPhoneChange = value => {

        console.log(value);
    }

    const isWeekday = date => {
        const day = date.getDay(date);
        return day !== 0;
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
                    <div className="row mt-3" key={item.name}>
                        <div className="col-4 p-0">
                            <img src={item.imageUrl} alt={item.name} className='w-130'/>
                        </div>
                        <div className="col-4">
                            <h4>{item.name}</h4>
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
                                    <PhoneInput
                                        name="phoneNumber"
                                        country="US"
                                        value={customerPhone}
                                        placeholder='(123) 456-7890'
                                        className='form-control'
                                        onChange={onPhoneChange}
                                        rules={{required:true}}/>
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
                                    <PhoneInput 
                                        country="US"
                                        className='form-control'
                                        name="recipientPhoneNumber" 
                                        value={recipientPhone}
                                        onChange={onPhoneChange}
                                        placeholder="(123) 456-7890"/>
                                </div>

                            </div>

                        </div>
                        <div className="row text-center">
                            <div className="col-12">
                                <h4>3. Delivery Options</h4>
                            </div>
                            <div className="col-12">
                                <label className='pr-2'>
                                    <input type="radio" name="deliveryOption" value="delivery"
                                        onChange={(e) => onDeliveryChange(e)}
                                        checked={isDelivery}/> Delivery
                                </label>
                                <label className='pl-2'>
                                    <input type="radio" name="deliveryOption" value="pickup"
                                        onChange={(e) => onDeliveryChange(e)}
                                        checked={!isDelivery}/> Pickup
                                </label><br/>
                                {isDelivery ? 
                                    <Fragment>
                                        <span>{settings.get('deliveryDateMessage')}</span><br/>
                                        <div className="form-group">
                                            <label htmlFor="deliveryDate">Delivery Date</label>
                                            <DatePickers
                                                filterDate={isWeekday}
                                                minDate={new Date()}
                                                className='form-control'
                                                onChange={(date) => setStartDate(date)}/>
                                        </div>
                                        <div className="row">
                                            <div className="form-group col-12">
                                                <label htmlFor="addressInput">Address</label>
                                                <input 
                                                    type="text" 
                                                    className='form-control' 
                                                    name="addressInput" 
                                                    id="addressInputId" 
                                                    required/>
                                            </div>
                                            <div className="form-group col-8">
                                                <label htmlFor="addrCity">City</label>
                                                <input 
                                                    type="text" 
                                                    name="addrCity" 
                                                    id="cityInput"
                                                    className='form-control'
                                                    required/>
                                            </div>
                                            <div className="form-group col-4">
                                                <label htmlFor="addrZip">ZIP</label>
                                                <input 
                                                    type="text" 
                                                    name="addrZip" 
                                                    id="zipInput"
                                                    className='form-control'
                                                    required/>
                                            </div>
                                            <div className="form-group col-12">
                                                <label htmlFor="cardMessage">Card Message</label>
                                                <input 
                                                    type="text" 
                                                    name="cardMessage" 
                                                    className='form-control'
                                                    id="cardMessageInput" />
                                            </div>
                                            <div className="form-group col-12">
                                                <label htmlFor="specialInstructions">Special Instructions</label>
                                                <input 
                                                    type="text" 
                                                    name="specialInstructions"
                                                    className='form-control'
                                                    id="specialInstructionsInput" />
                                            </div>
                                        </div>
                                    </Fragment>
                                    :
                                    <div className="form-control">
                                        <span>{settings.get('pickupMessage')}</span>
                                    </div>
                                }
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


/*

                                    <input 
                                        type="tel" 
                                        name="phoneNumber" 
                                        id="phoneNumberInput" 
                                        className='form-control' 
                                        placeholder="(123) 456-7890"
                                        pattern="\(\d{3}\) \d{3}-\d{4}"
                                        required/>*/