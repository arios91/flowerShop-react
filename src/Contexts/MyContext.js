import { createContext, useState } from "react";
import useFirestore from "../hooks/useFirestore";

/* export const MyContext = createContext({}) */

const MyContext = createContext();

export const ContextProvider = ({children}) => {
    console.log('context')
    const [cartItems, setCartItems] = useState([]);
    const {arrangementPages} = useFirestore('arrangements');
    const {addons} = useFirestore('addons')
    const {settings} = useFirestore('settings');
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [currentArrangement, setCurrentArrangement] = useState({});
    const [currentAddons, setCurrentAdddons] = useState([])


    const handleArrangementSelect = arrangement => {
        console.log(arrangement);
        if(arrangement.addonNames && arrangement.addonNames.length > 0){
            console.log(arrangement.addonNames);
            let tmpAddons = addons.filter(addon => arrangement.addonNames.includes(addon.name));
            tmpAddons = tmpAddons.map(addon => {
                return {...addon, inCart: false}
            })
            setCurrentAdddons(tmpAddons);
        }else{
            setCurrentAdddons([]);
        }
        setCurrentArrangement(arrangement);
    }

    const addToCart = (item) => {
        console.log(item)
        //if no item, alert somehow
        if(item){
          setCartItems([item, ...cartItems]);      
        }else{
          alert('Error adding item to your cart')
        }
        console.log(cartItems);
    }


    return <MyContext.Provider value = {{
        settings,
        cartItems,
        arrangementPages,
        addons,
        settings,
        currentPage,
        isLoading,
        setCurrentPage,
        currentArrangement,
        setCurrentArrangement,
        handleArrangementSelect,
        currentAddons,
        setCurrentAdddons,
        addToCart,
        setCartItems
    }}>
        {children}
    </MyContext.Provider>
}

export default MyContext