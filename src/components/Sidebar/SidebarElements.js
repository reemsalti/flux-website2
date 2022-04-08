import styled from "styled-components";
import { HiMinus } from 'react-icons/hi';
import { Link } from "react-router-dom";


export const SidebarContainer = styled.aside`
position: absolute;
z-index: 999;
width: 10rem;
height: auto;
background: transparent;
// background: rgba(0, 0, 0, 0.96);
display: grid;
align-items: center;
top: 0;
right: 0;
transition: 0.3s ease-in;
visibility: ${({ isOpen }) => (isOpen ? 'visible' : 'hidden')};
top: ${({ isOpen }) => (isOpen ? '-100' : '0')};
top: 0;
font-family: Kasse;
font-weight: 100;
cursor: auto;

`;

export const CloseIcon = styled(HiMinus)`
color: #fff;
cursor: auto;
`;

export const Icon = styled.div`
position: absolute;
top: 0;
right: 0;
margin-right: 1.4rem;
margin-top: 1.4rem;
background-color: #0e0c08;
font-size: 1.3rem;
cursor: pointer;
outline: none;
font-weight: 50;

`;


export const SidebarWrapper = styled.div`
color: #fff;

`;

export const SidebarMenu = styled.ul`
display: block;
text-align: center;
padding-top: 30px;

@media screen and (max-width: 480px) {
    grid-template-rows: repeat(6, 60px);
}
`;

export const SidebarLink = styled(Link)`
display: flex;
align-items: center;
justify-content: right;
font-size: 0.8rem;
text-decoration: none;
list-style: none;
transition: hidden;
text-decoration: none;
color: #fff;
cursor: pointer;
padding: 10px;


&:hover {
    color: #812A2A;
    font-size: 1.4rem;
}
`;