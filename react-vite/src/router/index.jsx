import { Route, createBrowserRouter, createRoutesFromElements, Outlet } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import Layout from './Layout';

import MainPage from '../components/MainPage'
import LandingPage from '../components/LandingPage'
import Home from '../components/Home'
import ServerPage from '../components/ServerPage'
import ChannelPage from '../components/ChannelPage';

// export const router = createBrowserRouter([
//   {
//     element: <Layout />,
//     children: [
//       {
//         path: "/",
//         element: <h1>Welcome!</h1>,
//       },
//       {
//         path: "login",
//         element: <LoginFormPage />,
//       },
//       {
//         path: "signup",
//         element: <SignupFormPage />,
//       },
//     ],
//   },
// ]);

export const router = createBrowserRouter(createRoutesFromElements(
  <Route element={<Layout />}>

    <Route path='/'  element={<Home /> }/>
    <Route path='/login' element={<LoginFormPage />}/>
    <Route path='/signup' element={<SignupFormPage />}/>
    <Route path='/landing' element={<LandingPage />} />
    <Route path='/main' element={<MainPage />}>
      <Route path='servers' element={<Outlet />}>
        <Route path=':serverId' element={<ServerPage />} >
          <Route path='channels' element={<Outlet />}>
            <Route path=':channelId' element={<ChannelPage />} />
          </Route>
        </Route>
      </Route>
    </Route>
    <Route path="*" element={<h1>Error 404 Not Found </h1>} />
  </Route>
))
