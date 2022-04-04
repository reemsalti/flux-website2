
import React from 'react'
import { Link } from 'react-router-dom'
import './Footer.css';
import logoimg from './logo1.png';

function Footer() {
  return (
    <div className='footer-container'>
                <div className='footernav'>
                    <Link className="fnlink" to='/'>Home</Link>
                    <Link className="fnlink" to='/contact'>Contact</Link>
                    <Link className="fnlink" to='/sheds'>Shop</Link>
                 </div>
                <Link to="/" className='footerlogo'><img className="footerlogo"src={logoimg} alt=''/></Link>
                <p className='copyright'>Through & Through<strong>©</strong> 2022</p>
            </div>
  )
}
export default Footer;