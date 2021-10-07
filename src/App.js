import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'; 
import Test from './components/Test';
import Footer from './components/footer/Footer';
import Header from './components/header/Header';
import Cart from './components/cart/Cart';
import Dashboard from './components/dashboard/Dashboard';
import './App.css';
import {Provider} from 'react-redux'
import store from './Store'
import Arrangements from './components/arrangements/Arrangements';

function App() {
  return (
    <Provider store={store}>

      <Router>
        <div className="App">
          <Header/>
          <Switch>
            <Route exact path="/" component={Dashboard}/>
            <Route exact path="/cart" component={Cart}/>
          </Switch>
          <Footer/>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
