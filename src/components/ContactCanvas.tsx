import React, { Suspense } from 'react';
import { Preload } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Effect } from './Effect';
import { ImagePlane } from './ImagePlane';
import { Scroll, ScrollControls } from "@react-three/drei";
import Contactpage from './Contact';
// import grain from 'https://i.gifer.com/Azgz.gif';
import Footer from './Footer/Footer';


function Contact() {
  return (
    <Canvas style={{ position: 'relative'}}
			 camera={{
				position: [0, 3, 1],
				fov: 10,
				aspect: window.innerWidth / window.innerHeight,
				near: 0.1,
				far: 2000
			}}
			dpr={window.devicePixelRatio}>
			{/* canvas color */}
			<color attach="background" args={['#000']} />
			{/* camera controller */}
			{/* <OrbitControls attach="orbitControls" /> */}
			{/* helper */}
			{/* <Stats /> */}
			{/* object */}
			<Suspense fallback={null}>
			<ScrollControls
  pages={1.35} // Each page takes 100% of the height of the canvas
  distance={1} // A factor that increases scroll bar travel (default: 1)
  damping={5} // Friction, higher is faster (default: 4)
  horizontal={false} // Can also scroll horizontally (default: false)
  infinite={false} // Can also scroll infinitely (default: false)
>
  {/* You can have components in here, they are not scrolled, but they can still
      react to scroll by using useScroll! */}
	  <ImagePlane/>
  <Scroll html>
	  <div className='wrapper' style={{width: "100vw", height: '136vh'}}>
		  <div className='bgimg' style={{ zIndex: '1'}}>
      		{/* <img className='grain' src="https://i.gifer.com/Azgz.gif" alt=''/> */}
      	</div>
	<Contactpage/>
	<Footer/>
	</div>
  </Scroll>
</ScrollControls>

				<Preload/>
			</Suspense>
			{/* effect */}
			<Effect />
			
		</Canvas>
  )
}

export default Contact;