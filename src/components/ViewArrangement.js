import React, { Fragment } from 'react'
import {useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {MyContext} from '../Contexts/MyContext';
import { Redirect } from 'react-router-dom';
import Currency from 'react-currency-formatter';
import Modal from 'react-modal';

const ViewArrangement = () => {
    const {currentArrangement, addons, addToCart} = useContext(MyContext);
    const [itemAddons, setItemAddons] = useState([])
    const [redirect,  setRedirect] = useState(false);
    const [totalPrice, setTotalPrice] = useState(0);

    let [isModalOpen, setModalOpen] = useState(false);
    let addonContainerClass = 'imageContainer';

    let goHome = () => {
        console.log('going home')
        return <Redirect to='/'/>
    }


    useEffect(() => {
        
        console.log('hi from view arrangement');
        console.log('hi from useEffect');
        if(!currentArrangement.name){
            console.log('nothing to display');
            setRedirect(true);
        }else{
            console.log(currentArrangement);
            console.log(addons)
            setTotalPrice(currentArrangement.price);
            if(currentArrangement.addonNames && currentArrangement.addonNames.length > 0){
                console.log('setting addons');
                let tmpAddons = addons.filter(addon => currentArrangement.addonNames.includes(addon.name));
    
                tmpAddons = tmpAddons.map(addon => {
                    return {...addon, inCart: false}
                })
                setItemAddons(tmpAddons);

                if(tmpAddons.length > 0){
                    addonContainerClass += ' col-' + (12 / tmpAddons.length);
                }
                
            }
        }
    }, []);


    if(redirect){
        console.log('redirecting');
        return <Redirect to='/'/>
    }


    let toggleAddon = e => {
        setItemAddons(itemAddons.map(item => {
            if(item.name == e.target.name){
                item.inCart = !item.inCart;
            }
            return item;
        }));

        console.log(itemAddons)
    }

    let toCart = (e) => {
        e.preventDefault();
        let productAddons = itemAddons.filter(addon => addon.inCart);
        let itemToAdd = {...currentArrangement, productAddons : productAddons};
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
                <div className="col-12 col-lg-6 p-0">
                    <img
                        className='w-100' 
                        src={currentArrangement.imageUrl} 
                        alt={currentArrangement.name} />
                </div>
                <div className="col-12 col-lg-6 p-0">
                    <div className="card">
                        <div className="card-body">
                            <h1>{currentArrangement.name}</h1> <h4><Currency quantity={totalPrice} currency="USD"/></h4>
                            <span>{currentArrangement.longDescription}</span>
                            {itemAddons.length > 0 ? 
                                <Fragment>
                                    <h3>Make it Special!</h3>
                                    <div className="row mt-3 ml-0 mr-0 addonContainer">

                                        {itemAddons.map(item => (
                                            <div className={addonContainerClass} key={item.id}>
                                                <div className="imageContainer">
                                                    <img 
                                                        src={item.imageUrl} 
                                                        alt={item.name} 
                                                        className="card-img-top"
                                                        height="130"/>
                                                </div>
                                                <div className="card-body addonDescription">
                                                    <span>{item.description}</span>
                                                    {item.inCart ? 
                                                        <a name={item.name} className="btn btn-outline-danger" onClick={(e => {toggleAddon(e)})}>Remove</a>
                                                        :
                                                        <a name={item.name} className="btn btn-outline-primary" onClick={(e => {toggleAddon(e)})}>Add</a>
                                                    }
                                                </div>
                                            </div>
                                        ))}

                                    </div>
                                </Fragment>
                            :
                                <Fragment/>
                            }

                            <button 
                                data-bs-toggle="modal" data-bs-target="#exampleModal"
                                className="btn btn-primary btn-block mt-4"
                                onClick={(e => toCart(e))}>
                                    Add To Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Modal 
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

