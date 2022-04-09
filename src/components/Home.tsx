import React from 'react';
import './Home.css';
import art1 from './images/artwork1.jpg';
import art2 from './images/photo2.jpg';
import art3 from './images/photo3.jpg';
import art4 from './images/photo4.jpg';
import art5 from './images/photo5.jpg';


export const Home = () => {
  return (
    <>
    <div className='container'>
      
      <div className='hdr'>
        <h1 className='dtview'>Through & Through</h1>
        <h1 className='mbview'>Through<br></br>&<br></br>Through</h1>
        <h2 className='slogan'>A Transcending Vision</h2>
        <h2 className='by'> by Veronica Hermez</h2>
      </div>
      <h3 className='stmnthdr'>Artist's Statement</h3>
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

      <div className='panel'>
        <img className='featuredart' src={art4} alt=''/>
        <p className='title'>Through the Looking Glass</p>
      </div>

<div className='panel2'>
      <div className='subpanel'>
        <img className='featuredart' src={art2} alt=''/>
        <p className='title'>Mandate of Heaven</p>
      </div>

      <div className='subpanel'>
        <img className='featuredart' src={art3} alt=''/>
        <p className='title'>Meloncholy Reflections</p>
      </div>

</div>
      <div className='panel'>
        <img className='featuredart' src={art1} alt=''/>
        <p className='title'>Vibrant Melodies</p>
      </div>
        
      <div className='panel'>
        <img className='featuredart' src={art5} alt=''/>
        <p className='title'>Negative Space Monsters</p>
      </div>

      </div> 
  
    </div>
  
    </>
  )
}

