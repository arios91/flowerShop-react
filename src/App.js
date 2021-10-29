import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'; 
import Footer from './components/Footer';
import Header from './components/Header';
import Cart from './components/Cart';
import Dashboard from './components/dashboard/Dashboard';
import './App.css';
import Arrangements from './components/arrangements/Arrangements';
import useFirestore from './hooks/useFirestore';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import PropsRoute from './components/PropsRoute';
import {MyContext} from './Contexts/MyContext'
import Loading from './components/Loading'

const App = () => {
  const [cartItems, setCartItems] = useState([]);
  const {arrangements} = useFirestore('arrangements');

  let addToCart = (item) => {
    //if no item, alert somehow
    if(item){
      setCartItems([item, ...cartItems]);      
    }
  }


 
  return (
    <MyContext.Provider value={{cartItems, arrangements, addToCart}}>
      <Router>
        <div className="App">
          <Header/>
          
          <Switch>
            <PropsRoute exact path="/" component={Dashboard}/>
            <PropsRoute exact path="/cart" component={Cart}/>
          </Switch>
          <Footer/>
        </div>
      </Router>
    </MyContext.Provider>
  );
}


export default App;
