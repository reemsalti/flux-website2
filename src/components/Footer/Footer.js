import React from 'react'
import { Link } from 'react-router-dom'
import './Footer.css';

function Footer() {
  return (
    <div className='footer-container'>
                <div className='footernav'>
                    <Link className="fnlink" to='/'>Home</Link>
                    <Link className="fnlink" to='/'>Gazebos</Link>
                    <Link className="fnlink" to='/sheds'>Sheds</Link>
                    <Link className="fnlink" to='/furniture'>Furniture</Link>
                    <Link className="fnlink" to='/testimonials'>Testimonials</Link>
                    <Link className="fnlink" to='/contact'>Contact</Link>
                    <br></br>
               <Link to="/" className='footerlogo'>Get Installed<br></br><p className='slgn'> "The Quick Installers"</p></Link>
                <p className='copyright'> Get Installed <strong>©</strong> 2022</p> </div>
                
            </div>
  )
}
export default Footer;