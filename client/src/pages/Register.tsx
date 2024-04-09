import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Typography, useTheme, useMediaQuery, TextField, Button } from '@mui/material';
import WidgetWrapper from '../components/WidgetWrapper';



export default function Register() {
  const theme = useTheme();
  const isNonMobileScreen = useMediaQuery('(min-width: 1000px)');
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);


  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault();
    const newUser = {username, password};
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });
      const data = await res.json();
      if (data.success === false) {
        if (data.message.includes('E11000 duplicate key error')) {
          setError('Username already in use, try something else!');
          return;
        }
        setError(data.message);
        return;
      }
      setError(null);
      navigate('/login')
    }catch (error) {
      console.log('error',error)
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
            Register
          </Typography>
          <form onSubmit={handleSubmit}>
            <Box textAlign='center' display='flex' flexDirection='column' padding='1rem' width={'100%'} gap='1rem'>
              <TextField 
                label='Username' 
                onChange={(e:React.ChangeEvent<HTMLInputElement>) => {setUsername(e.target.value)}}
                inputProps={{ minLength: 3 }}
                required
              />
              <TextField 
                type='password' 
                label='Password' 
                onChange={(e:React.ChangeEvent<HTMLInputElement>) => {setPassword(e.target.value)}} 
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
                <Typography fontWeight='bold'>REGISTER</Typography>
              </Button>
            </Box>
          </form>
          {error && <p style={{color: '#B22222'}}>{error}</p>}
          <Typography>
            Already have an account? 
            <Link to='/login' style={{ color: theme.palette.primary.main, marginLeft: '0.5rem' }}>Login here</Link>
          </Typography>
      </WidgetWrapper>
    </Box>
  )
}
