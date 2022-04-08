import styled from "styled-components";
import { NavLink as Link } from 'react-router-dom';


export const Nav = styled.nav`
background: transparent;
height: 70px;
width: 100%;
display: block;
align-items: center;
font-size: 1rem;
position: absolute;
margin: auto;
top: 0;
left: 0;
z-index: 999;
overflow: hidden;
cursor: auto;

// box-shadow: 2px 2px 40px #5B6D59;
@media screen and (max-width: 960px) {
    transition: 0.8s all ease;
    
}
`
export const NavbarContainer = styled.div`
display: flex;
justify-content: space-between !important;
height: 70px;
z-index: 1;
width: 100%
padding: 0 2px;
cursor: auto;
`

export const Logo = styled(Link)`
margin: 10px;
cursor: pointer;
text-decoration: none;
// image-rendering: -webkit-optimize-contrast;
image-rendering: optimizeQuality;

@media screen and (max-width: 460px) {
    height: 50px;
    
}
`;

export const logoimg = styled.img`
    
`



export const MobileIcon = styled.div`
display: none;
cursor: auto;


@media screen and (max-width: 768px) {
    display: flex;
    position: absolute;
    top: 0;
    right: 0;
    padding-right: 1.4rem;
    padding-top: 1.4rem;
    font-size: 1.3rem;
    cursor: pointer;
    color: #fff;
    z-index: 999;
    background-colour: transparent;
    
}
`
export const PlusIcon = styled.aside`
    cursor: pointer;
    opacity: ${({ toggle }) => ( toggle ?! '0%' : '100%')};
`

export const NavMenu = styled.ul`
justify-content: right;
display: flex;
align-items: center;
list-style: none;
text-decoration: none;
color: #fff;
text-align: right;

@media screen and (max-width: 768px) {
    display: none;
    
}
`

export const NavItem = styled.li`
color: #fff;
padding: 10px;
cursor: pointer;
font-size: 1rem;
display: flex;
align-items: center;
font-weight: bold;



`
export const NavLink = styled(Link)`
text-decoration: none !important;
color: #fff;
cursor: pointer;
font-size: 0.8rem;
display: flex;
align-items: center;
margin: auto;
font-weight: 300;
font-family: 'Kasse';
padding: 10px;


@media screen and (max-width: 460px) {
    font-size: 0.8rem;
    
}
`

