import { Leva } from 'leva';
import React, {VFC } from 'react';
import { TCanvas } from './TCanvas';
import { HashRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import fluxLogo from './images/logo.png'
//import grain from './images/grain5.gif'

export const App: VFC =  () => {

	return (
		<>
		<HashRouter>
		<div className='wrapper' style={{ position: 'absolute', width: '100vw', height: '100vh', top:'0', alignItems: 'center', justifyContent: 'center', display: 'flex' }}>
		<div className='wrapper' style={{ position: 'absolute', width: '100vw', height: '100vh', top:'0', alignItems: 'center', justifyContent: 'center', display: 'flex' }}></div>
		<img style={{display: 'flex', position: "absolute", width: "35rem", height: "30rem", zIndex: '1', justifyContent: 'center', alignItems: 'center'}} src={fluxLogo} alt=''/>
		<p style={{fontFamily: 'Aldrich', display: 'flex', position: 'absolute', zIndex: "2", color: '#fff', fontSize: '3rem', bottom: '10%'}}>COMING SOON</p>
		<div/>
			<Leva hidden/>
			<Routes>
				<Route path={"/"} element={<TCanvas/>}/>
			</Routes>
		</div>
		</HashRouter>
		</>
	)
}
