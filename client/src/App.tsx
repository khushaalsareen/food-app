import React, { useEffect } from "react";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import ForgotPassword from "./auth/ForgotPassword";
import ResetPassword from "./auth/ResetPassword";
import VerifyEmail from "./auth/VerifyEmail";
import HereSection from "./components/HereSection";
import MainLayout from "./layout/MainLayout";
import Profile from "./components/Profile";
import SearchPage from "./components/SearchPage";
import RestaurantDetail from "./components/RestaurantDetail";
import Cart from "./components/Cart";
import Restaurant from "./admin/Restaurant";
import AddMenu from "./admin/AddMenu";
import Orders from "./admin/Orders";
import Success from "./components/Success";
import Loading from "./components/Loading";

import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { useUserStore } from "./store/useUserStore";
import { useThemeStore } from "./store/useThemeStore";

import { CartProvider } from "@/context/CartProvider"; // Adjust path accordingly
import RestaurantsPage from "./components/ui/RestaurantsPage";

const ProtectedRoutes = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useUserStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!user?.isVerified) return <Navigate to="/verify-email" replace />;
  return children;
};

const AuthenticatedUser = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useUserStore();
  if (isAuthenticated && user?.isVerified) return <Navigate to="/" replace />;
  return children;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated } = useUserStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role === "user") return <Navigate to="/" replace />;
  return children;
};
  // const { user, isAuthenticated } = useUserStore();

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoutes>
        <MainLayout />
      </ProtectedRoutes>
    ),
    children: [
      { path: "/", element: <HereSection /> },
      { path: "/profile", element: <Profile /> },
      { path: "/search/:text", element: <SearchPage /> },
      { path: "/restaurant/:id", element: <RestaurantDetail /> },
      { path: "/cart", element: <Cart /> },
      { path: "/order/status", element: <Success /> },
      { path: "/restaurants", element: <RestaurantsPage /> },

      // Admin routes
      {
        path: "/admin/restaurant",
        element: (
          <AdminRoute>
            <Restaurant />
          </AdminRoute>
        ),
      },
      {
        path: "/admin/menu",
        element: (
          <AdminRoute>
            <AddMenu />
          </AdminRoute>
        ),
      },
      {
        path: "/admin/orders",
        element: (
          <AdminRoute>
            <Orders />
          </AdminRoute>
        ),
      },
    ],
  },
  { path: "/login", element: <AuthenticatedUser><Login /></AuthenticatedUser> },
  { path: "/signup", element: <AuthenticatedUser><Signup /></AuthenticatedUser> },
  { path: "/forgot-password", element: <AuthenticatedUser><ForgotPassword /></AuthenticatedUser> },
  { path: "/resetpassword/:token", element: <ResetPassword /> },
  { path: "/verify-email", element: <VerifyEmail /> },
]);

function App() {
  const initializeTheme = useThemeStore((state: any) => state.initializeTheme);
  const { checkAuthentication, isCheckingAuth, user, isAuthenticated } = useUserStore();

  useEffect(() => {
    checkAuthentication();
    initializeTheme();
  }, [checkAuthentication, initializeTheme]);

  if (isCheckingAuth) return <Loading />;

  return (
    <main>
      {isAuthenticated && user?._id ? (
        <CartProvider userId={user?._id}>
          <RouterProvider router={appRouter} />
        </CartProvider>
      ) : (
        <RouterProvider router={appRouter} />
      )}
    </main>
  );
}

export default App;
