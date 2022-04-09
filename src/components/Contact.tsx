import React from 'react';
import './Contact.css';
import {ContactForm} from './contactcomponent/contactform';
import { GrInstagram } from 'react-icons/gr';
import { FiMail } from 'react-icons/fi';

// import FooterComponent from './Footer/Footer.js';

// import grain from './images/grain5.gif';

const Contactpage =()=> {
  return (
    <div className='container'>
        {/* <img className='grain' src={grain} alt='' /> */}
         <h1 className='hdr'>Contact</h1>
          <div className='contactdetails'>
            <div className='link'>
            <GrInstagram className='cicon'/>
             <a className='clink' href='https://www.instagram.com/thrundthru/' target='t_blank'>
              @thrundthru
            </a>
            </div>
            <br></br>
            <div className='link'>
           <FiMail className='cicon'/><a className='clink' href='mailto:throughandthroughart@hotmail.com' target='t_blank'>
              throughandthroughart@hotmail.com
            </a>
            </div>
          </div>
          <div>
          
          </div>
         <div className='formwrapper'>
           
         <ContactForm/>
         </div>
    </div>
  )
}
export default Contactpage;
