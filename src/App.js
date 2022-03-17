import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'; 
import Footer from './components/Footer';
import Header from './components/Header';
import Cart from './components/Cart';
import Dashboard from './components/dashboard/Dashboard';
import './App.css';
import {ContextProvider} from './Contexts/MyContext'
import ViewArrangement from './components/ViewArrangement';
import Navbar from './components/Navbar';

const App = () => {

  return (
    <ContextProvider>
      <Router>
        <div className="App">
          <Header/>
          <Navbar/>
          <Switch>
            <Route exact path="/" component={Dashboard}/>
            <Route exact path="/cart" component={Cart}/>
            <Route exact path="/viewProduct" component={ViewArrangement}/>
          </Switch>
          <Footer/>
        </div>
      </Router>
    </ContextProvider>
  );
}


export default App;
