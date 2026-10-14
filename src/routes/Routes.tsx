import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home/Home.tsx';
import Register from '../pages/Register/Register.tsx';
import Admin from '../pages/Admin/Admin.tsx';
import Private from './Private.tsx';

function RoutesApp() {
   return (
      <BrowserRouter>
         <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={
               <Private>
                  <Admin />
               </Private>
            } />
         </Routes>
      </BrowserRouter>
   )
}

export default RoutesApp;