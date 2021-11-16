import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'; 
import Footer from './components/Footer';
import Header from './components/Header';
import Cart from './components/Cart';
import Dashboard from './components/dashboard/Dashboard';
import './App.css';
import useFirestore from './hooks/useFirestore';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import PropsRoute from './components/PropsRoute';
import {MyContext} from './Contexts/MyContext'
import Loading from './components/Loading'
import Arrangement from './components/Arrangement';
import ViewArrangement from './components/ViewArrangement';

const App = () => {
  const [cartItems, setCartItems] = useState([]);
  //const [arrangementPages, setArrangementPages] = useState([]);
  const [currentPage , setCurrentPage] = useState(0);
  const [currentArrangement, setCurrentArrangement] = useState({});
  const {arrangementPages} = useFirestore('arrangements')
  const {addons} = useFirestore('addons')


  /* if(arrangementPages.length == 0 && arrangements.length > 0){
    let counter = 0, arrX = 0, itemsPerPage = 12;
    let tmpPages = [], page = [];
    arrangements.forEach(item => {

      if(counter == itemsPerPage ){
        tmpPages.push(page);
        page = [];
        counter = 0;
      }else{
        page.push(item);
        counter++;
      }
    })
    setArrangementPages(tmpPages);
  } */

  let addToCart = (item) => {
    //if no item, alert somehow
    if(item){
      setCartItems([item, ...cartItems]);      
    }else{
      alert('Error adding item to your cart')
    }
  }


 
  return (
    <MyContext.Provider value={{cartItems, addToCart, setCartItems, arrangementPages, currentPage, setCurrentPage, currentArrangement, setCurrentArrangement, addons}}>
      <Router>
        <div className="App">
          <Header/>
          
          <Switch>
            <PropsRoute exact path="/" component={Dashboard}/>
            <PropsRoute exact path="/cart" component={Cart}/>
            <PropsRoute exact path="/viewProduct" component={ViewArrangement}/>
          </Switch>
          <Footer/>
        </div>
      </Router>
    </MyContext.Provider>
  );
}


export default App;
