import { useState, useEffect, useContext } from 'react';
import Select from "react-dropdown-select";
import PropTypes from 'prop-types';
import Loading from '../Loading';
import Arrangement from '../Arrangement';
import MyContext from '../../Contexts/MyContext';


const Dashboard = () => {
    const [sortList, setSortList] = useState([]);
    const [currentSort, setCurrentSort] = useState([]);
    const {arrangementPages, currentPage, handlePageNavigation, isLoading, away, awayMessage} = useContext(MyContext);



    /* const {addToCart, arrangementPages, currentPage, setCurrentPage} = useContext(MyContext); */
    /*
        To-do:
        - sort and filter
        - styling
    */
    
    let onPageClick = (e) => {
        e.preventDefault();
        let newPage = e.target.text - 1;
        console.log(newPage)
        if(newPage !== currentPage){
            handlePageNavigation(newPage)
        }
    }

    let onNavButtonClick = (e) => {
        if(e.target.name === 'prevButton'){
            if(currentPage > 0){
                handlePageNavigation(currentPage - 1);
            }
        }else if(e.target.name === 'nextButton'){
            if(currentPage < arrangementPages.length - 1){
                handlePageNavigation(currentPage + 1);
            }
        }
    }

    let pageButtons = arrangementPages.map((page, index) => (
        <li className='pageItem' onClick={onPageClick} key={index}>
            <a className='pageLink'>{index + 1}</a>
        </li>
    ));


    return isLoading ? <div>Loading</div> :

    
        <div id="dash"  className="container">
            {!arrangementPages || arrangementPages.length == 0 ? <Loading></Loading>:
            <div className="row">
                <div className="col-12 text-center">
                    {away && awayMessage}
                </div>
                <div className="col-12 p-0">
                    <img className="mainImage" src="https://images.pexels.com/photos/428611/bouquet-roses-colorful-floral-428611.jpeg?w=1260&h=750&auto=compress&cs=tinysrgb" alt="" />
                </div>
                <div className="col-12">
                    <div className="row">

                        <div className="col-12 col-lg-6 row sortContainer">
                            <div className="col-5 col-lg-2">
                                Sort By: 
                            </div>
                            <div className="col-7 col-lg-4">
                                sort here
                            </div>
                        </div>

                        <div className="col-12 col-lg-6 row filterContainer">
                            <div className="col-5 col-lg-2">Filter By:</div>
                            <div className="col-7 col-lg-4">
                                filter here
                            </div>
                        </div>
                    </div>
                    <div className="row text-center">
                        <div className="col-12 ">
                            <ul className='pagination'>
                                <li className='pageItem' >
                                    <a name='prevButton' className='pageLink' onClick={onNavButtonClick}>Previous</a>
                                </li>
                                {pageButtons}
                                <li className='pageItem'>
                                    <a name='nextButton' className='pageLink' onClick={onNavButtonClick}>Next</a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="row">
                        {arrangementPages[currentPage].map(tmpItem => (
                            <div className='col-6 col-md-4' key={tmpItem.id}>
                                <Arrangement arrangement={tmpItem}/>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            }
        </div>
    
}

export default Dashboard;



