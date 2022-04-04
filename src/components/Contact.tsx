import React from 'react';
import './Contact.css';
import {ContactForm} from './contactcomponent/contactform';

// import FooterComponent from './Footer/Footer.js';

// import grain from './images/grain5.gif';

const Contactpage =()=> {
  return (
    <div className='container'>
        {/* <img className='grain' src={grain} alt='' /> */}
         <h1 className='hdr'>Contact</h1>
          <div className='contactdetails'>
            
          </div>
         <div className='formwrapper'>
         <ContactForm/>

         </div>
         {/* <FooterComponent/> */}
    </div>
  )
}
export default Contactpage;
