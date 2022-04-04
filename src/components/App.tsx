import { Leva } from 'leva';
import { useState } from 'react';
import React, { VFC } from 'react';
import { TCanvas } from './TCanvas';
import Navbar from './Navbar/index';
import Sidebar from './Sidebar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
//import {Home} from './Home'
import './App.css';
import Contact from './ContactCanvas';
import ShopCanvas from './ShopCanvas';
import FooterComponent from './Footer/Footer.js';
//import Footer from './footer/Footer';
// import Footer from './Footer/Footer';



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
		<div className='wrapper' style={{ position: 'relative', width: '100vw', height: '100vh', top:'0' }}>
			<Leva hidden/>
			<div className='footerwrapper'>
				<FooterComponent/>
			</div>
			<Routes>
				<Route path={"/"} element={<TCanvas/>}/>
				<Route path={'/contact'} element={<Contact/>}/>
				<Route path={'/shop'} element={<ShopCanvas/>}/>
			</Routes>
		</div>
		</Router>
		</>
	)
}
