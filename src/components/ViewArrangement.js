import React, { Fragment } from 'react'
import {useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MyContext from '../Contexts/MyContext';

import Currency from 'react-currency-formatter';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';

const ViewArrangement = () => {
    const {currentArrangement, addToCart, currentAddons, away} = useContext(MyContext);
    const [redirect,  setRedirect] = useState(false);
    const [totalPrice, setTotalPrice] = useState(0);
    const [orderedBalloons, setOrderedBallons] = useState(false);
    const navigate = useNavigate();

    let [isModalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        if(!currentArrangement.name){
            setRedirect(true);
        }else{
            setTotalPrice(currentArrangement.price);
        }
    }, []);


    if(redirect){
        navigate('/');
    }

    let toggleAddon = e => {
        currentAddons.forEach(item => {
            if(item.name == e.target.name){
                if(item.inCart){
                    setTotalPrice(totalPrice - item.price);
                }else{
                    setTotalPrice(totalPrice + item.price);
                }

                if(item.name === 'balloon'){
                    setOrderedBallons(!orderedBalloons);
                }

                item.inCart = !item.inCart;
            }
        });
    }

    let toCart = (e) => {
        e.preventDefault();
        let productAddons = currentAddons.filter(addon => addon.inCart);
        let itemToAdd = {...currentArrangement, productAddons : productAddons, totalPrice: totalPrice};
        addToCart(itemToAdd);
        setModalOpen(true);
    }

    let modalStyle = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            overflow: 'none',
            borderRadius: '10px',
            minWidth: '25%',
            padding: '0'
          },
    }

    return (
        <div className="container">
            
            <div className="row">
                <div className="col-12 col-md-6 col-lg-6 p-0">
                    <img
                        className='w-100' 
                        src={currentArrangement.imageUrl} 
                        alt={currentArrangement.name} />
                </div>
                <div className="col-12 col-md-6 col-lg-6 p-0">
                    <div className="card border-0 h-100">
                        <div className="card-body text-center">
                            <h1>{currentArrangement.name}</h1> <h4><Currency quantity={totalPrice} currency="USD"/></h4>
                            <span>{currentArrangement.longDescription}</span>
                            {currentAddons.length > 0 ? 
                                <div className='pt-4'>
                                    <h3>Make it Special!</h3>
                                    <div className="row mt-3 mx-0 addonContainer">

                                        {currentAddons.map(item => (
                                            <div className={(`col-${12/currentAddons.length} card p-0`)} key={item.id}>
                                                <div className="imageContainer">
                                                    <img 
                                                        src={item.imageUrl} 
                                                        alt={item.name} 
                                                        className="card-img-top"
                                                        height="130"/>
                                                </div>
                                                <div className="card-body addonDescription">
                                                    <span>{item.description}</span><br/>
                                                    {item.inCart ? 
                                                        <a name={item.name} className="btn btn-outline-danger" onClick={(e => {toggleAddon(e)})}>Remove</a>
                                                        :
                                                        <a name={item.name} className="btn btn-outline-primary" onClick={(e => {toggleAddon(e)})}>Add</a>
                                                    }
                                                </div>
                                            </div>
                                        ))}

                                    </div>
                                </div>
                            :
                                <Fragment/>
                            }

                            {orderedBalloons ? 
                                <div className="mt-4">
                                    Note: When ordering ballons, please add the occasion in the "special instructions" input in the cart before checking out in order to ensure proper balloon is used.
                                </div> 
                                : <Fragment/>
                            }

                            <button 
                                data-bs-toggle="modal" data-bs-target="#exampleModal"
                                className="btn btn-primary btn-block mt-4 w-100"
                                disabled={away}
                                onClick={(e => toCart(e))}>
                                    Add To Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Modal 
                ariaHideApp={false}
                isOpen={isModalOpen}
                style={modalStyle}>
                <div className="container text-center p-0">
                    <div className="row my-2 text-center">
                        <div className="col-12 mx-0">
                            <h6>Successfully Added to Cart!</h6>
                        </div>
                    </div>
                    <hr></hr>
                    <div className="row mb-3 text-right">
                        <div className="col-12">
                            <Link className="btn btn-secondary mx-2"
                                to='/'>
                                Continue Shopping
                            </Link>
                            <Link className="btn btn-primary mx-2" 
                                to='/cart'>
                                Go To Cart
                            </Link>

                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default ViewArrangement

