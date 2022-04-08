
import React, { Suspense, VFC } from 'react';
import { Preload } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Effect } from './Effect';
import { ImagePlane } from './ImagePlane';
import { Scroll, ScrollControls } from "@react-three/drei";
import { Home } from './Home';
import grain from './images/grain8.gif'
import './Home.css'


export const TCanvas: VFC = () => {
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
			pages={5} // Each page takes 100% of the height of the canvas
			distance={1} // A factor that increases scroll bar travel (default: 1)
			damping={4} // Friction, higher is faster (default: 4)
			horizontal={false} // Can also scroll horizontally (default: false)
			infinite={false} // Can also scroll infinitely (default: false)
			>
				<Scroll>
					<ImagePlane/>
				</Scroll>
				<Scroll html>
					<div className='wrapper' style={{width: "100vw", height: '300vh', backgroundSize: '100%', backgroundRepeat: 'repeat'}}>
					<img className='grain' src={grain} alt='' style={{width: '100%', height: '300vh' , zIndex: '999', opacity: '50%', backgroundRepeat: "repeat-y(3)", transform: '180deg'}}/>
						<Home/>
					</div>
				</Scroll>
			</ScrollControls>

				<Preload/>
			</Suspense>
			<Effect />
			
		</Canvas>
		
		
		
	)
}
