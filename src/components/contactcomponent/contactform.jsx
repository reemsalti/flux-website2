import { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import './contactform.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export const ContactForm = () => {
  const form = useRef();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [number, setNumber] = useState('');
  const [message, setMessage] = useState('');

  const sendEmail = (e) => {
    e.preventDefault();

    if (!serviceId || !templateId || !publicKey) {
      toast.error('Contact form is not configured.');
      return;
    }

    emailjs
      .sendForm(serviceId, templateId, form.current, publicKey)
      .then(() => {
        setFirstName('');
        setLastName('');
        setEmail('');
        setNumber('');
        setMessage('');
        toast.success('Message sent!', {
          position: 'bottom-center',
          autoClose: 5000,
          hideProgressBar: true,
        });
      })
      .catch(() => {
        toast.error('Something went wrong. Please try again.', {
          position: 'bottom-center',
          autoClose: 5000,
          hideProgressBar: true,
        });
      });
  };

  return (
    <div className='formwrapper'>
      <div className='formcontainer'>
        <div className='topsection'>
          <h3 className='formhdr'>Leave a message</h3>
        </div>
        <form id='contactForm' ref={form} onSubmit={sendEmail}>
          <div className='infofield'>
            <li>
              <label>First Name</label>
              <input
                type='text'
                name='user_first_name'
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </li>
            <li>
              <label>Last Name</label>
              <input
                type='text'
                name='user_last_name'
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </li>
            <li>
              <label>Phone Number</label>
              <input
                type='text'
                name='user_number'
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                required
              />
            </li>
            <li>
              <label>Email</label>
              <input
                type='email'
                name='user_email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </li>
            <li className='msgbox'>
              <label>Message</label>
              <textarea
                name='message'
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </li>

            <div className='submitbtncontainer'>
              <input type='submit' value='Send' />

              <ToastContainer
                position='bottom-center'
                autoClose={6000}
                hideProgressBar
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
