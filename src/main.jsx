import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LandingPage from './pages/Landingpage/Landingpage';
import ResultsPage from "./pages/Resultspage/Resultspage";
import Upload from "./pages/Upload/Upload";
import './index.css'
import App from './App.jsx'
import Specieslist from './pages/Specieslist/Specieslist';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },

      {
        path: "/results",
        element: <ResultsPage />,
      },

      {
        path: "/upload",
        element: <Upload />,
      },

      {
        path: "/SaveList",
        element: <Specieslist />,
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
