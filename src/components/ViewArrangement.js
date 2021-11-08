import React from 'react'
import {useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import {MyContext} from '../Contexts/MyContext';
import { useHistory, browserHistory, Redirect   } from 'react-router-dom';
import Modal from 'react-modal';

const ViewArrangement = () => {
    const {currentArrangement, addons, setCartItems} = useContext(MyContext);
    const [testState, setTestState] = useState(false);
    const [itemAddons, setItemAddons] = useState([])

    let [isModalOpen, setModalOpen] = useState(false);
    let addonContainerClass = 'imageContainer'
    let totalPrice = 0;


    if(!currentArrangement.name){
        console.log('nothing to display');
        return <Redirect to='/'/>
    }else{}

    let tmpAddons = addons.filter(addon => currentArrangement.addonNames.includes(addon.name));
    tmpAddons = tmpAddons.map(addon => {
        return {...addon, inCart: false}
    })
    if(itemAddons.length == 0){
        setItemAddons(tmpAddons);
    }
    
    addonContainerClass += ' col-' + (12 / itemAddons.length);


    let toggleAddon = e => {
        setItemAddons(itemAddons.map(item => {
            if(item.name == e.target.name){
                item.inCart = !item.inCart;
            }
            return item;
        }));
    }

    let addToCart = (e) => {
        console.log('click')
        //let itemToAdd = {...currentArrangement, productAddons : itemAddons.filter(addon => addon.inCart)};
        //console.log(itemToAdd);
        setModalOpen(true);

    }

    let removeModal = e => {
        console.log('remove')
        setModalOpen(false);
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
                            <h1>{currentArrangement.name}</h1> <h4>{totalPrice}</h4>
                            <span>{currentArrangement.longDescription}</span>
                            <h3>Make it Special!</h3>
                            <div className="row mt-3 ml-0 mr-0 addonContainer">

                                {itemAddons.map(item => (
                                    <div className={addonContainerClass}>
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
                            <button 
                                data-bs-toggle="modal" data-bs-target="#exampleModal"
                                className="btn btn-primary btn-block mt-4"
                                onClick={(e => addToCart(e))}>
                                    Add To Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Modal isOpen={isModalOpen}>
                test modal
                <button className="btn btn-primary" 
                onClick={(e => removeModal(e))}>
                    Test
                </button>
            </Modal>
        </div>
    )
}

export default ViewArrangement

