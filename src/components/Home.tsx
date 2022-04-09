import React from 'react';
import Footer from './Footer/Footer';
import './Home.css';
import art1 from './images/artwork1.jpg';
import art2 from './images/photo2.jpg';
import art3 from './images/photo3.jpg';
import art4 from './images/photo4.jpg';

export const Home = () => {
  return (
    <>
    <div className='container'>
      
      <div className='hdr'>
        <h1 className='dtview'>Through & Through</h1>
        <h1 className='mbview'>Through<br></br>&<br></br>Through</h1>
        <h2 className='by'> by Veronica Hermez</h2>
      </div><h3 className='stmnthdr'>Artist's Statement</h3>
      <div className='biosection'>
        
              <p className='artiststmnt'>"My fluid and bold work is created by 
              showing up and allowing my first brush stroke to inspire the next. 
              I create organic shapes and utilize a wide array of colors as a means 
              of translation between my psyche and the viewer of my work. The shapes 
              that I create are a result of my subconscious imagination and later inspire 
              the subject matter; I aim to leave the interpretation of my work to each viewer."</p>
      </div>
      <div className='featured'> 
      <h3 className='fthdr'>Portfolio</h3>
        <img className='featuredart2' src={art4} alt='' />
        <div>
        <img className='featuredart' src={art2} alt=''/>
        <img className='featuredart' src={art3} alt=''/>
        </div>
        <img className='featuredart2' src={art1} alt=''/>
      </div>
      <Footer/>
    </div>
  
    </>
  )
}

