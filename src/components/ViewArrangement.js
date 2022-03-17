import React, { Fragment } from 'react'
import {useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MyContext from '../Contexts/MyContext';
import { Redirect } from 'react-router-dom';
import Currency from 'react-currency-formatter';
import Modal from 'react-modal';

const ViewArrangement = () => {
    const {currentArrangement, addToCart, currentAddons, away} = useContext(MyContext);
    const [redirect,  setRedirect] = useState(false);
    const [totalPrice, setTotalPrice] = useState(0);
    const [orderedBalloons, setOrderedBallons] = useState(false);

    let [isModalOpen, setModalOpen] = useState(false);

    

    useEffect(() => {
        if(!currentArrangement.name){
            setRedirect(true);
        }else{
            setTotalPrice(currentArrangement.price);
        }
    }, []);


    if(redirect){
        return <Redirect to='/'/>
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
                    <div className="card border-0">
                        <div className="card-body text-center">
                            <h1>{currentArrangement.name}</h1> <h4><Currency quantity={totalPrice} currency="USD"/></h4>
                            <span>{currentArrangement.longDescription}</span>
                            {currentAddons.length > 0 ? 
                                <div className='pt-4'>
                                    <h3>Make it Special!</h3>
                                    <div className="row mt-3 ml-0 mr-0 addonContainer">

                                        {currentAddons.map(item => (
                                            <div className={(`imageContainer col-${12/currentAddons.length}`)} key={item.id}>
                                                <div className="imageContainer">
                                                    <img 
                                                        src={item.imageUrl} 
                                                        alt={item.name} 
                                                        className="card-img-top"
                                                        height="90"/>
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
                                className="btn btn-primary btn-block mt-4"
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
                <div className="container m-3 text-center">
                    <div className="row mb-2">
                        <div className="col-12">
                            Successfully Added to Cart!
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <Link className="btn btn-secondary"
                                to='/'>
                                Continue Shopping
                            </Link>
                            <Link className="btn btn-primary" 
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

