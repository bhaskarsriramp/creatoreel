import React from "react";
import { Link } from 'react-router-dom';
import instagram from "../images/instagram_2111463.png"
import youtube from "../images/youtube_3991722.png"
import twitter from "../images/twitter_3256013.png"
import linkedin from "../images/linkedin_3992606.png"

export default function Footer() {
  return (
    <>
      <div className="container-fluid bg-footer-container pt-5 pb-2">
        <div className="container row mx-auto p-1">

        <div className="container col-sm-12 col-12 col-md-3 col-lg-3 footer-box">
            <div className="div">
            <ul>
                <li className="footer-head-text">Company</li>
                <li className="footer-content-text"><Link to="/pricing" className="footer-subhead-decoration">Pricing</Link></li>
                <li className="footer-content-text"><Link to="/careers" className="footer-subhead-decoration">Careers</Link></li>
                <li className="footer-content-text"><Link to="/sitemap.xml" className="footer-subhead-decoration">Sitemap</Link></li>
                <li className="footer-content-text"><Link to="/open-api-disclosure" className="footer-subhead-decoration">Open API Disclosure</Link></li>
                <li className="footer-content-text"><Link to="/google-api-disclosure" className="footer-subhead-decoration">Google API Disclosure</Link></li>
                <li className="footer-content-text"><Link to="/security" className="footer-subhead-decoration">Security</Link></li>
                

               
                {/* <li className="footer-content-text"><Link to="/sitemap.xml" className="footer-subhead-decoration">Sitemap</Link></li> */}

              </ul>
            </div>
          </div>
       
          <div className="container col-md-3 col-12 footer-box">
            <div className="div">
                
              <ul>
                <li className="footer-head-text">Useful</li>
                <li className="footer-content-text"><Link to="/terms" className="footer-subhead-decoration">Terms & Conditions</Link></li>
                <li className="footer-content-text"><Link to="/privacy-policy" className="footer-subhead-decoration">Privacy Policy</Link></li>
                <li className="footer-content-text"><Link to="/cancellation-refund" className="footer-subhead-decoration">Cancellation & Refund</Link></li>
                <li className="footer-content-text"><Link to="/shipping-policy" className="footer-subhead-decoration">Shipping Policy</Link></li>
                <li className="footer-content-text"><Link to="/contact" className="footer-subhead-decoration">Contact Us</Link></li>
                {/* <li className="footer-content-text"><Link to="/sitemap.xml" className="footer-subhead-decoration">Sitemap</Link></li> */}


                <li className="footer-head-text pt-4">
                  Follow us 
                </li>
                <li className="footer-content-text my-1">
  
                  <Link href="https://www.youtube.com"><a><img  className="img-fluid rounded icon-image" src={youtube} alt="youtube-icon" /></a></Link>
                  <Link href="https://www.instagram.com/broadreach.in/"><a><img  className="img-fluid rounded icon-image ms-1" src={instagram} alt="instagram-icon" /></a></Link>
                  <Link href="https://www.twitter.com"><a><img  className="img-fluid rounded icon-image ms-1" src={twitter} alt="twitter-icon" /></a></Link>

                  
                </li>
              </ul>
            </div>
          </div>
         
        
          
          
        </div>



        <div className="container text-center my-3">
          <span className="fw-normal" style={{color: "#B9B4C7"}}>&copy;Audioreel 2025</span>
        </div>
      </div>
    </>
  );
}
