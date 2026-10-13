import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home/Home.tsx';
import Register from '../pages/Register/Register.tsx';

function RoutesApp() {
   return (
      <BrowserRouter>
         <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
         </Routes>
      </BrowserRouter>
   )
}

export default RoutesApp;