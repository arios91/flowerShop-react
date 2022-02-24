
import { useContext, Fragment, useState, useEffect } from 'react';
import Currency from 'react-currency-formatter';
import MyContext from '../Contexts/MyContext';
import PhoneInput from 'react-phone-number-input/input'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Redirect } from 'react-router';
import axios from 'axios';
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from './cart/CheckoutForm';
import {Modal, Container, Row, Col} from 'react-bootstrap';
import flower from '../assets/flower.png'


const Cart = () => {
    const taxRate = .0825;
    const {cartItems, setCart, deliveryZones, settings, away} = useContext(MyContext);
    const promise = loadStripe('pk_test_Mqk5tVgm8NXvt81KUk3iigKo')
    const [show, setShow] = useState(false);

    const [redirect,  setRedirect] = useState(false);
    const [isDelivery, setIsDelivery] = useState(true);
    const [startDate, setStartDate] = useState(new Date());
    const [promoCode, setPromoCode] = useState('');
    const [discountApplied, setDiscountApplied] = useState(false);
    const [discountAmount, setDiscountAmount] = useState(0);
    const [subTotal, setSubTotal] = useState(0);
    const [taxes, setTaxes] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [deliveryFee, setDeliveryFee] = useState(0);
    const [deliveryZone, setDeliveryZone] = useState({price: 0});
    const [customer, setCustomer] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        email: ''
    })
    const [recipient, setRecipient] = useState({
        firstName: '',
        lastName: '',
        phone: ''
    })
    const [deliveryAddress, setDeliveryAddress] = useState({
        address: '',
        city: '',
        zip: ''
    })
    const [details, setDetails] = useState({
        cardMessage: '',
        instructions: ''
    })



    useEffect(() => {
        if(away){
            setRedirect(true);
        }

        //grab cutoff time, change startDate if past
        if(!startDate){
            setStartDate(new Date());
        }
        if(startDate.getHours() >= settings.get('cutoffTime')){
            let tmpDate = new Date(startDate);
            tmpDate.setDate(startDate.getDate() + 1);
            setStartDate(tmpDate)
        }
        console.log('in use effect')
        console.log(cartItems);
        if(cartItems.length > 0){
            calculateTotal();
        }
    }, [cartItems]);


    if(redirect){
        return <Redirect to='/'/>
    }

    const handleClose = () => setShow(false);

    const calculateTotal = () => {
        let tmpSubtotal = 0;
        console.log('calculatingTotal');

        cartItems.forEach(item => {
            tmpSubtotal += item.price;
            if(item.productAddons.length > 0){
                item.productAddons.forEach(addon => {
                    tmpSubtotal += addon.price;
                })
            }
        })

        setSubTotal(tmpSubtotal);
        let tmpTaxes = tmpSubtotal * taxRate;
        setTaxes(tmpTaxes);
        setTotalPrice(tmpSubtotal + tmpTaxes)
    }

    const setDeliveryDate = date => {
        console.log(date);
    }

    let remove = indexToRemove => {
        let newItems = cartItems.filter((item, index) => {
            return index !== indexToRemove;
        });
        console.log(newItems);
        setCart(newItems);
    }

    let submitForm = async(e) => {
        e.preventDefault();
        console.log('submit form');
        setShow(true);
    }

    let onDeliveryChange = e => {
        if(e.target.value === 'pickup'){
            setIsDelivery(false);
        }else{
            setIsDelivery(true);
        }
    }

    const isDeliveryDay = date => {
        const day = date.getDay(date);
        return day !== 0;
    }


    const handleZipChange = e => {
        let value = e.target.value;
        
        setDeliveryAddress({...deliveryAddress, zip: value});
        
        let result = deliveryZones.filter(zone => zone.zips.includes(value));
        console.log(result)
        
        if(result.length > 0){
            setDeliveryZone(result[0]);
            setTotalPrice(subTotal + taxes + result[0].price);
        }else{
            setDeliveryZone({price: 0});
            setTotalPrice(subTotal + taxes);
        }
    }

    // TO-DO
    // 1) validate discount code
    // 2) re-calculate total if validated
    // 3) Remove discount code from db if used
    // 4) If user removes promo, re-calculate total
    const handleDiscountApplied = (e) => {
        e.preventDefault();
        if(discountApplied){
            setDiscountApplied(false);
            setDiscountAmount(0);
            calculateTotal();
            setPromoCode('');
        }else{
            if(!promoCode || promoCode.length < 5){
                alert('please enter valid promo code')
            }else{
                setDiscountApplied(true);
                setDiscountAmount(20);
                setSubTotal(subTotal - 20);
            }
        }

    }


    const testClick = (e) => {
        e.preventDefault();
        console.log(customer);
        console.log(recipient);
        console.log(deliveryAddress);
        console.log(details);
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
                                    <input type="text" 
                                        name="firstName" 
                                        id="firstNameInput" 
                                        className='form-control'
                                        value={customer.firstName}
                                        onChange={(e) => setCustomer({...customer, [e.target.name]: e.target.value})}
                                        required/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="lastName">Last Name</label>
                                    <input type="text" 
                                        name="lastName" 
                                        id="lastNameInput" 
                                        className='form-control' 
                                        value={customer.lastName}
                                        onChange={(e) => setCustomer({...customer, [e.target.name]: e.target.value})}
                                        required/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="phoneNumber">Phone Number</label>
                                    <PhoneInput
                                        name="phone"
                                        country="US"
                                        value={customer.phone}
                                        placeholder='(123) 456-7890'
                                        className='form-control'
                                        onChange={(value) => setCustomer({...customer, phone: value})}
                                        rules={{required:true}}/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <input type="email" 
                                        name="email" 
                                        id="emailInput" 
                                        className='form-control' 
                                        value={customer.email}
                                        onChange={(e) => setCustomer({...customer, [e.target.name]: e.target.value})}
                                        required/>
                                </div>
                            </div>
                            <div className="col-12 col-md-6">
                                <h4>2. Their Info</h4>
                                <div className="form-group">
                                    <label htmlFor="firstName">First Name</label>
                                    <input type="text" 
                                        name="firstName" 
                                        id="recipientNameInput" 
                                        className='form-control' 
                                        value={recipient.firstName}
                                        onChange={(e) => setRecipient({...recipient, [e.target.name]: e.target.value})}
                                        required/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="lastName">Last Name</label>
                                    <input type="text" 
                                        name="lastName"
                                        id="recipientLastNameInput" 
                                        className='form-control'
                                        value={recipient.lastName}
                                        onChange={(e) => setRecipient({...recipient, [e.target.name]: e.target.value})}
                                        required/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="recipientPhoneNumber">Phone Number (optional)</label>
                                    <PhoneInput 
                                        country="US"
                                        className='form-control'
                                        name="recipientPhoneNumber" 
                                        value={recipient.phone}
                                        onChange={(value) => setRecipient({...recipient, phone: value})}
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
                                            <DatePicker
                                                filterDate={isDeliveryDay}
                                                minDate={new Date()}
                                                selected={startDate}
                                                className='form-control'
                                                onChange={(date) => setStartDate(date)}/>
                                        </div>
                                        <div className="row">
                                            <div className="form-group col-12">
                                                <label htmlFor="address">Address</label>
                                                <input 
                                                    type="text" 
                                                    className='form-control' 
                                                    name="address" 
                                                    id="addressInputId"
                                                    value={deliveryAddress.address}
                                                    onChange={(e) => setDeliveryAddress({...deliveryAddress, [e.target.name]: e.target.value})} 
                                                    required/>
                                            </div>
                                            <div className="form-group col-8">
                                                <label htmlFor="city">City</label>
                                                <input 
                                                    type="text" 
                                                    name="city" 
                                                    id="cityInput"
                                                    className='form-control'
                                                    value={deliveryAddress.city}
                                                    onChange={(e) => setDeliveryAddress({...deliveryAddress, [e.target.name]: e.target.value})} 
                                                    required/>
                                            </div>
                                            <div className="form-group col-4">
                                                <label htmlFor="addrZip">ZIP</label>
                                                <input 
                                                    type="text" 
                                                    name="addrZip" 
                                                    id="zipInput"
                                                    className='form-control'
                                                    value={deliveryAddress.zip}
                                                    onChange={handleZipChange}
                                                    required/>
                                            </div>
                                            <div className="form-group col-12">
                                                <label htmlFor="cardMessage">Card Message</label>
                                                <input 
                                                    type="text" 
                                                    name="cardMessage" 
                                                    className='form-control'
                                                    value={details.cardMessage}
                                                    onChange={(e) => setDetails({...details, [e.target.name]: e.target.value})}
                                                    id="cardMessageInput" />
                                            </div>
                                            <div className="form-group col-12">
                                                <label htmlFor="instructions">Special Instructions</label>
                                                <input 
                                                    type="text" 
                                                    name="instructions"
                                                    className='form-control'
                                                    value={details.instructions}
                                                    onChange={(e) => setDetails({...details, [e.target.name]: e.target.value})}
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
                        <div className="row mt-3">
                            <div className="col-12">
                                <h4>4. Review Summary</h4>
                            </div>
                            <div className="col-12 formContainer">
                                <div className="col-12 form-group">
                                    <label htmlFor="discountCode" className='mr-2'>Promo Code</label>
                                    <input type="text" 
                                        name="discountCode" 
                                        id="discountCodeInput"
                                        className='mr-2'
                                        value={promoCode}
                                        onChange={e => setPromoCode(e.target.value)}/>

                                    <button type='button'
                                        name='discountButton'
                                        onClick={handleDiscountApplied}
                                        className={discountApplied ? 'btn btn-outline-danger' : 'btn btn-outline-primary'}>
                                        {discountApplied ? 'Remove' : 'Apply'}
                                    </button>
                                </div>
                                {discountApplied && <div className='col-12'>Discount: <Currency quantity={discountAmount} currency="USD"/></div> }
                                <div className="col-12">
                                    Subtotal: <Currency quantity={subTotal} currency="USD"/>
                                </div>
                                <div className="col-12">
                                    Taxes: <Currency quantity={taxes} currency="USD"/>
                                </div>
                                <div className="col-12">
                                    Delivery Fee: <Currency quantity={deliveryZone.price} currency="USD"/>
                                </div>
                                <div className="col-12">
                                    Total: <Currency quantity={totalPrice} currency="USD"/>
                                </div>
                            </div>
                        </div>
                        <input type="submit" value="Submit" className='btn btn-primary w-100 mt-2 mb-2'/>
                    </form>
                </div>
                <Modal show={show} onHide={handleClose} centered className='paymentModal mainModal text-center'>
                    <Modal.Body className='paymentModal modalBody px-0'>
                        <Container className='paymentModal modalContainer'>
                            <Row>
                                <Col xs={12} className='modal-title'>
                                    <Col>
                                        <div className="modalImage">
                                            <img src={flower}/>
                                        </div>
                                    </Col>
                                    <Col className='modalHeader'>
                                        Petalos y Arte Flower Shop
                                    </Col>
                                    <Col>
                                        {cartItems.map((item,index) => (
                                            <div>
                                                {item.name}
                                            </div>
                                        ))}
                                    </Col>
                                </Col>
                                <Col xs={12} className='modal-email py-1'>
                                    {customer.email}
                                </Col>
                                <Col xs={12} className='pt-4'>
                                    <Elements stripe={promise}>
                                        <CheckoutForm totalPrice={totalPrice}/>
                                    </Elements>
                                </Col>
                            </Row>
                        </Container>
                    </Modal.Body>
                </Modal>
            </Fragment>
            }
        </div>
    )
}

export default Cart
