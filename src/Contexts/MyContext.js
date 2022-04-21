import { createContext, useState, useEffect, useReducer } from "react";
import useFirestore from "../hooks/useFirestore";
import contextReducer from "./ContextReducer";

/* export const MyContext = createContext({}) */

const MyContext = createContext();

export const ContextProvider = ({children}) => {
    /* console.log('context') */
    const {arrangements} = useFirestore('arrangements');
    const {addons} = useFirestore('addons')
    const {settings} = useFirestore('settings');
    const {discounts} = useFirestore('discounts');
    const {deliveryZones} = useFirestore('deliveryZones');
    
    
    const inititalState = {
        cartItems: [],
        currentPage: 0,
        currentArrangement: {},
        currentAddons: [],
        awayMessage: '',
        away: false,
        isLoading: true
    }

    const [state, dispatch] = useReducer(contextReducer, inititalState);

    useEffect(() => {
        if(settings.size == 0 || addons.length == 0 || arrangements.length == 0){
            dispatch({
                type: 'SET_LOADING',
                payload: true
            })
        }else{
            dispatch({
                type: 'SET_AWAY_MESSAGE',
                payload: settings.get('awayMessage')
            })

            let beginDate = new Date(0);
            beginDate.setUTCSeconds(settings.get('beginAwayDate').seconds);

            let endDate = new Date(0);
            endDate.setUTCSeconds(settings.get('endAwayDate').seconds);

            
            let currentDate = new Date();
            if(currentDate >= beginDate && currentDate <= endDate){
                dispatch({
                    type: 'SET_AWAY',
                    payload: true
                })
            }else{
                dispatch({
                    type: 'SET_AWAY',
                    payload: false
                })
            }
            

            dispatch({
                type: 'SET_LOADING',
                payload: false
            })
        }
    }, [settings, arrangements, addons, deliveryZones, discounts])

    const handlePageNavigation = newPage => {
        dispatch({
            type: 'SET_CURRENT_PAGE',
            payload: newPage
        })

    }



    const handleArrangementSelect = arrangement => {
        console.log(arrangement);
        if(arrangement.addonNames && arrangement.addonNames.length > 0){
            console.log(arrangement.addonNames);
            let tmpAddons = addons.filter(addon => arrangement.addonNames.includes(addon.name));
            tmpAddons = tmpAddons.map(addon => {
                return {...addon, inCart: false}
            })
            dispatch({
                type: 'SET_CURRENT_ADDONS',
                payload: tmpAddons
            })
        }else{
            dispatch({
                type: 'SET_CURRENT_ADDONS',
                payload: []
            })
        }
        dispatch({
            type: 'SET_CURRENT_ARRANGEMENT',
            payload: arrangement
        })
    }

    const addToCart = (item) => {
        //if no item, alert somehow
        if(item){
            dispatch({
                type: 'ADD_TO_CART',
                payload: item
            })
        }else{
          alert('Error adding item to your cart')
        }
    }

    const setCart = newItems => {
        dispatch({
            type: 'SET_CART',
            payload: newItems
        })
    }


    return <MyContext.Provider value = {{
        ...state,
        settings,
        arrangements,
        addons,
        deliveryZones,
        settings,
        discounts,
        handlePageNavigation,
        handleArrangementSelect,
        addToCart,
        setCart
    }}>
        {children}
    </MyContext.Provider>
}

export default MyContext