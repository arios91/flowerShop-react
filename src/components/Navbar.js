import {Link} from 'react-router-dom'

const Navbar = () => {
    return (
        <div className="container mb-3 headerRow mx-3">
            <nav className="navbar navbar-expand-sm navbar-light">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#"></a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
                        <div className="navbar-nav w-100">
                            <Link to='/' className='nav-item nav-link w-50 text-center'>
                                <h5 className="headerLinkText">Home</h5>
                            </Link>
                            <Link to='/cart' className='nav-item nav-link w-50 text-center'>
                                <h5 className="headerLinkText">Cart</h5>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Navbar
