import './assets/DesignSystem/index.js';
import Header from "./components/Header/Header";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Homepage } from "./pages/Homepage";
import { RegistrationForm } from "./pages/RegistrationForm";
import { PrivateRoute } from './components/PrivateRoute';
import {LoginForm} from "./pages/LoginForm";
// import Dashboard from './pages/Dashboard';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Header />
                <Routes>
                    <Route path="/" element={<Homepage />} />
                    <Route path="/register" element={<RegistrationForm />} />
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="*" element={
                        <div>
                            <h1>Page non trouvée</h1>
                        </div>
                    } />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
