import PropTypes from 'prop-types'
import PhoneInput from 'react-phone-number-input/input'

function CustomerForm({customer, setCustomer}) {
  return (
    <div className="col-12 col-md-6">
      <h4>1. Your Info</h4>
      <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input type="text" 
              name="firstName" 
              id="firstNameInput" 
              className='form-control'
              value={customer.firstName}
              onChange={(e) => setCustomer({...customer, [e.target.name]: e.target.value})}
              required/>
      </div>
      <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input type="text" 
              name="lastName" 
              id="lastNameInput" 
              className='form-control' 
              value={customer.lastName}
              onChange={(e) => setCustomer({...customer, [e.target.name]: e.target.value})}
              required/>
      </div>
      <div className="form-group">
          <label htmlFor="phoneNumber">Phone Number</label>
          <PhoneInput
              name="phone"
              country="US"
              value={customer.phone}
              placeholder='(123) 456-7890'
              className='form-control'
              onChange={(value) => setCustomer({...customer, phone: value})}
              rules={{required:true}}/>
      </div>
      <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" 
              name="email" 
              id="emailInput" 
              className='form-control' 
              value={customer.email}
              onChange={(e) => setCustomer({...customer, [e.target.name]: e.target.value})}
              required/>
      </div>
  </div>
  )
}

CustomerForm.propTypes = {
  customer: PropTypes.object,
  setCustomer: PropTypes.func
}

export default CustomerForm