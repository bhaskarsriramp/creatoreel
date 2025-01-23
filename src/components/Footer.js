import React from "react";
import instagram from "../images/instagram_2111463.png"
import youtube from "../images/youtube_3991722.png"
import twitter from "../images/twitter_3256013.png"

export default function Footer() {
  return (
    <>
      <div className="container-fluid bg-footer-container pt-5 pb-2">
        <div className="container row mx-auto p-1">

        <div className="container col-sm-12 col-12 col-md-3 col-lg-3 footer-box">
            <div className="div">
            <ul>
                <li className="footer-head-text">Company</li>
                <li className="footer-content-text"><a href="/pricing" style={{ textDecoration : 'none'}} className="footer-subhead-decoration">Pricing</a></li>
                {/* <li className="footer-content-text"><a href="/careers" style={{ textDecoration : 'none'}} className="footer-subhead-decoration">Careers</a></li> */}
                <li className="footer-content-text"><a href="/sitemap.xml" style={{ textDecoration : 'none'}} className="footer-subhead-decoration">Sitemap</a></li>
                <li className="footer-content-text"><a href="/open_api_disclosure" style={{ textDecoration : 'none'}} className="footer-subhead-decoration">Open API Disclosure</a></li>
                <li className="footer-content-text"><a href="/google_api_disclosure" style={{ textDecoration : 'none'}} className="footer-subhead-decoration">Google API Disclosure</a></li>
                {/* <li className="footer-content-text"><a href="/security" style={{ textDecoration : 'none'}} className="footer-subhead-decoration">Security</a></li> */}
                

               
                {/* <li className="footer-content-text"><Link to="/sitemap.xml" className="footer-subhead-decoration">Sitemap</Link></li> */}

              </ul>
            </div>
          </div>
       
          <div className="container col-md-3 col-12 footer-box">
            <div className="div">
                
              <ul>
                <li className="footer-head-text">Useful</li>
                <li className="footer-content-text"><a href="/terms" style={{ textDecoration : 'none'}} className="footer-subhead-decoration">Terms & Conditions</a></li>
                <li className="footer-content-text"><a href="/privacy_policy" style={{ textDecoration : 'none'}} className="footer-subhead-decoration">Privacy Policy</a></li>
                <li className="footer-content-text"><a href="/cancellation_refund" style={{ textDecoration : 'none'}} className="footer-subhead-decoration">Cancellation & Refund</a></li>
                <li className="footer-content-text"><a href="/shipping_policy" style={{ textDecoration : 'none'}} className="footer-subhead-decoration">Shipping Policy</a></li>
                <li className="footer-content-text"><a href="/contact" style={{ textDecoration : 'none'}} className="footer-subhead-decoration">Contact Us</a></li>
                {/* <li className="footer-content-text"><Link to="/sitemap.xml" className="footer-subhead-decoration">Sitemap</Link></li> */}


                <li className="footer-head-text pt-4">
                  Follow us 
                </li>
                <li className="footer-content-text my-1">

                <a href="https://www.youtube.com/channel/UCqp363NhrpKpeGlOK2U-hWA" style={{ textDecoration: 'none' }}><img  className="img-fluid rounded icon-image" src={youtube} alt="youtube-icon" /></a>
                <a href="https://www.instagram.com/audioreel/" style={{ textDecoration: 'none' }}><img  className="img-fluid rounded icon-image ms-1" src={instagram} alt="instagram-icon" /></a>
                <a href="https://www.twitter.com" style={{ textDecoration: 'none' }}><img  className="img-fluid rounded icon-image ms-1" src={twitter} alt="twitter-icon" /></a>

                  
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
