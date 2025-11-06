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
import SanjayGandhi from "../pages/SanjavGandhi/SanjayGandhi";
 
export default function Routing() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Signin />} />
          <Route path="forgot-password" element={<ForgotPassword />} />{" "}
          {/* 👈 Add this route */}
          <Route path="dashboard" element={<Dashboard />}>
            <Route path="home" element={<Home />} />
            <Route path="manage-user" element={<ManageUser />} />
            <Route path="department" element={<Department />} />
            <Route path="Services" element={<Services />} />
            <Route path="OfflineServices" element={<OfflineServices />} />
            <Route path="DocumentMaster" element={<DocumentMaster />} />
            <Route path="EmailSetup" element={<EmailSetup />} />
            <Route path="Upload-Document" element={<UploadDocument />} />
            <Route path="Gazetted-Master" element={<GazettedMaster />} />
                        <Route path="SanjayGandhi" element={<SanjayGandhi />} />


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
