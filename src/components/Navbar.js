import {Link} from 'react-router-dom'

const Navbar = () => {
    return (
        <div className="container mb-3 headerRow">
            <nav class="navbar navbar-expand-sm navbar-light bg-light">
                <div class="container-fluid">
                    <a class="navbar-brand" href="#"></a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarTogglerDemo02">
                        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                            <Link to='/' className='nav-item'>
                                <h5 class="headerLinkText">Home</h5>
                            </Link>
                            <Link to='/cart' className='nav-item'>
                            <h5 class="headerLinkText">Cart</h5>
                            </Link>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Navbar
