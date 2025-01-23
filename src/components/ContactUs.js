import React, { useEffect } from 'react';
import Navbar from './Navbar'
import Footer from './Footer'


function supportContact() {

         useEffect(() => {
              // Ensure dataLayer is defined before calling gtag
              window.dataLayer = window.dataLayer || [];
              function gtag() {
                window.dataLayer.push(arguments);
              }
              gtag('js', new Date());
              gtag('config', 'G-D1X0WBG5EL');
            }, []);


  return (
   <>

    <header>
        <title>Contact Us | Audioreel</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-D1X0WBG5EL"></script>

      </header>

   <Navbar />
  

    <div className="container">
        <p>
You may contact us using the information below:
        </p>


<p>
Linck One Enterprises
<br /><br />

Registered Address: Plot no - 20, 2nd Floor, 302, Behind Lucid Hospital, Kukatpally, Hyderabad TELANGANA 500072 <br /> <br />
Operational Address: Plot no - 20, 2nd Floor, 302, Behind Lucid Hospital, Kukatpally, Hyderabad TELANGANA 500072 <br />

E-Mail ID: support@audioreel.io
        </p>
    </div>

    <Footer />
   </>
  )
}

export default supportContact