import styled from 'styled-components';
import { NavLink as Link } from 'react-router-dom';

export const Nav = styled.nav`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	height: 80px;
	display: flex;
	align-items: center;
	z-index: 100;
	background: transparent;
	border: none;
	transition:
		opacity 0.4s ease,
		transform 0.4s ease;

	&.nav--hidden {
		opacity: 0;
		transform: translateY(-100%);
		pointer-events: none;
	}
`;

export const NavbarContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	max-width: 1200px;
	margin: 0 auto;
	padding: 0 1.5rem;
`;

export const Logo = styled(Link)`
	display: flex;
	align-items: center;
	cursor: pointer;
	filter: drop-shadow(0 2px 12px rgba(0, 0, 0, 0.45));

	img {
		height: 48px;
		width: auto;
		display: block;
	}
`;

export const NavMenu = styled.ul`
	display: flex;
	align-items: center;
	list-style: none;
	margin: 0;
	padding: 0;
`;

export const NavItem = styled.li`
	display: flex;
	align-items: center;
	gap: 1.75rem;

	@media screen and (max-width: 768px) {
		gap: 1rem;
	}
`;

export const NavLink = styled(Link)`
	color: var(--text);
	text-decoration: none;
	font-family: var(--font-body);
	font-weight: 500;
	font-size: 0.72rem;
	text-transform: uppercase;
	letter-spacing: 0.18em;

	@media screen and (max-width: 768px) {
		font-size: 0.62rem;
		letter-spacing: 0.12em;
	}
	transition: color 0.2s ease, opacity 0.2s ease;
	cursor: pointer;
	text-shadow: 0 1px 8px rgba(0, 0, 0, 0.6);

	&:hover,
	&.active {
		color: var(--accent-soft);
	}
`;
