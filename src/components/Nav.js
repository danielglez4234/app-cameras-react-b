import React, { useState }  from 'react';
import { Consumer }           from './context';
import * as $                 from 'jquery';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Tooltip from '@mui/material/Tooltip';

import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import ModeEditRoundedIcon from '@mui/icons-material/ModeEditRounded';
import MoreIcon from '@mui/icons-material/MoreVert';
import LogoutIcon from '@mui/icons-material/Logout';

import logoSrc                from '../img/logo.png';

function Nav(){

   const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
   const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

   const handleMobileMenuClose = () => {
     setMobileMoreAnchorEl(null);
   };

   const handleMenuClose = () => {
     handleMobileMenuClose();
   };

   const handleMobileMenuOpen = (event) => {
     setMobileMoreAnchorEl(event.currentTarget);
   };

   const showLogInInputs = () => {
     $('.logIn-cont').fadeIn(100);
     $('.logIn-AreaClose').fadeIn(100);
   }


   const showEditDeleteButtons = () =>{
     $(".deleteUpdate-cameraButtons-box").toggleClass('show-deleteUpdate-camerabuttons');
   }

   const hideNavBar = () => {
     $("#navBar").toggle("display-none");
   }



  return(
   <Consumer>
    { context => {
    const loggedIn = context.loggedIn;
    const logOut = context.logOut;


    const renderMobileMenu = (
      <Menu
        anchorEl={mobileMoreAnchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        id="primary-search-account-menu-mobile"
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={isMobileMenuOpen}
        onClose={handleMobileMenuClose}
      >

      {(loggedIn) ?
       <div>
        <MenuItem>
          <a href="/create" className="mobile-menu-a">
            <IconButton size="large" aria-label="show 4 new mails" color="inherit">
             <AddBoxRoundedIcon />
            </IconButton>
            <p className="mobileText-menu mobile-menu-aTEXT">Add Camera</p>
          </a>
        </MenuItem>
        <MenuItem onClick={() => {showEditDeleteButtons()}}>
          <IconButton size="large" aria-label="show 17 new notifications" color="inherit">
           <ModeEditRoundedIcon />
          </IconButton>
          <p className="mobileText-menu">Edit Camera</p>
        </MenuItem>
        <MenuItem onClick={() => {logOut()}}>
          <a href="/" className="mobile-menu-a">
            <IconButton size="large" aria-label="account of current user" aria-controls="primary-search-account-menu" color="inherit">
              <LogoutIcon />
            </IconButton>
            <p className="mobileText-menu mobile-menu-aTEXT">Log Out</p>
          </a>
        </MenuItem>
       </div>

       :

       <MenuItem onClick={() => {showLogInInputs()}}>
           <IconButton size="large" aria-label="account of current user" aria-controls="primary-search-account-menu" color="inherit">
             <AccountCircle />
           </IconButton>
           <p className="mobileText-menu">Admin LogIn</p>
       </MenuItem>
     }

      </Menu>
    );





    return(

    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>

          <a href="/" className="box-logo-content">
            <img className="box-logo-icon" src={ logoSrc } alt="Gran Telescopio de Canarias" />
          </a>
          <Typography variant="h6" noWrap component="div" sx={{ display: { xs: 'none', sm: 'block' } }}>
            Web Cameras
          </Typography>

      <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>


          {
            (loggedIn) ?

          <div>
            <Tooltip title="Add Camera">
              <IconButton className="navBar-buttons" size="large" color="inherit">
                <a href="/create" className="navBar-buttons-addCamera">
                  <AddBoxRoundedIcon />
                </a>
              </IconButton>
            </Tooltip>

            <Tooltip title="Edit Camera">
              <IconButton onClick={() => {showEditDeleteButtons()}} className="navBar-buttons" size="large" color="inherit">
                <ModeEditRoundedIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Admin LogIn">
              <IconButton onClick={() => {logOut()}} className="navBar-buttons" size="large" edge="end" aria-controls="primary-search-account-menu">
                <a href="/" className="navBar-buttons-addCamera">
                  <LogoutIcon />
                </a>
              </IconButton>
            </Tooltip>
          </div>

          :

          <Tooltip title="Admin LogIn">
            <IconButton onClick={() => {showLogInInputs()}} className="navBar-buttons" size="large" edge="end" aria-controls="primary-search-account-menu">
                <AccountCircle />
            </IconButton>
          </Tooltip>

        }

          </Box>

          {/*mobile menu open icon buttons*/}
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls="primary-search-account-menu-mobile"
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {
        renderMobileMenu
      }

    </Box>

      );
      }}
    </Consumer>
    );
}
export default Nav;
