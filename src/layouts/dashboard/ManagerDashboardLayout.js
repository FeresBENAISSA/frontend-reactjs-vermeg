import { useState } from 'react';
import { Outlet } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
//
import Header from './header';
import Nav from './nav';

// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const StyledRoot = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden',
});

const Main = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  paddingTop: APP_BAR_MOBILE + 24,
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up('lg')]: {
    paddingTop: APP_BAR_DESKTOP + 24,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  zIndex: 2,
}));

// const Main = styled.main`
//   position: relative;
//   z-index: 1; // Set the z-index of the main component to a higher value
// `;

const NavWrapper = styled('div')`
  position: relative;
  top: 0;
  left: 0;
  z-index: 1; // Set the z-index of the navigation and menu button components to a lower value
`;
const HeaderWrapper = styled('div')(({ isTableExpanded }) => ({
  position: 'fixed',
  top: isTableExpanded ? -APP_BAR_MOBILE : 0,
  left: 0,
  zIndex: 3,
}));
// ----------------------------------------------------------------------

export default function ManagerDashboardLayout() {
  const [open, setOpen] = useState(false);

  

  return (
    <StyledRoot>
         <HeaderWrapper >
        <Header onOpenNav={() => setOpen(true)} />
        </HeaderWrapper>
      <NavWrapper>
        <Nav openNav={open} onCloseNav={() => setOpen(false)} />
      </NavWrapper>
      <Main>
        <Outlet  />
      </Main>
    </StyledRoot>
  );
}
