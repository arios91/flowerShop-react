import { useState, useEffect, useContext } from 'react';
import Select from "react-dropdown-select";
import PropTypes from 'prop-types';
import Loading from '../Loading';
import Arrangement from '../Arrangement';
import MyContext from '../../Contexts/MyContext';


const Dashboard = () => {
    const itemsPerPage = 12;
    const sortList= [
        {name: 'new', label: 'Newest'},
        {name: 'popular', label: 'Most Popular'},
        {name: 'price1', label: 'Price: High to Low'},
        {name: 'price2', label: 'Price: Low to High'},
    ];
    const [currentSort, setCurrentSort] = useState(sortList[0].name);
    const [arrangementPages, setArrangementPages] = useState([])
    const {arrangements, currentPage, handlePageNavigation, isLoading, away, awayMessage} = useContext(MyContext);

    useEffect(() => {
        handleSort();
    }, [arrangements, currentSort])


    const handleSort = () => {
        if(currentSort == 'new'){
            arrangements.sort((a,b) => b.id - a.id);
        }else if(currentSort == 'popular'){
            arrangements.sort((a,b) => b.popularity - a.popularity);
        }else if(currentSort == 'price1'){
            arrangements.sort((a,b) => b.price - a.price);
        }else if(currentSort == 'price2'){
            arrangements.sort((a,b) => a.price - b.price);
        }
        let counter = 0;
        let page = [];
        let docs = []
        arrangements.forEach(doc => {
            if(counter == itemsPerPage){
                docs.push(page);
                page = [];
                counter = 0;
            }else{
                page.push({...doc});
                counter++;
            }
        })
        setArrangementPages(docs);
    }

    let onPageClick = (e) => {
        e.preventDefault();
        let newPage = e.target.text - 1;
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
        <li className={index == currentPage ? 'pageItem active' : 'pageItem'} onClick={onPageClick} key={index}>
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
                <div className="col-12">
                    <img className="mainImage" src="https://images.pexels.com/photos/428611/bouquet-roses-colorful-floral-428611.jpeg?w=1260&h=750&auto=compress&cs=tinysrgb" alt="" />
                </div>
                <div className="col-12 py-5">
                    <div className="row">
                        <div className="col-12 col-lg-6 sortContainer">
                            Sort By:&nbsp;
                            <select className='form-select custom-select' onChange={e => setCurrentSort(e.target.value)}>
                                {sortList.map(sort => (
                                    <option key={sort.name} value={sort.name}>{sort.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="row text-center">
                        <div className="col-12 ">
                            <ul className='pagination'>
                                <li className={currentPage == 0 ? 'pageItem disabled' : 'pageItem'}>
                                    <a name='prevButton' className='pageLink' onClick={onNavButtonClick}>Previous</a>
                                </li>
                                {pageButtons}
                                <li className={currentPage == arrangementPages.length-1 ? 'pageItem disabled' :'pageItem'}>
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



