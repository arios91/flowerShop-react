
const Footer = () => {
    /*
    state = {
        setNavbarOpaque: false
    }

    changeNavClass = (inIntro) => {
        this.setState({setNavbarOpaque: !inIntro});
    }

    <a _ngcontent-c3="" href="https://goo.gl/maps/v2TucsdmAw22">200 N La Homa Rd, Palmview TX</a>
    */
    return (
        <div id="footer"  className="container footer">
            <div className="row"><a href="tel:+1-956-607-6047">956-607-6047</a></div>
            <div className="row"><a href="https://goo.gl/maps/v2TucsdmAw22">200 N La Homa Rd, Palmview TX</a></div>
            <div className="row">Facebook</div>
        </div>
    )
}

export default Footer
