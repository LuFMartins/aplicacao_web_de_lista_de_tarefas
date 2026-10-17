import { ToastContainer } from 'react-toastify';

import RoutesApp from './routes/Routes.tsx';

function App() {
  return (
    <>
      <RoutesApp />
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        theme='dark'
      />
    </>
  );
}

export default App;