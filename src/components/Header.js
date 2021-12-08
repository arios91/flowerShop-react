import {Link} from 'react-router-dom'
import {useContext} from 'react';
import MyContext from '../Contexts/MyContext';

const Header = () => {
    const {away} = useContext(MyContext);
    /*
    state = {
        setNavbarOpaque: false
    }

    changeNavClass = (inIntro) => {
        this.setState({setNavbarOpaque: !inIntro});
    }
    */
    return (
        <div id="header"  className="container text-center">
            <div className="row headerRow">
                <div className="col-3 headerSubscript">Locally owned flower shop in Palview, TX</div>
                <div className="col-6 headerMain">Pétalos y Are</div>
                <div className="col-3 headerSubscript">Providing same day flower delivery for the valley</div>
            </div>
            <div className="row headerRow">
                <div className="col headerSubscript"><Link to="/">Home</Link></div>
                {!away && <div className="col headerSubscript"><Link to="/cart">Cart</Link></div>}
            </div>
        </div>
    )
}

export default Header
