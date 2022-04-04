import React from 'react';
//import FooterComponent from './Footer/Footer';
// import FooterComponent from './Footer/Footer';
import './Home.css';
import art1 from './images/artwork1.jpg';
import art2 from './images/photo2.jpg';
import art3 from './images/photo3.jpg';
import art4 from './images/photo4.jpg';




export const Home = () => {
  return (
    <>
    <div className='container'>
      {/* <img className='grain' src={grain} alt='' /> */}
      <div className='hdr'>
        <h1 className='dtview'>Through & Through</h1>
        <h1 className='mbview'>Through<br></br>&<br></br>Through</h1>
        <h2 className='by'>Veronica Hermez</h2>
      </div>
      {/* <a href='#page2'><CgArrowLongDown className='arrow'/></a> */}
      <div className='featured' id='page2'>
        <img className='featuredart' src={art1} alt=''/>
        <img className='featuredart' src={art4} alt=''/>
        <img className='featuredart' src={art2} alt=''/>
        <img className='featuredart' src={art3} alt=''/>
      </div>
    </div>
  
    </>
  )
}

