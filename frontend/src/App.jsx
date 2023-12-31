import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Navigation from './components/Navigation';
import * as sessionActions from './store/session';
import SpotsIndex from './components/Spots';
import SpotShow from './components/Spots/SpotShow';
import SpotNew from './components/Spots/SpotNew';
import SpotCurrent from './components/Spots/SpotCurrent';
import SpotEdit from './components/Spots/SpotEdit';

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <SpotsIndex />
      },
      {
        path: '/spots/:spotId',
        element: <SpotShow />
      },
      {
        path: '/spots/new',
        element: <SpotNew />
      },
      {
        path: '/spots/current',
        element: <SpotCurrent />
      },
      {
        path: '/spots/:spotId/edit',
        element: <SpotEdit />
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
