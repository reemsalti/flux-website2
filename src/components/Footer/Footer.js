
import React from 'react'

import './Footer.css';
import logoimg from './logo1.png';

function Footer () {
  return (
    <div className='footer-container'>
                <div className='footernav'>
                    <a className="fnlink" href='https://throughandthrough.ca'>Home</a>
                    <a className="fnlink" href='https://throughandthrough.ca/#/contact'>Contact</a>
                    <a className="fnlink" href='https://throughandthrough.ca/#/shop'>Shop</a>
                 </div>
                
                <a href="https://throughandthrough.ca" className='footerlogo'><img className="footerlogo"src={logoimg} alt=''/></a>
                <p className='copyright'>Through & Through<strong>©</strong> 2022</p>
                
           </div>
    );
}
export default Footer;