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
                <div className="col-12 col-lg-3 headerSubscript d-none d-lg-block">
                        Locally owned flower shop in Palmview, TX
                </div>
                <div className="col-12 col-lg-6 headerMain">Pétalos y Arte</div>
                <div className="col-12 col-lg-3 headerSubscript">
                    <span className='d-lg-none'>
                        Locally owned flower shop in Palmview, TX providing same day flower delivery for the valley
                    </span>
                    <span className='d-none d-lg-block'>
                        Providing same day flower delivery for the valley
                    </span>
                </div>
            </div>
        </div>
    )
}

export default Header
