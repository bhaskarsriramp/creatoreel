import React from 'react'
import sideImage1 from "../images/upload-audio-file.svg"
import machineTranslation from "../images/machine-translation.png"
import smartCaptions from "../images/smart-captions.png"
import pexelsLogo from "../images/pexels-logo.png"
import securityIcon from "../images/security-icon.png"
import sideImage2 from "../images/download-video-file.svg"
import sideImage3 from "../images/video-editor-image.jpg"
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';






function BodyBlocks() {
  return (
    <>

    <div className="container mt-2">

        <div className="row mx-auto">
            <div className="col-12 col-md-6 col-lg-6 my-auto">
                <div className="creator-underline"><p>Upload Audio File</p></div>
                <div className="bb-txt-2"><p>Upload your audio file in 
                    <span className="span-70"> MP3 </span>format to get started.</p>
                    <p>That's it.</p></div>


            </div>

            <div className="col-12 col-md-6 col-lg-6">
                <img className="img-fluid rounded" src={sideImage1} alt="banner" width={500} height={500} />
            </div>
        </div>
    </div>



    <div className="container mt-1">

<div className="row mx-auto">

<div className="col-12 col-md-6 col-lg-6 order-2 order-md-0 order-lg-0">

        <img className="img-fluid rounded" src={sideImage3} alt="banner" width={500} height={500} />

    </div>

    <div className="col-12 col-md-6 col-lg-6 my-auto">
        <div className="row creator-underline txt-bold"><p>Audioreel AI: Generates Videos</p></div>
        <div className="row bb-txt-2"><p>Sit back and relax as 
            <span className="span-70"> Audioreel </span>transforms your audio into a visually stunning videos with synchronized subtitles.</p></div>




    </div>

   
</div>
</div>

     <div className="container mt-3">
        <div className="row mx-auto">

       

        
    


            <div className="col-12 col-md-6 col-lg-6 my-auto">
                <div className="row creator-underline txt-bold"><p>Download Video</p></div>
                <div className="row bb-txt-2"><p>Your video is ready! Download the fully crafted masterpiece with perfectly matched <span className="span-70">visuals </span> and synced <span className="span-70">subtitles.</span></p></div>





            </div>

            <div className="col-12 col-md-6 col-lg-6">
        <img className="img-fluid rounded" src={sideImage2} alt="banner" width={500} height={500} />

    </div>


        </div>
    </div>


    <div className = "col-12 supported-languages"> Supported languages</div>
    <div className = "supported-languages-subtext">
    Below is the list of popular languages we support for transcription and subtitles.
    </div>

    <div className="container language-main-block">

  <div className="row">

    <div className="col-md-3 col-6 languages-blocks-boxes">
      <button className = 'supported-languages-button'>
      English
      </button>
    </div>

    <div className="col-md-3 col-6 languages-blocks-boxes"> <button className = 'supported-languages-button'>
      Hindi
      </button>
      </div>


    <div className="col-md-3 col-6 languages-blocks-boxes ">
    <button className = 'supported-languages-button'>
      Telugu
      </button>
    </div>
    <div className="col-md-3 col-6 languages-blocks-boxes">
    <button className = 'supported-languages-button'>
      French
      </button>
    </div>

    <div className="col-md-3 col-6 languages-blocks-boxes">
    <button className = 'supported-languages-button'>
    Spanish
    </button>
  </div>

  <div className="col-md-3 col-6 languages-blocks-boxes"> <button className = 'supported-languages-button'>
    German
    </button>
    </div>


  <div className="col-md-3 col-6 languages-blocks-boxes">
  <button className = 'supported-languages-button'>
    Dutch
    </button>
  </div>
  
  <div className="col-md-3 col-6 languages-blocks-boxes">
  <button className = 'supported-languages-button'>
    Polish
    </button>
  </div>



  </div>
</div>



  <div className="col-12 all-languages-box mt-3">
  <button className = 'all-languages-button'>
    See all languages →
    </button>
  </div>

 <div className="col-12 col-md-12 get-started-button-credit-card mt-3" >
          <Link to="/login" style={{textDecoration: 'none'}}>
            <button className="btn signup-btn-grad btn-g-fonts">
              Get Started
            </button>
          </Link>
      </div>



<div className = "features-main-block">

      <div className="col-12 features-title"> What We do </div>


        <div className="features-blocks">

              <div className="col-md-6 col-12 features-blocks-indi">

                <div className="icon-featurename-div">

                      <img 
                          src={machineTranslation} 
                          alt="Machine Translation" 
                          style={{
                            width: '40px', 
                            height: '40px', 
                            marginRight: '8px', 
                            verticalAlign: 'middle'
                          }} 
                        />
                      <div className = "feature-name">Machine Translation</div>

                </div>

                <div className = "feature-description">Automatically translate your transcription and subtitles in the most common languages.</div>

              </div>

              <div className="col-md-6 col-12 features-blocks-indi">

              <div className="icon-featurename-div">

                    <img 
                        src={smartCaptions} 
                        alt="Smart captions" 
                        style={{
                          width: '40px', 
                          height: '40px', 
                          marginRight: '8px', 
                          verticalAlign: 'middle'
                        }} 
                      />
                    <div className = "feature-name">Smart Captions</div>

                    </div>

                <div className = "feature-description">Generates AI-powered captions in the user's selected language, with support for over 99 languages worldwide.</div>

              </div>

        
        </div>

        <div className="features-blocks">

            <div className="col-md-6 col-12 features-blocks-indi">

            <div className="icon-featurename-div">

                  <img 
                      src={pexelsLogo} 
                      alt="Pexels" 
                      style={{
                        width: '100px', 
                        height: '40px', 
                        marginRight: '8px', 
                        verticalAlign: 'middle'
                      }} 
                    />
                  {/* <div className = "feature-name">Smart Captions</div> */}

                  </div>

              <div className = "feature-description">A vast library of over 1.5 million+ high-quality stock videos sourced from Pexels, seamlessly integrated to bring your audio to life.</div>

            </div>

            <div className="col-md-6 col-12 features-blocks-indi">

             
            <div className="icon-featurename-div">

              <img 
                  src={securityIcon} 
                  alt="Security" 
                  style={{
                    width: '40px', 
                    height: '40px', 
                    marginRight: '8px', 
                    verticalAlign: 'middle'
                  }} 
                />
              <div className = "feature-name">Security & Confidentiality</div>

              </div>

              <div className = "feature-description">All files are protected and remain private. Your subtitles are protected.</div>

            </div>


        </div>


</div>





    <div className="container-fluid mx-auto custom-container-dimensions">
        <div className="row">
          <div className="col-md-6 col-12 txt-2 text-center my-auto"><p>Pick a Plan<br /></p> </div>
          <div className="col-md-6 col-12 my-auto">
            <div className="container mx-auto h2 pt-2">Pick the plan that best suits your requirements.</div>
            <div className="container mx-auto row pt-2 pb-4">Save 4+ hours on video editing every day.</div>
            <div className="container mx-auto "> <div className="col-md-12 col-12">
            <Link to="/pricing" style={{textDecoration: 'none'}}><button className="btn signup-btn-grad-2 btn-g-fonts">View Plans</button></Link>

          </div></div>
            </div>
        </div>
      </div>

    

    
{/* 
      <div className="container-fluid mx-auto custom-container-dimensions-1">
        <div className="row">
          <div className="col-md-6 col-12 txt-2 text-center my-auto"><p>Unlimited Clicks<br /> <span className="creator-underline"> in all plans.</span></p> </div>
          <div className="col-md-6 col-12 my-auto">
            <div className="container mx-auto h2 pt-2 pb-4">NO limits on number of clicks per link.</div>
            <div className="container mx-auto "> <div className="col-md-12 col-12">
            <Link to="/pricing" style={{textDecoration: 'none'}}><button className="btn login-btn-grad btn-g-fonts text-white">View Plans</button></Link>

          </div></div>
            </div>
        </div>
      </div> */}

    </>
  )
}

export default BodyBlocks