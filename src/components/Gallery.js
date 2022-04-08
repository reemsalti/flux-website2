import React from 'react';
import './Home.css';
import 'photoswipe/dist/photoswipe.css';
import 'photoswipe/dist/default-skin/default-skin.css';
import art1 from './images/artwork1.jpg';
import art2 from './images/photo2.jpg';
import art3 from './images/photo3.jpg';
import art4 from './images/photo4.jpg';

import { Gallery, Item } from 'react-photoswipe-gallery'

const MyGallery = () => (
  
  <Gallery>
    <div className='row'>
    <Item
      original={art1}
      width="200"
      height="150"
    >
      {({ ref, open }) => (
        <img className='gall' ref={ref} onClick={open} src={art1} alt='' />
      )}
    </Item>
    <Item
      original={art2}
      width="150"
      height="200"
    >
      {({ ref, open }) => (
        <img className='gall' ref={ref} onClick={open} src={art2} alt='' />
      )}
    </Item>
    <Item
      original={art3}
      width="150"
      height="200"
    >
      {({ ref, open }) => (
        <img className='gall' ref={ref} onClick={open} src={art3} alt='' />
      )}
    </Item>
    <Item
      original={art4}
      width="150"
      height="200"
    >
      {({ ref, open }) => (
        <img className='gall' ref={ref} onClick={open} src={art4} alt='' />
      )}
    </Item>
    </div>
  </Gallery>
  
  
)

export default MyGallery;