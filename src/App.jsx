import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";
import Homepage from "./Homepage.jsx";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Homepage />}


  ])

  return (
    <RouterProvider router={router} />
  )
}

export default App
