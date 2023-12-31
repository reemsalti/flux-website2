import React, { VFC } from 'react';
import * as THREE from 'three';
import { Plane, useTexture } from '@react-three/drei';
import { publicPath } from '../utils/file';

export const ImagePlane: VFC = () => {
	const path = (name: string) => publicPath(`/assets/images/${name}.jpg`)
	const textures = useTexture([path('fluxcolors'), path('fluxcolors2')])

	const material = (texture: THREE.Texture) =>
		new THREE.ShaderMaterial({
			uniforms: {
				u_texture: { value: texture }
				
			},
			vertexShader: vertexShader,
			fragmentShader: fragmentShader
			
		})

	return (
		<>
			{textures.map((texture, i) => (
				<Plane key={i} args={[0.4, 33 * (615 / 900)]} material={material(texture)} scale={0.9} position={[i - 1, 0, 0]} />
			))}
		
		</>
	)
}

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
