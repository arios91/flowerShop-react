import { useContext } from 'react';
import PropTypes from 'prop-types';
import { Fragment } from 'react';
import {Link} from 'react-router-dom'
import MyContext from '../Contexts/MyContext';
import Currency from 'react-currency-formatter';


const Arrangement = ({arrangement}) => {
    const {handleArrangementSelect} = useContext(MyContext)

    let viewArrangement = e => {
        handleArrangementSelect(arrangement);
    }
    
    return (
        <div className='arrangementContainer card mb-4'>
            <img src={arrangement.imageUrl} alt="arrangement image" />
            <div className="card-body text-center">
                <p className="arrangementTitle mb-0">{arrangement.name}</p>
                <p className="arrangementPrice mb-2"><Currency quantity={arrangement.price} currency="USD"/></p>
                <Link className="btn btn-sm btn-outline-secondary viewButton" to="/viewProduct" onClick={(e => {viewArrangement(e)})}>View</Link>
            </div>
        </div>
    )
}

Arrangement.defaultProps = {
    arrangement: {}
}

Arrangement.propTypes ={
    arrangement: PropTypes.object
}

export default Arrangement
