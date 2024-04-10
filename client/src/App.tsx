import { useMemo } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./themes";
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar';
import MySpendings from "./pages/MySpendings";
import { useSelector } from "react-redux";
import { RootState } from './redux/store';

function App() {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const mode = useSelector((state: RootState) => state.user.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Navbar />
          <Routes>
            <Route path='/' element={currentUser ? <Home /> : <Login />} />
            <Route path='/mySpendings' element={currentUser ? <MySpendings /> : <Login />} />
            <Route path='/login' element={ <Login /> } />
            <Route path='/register' element={ <Register /> } />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  )
}

export default App
