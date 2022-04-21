
import { useContext, Fragment, useState, useEffect } from 'react';
import Currency from 'react-currency-formatter';
import MyContext from '../Contexts/MyContext';
import PhoneInput from 'react-phone-number-input/input'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import axios from 'axios';
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from './cart/CheckoutForm';
import {Modal, Container, Row, Col} from 'react-bootstrap';
import flower from '../assets/flower.png'
import { useNavigate } from 'react-router-dom';

//TO-DO
//- send email
//- move axios calls to own file
//- move html builder functions to helper file if possible
//- finish pickup options (select date, maybe time)
const Cart = () => {
    const taxRate = .0825;
    const discountChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const {cartItems, setCart, deliveryZones, settings, discounts, away} = useContext(MyContext);
    const promise = loadStripe('pk_test_Mqk5tVgm8NXvt81KUk3iigKo')
    const [show, setShow] = useState(false);
    const navigate = useNavigate();

    const [redirect,  setRedirect] = useState(false);
    const [isDelivery, setIsDelivery] = useState(true);
    const [deliveryDate, setDeliveryDate] = useState(new Date());
    const [promoCode, setPromoCode] = useState({});
    const [discountCode, setDiscountCode] = useState('');
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
    const [receipt, setReceipt] = useState('');
    const [sendToReceipt, setSendToReceipt] = useState(false);
    const [orderEmail, setOrderEmail] = useState('');



    useEffect(() => {
        if(away){
            setRedirect(true);
        }



        if(sendToReceipt){
            console.log('sending to receipt')
            setCart([])
            navigate('/receipt', {state: {receipt}});
        }

        //grab cutoff time, change startDate if past
        if(!deliveryDate){
            setDeliveryDate(new Date());
        }
        if(deliveryDate.getHours() >= settings.get('cutoffTime')){
            let tmpDate = new Date(deliveryDate);
            tmpDate.setDate(deliveryDate.getDate() + 1);
            setDeliveryDate(tmpDate)
        }

        if(cartItems.length > 0){
            calculateTotal();
        }
    }, [cartItems, sendToReceipt, discountApplied]);


    if(redirect){
        navigate('/')
    }

    const checkoutSuccess = (payload) => {
        console.log('checkoutSuccess');
        setShow(false);

        buildReceiptandOrderEmail(payload.paymentIntent);

        if(discountApplied){
            axios.post(`http://localhost:8080/petalosarte/removeDiscountCode/${promoCode.id}`);
        }
        
        cartItems.forEach(item => {
            console.log(item);
            axios.post(`http://localhost:8080/petalosarte/incrementPopularity/${item.id}`);
        })

        setSendToReceipt(true);
    }

    const buildReceiptandOrderEmail = (paymentIntent) => {
        let receipt = getDeliveryDateInfo();
        let orderEmail = getDeliveryDateInfo();

        receipt += getDeliveryPersonInfo();
        orderEmail += getDeliveryPersonInfo();

        orderEmail += getContactPersonInfo();
        
        receipt += getOrderInfo();
        orderEmail += getOrderInfo();
        
        if(details.cardMessage !== '' || details.instructions !== ''){
            receipt += getAdditionalInfo();
            orderEmail += getAdditionalInfo();
        }
        
        receipt += getDiscountInfo();

        receipt += closeTable(paymentIntent.id);
        orderEmail += closeTable(paymentIntent.id);

        setReceipt(receipt);
        setOrderEmail(orderEmail);
    }


    const getDeliveryDateInfo = () => {
        console.log(deliveryDate.date)
        let deliveryDateInfo = `
        <table style="width: 90%;" align="center">
        <tr>
        <td style="width: 35%; text-align:right; font-weight: bold;">${isDelivery ? 'Delivery' : 'Pickup'} Date:</td>
        <td style="width: 65%; text-align:left; padding-left: 25px;">${deliveryDate.getMonth() + 1}/${deliveryDate.getDate()}/${deliveryDate.getFullYear()}</td>
        
        </tr>`;


        return deliveryDateInfo;
    }

    const getDeliveryPersonInfo = () => {
        let deliveryInfo = `
        <tr>
            <td style="width: 35%; text-align:right; font-weight: bold;">${isDelivery ? 'Deliver To' : 'For'}:</td>
            <td style="width: 65%; text-align:left; padding-left: 25px;">${recipient.firstName} ${recipient.lastName}</td>
        </tr>`;

        if(isDelivery){
            deliveryInfo += `
            <tr>
                <td style="width: 35%; text-align:right; font-weight: bold;">Street Address:</td>
                <td style="width: 65%; text-align:left; padding-left: 25px;">${deliveryAddress.address}</td>
            </tr>
            <tr>
                <td style="width: 35%; text-align:right; font-weight: bold;">City, State, Zip:</td>
                <td style="width: 65%; text-align:left; padding-left: 25px;">${deliveryAddress.city}, TX ${deliveryAddress.zip}</td>
            </tr>`
        }

        deliveryInfo += `
        <tr>
            <td style="width: 35%; text-align:right; font-weight: bold;">Phone:</td>
            <td style="width: 65%; text-align:left; padding-left: 25px;">${recipient.phone}</td>
        </tr>`;

        return deliveryInfo;
    }

    const getContactPersonInfo = () => {
        let contactInfo = 
        `<tr>
            <td>
                <br/>
            </td>
        </tr>
        
        <tr>
            <td style="width: 35%; text-align:right; font-weight: bold;">Customer Name:</td>
            <td style="width: 65%; text-align:left; padding-left: 25px;">${customer.firstName} ${customer.lastName}</td>
        </tr>
        <tr>
            <td style="width: 35%; text-align:right; font-weight: bold;">Customer Phone:</td>
            <td style="width: 65%; text-align:left; padding-left: 25px;">${customer.phone}</td>
        </tr>
        <tr>
            <td style="width: 35%; text-align:right; font-weight: bold;">Customer Email:</td>
            <td style="width: 65%; text-align:left; padding-left: 25px;">${customer.email}</td>
        </tr>
        
        <tr>
            <td>
                <br/>
            </td>
        </tr>`;

        return contactInfo;
    }

    const getOrderInfo = () => {
        let orderInfo = '';

        for(let product of cartItems){
            orderInfo += `
            <tr>
                <td style="width: 35%; text-align:right; font-weight: bold;">Product Details:</td>
                <td style="width: 65%; text-align:left; padding-left: 25px;">${product.name}</td>
            </tr>`
            for(let addon of product.productAddons){
                orderInfo += `
                <tr>
                  <td style="width: 35%; text-align:right; font-weight: bold;">Addons:</td>
                  <td style="width: 65%; text-align:left; padding-left: 25px;">${addon.name}</td>
                </tr>`;
              }
        }

        return orderInfo;
    }

    const getAdditionalInfo = () => {
        let info = 
        `<tr>
          <td>
            <br/>
          </td>
        </tr>
        ${details.cardMessage !== '' ? `
        <tr>
          <td style="width: 35%; text-align:right; font-weight: bold;">Card Message:</td>
          <td style="width: 65%; text-align:left; padding-left: 25px;">${details.cardMessage}</td>
        </tr>`: ``}
        ${details.instructions !== '' ? `
        <tr>
            <td style="width: 35%; text-align:right; font-weight: bold;">Special Instructions:</td>
            <td style="width: 65%; text-align:left; padding-left: 25px;">${details.instructions}</td>
        </tr>`: ``}`;

        return info;
    }

    const getDiscountInfo = () => {
        let discountCode = '';
        let discountAmount = 0;

        for (var i = 0; i < 7; i++){
            discountCode += discountChars.charAt(Math.floor(Math.random() * discountChars.length));
        }

        if(totalPrice > 149){
            discountAmount = 15;
        }else if(totalPrice > 99){
            discountAmount = 10;
        }else if(totalPrice){
            discountAmount = 5;
        }

        axios.post('http://localhost:8080/petalosarte/createDiscountCode', {discountCode, discountAmount});

        let discountInfo = `
        <tr>
          <td>
            <br/>
          </td>
        </tr>
        <tr>
          <td style="width: 35%; text-align:right; font-weight: bold;">${discountAmount}% Discount Code:</td>
          <td style="width: 65%; text-align:left; padding-left: 25px;">${discountCode}</td>
        </tr>`;

        return discountInfo;
    }
    
    const closeTable = (paymentIntent) => {
        var cardToken = paymentIntent.substring(paymentIntent.length - 6, paymentIntent.length);
        let info = `
        <tr>
        <td style="width: 35%; font-weight: bold; text-align:right;">Confirmation Code:</td>
        <td style="width: 65%; text-align:left; padding-left: 25px;">${cardToken}</td>
        </tr>
        </table>`
        return info;

    }
    const handleClose = () => setShow(false);

    const calculateTotal = () => {
        let tmpSubtotal = 0;

        cartItems.forEach(item => {
            tmpSubtotal += item.price;
            if(item.productAddons.length > 0){
                item.productAddons.forEach(addon => {
                    tmpSubtotal += addon.price;
                })
            }
        })

        if(discountApplied){
            let discountAmount = tmpSubtotal * (promoCode.discountAmount / 100);
            console.log(discountAmount);
            setDiscountAmount(discountAmount)
            tmpSubtotal = tmpSubtotal - discountAmount;
            console.log(tmpSubtotal)
        }


        setSubTotal(tmpSubtotal);

        let tmpTaxes = tmpSubtotal * taxRate;
        setTaxes(tmpTaxes);
        
        setTotalPrice(Math.round(((tmpSubtotal + tmpTaxes) + Number.EPSILON) * 100) / 100)
    }

    const handleDiscountApplied = (e) => {
        e.preventDefault();
        if(discountApplied){
            setDiscountCode('');
            setPromoCode({});
            setDiscountApplied(false);
        }else{
            if(!promoCode || promoCode.length < 5){
                alert('please enter valid promo code')
            }else{
                let tmpDiscount = discounts.filter(discount => discount.discountCode === discountCode);
                if(tmpDiscount.length > 0){
                    tmpDiscount = tmpDiscount[0];
                    setPromoCode(tmpDiscount);
                    setDiscountApplied(true)
                }else{
                    alert('Please enter a valid promo code');
                }
            }
        }

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

        //zip validation
        let validZip = false;
        for(let zone of deliveryZones){
            if(zone.active){
                for(let zip of zone.zips){
                    if(zip == deliveryAddress.zip){
                        validZip = true;
                    }
                }
            }
            if(validZip){
                break;
            }
        }

        if(validZip){
            setShow(true);
        }else{
            alert('We are currently not servicing the delivery zip code you input, thank you for your understanding.')
        }
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
            setTotalPrice(Math.round(((subTotal + taxes + result[0].price) + Number.EPSILON) * 100) / 100)
        }else{
            setDeliveryZone({price: 0});
            setTotalPrice(Math.round(((subTotal + taxes) + Number.EPSILON) * 100) / 100)
        }
    }

    


    const testClick = async(e) => {
        e.preventDefault();
        console.log(discounts);

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
                                                selected={deliveryDate}
                                                className='form-control'
                                                onChange={(date) => setDeliveryDate(date)}/>
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
                                        value={discountCode}
                                        onChange={e => setDiscountCode(e.target.value)}/>

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
                                        <CheckoutForm totalPrice={totalPrice} checkoutSuccess={checkoutSuccess}/>
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
