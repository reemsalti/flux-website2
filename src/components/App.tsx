import { Leva } from 'leva';
import { useState } from 'react';
import React, { VFC } from 'react';
import { TCanvas } from './TCanvas';
import Navbar from './Navbar/index';
import Sidebar from './Sidebar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {Home} from './Home'
import Contact from './Contact';
// import grain from './images/grain5.gif';
import './App.css';

export const App: VFC = () => {
	const [isOpen, setIsOpen] = useState(false)
  
  	const toggle = () => {
      setIsOpen(!isOpen)
  }

	return (
		<>
		<Router>
			
		<Navbar toggle={toggle}/>
		<Sidebar isOpen={isOpen} toggle={toggle}/>
		<div className='wrapper' style={{ position: 'absolute', display: "inline-block", width: '100vw', height: '100vh', top:'0' }}>
			<div className='bg'>
				{/* <img className='grain' src={grain} alt='' /> */}
			</div>
			<TCanvas />
			<Leva hidden/>
			</div>
			<Routes>
				<Route path={"/"} element={<Home/>}/>
				<Route path={'/contact'} element={<Contact/>}/>

			</Routes>
		
		
		</Router>
		</>
	)
}
