import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from './Navbar/Navbar';
import AppRouter from './router/router';

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: { main: '#1B2B4B', dark: '#0f1c33', light: '#2d4a7a' },
        secondary: { main: '#FF6B6B' },
        error: { main: '#ef4444' },
        success: { main: '#10b981' },
        warning: { main: '#f59e0b' },
        background: { default: '#F8F9FA', paper: '#ffffff' },
        text: { primary: '#1B2B4B', secondary: '#6B7280' }
    },
    typography: {
        fontFamily: "'Inter', sans-serif",
        button: { textTransform: 'none', fontWeight: 600 },
        h1: { fontWeight: 800, letterSpacing: '-1.5px' },
        h2: { fontWeight: 800, letterSpacing: '-1px' },
        h3: { fontWeight: 700, letterSpacing: '-0.5px' },
        h4: { fontWeight: 700 },
        h5: { fontWeight: 600 },
        h6: { fontWeight: 600 },
    },
    shape: { borderRadius: 12 },
    components: {
        MuiButton: {
            styleOverrides: {
                root: { borderRadius: 10, fontWeight: 600, transition: 'all 0.2s ease', '&:hover': { transform: 'translateY(-1px)' } },
                contained: { background: '#1B2B4B', color: 'white', boxShadow: '0 4px 14px rgba(27,43,75,0.25)', '&:hover': { background: '#0f1c33', boxShadow: '0 6px 20px rgba(27,43,75,0.35)' } },
                outlined: { borderColor: '#1B2B4B', color: '#1B2B4B', '&:hover': { bgcolor: '#F8F9FA', borderColor: '#0f1c33' } }
            }
        },
        MuiCard: {
            styleOverrides: {
                root: { borderRadius: 16, boxShadow: '0 2px 16px rgba(27,43,75,0.08)', border: '1px solid #E5E7EB', transition: 'all 0.25s ease' }
            }
        },
        MuiPaper: { styleOverrides: { root: { borderRadius: 16 } } },
        MuiChip: { styleOverrides: { root: { fontWeight: 600 } } },
        MuiTextField: { styleOverrides: { root: { '& .MuiOutlinedInput-root': { borderRadius: 10, '&:hover fieldset': { borderColor: '#1B2B4B' }, '&.Mui-focused fieldset': { borderColor: '#1B2B4B' } } } } }
    }
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter>
                <Navbar />
                <AppRouter />
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
