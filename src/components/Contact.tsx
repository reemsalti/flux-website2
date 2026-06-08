import './Contact.css';
import { ContactForm } from './contactcomponent/contactform';
import { GrInstagram } from 'react-icons/gr';
import { FiMail } from 'react-icons/fi';

const Contactpage = () => {
  return (
    <div className='contact'>
      <h1 className='contact__hdr'>Contact</h1>

      <div className='contact__details'>
        <a
          className='contact__link'
          href='https://www.instagram.com/thrundthru/'
          target='_blank'
          rel='noreferrer'
        >
          <GrInstagram className='contact__icon' /> @thrundthru
        </a>
        <a className='contact__link' href='mailto:throughandthroughart@hotmail.com'>
          <FiMail className='contact__icon' /> throughandthroughart@hotmail.com
        </a>
      </div>

      <ContactForm />
    </div>
  );
};

export default Contactpage;
