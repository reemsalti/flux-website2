import { useEffect, useState } from 'react';
import type { FC } from 'react';
import { useLocation } from 'react-router-dom';
import { TCanvas } from './TCanvas';
import './WarpBackground.css';

type WarpBackgroundProps = {
	isHome: boolean;
};

export const WarpBackground: FC<WarpBackgroundProps> = ({ isHome }) => {
	const [paused, setPaused] = useState(false);

	useEffect(() => {
		const sync = () => {
			setPaused(
				document.hidden || document.body.classList.contains('gallery-focus'),
			);
		};

		sync();
		document.addEventListener('visibilitychange', sync);

		const observer = new MutationObserver(sync);
		observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

		return () => {
			document.removeEventListener('visibilitychange', sync);
			observer.disconnect();
		};
	}, []);

	return (
		<>
			<div className='warp-bg' aria-hidden='true'>
				<TCanvas paused={paused} />
			</div>
			<div
				className={`warp-scrim warp-scrim--home${isHome ? ' is-active' : ''}`}
				aria-hidden='true'
			/>
			<div
				className={`warp-scrim warp-scrim--page${isHome ? '' : ' is-active'}`}
				aria-hidden='true'
			/>
		</>
	);
};

export const ScrollToTop: FC = () => {
	const { pathname } = useLocation();

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [pathname]);

	return null;
};
