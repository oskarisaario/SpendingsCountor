import { useState } from "react";
import { 
  Box,
  IconButton,
  Typography,
  useTheme,
  useMediaQuery,
  Button,
  Drawer,
  Divider
 } from "@mui/material";
 import {
  DarkMode,
  LightMode,
  Menu,
  Logout
 } from '@mui/icons-material';
 import { useDispatch, useSelector } from "react-redux";
 import { setMode, signOutUserStart, signOutUserFailure, signOutUserSuccess } from '../redux/userSlice';
 import { Link, useNavigate } from "react-router-dom";
 import { RootState } from '../redux/store';


 
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: RootState) => state.user);


  const theme = useTheme();
  const dark = theme.palette.neutral.dark;


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
