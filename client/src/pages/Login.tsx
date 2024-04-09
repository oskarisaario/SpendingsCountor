import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Typography, useTheme, useMediaQuery, TextField, Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInFailure, signinSuccess } from '../redux/userSlice';
import { RootState } from '../redux/store';
import WidgetWrapper from '../components/WidgetWrapper';



export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isNonMobileScreen = useMediaQuery('min-width: 1000px');
  const { error } = useSelector((state: RootState) => state.user);
  const [formData, setFormData] = useState({});
  const theme = useTheme();


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(
      {
        ...formData,
        [e.target.id]: e.target.value,
      });
  };


  
  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log('data', data)
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signinSuccess(data))
      navigate('/');
    } catch (error) {
      if (error instanceof Error) {
        dispatch(signInFailure(error.message));
      }
      console.log('error', error);
    }
  };


  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      <WidgetWrapper width='80%' backgroundColor={theme.palette.background.alt} p='1rem 6%' textAlign='center' maxWidth='800px'>
          <Typography 
            fontWeight='bold' 
            fontSize='32px' 
            color='primary'
          >
            Login
          </Typography>
          <form onSubmit={handleSubmit}>
            <Box textAlign='center' display='flex' flexDirection='column' padding='1rem' width={isNonMobileScreen ? '10%' : '100%'} gap='1rem'>
              <TextField 
                label='Username'
                id='username'
                onChange={handleChange}
                inputProps={{ minLength: 3 }}
                required
              />
              <TextField 
                type='password'
                id='password'
                label='Password' 
                onChange={handleChange} 
                inputProps={{ minLength: 5 }}
                required
              />
              <Button type="submit"
                sx={{  
                  p: '1rem', 
                  backgroundColor: theme.palette.primary.main, 
                  color: theme.palette.background.alt, 
                  '&:hover': {color: theme.palette.primary.main}
                }} 
              >
                <Typography fontWeight='bold'>LOGIN</Typography>
              </Button>
            </Box>
          </form>
          {error && <p style={{color: '#B22222'}}>{error}</p>}
          <Typography>
            No account yet? 
            <Link to='/register' style={{ color: theme.palette.primary.main, marginLeft: '0.5rem' }}>Register here</Link>
          </Typography>
      </WidgetWrapper>
    </Box>
  )
}
