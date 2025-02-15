import { createRoot } from 'react-dom/client'
import DashboardPage from './pages/dashboardPage.jsx';
import LoginCredentialsDiv from './pages/loginPage.jsx';
import App from './app.jsx';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router';

/*
Entering the root path / from host brings user to the Outlet
which will then redirect the user to <LoginCredentialsDiv/>.

/home redirects users to <DashboardPage/>
*/
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App/>}>
        <Route index element={<LoginCredentialsDiv/>}/>
        <Route path="home" element={<DashboardPage/>}/>
      </Route>
    </Routes>
  </BrowserRouter>
)