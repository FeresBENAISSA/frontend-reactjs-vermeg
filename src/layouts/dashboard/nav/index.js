import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
// @mui
import { styled, alpha } from '@mui/material/styles';
import { Box, Link,  Drawer, Typography, Avatar } from '@mui/material';
// mock
// hooks
import useResponsive from '../../../hooks/useResponsive';
// components
import Logo from '../../../components/logo';
import Scrollbar from '../../../components/scrollbar';
import NavSection from '../../../components/nav-section';
//
// import navConfig from './configManager';
import { useSelector } from 'react-redux';
import { selectCurrentRoles, selectCurrentEmail, selectCurrentUser } from '../../../redux/features/auth/authSlice';
import navConfigAdmin from './configAdmin';
import navConfigManager from './configManager';
import navConfigBank from './configBank';
import * as Constants from "../../../Constants/constants"
// ----------------------------------------------------------------------

const NAV_WIDTH = 310;

const StyledAccount = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: alpha(theme.palette.grey[500], 0.12),
}));

// ----------------------------------------------------------------------

Nav.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};

export default function Nav({ openNav, onCloseNav }) {
  const { pathname } = useLocation();
  const roles = useSelector(selectCurrentRoles);
  const email =useSelector(selectCurrentEmail)
  const user = useSelector(selectCurrentUser)
  const isDesktop = useResponsive('up', 'lg');
  const [navConfiguration,setNavConfiguration] = useState();
 
  const navigationConfiguration =()=>{
    if(roles.includes("ADMIN")) 
    setNavConfiguration(navConfigAdmin)
    else if(roles.includes("STORE_MANAGER")) 
    setNavConfiguration(navConfigManager)
    else if(roles.includes("BANK_AGENT")) 
    setNavConfiguration(navConfigBank)
    else
      console.log("no access")
  }
  
  




useEffect(()=>{
  navigationConfiguration()
},roles)

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column' },
      }}
    >
      <Box sx={{ px: 2.5, py: 3, display: 'inline-flex' }}>
        <Logo />
      </Box>

      <Box sx={{ mb: 5, mx: 2.5 }}>
        <Link underline="none">
          <StyledAccount>
            {/* <Avatar src={account.photoURL} alt="photoURL" /> */}
            <Avatar src={user.avatar?Constants.BASE_URL+user.avatar.split('\\')[1]:"avatar"} alt="photoURL" />
            <Box sx={{ ml: 2 }}>
              <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
              {email}
              </Typography>

              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {roles}
              </Typography>
            </Box>
          </StyledAccount>
        </Link>
      </Box>

      <NavSection data={navConfiguration} />

      <Box sx={{ flexGrow: 1 }} />

      
    </Scrollbar>
  );

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV_WIDTH },
      }}
    >
      {isDesktop ? (
        <Drawer
          open
          variant="permanent"
          PaperProps={{
            sx: {
              width: NAV_WIDTH,
              bgcolor: 'background.default',
              borderRightStyle: 'dashed',
            },
          }}
        >
          {renderContent}
        </Drawer>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          ModalProps={{
            keepMounted: true,
          }}
          PaperProps={{
            sx: { width: NAV_WIDTH },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}
