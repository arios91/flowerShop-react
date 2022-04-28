import PropTypes from 'prop-types'
import PhoneInput from 'react-phone-number-input/input'

function RecipientForm({recipient, setRecipient}) {
  return (
    <div className="col-12 col-md-6">
        <h4>2. Their Info</h4>
        <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input type="text" 
                name="firstName" 
                id="recipientNameInput" 
                className='form-control' 
                value={recipient.firstName}
                onChange={(e) => setRecipient({...recipient, [e.target.name]: e.target.value})}
                required/>
        </div>
        <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input type="text" 
                name="lastName"
                id="recipientLastNameInput" 
                className='form-control'
                value={recipient.lastName}
                onChange={(e) => setRecipient({...recipient, [e.target.name]: e.target.value})}
                required/>
        </div>
        <div className="form-group">
            <label htmlFor="recipientPhoneNumber">Phone Number (optional)</label>
            <PhoneInput 
                country="US"
                className='form-control'
                name="recipientPhoneNumber" 
                value={recipient.phone}
                onChange={(value) => setRecipient({...recipient, phone: value})}
                placeholder="(123) 456-7890"/>
        </div>
    </div>
  )
}

RecipientForm.propTypes = {
    recipient: PropTypes.object,
    setRecipient: PropTypes.func
  }

export default RecipientForm