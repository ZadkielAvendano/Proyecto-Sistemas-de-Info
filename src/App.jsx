import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";

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
