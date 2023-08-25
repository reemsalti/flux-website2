import React, { useRef } from 'react';
import { useState } from 'react';
import emailjs from '@emailjs/browser';
import "./contactform.css"
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const ContactForm = () => {
  const form = useRef();
  const [ firstName, setFirstName ] = useState("");
  const [ lastName, setLastName ] = useState("");
  const [ email, setEmail ] = useState("");
  const [ number, setNumber ] = useState("");
  const [ message, setMessage] = useState("");



  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.sendForm('service_d6r051h', 'template_lcttner', form.current, 'o9OjeE3BjfOBnjSkg')
      .then((result) => {
          console.log(result.text);
      }, (error) => {
          console.log(error.text);
      });
      console.log( firstName, lastName, email, number, message);
      
     setTimeout(function handleSubmit() {
        setFirstName("");
    setLastName("");
    setEmail("");
    setNumber("");
    setMessage("");
     }, 1000); 

     toast.success('Message Sent! ', {
      position: "bottom-center",
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined 
      });
     
  }; 


  return (
    <div className='formwrapper'>fav
    <div className='formcontainer'>
      <div className="topsection">
      <h3 className='formhdr'>Leave a message</h3>
            
      </div>
          <form id="contactForm" ref={form} onSubmit={sendEmail}>
            <div className='infofield'>
              <li>
              <label>First Name</label>
              <input 
              type="text"
              name="user_first_name" 
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              />
              </li>
            <li>
              <label>Last Name</label>
              <input 
              type="text" 
              name="user_last_name" 
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              />
            </li>
            <li>
              <label>Phone Number</label>
              <input 
              type="text" 
              name="user_number" 
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              required 
              />
            </li>
            <li>
              <label>Email</label>
              <input 
              type="email" 
              name="user_email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              />
              </li>
              <li className="msgbox">
              <label>Message</label>
              <textarea
              name="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              /> 
              </li>
              
              
              <div className='submitbtncontainer'>
              <input 
              type="submit" 
              value="Send" 
              onClick={() => {(sendEmail());}}
              />

              <ToastContainer
              position="bottom-center"
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

