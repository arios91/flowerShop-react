import {Fragment, useContext} from 'react'
import MyContext from '../../Contexts/MyContext';
import PropTypes from 'prop-types'
import Currency from 'react-currency-formatter';


function CartItems({cartItems}) {
    const {setCart} = useContext(MyContext);
    
    let remove = indexToRemove => {
        let newItems = cartItems.filter((item, index) => {
            return index !== indexToRemove;
        });
        console.log(newItems);
        setCart(newItems);
    }

  return (
      <Fragment>
          {cartItems.map((item, index) => (
              <div className="row mt-3" key={item.name}>
                  <div className="col-4 p-0">
                      <img src={item.imageUrl} alt={item.name} className='w-130'/>
                  </div>
                  <div className="col-4">
                      <h4>{item.name}</h4>
                      {item.productAddons && item.productAddons.length > 0 ?
                      <Fragment>
                          <div>Along with:</div>
                          {item.productAddons.map(addon => (
                              <div key={addon.name}>{addon.name}</div>
                          ))}
                      </Fragment> 
                      :<Fragment/>}
                  </div>
                  <div className="col-4">
                      <h4>
                          Price: <Currency quantity={item.totalPrice} currency="USD"/>
                      </h4>
                  </div>
                  <div className="col-4 p-0 mt-1">
                      <button className="btn btn-outline-secondary w-130" onClick={e => remove(index)}>Remove</button>
                  </div>
              </div>
          ))}
      </Fragment>
  )
}

CartItems.propTypes = {
    cartItems: PropTypes.array
}

export default CartItems