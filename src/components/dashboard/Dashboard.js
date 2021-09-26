import React, { Component } from 'react';

class Dashboard extends Component {
    state = {
        setNavbarOpaque: false
    }

    changeNavClass = (inIntro) => {
        this.setState({setNavbarOpaque: !inIntro});
    }

    render() {
        return (
            <div id="dash"  className="container">
                <div className="row">
                    <div className="col-12 p-0 ">
                        <img className="mainImage" src="https://images.pexels.com/photos/428611/bouquet-roses-colorful-floral-428611.jpeg?w=1260&h=750&auto=compress&cs=tinysrgb" alt="" />
                    </div>
                </div>
            </div>
        )
    }
}

export default Dashboard;

