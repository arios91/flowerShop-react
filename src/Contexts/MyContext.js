import { createContext, useState, useEffect } from "react";
import useFirestore from "../hooks/useFirestore";

/* export const MyContext = createContext({}) */

const MyContext = createContext();

export const ContextProvider = ({children}) => {
    /* console.log('context') */
    const [cartItems, setCartItems] = useState([]);
    const {arrangementPages} = useFirestore('arrangements');
    const {addons} = useFirestore('addons')
    const {settings} = useFirestore('settings');
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [currentArrangement, setCurrentArrangement] = useState({});
    const [currentAddons, setCurrentAdddons] = useState([])
    const [awayMessage, setAwayMessage] = useState('');
    const [showAwayMessage, setShowAwayMessage] = useState(false)

    useEffect(() => {
        if(settings.size == 0 || addons.length == 0 || arrangementPages.length == 0){
            setIsLoading(true);
        }else{
            setAwayMessage(settings.get('awayMessage'));

            let beginDate = new Date(0);
            beginDate.setUTCSeconds(settings.get('beginAwayDate').seconds);

            let endDate = new Date(0);
            endDate.setUTCSeconds(settings.get('endAwayDate').seconds);

            
            let currentDate = new Date();
            if(currentDate >= beginDate && currentDate <= endDate){
                setShowAwayMessage(true);
            }else{
                setShowAwayMessage(false);
            }
            

            setIsLoading(false);
        }
    }, [settings, arrangementPages, addons])



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
        setCartItems,
        awayMessage,
        showAwayMessage
    }}>
        {children}
    </MyContext.Provider>
}

export default MyContext