import { useState, useEffect, useContext } from 'react';
import Arrangements from '../arrangements/Arrangements'
import Select from "react-dropdown-select";
import PropTypes from 'prop-types';
import {MyContext} from '../../Contexts/MyContext'
import Loading from '../Loading';


const Dashboard = () => {
    const [sortList, setSortList] = useState([]);
    const [currentSort, setCurrentSort] = useState([]);
    const {setTestContext, arrangements} = useContext(MyContext);
    console.log(arrangements)



    /*
    state = {
        setNavbarOpaque: false,
        currentSort: {label:'Newest', name: 'new'},
        sortlist: [
            {label:'Newest', name: 'new'},
            {label:'Most Popular', name: 'popular'},
            {label:'Price: High to Low', name: 'high'},
            {label:'Price: Low to High', name: 'low'},
        ],
        categories: [
            
        ]
    }

    changeNavClass = (inIntro) => {
        this.setState({setNavbarOpaque: !inIntro});
    }

    onSortChange = (value) => {
        let newCurrent = this.state.sortlist.filter(sort => sort.name == value[0].name);
        this.setState({currentSort: newCurrent[0]});
    }

    */
   let testClick = () => {
       console.log('clicked');
   }


    return (
        <div id="dash"  className="container">
            {!arrangements || arrangements.length == 0 ? <Loading></Loading>:
            <div className="row">
                <div className="col-12 p-0">
                    <img className="mainImage" src="https://images.pexels.com/photos/428611/bouquet-roses-colorful-floral-428611.jpeg?w=1260&h=750&auto=compress&cs=tinysrgb" alt="" />
                </div>
                <div className="col-12">
                    <div className="row">

                        <div className="col-12 col-lg-6 row">
                            <div className="col-5 col-lg-2">
                                Sort By: 
                            </div>
                            <div className="col-7 col-lg-4">
                                
                            </div>
                        </div>

                        <div className="col-12 col-lg-6 row">
                            <div className="col-5 col-lg-2">Filter By:</div>
                            <div className="col-7 col-lg-4">

                            </div>
                        </div>
                    </div>
                    <div className="row text-center">
                        <input
                            type="text"
                            onChange={(e) => {setTestContext(e.target.value)}}/>
                        <button onClick={testClick}>Click</button>

                        
                        
                    </div>
                </div>
            </div>
            }
        </div>
    )
    
}

export default Dashboard;

