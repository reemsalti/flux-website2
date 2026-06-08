import { useMemo, type FC } from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { publicPath } from '../utils/file';

export const ImagePlane: FC = () => {
	const { viewport } = useThree();
	const texture = useTexture(publicPath('/assets/images/fluxcolors.jpg'));

	// tile the colour texture so the distortion can pull samples beyond [0,1]
	texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

	const material = useMemo(
		() =>
			new THREE.ShaderMaterial({
				uniforms: {
					u_texture: { value: texture }
				},
				vertexShader,
				fragmentShader
			}),
		[texture]
	);

	// size the plane to exactly cover the camera's view at z = 0
	return (
		<mesh material={material} scale={[viewport.width, viewport.height, 1]}>
			<planeGeometry args={[1, 1]} />
		</mesh>
	);
};

// --------------------------------------------------------
const vertexShader = `
varying vec2 v_uv;

void main() {
  v_uv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`

const fragmentShader = `
uniform sampler2D u_texture;
varying vec2 v_uv;

void main() {
  vec4 color = texture2D(u_texture, v_uv);
  gl_FragColor = color;
}
`
