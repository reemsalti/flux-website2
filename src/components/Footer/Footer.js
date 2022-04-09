
import React from 'react'
import { GrInstagram } from 'react-icons/gr';
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
                <p className='copyright'>Through & Through © 2022</p>
                <div className='fl3'>
                
                <p>
                  
                  <a className='iglink' href='https://www.instagram.com/thrundthru/' target='t_blank'>
                  <GrInstagram className='ficon'/> @thrundthru
                  </a>
                </p><p className='dev'>Website developed by <u>WebDevReem</u></p></div>
           </div>
    );
}
export default Footer;