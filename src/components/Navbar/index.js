import React from 'react';
import { FiPlus } from 'react-icons/fi';
import {Nav, NavbarContainer, MobileIcon, NavMenu, NavItem, Logo, NavLink } from "./NavbarElements";
import logoimg from '../../components/images/logo1.png';
const Navbar = ({ toggle }) => {
    return (
        <>
        <Nav>
            <NavbarContainer>
                <Logo to={'/'}><img className='logoimg' src={logoimg} alt='' height= '55px'/> </Logo>
                
                <MobileIcon onClick={toggle}>
                    <FiPlus className='icon' onClick={toggle}/>
                </MobileIcon>
                <NavMenu>
                    <NavItem>
                        <NavLink to={'/'}>Home</NavLink>
                        <NavLink to={'/about'}>About</NavLink>
                        <NavLink to={'/shop'}>Shop</NavLink>
                        <NavLink to={'/contact'}>Contact</NavLink>
                    </NavItem>
                </NavMenu>
            </NavbarContainer>
        </Nav>
        </>
    );
};

export default Navbar;
