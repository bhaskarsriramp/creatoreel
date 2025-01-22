import React from 'react'
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import { deepOrange, blue, indigo, green, purple, brown } from '@mui/material/colors';
import { Outlet} from "react-router-dom";
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import useMediaQuery from '@mui/material/useMediaQuery';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import ContactsOutlinedIcon from '@mui/icons-material/ContactsOutlined';
import DnsOutlinedIcon from '@mui/icons-material/DnsOutlined';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import LogoutIcon from '@mui/icons-material/Logout';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import { useSelector } from "react-redux";
import Badge from '@mui/material/Badge';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { logout } from "../../store/brandSlice";
import { useDispatch } from "react-redux";
import DashboardCustomizeOutlinedIcon from '@mui/icons-material/DashboardCustomizeOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';


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
      main: blue[800],
    },
  },
});


const ResponsiveDrawer = (props) => {

  const { window } = props;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const settings = [
    { name: 'Account', icon: <AccountCircleIcon />, path: '/brand/account/details' },
    { name: 'Help & Support', icon: <HelpOutlineIcon />, path: '/brand/support' },
    { name: 'Logout', icon: <LogoutIcon />, action: 'logout'},
  ];


 const handleLogOut = () => {
    dispatch(logout());
    navigate(`/login`);
   
  };

const handleMenuClick = (setting) => {
  if (setting.action === 'logout') {
    handleLogOut(); // Call the logout function
  }  else if (setting.path) {
    navigate(setting.path); // Navigate to the path
  }
};



  const isMenuOpen = Boolean(anchorEl);

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };


  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuId = 'primary-search-account-menu';
  // const renderMenu = (
  //   <Menu
  //     anchorEl={anchorEl}
  //     anchorOrigin={{
  //       vertical: 'top',
  //       horizontal: 'right',
  //     }}
  //     id={menuId}
  //     keepMounted
  //     transformOrigin={{
  //       vertical: 'top',
  //       horizontal: 'right',
  //     }}
  //     open={isMenuOpen}
  //     onClose={handleMenuClose}
  //   >
  //     <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
  //     <MenuItem onClick={handleMenuClose}>My account</MenuItem>
  //   </Menu>
  // );


  const drawer = (
    <div>
       <Toolbar>
        <Typography
          sx={{
            textAlign: 'center',
            width: '100%',
            fontWeight: 500,
            color: blue[500],
            fontSize : '24px'
          }}
        >
          Inboxe
        </Typography>
         
      </Toolbar>
      <Divider />

      <List>

      <ListItem key="dashboard" disablePadding style={{ marginBottom : '4px'}}>
          <Link
            style={{ textDecoration: "none", color: "black" }}
            to="/brand/dashboard"
            onClick={handleDrawerToggle}

          >
            <ListItemButton>
              <ListItemIcon>
                <DashboardCustomizeOutlinedIcon sx={{ color: blue[800] }}/>
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
          </Link>
        </ListItem>

        <ListItem key="Campaigns" disablePadding style={{ marginBottom : '4px'}}>
          <Link
            style={{ textDecoration: "none", color: "black" }}
            to="/brand/allCampaigns"
            onClick={handleDrawerToggle}
          >
            <ListItemButton>
              <ListItemIcon>
                <EventAvailableOutlinedIcon sx={{ color: deepOrange[500] }}/>
              </ListItemIcon>
              <ListItemText primary="Campaigns" />
            </ListItemButton>
          </Link>
        </ListItem>

        <ListItem key="Contacts" disablePadding style={{ marginBottom : '4px'}}>
          <Link
            style={{ textDecoration: "none", color: "black" }}
            to="/brand/allContacts"
            onClick={handleDrawerToggle}

          >
            <ListItemButton>
              <ListItemIcon>
                <ContactsOutlinedIcon sx={{ color: green[500] }}/>
              </ListItemIcon>
              <ListItemText primary="Contacts" />
            </ListItemButton>
          </Link>
        </ListItem>


      

        <ListItem key="domains" disablePadding>
          <Link
            style={{ textDecoration: "none", color: "black" }}
            to="/brand/subdomainRequestList"
            onClick={handleDrawerToggle}

          >
            <ListItemButton>
              <ListItemIcon>
                <DnsOutlinedIcon sx={{ color: purple[500] }}/>
              </ListItemIcon>
              <ListItemText primary="Domains" />
            </ListItemButton>
          </Link>
        </ListItem>

        <ListItem key="settings" disablePadding>
          <Link
            style={{ textDecoration: "none", color: "black" }}
            to="/brand/account/details"
            onClick={handleDrawerToggle}

          >
            <ListItemButton>
              <ListItemIcon>
                <SettingsOutlinedIcon sx={{ color: brown[500] }}/>
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItemButton>
          </Link>
        </ListItem>

        <ListItem key="Support" disablePadding>
          <Link
            style={{ textDecoration: "none", color: "black" }}
            to="/brand/support"
            onClick={handleDrawerToggle}
          >
            <ListItemButton>
              <ListItemIcon>
                <SupportAgentIcon sx={{ color: indigo[500] }}/>
              </ListItemIcon>
              <ListItemText primary="Support" />
            </ListItemButton>
          </Link>
        </ListItem>

      </List>


      <Divider />
    </div>
  );

  // Check if window is defined (during SSR it might not be available)
  const container = window !== undefined ? () => window().document.body : undefined;

  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const drawerWidth = isSmallScreen ? '100%' : 220;
    const user = useSelector((state) => state.brandUser);
  


  return (
    <ThemeProvider theme={theme}>

    <Box sx={{ display: 'flex', overflow: 'auto' }}>
      <Box sx={{ flexGrow: 1 }}>
      <AppBar position="absolute" sx={{ background: '#F5F7F8', boxShadow: 'none' }}>
          <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
              App Title
            </Typography>
             
            <Box sx={{ display: 'flex' }}>
              <IconButton size="large" color="inherit">
                {/* <Badge badgeContent={4} color="error"> */}
                {/* deepOrange, blue, indigo, green, purple, brown */}
                <Badge >
                  <MailIcon sx={{ color : blue[500]}}/>
                </Badge>
              </IconButton>
              <IconButton size="large" color="inherit">
                {/* <Badge badgeContent={17} color="error"> */}
                <Badge >
                  <NotificationsIcon sx={{ color : brown[400]}}/>
                </Badge>
              </IconButton>
              <Box sx={{ flexGrow: 0 }}>
              <IconButton onClick={handleOpenUserMenu} size="large" color="inherit">
                {/* <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" /> */}
                <PersonOutlineOutlinedIcon sx={{ color : green[500]}}/>
              </IconButton>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
            {settings.map((setting) => (
  <MenuItem key={setting.name} onClick={handleCloseUserMenu}>
    <Box  onClick={() => handleMenuClick(setting)} sx={{ display: 'flex', gap: 2, paddingRight : '4rem', alignItems : 'self-start', marginBottom :'12px' }}>
      {setting.icon}
      <Typography sx={{ textAlign: 'center' }}>{setting.name}</Typography>
    </Box>
  </MenuItem>
))}
            </Menu>
          </Box>
            </Box>
          </Toolbar>
        </AppBar>
        {/* {renderMenu} */}
       
      </Box>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          container={container}
          anchor="bottom"
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { width: drawerWidth },
          }}
        >
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {  width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{ flexGrow: 1, p: 1,  width: '100%', overflow: 'auto',
        maxWidth: { sm: `calc(100% - ${drawerWidth}px)` }
        }}
      >
        <Toolbar />
        
        <Outlet />
      </Box>

      
    </Box>

    </ThemeProvider>



  );
};

ResponsiveDrawer.propTypes = {
  window: PropTypes.func,
};

export default ResponsiveDrawer;
