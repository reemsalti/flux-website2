import { Suspense, type FC } from 'react';
import { Canvas } from '@react-three/fiber';
import { Effect } from './Effect';
import { ImagePlane } from './ImagePlane';

type TCanvasProps = {
	paused?: boolean;
};

const canvasDpr = () => Math.min(window.devicePixelRatio, 1.5);

export const TCanvas: FC<TCanvasProps> = ({ paused = false }) => (
	<Canvas
		style={{ width: '100%', height: '100%', display: 'block' }}
		frameloop={paused ? 'never' : 'always'}
		camera={{
			position: [0, 0, 1],
			fov: 50,
			near: 0.1,
			far: 2000,
		}}
		dpr={canvasDpr()}
	>
		<color attach='background' args={['#000000']} />
		<Suspense fallback={null}>
			<ImagePlane />
			<Effect />
		</Suspense>
	</Canvas>
);
