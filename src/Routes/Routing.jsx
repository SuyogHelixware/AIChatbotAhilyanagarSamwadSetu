import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "../Dashboard/Dashboard";
import Home from "../pages/Home";

import Signin from "../Dashboard/signin";
import ManageUser from "../pages/ManageUser"
import Department from "../pages/Department"
import Services from "../pages/Services/Services"
import ServicesDocType from "../pages/Services/ServicesDocType"
// import PNDiet from "../PostNatal/PostNatalDiet"
// import PNExercise from "../PostNatal/PostNatalExercise"
// import PNPrecaution from "../PostNatal/PostNatalPrecaution";
// import PNMedication from "../PostNatal/PostNatalMedication";
// import PNVaccination from "../PostNatal/PostNatalVaccination"


export default function Routing() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Signin />} />
          <Route path="dashboard" element={<Dashboard />}>
            <Route path="home" element={<Home />} />
            <Route path="manage-user" element={<ManageUser />} />
            <Route path="department" element={<Department />} />
            <Route path="Services" element={<Services />} />
            <Route path="ServicesDocType" element={<ServicesDocType />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
