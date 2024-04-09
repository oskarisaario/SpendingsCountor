import { useState } from "react";
import { 
  Box,
  IconButton,
  InputBase,
  Typography,
  Select,
  MenuItem,
  Popover,
  FormControl,
  useTheme,
  useMediaQuery,
  Badge,
  Button,
  Drawer,
  Divider
 } from "@mui/material";
 import {
  Search,
  Message,
  DarkMode,
  LightMode,
  Notifications,
  Help,
  Menu,
  Close,
  Logout
 } from '@mui/icons-material';
 import { useDispatch, useSelector } from "react-redux";
 import { setMode, signOutUserStart, signOutUserFailure, signOutUserSuccess } from '../redux/userSlice';
 import { Link, useNavigate } from "react-router-dom";
 import { RootState } from '../redux/store';
 import FlexBetween from "../components/FlexBetween";


 
export default function Navbar() {
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { palette } = useTheme();
  const { currentUser } = useSelector((state: RootState) => state.user);
  const isNonMobileScreens = useMediaQuery('(min-width: 1000px)');


  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;


  const handleLogout = async() => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
      navigate('/login');
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <Box display='flex'>
    <Button 
      onClick={() => setOpen(!open)}
      sx={{ '&:hover': { color: dark, cursor: 'pointer'} }}
    >
      <Menu />
      <Drawer open={open}>
        <Box sx={{ width: 250, padding: '1rem' }}>
          <Typography fontWeight='bold' color='primary'>Menu</Typography>
          {currentUser && (
            <Typography>Logged in as {currentUser.username}</Typography>
          )}
          <Typography color='primary'>
          <IconButton onClick={() => dispatch(setMode())}>
              {theme.palette.mode === 'dark' ? (
                <DarkMode sx={{ fontSize: '25px' }} />
              ): (
                <LightMode sx={{ color: dark, fontSize: '25px' }} />
              )}
          </IconButton>
          Mode
          </Typography>
          <Typography color='primary'>
            <IconButton onClick={handleLogout}>
              <Logout sx={{ textAlign: 'center' }}/>
            </IconButton>
            Logout
          </Typography>
        </Box>
        <Divider />
        <Box sx={{ width: 250, padding: '1rem'}}>
          <Link to='/mySpendings' style={{ textDecoration: 'none', marginBottom: '1rem'}} >
            <Typography fontWeight='bold' color='primary'>View monthly spendings</Typography>
          </Link>
          <Link to='/' style={{ textDecoration: 'none'}}>
            <Typography fontWeight='bold' color='primary'>Add spendings</Typography>
          </Link>
        </Box>
      </Drawer>
    </Button>
      <Typography padding='1rem' fontWeight='bold' fontSize='32px' color='primary' marginLeft='2rem'>Spendings Countor</Typography>
    </Box>
  )
}
