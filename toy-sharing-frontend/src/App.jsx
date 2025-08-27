import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";

// Layout
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/features/auth/ProtectedRoute";
import ErrorBoundary from "./components/common/ErrorBoundary";

// Loading component
import Loading from "./components/ui/Spinner";

// Lazy load pages for better performance
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const HowItWorks = lazy(() => import("./pages/HowItWorks"));

// Auth pages
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));

// Toy pages
const ToyBrowse = lazy(() => import("./pages/toys/ToyBrowse"));
const ToyDetail = lazy(() => import("./pages/toys/ToyDetail"));
const ToyCreate = lazy(() => import("./pages/toys/ToyCreate"));
const ToyEdit = lazy(() => import("./pages/toys/ToyEdit"));
const MyToys = lazy(() => import("./pages/toys/MyToys"));
const Favorite = lazy(() => import("./pages/toys/Favorite"));

// Booking pages
const MyBookings = lazy(() => import("./pages/bookings/MyBookings"));
const BookingDetail = lazy(() => import("./pages/bookings/BookingDetail"));

// Profile pages
const Profile = lazy(() => import("./pages/profile/Profile"));
const EditProfile = lazy(() => import("./pages/profile/EditProfile"));
const Settings = lazy(() => import("./pages/profile/Settings"));

// Chat page
const Chat = lazy(() => import("./pages/Chat"));

// Legal pages
const Privacy = lazy(() => import("./pages/legal/Privacy"));
const Terms = lazy(() => import("./pages/legal/Terms"));
const Safety = lazy(() => import("./pages/legal/Safety"));

// Error pages
const NotFound = lazy(() => import("./components/common/NotFound"));

function App() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-kid-bg to-white">
        <Suspense fallback={<Loading />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Layout />}>
              {/* Home & Info */}
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="how-it-works" element={<HowItWorks />} />

              {/* Browse Toys (Public) */}
              <Route path="toys" element={<ToyBrowse />} />
              <Route path="toys/:id" element={<ToyDetail />} />

              {/* Legal Pages */}
              <Route path="privacy" element={<Privacy />} />
              <Route path="terms" element={<Terms />} />
              <Route path="safety" element={<Safety />} />
            </Route>

            {/* Auth Routes (No Layout) */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route path="/" element={<Layout />}>
              <Route element={<ProtectedRoute />}>
                {/* Toy Management */}
                <Route path="my-toys" element={<MyToys />} />
                <Route path="favorites" element={<Favorite />} />
                <Route path="toys/create" element={<ToyCreate />} />
                <Route path="toys/:id/edit" element={<ToyEdit />} />

                {/* Bookings */}
                <Route path="bookings" element={<MyBookings />} />
                <Route path="bookings/:id" element={<BookingDetail />} />

                {/* Profile */}
                <Route path="profile" element={<Profile />} />
                <Route path="profile/edit" element={<EditProfile />} />
                <Route path="settings" element={<Settings />} />

                {/* Chat */}
                <Route path="chat" element={<Chat />} />
              </Route>
            </Route>

            {/* Redirects */}
            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route
              path="/dashboard"
              element={<Navigate to="/my-toys" replace />}
            />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </div>
    </ErrorBoundary>
  );
}

export default App;
