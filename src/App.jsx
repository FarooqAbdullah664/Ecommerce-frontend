import { BrowserRouter } from 'react-router-dom';
import Navbar from './Navbar/Navbar';
import AppRouter from './router/router';

function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <AppRouter />
        </BrowserRouter>
    );
}

export default App;
