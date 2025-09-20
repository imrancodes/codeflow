import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import SignIn from "./components/auth/SignIn.tsx";
import SignUp from "./components/auth/SignUp.tsx";
import AuthLayout from "./components/auth/AuthLayout.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import HomeLayout from "./components/Home/HomeLayout.tsx";

const client = new QueryClient();

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<AuthLayout />}>
        <Route path="signin" element={<SignIn />} />
        <Route path="signup" element={<SignUp />} />
      </Route>

      <Route path="/" element={<HomeLayout />}>
        <Route index element={<App />} />
      </Route>
    </>
  )
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={client}>
      <Toaster/>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
);
