import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "../Dashboard/Dashboard";
import Home from "../pages/Home";

import Signin from "../Dashboard/signin";
import ManageUser from "../pages/ManageUser";
import Department from "../pages/Department";
import Services from "../pages/Services/Services";
import OfflineServices from "../pages/OfflineServices";
import LoginPage1 from "../pages/LoginPage1";
import LoginPage2 from "../pages/LoginPage2";
import LoginPage3 from "../pages/LoginPage3";
import LoginPage4 from "../pages/LoginPage4";
import LoginPage5 from "../pages/LoginPage5";
import LoginPage6 from "../pages/LoginPage6";
import LoginPage7 from "../pages/LoginPage7";
import ForgotPassword from "../Dashboard/ForgotPassword";
import DocumentMaster from "../pages/DocumentMaster";
import EmailSetup from "../pages/EmailSetup";
import UploadDocument from "../pages/Upload-Document";
import GazettedMaster from "../pages/Gazetted-Master";
import ManageDocumentsPage from "../pages/ManageDocPage";
import Report from "../pages/Report";
import RoleCreation from "../pages/RoleCreation";

import SanjayGandhi from "../pages/SanjavGandhi/SanjayGandhi";
import Rehabilitation from "../pages/Rehabilitation/Rehabilitation";
import { useThemeMode } from "../Dashboard/Theme";
import ProtectedRoute from "./ProtectedRoute";
import BhusampadanDashboard from "../Dashboard/BhusampadanDashboard";
import SJYGandhiDashboard from "../Dashboard/SJYGandhi-Dashboard";
import LandAcquistionReport from "../pages/Reports/LandAcquistion-Report";
import SJYGandhiReport from "../pages/Reports/SJYGandhi-Report";

export default function Routing() {
  const { roleAccess } = useThemeMode();

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Signin />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          {/* 👈 Add this route */}
          <Route path="dashboard" element={<Dashboard />}>
            <Route path="home" element={<Home />} />
            <Route path="BhusampadanDashboard" element={<BhusampadanDashboard />} />
            <Route path="SJYGandhiDashboard" element={<SJYGandhiDashboard />} />
            <Route path="LandAcquistionReport" element={<LandAcquistionReport />} />
            <Route path="SJYGandhiReport" element={<SJYGandhiReport />} />



            {/* <Route
              path="home"
              element={
                <ProtectedRoute menuId={1} roleAccess={roleAccess}>
                  <Home />
                </ProtectedRoute>
              }
            /> */}

            {/* <Route path="manage-user" element={<ManageUser />} /> */}
            <Route
              path="manage-user"
              element={
                <ProtectedRoute menuId={3} roleAccess={roleAccess}>
                  <ManageUser />
                </ProtectedRoute>
              }
            />
            {/* <Route path="RoleCreation" element={<RoleCreation />} /> */}
            <Route
              path="RoleCreation"
              element={
                <ProtectedRoute menuId={12} roleAccess={roleAccess}>
                  <RoleCreation />
                </ProtectedRoute>
              }
            />
            {/* <Route path="department" element={<Department />} /> */}
            <Route
              path="department"
              element={
                <ProtectedRoute menuId={6} roleAccess={roleAccess}>
                  <Department />
                </ProtectedRoute>
              }
            />
            {/* <Route path="Services" element={<Services />} /> */}
            <Route
              path="Services"
              element={
                <ProtectedRoute menuId={7} roleAccess={roleAccess}>
                  <Services />
                </ProtectedRoute>
              }
            />
            {/* <Route path="OfflineServices" element={<OfflineServices />} /> */}
            <Route
              path="OfflineServices"
              element={
                <ProtectedRoute menuId={8} roleAccess={roleAccess}>
                  <OfflineServices />
                </ProtectedRoute>
              }
            />
            {/* <Route path="DocumentMaster" element={<DocumentMaster />} /> */}
            <Route
              path="DocumentMaster"
              element={
                <ProtectedRoute menuId={5} roleAccess={roleAccess}>
                  <DocumentMaster />
                </ProtectedRoute>
              }
            />
            {/* <Route path="ManageDocumentsPage" element={<ManageDocumentsPage />} /> */}
            {/* <Route path="EmailSetup" element={<EmailSetup />} /> */}
            <Route
              path="EmailSetup"
              element={
                <ProtectedRoute menuId={2} roleAccess={roleAccess}>
                  <EmailSetup />
                </ProtectedRoute>
              }
            />
            {/* <Route path="Gazetted-Master" element={<GazettedMaster />} /> */}
            <Route
              path="Gazetted-Master"
              element={
                <ProtectedRoute menuId={4} roleAccess={roleAccess}>
                  <GazettedMaster />
                </ProtectedRoute>
              }
            />
            {/* <Route path="Upload-Document" element={<UploadDocument />} /> */}
            {/* <Route path="Report" element={<Report />} /> */}
            <Route
              path="Upload-Document"
              element={
                <ProtectedRoute menuId={9} roleAccess={roleAccess}>
                  <UploadDocument />
                </ProtectedRoute>
              }
            />
            <Route
              path="SanjayGandhi"
              element={
                <ProtectedRoute menuId={10} roleAccess={roleAccess}>
                  <SanjayGandhi />
                </ProtectedRoute>
              }
            />
            {/* <Route path="SanjayGandhi" element={<SanjayGandhi />} /> */}
            <Route
              path="Rehabilitation"
              element={
                <ProtectedRoute menuId={11} roleAccess={roleAccess}>
                  <Rehabilitation />
                </ProtectedRoute>
              }
            />
            {/* <Route path="Rehabilitation" element={<Rehabilitation />} /> */}
          </Route>
          {/* <Route path="/dashboard/special" element={<SpecialLayout />}> */}
          <Route path="LoginPage1" element={<LoginPage1 />} />
          <Route path="LoginPage2" element={<LoginPage2 />} />
          <Route path="LoginPage3" element={<LoginPage3 />} />
          <Route path="LoginPage4" element={<LoginPage4 />} />
          <Route path="LoginPage5" element={<LoginPage5 />} />
          <Route path="LoginPage6" element={<LoginPage6 />} />
          <Route path="LoginPage7" element={<LoginPage7 />} />
          {/* </Route> */}
        </Routes>
      </BrowserRouter>
    </>
  );
}
