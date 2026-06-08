import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Nav, NavbarContainer, NavMenu, NavItem, Logo, NavLink } from './NavbarElements';
import logoimg from '../images/logo1.png';

const Navbar = ({ hidden = false }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';
  const [scrollHidden, setScrollHidden] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      const scrollingDown = y > lastY;

      if (isHome) {
        setScrollHidden(y > 100 && scrollingDown);
      } else {
        setScrollHidden(false);
      }

      lastY = y;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHome]);

  useEffect(() => {
    setScrollHidden(false);
  }, [location.pathname]);

  const navHidden = hidden || scrollHidden;

  const goHome = (event) => {
    event.preventDefault();
    if (isHome) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  return (
    <Nav className={navHidden ? 'nav--hidden' : ''}>
      <NavbarContainer>
        <Logo to='/' onClick={goHome} aria-label='Through & Through — home'>
          <img className='logoimg' src={logoimg} alt='' height='55px' />
        </Logo>
        <NavMenu>
          <NavItem>
            <NavLink to='/'>Home</NavLink>
            <NavLink to='/shop'>Shop</NavLink>
            <NavLink to='/contact'>Contact</NavLink>
          </NavItem>
        </NavMenu>
      </NavbarContainer>
    </Nav>
  );
};

export default Navbar;
