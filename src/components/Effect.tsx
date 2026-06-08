import { useEffect, useRef, type FC } from 'react';
import { EffectComposer, RenderPass, ShaderPass } from 'three-stdlib';
import { extend, useFrame, useThree } from '@react-three/fiber';
import { DistortionPass } from './postprocessing/DistortionPass';
import { RipplePass } from './postprocessing/RipplePass';

extend({ EffectComposer, RenderPass, ShaderPass });

const DISTORTION = { enabled: true, progress: 0.85, scale: 0.6 };
const RIPPLE = { enabled: true };

export const Effect: FC = () => {
	const composerRef = useRef<EffectComposer>(null);
	const { gl, scene, camera, size } = useThree();

	useEffect(() => {
		composerRef.current?.setSize(size.width, size.height);
	}, [size]);

	useFrame(() => {
		composerRef.current?.render();
	}, 1);

	return (
		<effectComposer ref={composerRef} args={[gl]}>
			<renderPass attach='passes-0' args={[scene, camera]} />
			<DistortionPass attach='passes-1' {...DISTORTION} />
			<RipplePass attach='passes-2' {...RIPPLE} />
		</effectComposer>
	);
};
