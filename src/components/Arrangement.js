import { useContext } from 'react';
import PropTypes from 'prop-types';
import { Fragment } from 'react';
import {Link} from 'react-router-dom'
import { MyContext } from '../Contexts/MyContext';


const Arrangement = ({item}) => {
    const {setCurrentArrangement} = useContext(MyContext)

    let onTestClick = e => {
        console.log('clicked');
        setCurrentArrangement(item);
    }
    return (
        <div className='arrangementContainer card mb-4'>
            <img src={item.imageUrl} alt="arrangement image" />
            <div className="card-body text-center">
                <p className="arrangementTitle mb-0">{item.name}</p>
                <p className="arrangementPrice mb-2">${item.price}</p>
                <Link className="btn btn-sm btn-outline-secondary viewButton" to="/viewProduct" onClick={(e => {onTestClick(e)})}>View</Link>
            </div>
        </div>
    )
}

Arrangement.defaultProps = {
    item: {}
}

Arrangement.propTypes ={
    item: PropTypes.object
}

export default Arrangement
