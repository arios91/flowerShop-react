import React from 'react'
import {useContext } from 'react';
import { Link } from 'react-router-dom';
import {MyContext} from '../Contexts/MyContext';
import { useHistory, browserHistory, Redirect   } from 'react-router-dom';

const ViewArrangement = () => {
    const {currentArrangement, addons} = useContext(MyContext);
    let addonContainerClass = 'imageContainer'
    let totalPrice = 0;
    let tmpCol = 4;


    if(!currentArrangement.name){
        console.log('nothing to display');
        return <Redirect to='/'/>
    }

    let itemAddons = addons.filter(addon => currentArrangement.addonNames.includes(addon.name));
    addonContainerClass += ' col-' + (12 / itemAddons.length);

    



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
                            <div className="row mt-3 ml-0 mr-0">

                                {itemAddons.map(item => (
                                    <div className={addonContainerClass}>
                                        <div className="imageContainer">
                                            <img 
                                                src={item.imageUrl} 
                                                alt={item.name} 
                                                className="card-img-top"
                                                height="130"/>
                                        </div>
                                        <div className="card-body">
                                            <span>{item.description}</span>
                                        </div>
                                    </div>
                                ))}

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {currentArrangement.name}
        </div>
    )
}

export default ViewArrangement
