// Importing new components
// import Black from "../pages/Black";
// import BlueGrey from "../pages/BlueGrey";
// import GraphiteGrey from "../pages/GraphiteGrey";
// import Pebble from "../pages/Pebble";
// import SilverGrey from "../pages/SilverGrey";
// import StoneGrey from "../pages/StoneGrey";
// import Sp144 from "../pages/Sp144";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import SharePage from "../pages/SharePage";
import Van from "../pages/Van";
import RegistrationForm from "../components/auth/RegistrationForm"
import LoginPage from "../components/auth/LoginPage"
import ProfilePage from "../components/profile-page/ProfilePage"
import AccountPage from '../pages/AccountPage';
import { AuthProvider } from '../context/AuthContext';
import ProtectedRoute from '../components/protected-route/ProtectedRoute';
import GoogleCallback from "../components/google-auth/GoogleCallback"
import { VanProvider } from "../context/VanContext";
const AppRoutes = () => {


  return (
    <AuthProvider>
      <VanProvider >
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<RegistrationForm />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            {/* <Route path="/sp-144" element={<Sp144 />} /> */}
            {/* <Route path="/black" element={<Black />} /> */}
            {/* <Route path="/blue-grey" element={<BlueGrey />} /> */}
            {/* <Route path="/graphite-grey" element={<GraphiteGrey />} /> */}
            {/* <Route path="/pebble" element={<Pebble />} /> */}
            {/* <Route path="/silver-grey" element={<SilverGrey />} /> */}
            {/* <Route path="/stone-grey" element={<StoneGrey />} /> */}
            <Route
              path="/rendering-library"
              element={
                <AccountPage />
              }
            />
            <Route path="/google-callback" component={GoogleCallback} />
            <Route path="/share" element={<SharePage />} />
            <Route path="/van" element={<Van />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </VanProvider>
    </AuthProvider>
  );
};

export default AppRoutes;
