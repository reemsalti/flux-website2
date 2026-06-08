import { Link } from 'react-router-dom';
import { GrInstagram } from 'react-icons/gr';
import './Footer.css';

function Footer() {
  return (
    <footer className='site-footer'>
      <Link className='site-footer__link' to='/contact'>
        Contact
      </Link>
      <span className='site-footer__dot' aria-hidden>
        ·
      </span>
      <a
        className='site-footer__link'
        href='https://www.instagram.com/thrundthru/'
        target='_blank'
        rel='noreferrer'
      >
        <GrInstagram aria-hidden /> @thrundthru
      </a>
      <span className='site-footer__dot' aria-hidden>
        ·
      </span>
      <span className='site-footer__copy'>© 2022</span>
    </footer>
  );
}

export default Footer;
