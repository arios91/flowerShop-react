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
import CartItems from './cart/CartItems';
import {Modal, Container, Row, Col} from 'react-bootstrap';
import flower from '../assets/flower.png'
import { useNavigate } from 'react-router-dom';
import {getDeliveryDateInfo, getDeliveryPersonInfo, 
    getContactPersonInfo, getOrderInfo,
    getAdditionalInfo,getDiscountInfo,
    closeTable} from './cart/CartUtils.js'

//TO-DO
//- move axios calls to own file
const Cart = () => {
    const taxRate = .0825;
    
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
            setCart([])
            setSendToReceipt(false);
            axios.post('http://localhost:8080/email/sendEmail', {
                emailBody: orderEmail,
                subject: 'Order In',
                toEmail: 'order_in',
                fromEmail: 'order_in'
            });
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
        let receipt = getDeliveryDateInfo(isDelivery, deliveryDate);
        let orderEmail = getDeliveryDateInfo(isDelivery, deliveryDate);

        receipt += getDeliveryPersonInfo(isDelivery, recipient, deliveryAddress);
        orderEmail += getDeliveryPersonInfo(isDelivery, recipient, deliveryAddress);

        orderEmail += getContactPersonInfo(customer);
        
        receipt += getOrderInfo(cartItems);
        orderEmail += getOrderInfo(cartItems);
        
        if(details.cardMessage !== '' || details.instructions !== ''){
            receipt += getAdditionalInfo(details);
            orderEmail += getAdditionalInfo(details);
        }
        
        receipt += getDiscountInfo(totalPrice);

        receipt += closeTable(paymentIntent.id);
        orderEmail += closeTable(paymentIntent.id);

        setReceipt(receipt);
        setOrderEmail(orderEmail);
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

    let submitForm = async(e) => {
        e.preventDefault();

        if(isDelivery){
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
        }else{
            setShow(true);
        }

    }

    let onDeliveryChange = e => {
        if(e.target.value === 'pickup'){
            setIsDelivery(false);
            setDeliveryAddress({
                address: '',
                city: '',
                zip: ''
            });
            removeDeliveryFee();
        }else{
            setIsDelivery(true);
        }
    }

    const isDeliveryDay = date => {
        const day = date.getDay(date);
        return day !== 0;
    }

    const handleZipChange = value => {
        setDeliveryAddress({...deliveryAddress, zip: value});
        let result = deliveryZones.filter(zone => zone.zips.includes(value));
        
        if(result.length > 0){
            setDeliveryZone(result[0]);
            setTotalPrice(Math.round(((subTotal + taxes + result[0].price) + Number.EPSILON) * 100) / 100)
        }else{
            removeDeliveryFee();
        }
    }

    const removeDeliveryFee = () => {
        setDeliveryZone({price: 0});
        setTotalPrice(Math.round(((subTotal + taxes) + Number.EPSILON) * 100) / 100);
    }

    const testClick = () => {
        console.log('hey!');
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
                <CartItems cartItems={cartItems}/>

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
                                <label className='px-2'>
                                    <input type="radio" name="deliveryOption" value="delivery"
                                        onChange={(e) => onDeliveryChange(e)}
                                        checked={isDelivery}/> Delivery
                                </label>
                                <label className='px-2'>
                                    <input type="radio" name="deliveryOption" value="pickup"
                                        onChange={(e) => onDeliveryChange(e)}
                                        checked={!isDelivery}/> Pickup
                                </label><br/>
                                {isDelivery ? 
                                    <Fragment>
                                        <span>{settings.get('deliveryDateMessage')}</span><br/>
                                    </Fragment>
                                    :
                                    <Fragment>
                                        <span>{settings.get('pickupMessage')}</span><br/>
                                    </Fragment>
                                }
                                <div className="form-group">
                                    <label htmlFor="deliveryDate">{isDelivery ? 'Delivery Date' : 'Pickup Date'}</label>
                                    <DatePicker
                                        filterDate={isDeliveryDay}
                                        minDate={new Date()}
                                        selected={deliveryDate}
                                        className='form-control text-center'
                                        onChange={(date) => setDeliveryDate(date)}/>
                                </div>
                                <div className="row">
                                    {isDelivery ? 
                                    <Fragment>
                                        <div className="col-12 col-md-4">
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
                                        <div className="col-6 col-md-4">
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
                                        <div className="col-6 col-md-4">
                                            <label htmlFor="addrZip">ZIP</label>
                                            <input 
                                                type="text" 
                                                name="addrZip" 
                                                id="zipInput"
                                                className='form-control'
                                                value={deliveryAddress.zip}
                                                onChange={(e) => handleZipChange(e.target.value)}
                                                required/>
                                        </div>
                                    </Fragment> : <Fragment></Fragment>}
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
                            </div>

                        </div>
                        <div className="row mt-3">
                            <div className="col-12">
                                <h4>4. Review Summary</h4>
                            </div>
                            <div className="col-12 formContainer">
                                <div className="col-12 form-group">
                                    <label htmlFor="discountCode">Promo Code</label>
                                    <input type="text" 
                                        name="discountCode" 
                                        id="discountCodeInput"
                                        className='mx-2'
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
                        <input type="submit" value="Check Out" className='btn btn-primary w-100 mt-2 mb-2'/>
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
