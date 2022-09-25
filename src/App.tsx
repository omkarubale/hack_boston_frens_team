import { ConnectButton } from '@rainbow-me/rainbowkit';
import Navbar from './components/Nav';
import CreateProfile from './components/CreateProfile';

import {
  createBrowserRouter,
  RouterProvider,
  Route,
} from "react-router-dom";
import GamePage from './components/GamePage';
import HomePage from './components/HomePage';


import Profile from './components/Profile'

const App = () => {

  const router = createBrowserRouter([
    {
      path: "/profile",
      element:  <div className='m-auto'><Profile></Profile></div>,
    },
    {
      path: "/",
      element: <HomePage></HomePage>
    },
  ]);

  return (
    <div>      
      <div className='flex flex-row h-screen'>
        <div className='flex-initial w-128'>
          <Navbar></Navbar>
        </div>
        <div className="w-full">
          <RouterProvider router={router} />
        </div>
      </div>
    </div>
  );
};

export default App;


