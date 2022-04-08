import { Leva } from 'leva';
import { useState } from 'react';
import React, { VFC } from 'react';
import { TCanvas } from './TCanvas';
import Navbar from './Navbar/index';
import Sidebar from './Sidebar';
import { HashRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Contact from './ContactCanvas';
import ShopCanvas from './ShopCanvas';
import grain from './images/grain5.gif'

export const App: VFC = () => {
	const [isOpen, setIsOpen] = useState(false)
  
  	const toggle = () => {
      setIsOpen(!isOpen)
  }
	return (
		<>
		<HashRouter>
			
		<Navbar toggle={toggle}/>
		<Sidebar isOpen={isOpen} toggle={toggle}/>
		
		<div className='wrapper' style={{ position: 'relative', width: '100vw', height: '100vh', top:'0' }}>
			<Leva hidden/>
			
			<Routes>
				<Route path={"/"} element={<TCanvas/>}/>
				<Route path={'/contact'} element={<Contact/>}/>
				<Route path={'/shop'} element={<ShopCanvas/>}/>
			</Routes>
		</div>
		</HashRouter>
		</>
	)
}
