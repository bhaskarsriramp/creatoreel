import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Box, List, ListItem, ListItemText, Hidden, Stack, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { deepOrange, blue, indigo, green, purple, brown } from '@mui/material/colors';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";
import logo from '../images/audioreel-logo.png'

const theme = createTheme({
    palette: {
      primary: {
        main: deepOrange[500],
      },
      secondary: {
        main: green[500],
      },
      warning: {
        main: purple[500],
      },
      info: {
        main: blue[900],
      },
    },
  });


export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
      const navigate = useNavigate();
    

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };


    return (
        <ThemeProvider theme={theme}>
        <div style={{ marginBottom : '86px'}}>
            {/* Header Section */}
            <AppBar position="fixed" sx={{ backgroundColor: '#F5F7F8', color: '#11009E', boxShadow: 'none', height: '76px' }}>
                <Toolbar sx={{ marginTop : '12px'}}>
                    {/* Brand/Logo */}
                    <Typography
                        variant="h6"
                        sx={{
                            flexGrow: 1,
                            textDecoration: 'none',
                            color: '#09122C',
                            fontFamily: 'Poppins',
                            fontSize: '22px',
                            fontWeight: 500,
                        }}
                    >
                        <a href="/" style={{ textDecoration: 'none' }}>
                            <img className="img-fluid rounded icon-image-logo" src={logo} alt="audioreel" />
                        </a>
                    </Typography>


                    {/* Menu/Close Icon for Mobile */}
                    <Hidden mdUp>
                        <IconButton
                            edge="end"
                            color="inherit"
                            onClick={toggleMenu}
                        >
          <Button variant='outlined' color="info"   onClick={() => navigate('/login')} sx={{ paddingX : '44px', height : '38px', textTransform : 'none'}}>Login</Button>

                        </IconButton>
                    </Hidden>

                    {/* Desktop and Tablet Navigation Links */}
                    <Hidden smDown>
    <Box sx={{ display: 'flex', maxWidth: '100%' }}>
        {/* <List sx={{ display: 'flex', width: '100%', marginRight : '112px' }}>
            
            <ListItem component={Link} to="/pricing" sx={{ color: '#11009E', whiteSpace: 'nowrap' }}>
                <ListItemText primary="Pricing" />
            </ListItem>
           
        </List> */}

        <Stack sx={{ display : 'flex', flexDirection : 'row', alignItems : 'center', marginRight : '80px'}}>
          <Button variant='outlined' color="info"   onClick={() => navigate('/login')} sx={{ paddingX : '66px', height : '44px', textTransform : 'none'}}>Login</Button>
          <Button variant='contained' color="primary"   onClick={() => navigate('/signup')} sx={{ paddingX : '66px', height : '44px', marginLeft : '12px', textTransform : 'none', whiteSpace: 'nowrap'}}>Sign up</Button>
        </Stack>

    </Box>
</Hidden>

                </Toolbar>
            </AppBar>

           
        </div>
        </ThemeProvider>
    );
}
