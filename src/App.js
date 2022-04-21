import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'; 
import Footer from './components/Footer';
import Header from './components/Header';
import Cart from './components/Cart';
import Dashboard from './components/dashboard/Dashboard';
import './App.css';
import {ContextProvider} from './Contexts/MyContext'
import ViewArrangement from './components/ViewArrangement';
import Navbar from './components/Navbar';
import Receipt from './components/cart/Receipt';

const App = () => {

  return (
    <ContextProvider>
      <Router>
        <div className="App">
          <Header/>
          <Navbar/>
          <Routes>
            <Route exact path="/" element={<Dashboard/>}/>
            <Route exact path="/cart" element={<Cart/>}/>
            <Route exact path="/viewProduct" element={<ViewArrangement/>}/>
            <Route exact path="/receipt" element={<Receipt/>}/>
          </Routes>
          <Footer/>
        </div>
      </Router>
    </ContextProvider>
  );
}


export default App;
