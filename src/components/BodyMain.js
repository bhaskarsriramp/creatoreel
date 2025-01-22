import React from "react";
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Typography, Box, List, ListItem, ListItemText, Hidden, Stack, Button } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';





function BodyMain() {


  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));



  return (
    <>
      <div className="container mx-auto row">

        <div className="container col-md-12 col-lg-12 main-hero-section">

          <h1
            className="txt-2"
            style={{ color: '#686D76'}}
          >
            Turn your <span style={{ display: 'inline', color: '#09122C' }}>Audio</span> into stunning <span style={{ display: 'inline', color: '#16C47F' }}>Videos</span>
            <br />
            &nbsp;instantly.
          </h1>


          <h2 className="txt-4">
          From spoken words to visual storytelling—AudioReel automates video creation with AI-selected stock footage.
          </h2>

        
        </div>
       

      <div className="col-12 col-md-12 get-started-button-credit-card mt-5 " >
          <Link to="/login" style={{textDecoration: 'none'}}>
            <button className="btn signup-btn-grad btn-g-fonts">
              Get Started
            </button>
          </Link>
          <p className="subtext">No credit card required.</p>
      </div>

      </div>

      {/* {isSmallScreen ? (

            <>
      <Box sx={{ background : '#CDC1FF', color: 'black'}}>

            <Stack sx={{ justifyContent : 'center', alignItems : 'center'}}>
                <Typography sx={{ paddingTop : '20%', fontSize : '28px', fontWeight : 500, paddingX : '8%'}}>Why we're best-in-class for Realtors</Typography>
                <Typography sx={{ marginTop : '12px', fontSize : '18px', paddingX : '8%'}}>The #1 email marketing and automations platform that recommends ways to get more opens, clicks and sales.</Typography>
              </Stack>
      
      
      
            <Stack sx={{ display : 'flex', flexDirection : 'column', paddingX : '8%', paddingTop : '10%'}}>
      
            <Stack sx={{ display : 'flex', flexDirection : 'column'}}>
              <Typography sx={{ fontSize : '24px', fontWeight : 400}}>Up to 25x ROI</Typography>
              <Typography>seen by Inboxe users*</Typography>
            </Stack>
      
            <Stack sx={{ display : 'flex', flexDirection : 'column', marginTop : '46px'}}>
              <Typography sx={{ fontSize : '24px', fontWeight : 400}}>12M+ Users</Typography>
              <Typography>of Inboxe globally</Typography>
            </Stack>
      
              </Stack>


              
            <Stack sx={{ display : 'flex', flexDirection : 'column', paddingX : '8%', paddingTop : '10%', paddingBottom : '20%'}}>
      
      <Stack sx={{ display : 'flex', flexDirection : 'column'}}>
        <Typography sx={{ fontSize : '24px', fontWeight : 400}}>22 years experience</Typography>
        <Typography>helping businesses sell more</Typography>
      </Stack>

      <Stack sx={{ display : 'flex', flexDirection : 'column', marginTop : '46px'}}>
        <Typography sx={{ fontSize : '24px', fontWeight : 400}}>$1.7K per campaign</Typography>
        <Typography>generated on average*</Typography>
      </Stack>

        </Stack>
      
      
      
    

      </Box>

      
      </>

      ) : (
        <div className = "hero-card-main-div-frame">

        <div className="row col-md-12 col-lg-12 hero-main-card-design ">
        <div className="col-md-4 col-12 " >
  
        <div className = "main-card-sec-1">
            <Typography sx={{ fontSize : '28px', fontWeight : 500}}>Why we're best-in-class for Realtors</Typography>
            <Typography sx={{ marginTop : '12px', fontSize : '18px', paddingRight : '22px'}}>The #1 email marketing and automations platform that recommends ways to get more opens, clicks and sales.</Typography>
          </div>
  
        </div>
  
        <div className="col-md-4 col-12 main-card-sec-2">
  
        <Stack sx={{ display : 'flex', flexDirection : 'column', paddingX : '56px'}}>
  
        <Stack sx={{ display : 'flex', flexDirection : 'column'}}>
          <Typography sx={{ fontSize : '24px', fontWeight : 400}}>Up to 25x ROI</Typography>
          <Typography>seen by Inboxe users*</Typography>
        </Stack>
  
        <Stack sx={{ display : 'flex', flexDirection : 'column', marginTop : '56px'}}>
          <Typography sx={{ fontSize : '24px', fontWeight : 400}}>12M+ Users</Typography>
          <Typography>of Inboxe globally</Typography>
        </Stack>
  
          </Stack>
  
        </div>
  
        <div className="col-md-4 col-12 main-card-sec-2">
  
        <Stack sx={{ display : 'flex', flexDirection : 'column', paddingX : '56px'}}>
  
        <Stack sx={{ display : 'flex', flexDirection : 'column'}}>
          <Typography sx={{ fontSize : '24px', fontWeight : 400}}>22 years experience</Typography>
          <Typography>helping businesses sell more</Typography>
        </Stack>
  
        <Stack sx={{ display : 'flex', flexDirection : 'column', marginTop : '56px'}}>
          <Typography sx={{ fontSize : '24px', fontWeight : 400}}>$1.7K per campaign</Typography>
          <Typography>generated on average*</Typography>
        </Stack>
  
          </Stack>
  
        </div>
  
  
  
        </div>
  
        </div>
      )} */}

      <div className = "col-12 howitworks-text "> How it works</div>

    

      
    </>
  );
}

export default BodyMain;
