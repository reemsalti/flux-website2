import { useState, useCallback } from 'react';
import type { FC } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import { WarpBackground, ScrollToTop } from './WarpBackground';
import { IntroOverlay } from './intro/IntroOverlay';
import { Home } from './Home';
import Shop from './Shop';
import Contactpage from './Contact';
import './App.css';

const introSeen = () => sessionStorage.getItem('intro-seen') === '1';

export const App: FC = () => {
	const [introDone, setIntroDone] = useState(introSeen);
	const location = useLocation();
	const isHome = location.pathname === '/';
	const showIntro = isHome && !introDone;

	const finishIntro = useCallback(() => {
		sessionStorage.setItem('intro-seen', '1');
		document.body.classList.remove('intro-active', 'intro-text-in');
		setIntroDone(true);
	}, []);

	return (
		<div className="app">
			<ScrollToTop />
			{showIntro && <IntroOverlay onComplete={finishIntro} />}
			<WarpBackground isHome={isHome} />
			<Navbar hidden={showIntro} />

			<main className="app__content">
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/shop" element={<Shop />} />
					<Route path="/contact" element={<Contactpage />} />
				</Routes>
			</main>
		</div>
	);
};
