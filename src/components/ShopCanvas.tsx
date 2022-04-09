import React, { Suspense } from 'react';
import { Preload } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Effect } from './Effect';
import { ImagePlane } from './ImagePlane';
import { Scroll, ScrollControls } from "@react-three/drei";
import Shop from './Shop';
import grain from './images/grain5.gif'

function ShopCanvas() {
  return (
    <Canvas style={{ position: 'relative'}}
			 camera={{
				position: [0, 1, 2],
				fov: 30,
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
  pages={1} // Each page takes 100% of the height of the canvas
  distance={1} // A factor that increases scroll bar travel (default: 1)
  damping={2} // Friction, higher is faster (default: 4)
  horizontal={false} // Can also scroll horizontally (default: false)
  infinite={false} // Can also scroll infinitely (default: false)
>
  {/* You can have components in here, they are not scrolled, but they can still
      react to scroll by using useScroll! */}
	  <ImagePlane/>
  <Scroll>
	  
  </Scroll>
  <Scroll html>
	  <div className='wrapper' style={{width: "100vw", height: '100vh'}}>
      	<div className='bgimg' style={{ zIndex: '99'}}>
      		<img className='grain' src={grain} alt=''/>
      	</div>
    <Shop/>
	
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

export default ShopCanvas