const Header = () => {
    return (
        <div id="header"  className="container text-center">
            <div className="row headerRow">
                <div className="col-12 col-lg-3 headerSubscript d-none d-lg-block">
                    <span>
                        Locally owned flower shop in Palmview, TX
                    </span>
                </div>
                <div className="col-12 col-lg-6 headerMain">Pétalos y Arte</div>
                <div className="col-12 col-lg-3 headerSubscript d-none d-lg-block">
                    <span>
                        Providing same day flower delivery for the valley
                    </span>
                </div>
            </div>
        </div>
    )
}

export default Header
