import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./signup";
import Login from "./Login";
import Forgotpass from "./Forgotpass";
import Welcome_admin from "./Welcome_admin";
import Welcome from "./Welcome";
import ManageAccount from "./ManageAccount";  // Composant pour gérer le compte
import Welcome2 from "./Welcome2";
import ResetPassword from "./ResetPassword";
import Creer_test from "./Creer_test"
import AjouterQCM from "./AjouterQCM";
import CreerTest from "./CreerTest";
import ConsulterUtilisateur from "./ConsulterUtilisateur";
import Supprimer from "./Supprimer"; //
import GererUtilisateurs from "./GererUtilisateurs";
import ConsulterTest from "./ConsulterTest";
import ConsulterQuestion from "./ConsulterQuestion";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgotpass" element={<Forgotpass />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/Welcome_admin" element={<Welcome_admin />} />
        <Route path="/welcome2" element={<Welcome2 />} />
        <Route path="/manage-account" element={<ManageAccount />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/Creer_test" element={<Creer_test />} />
        <Route path="/ajouter-qcm" element={<AjouterQCM />} />
        <Route path="/Creertest" element={<CreerTest />} />
        <Route path="/ConsulterUtilisateur" element={<ConsulterUtilisateur />} />


        <Route path="/supprimer" element={<Supprimer />} />
        <Route path="/GererUtilisateurs" element={<GererUtilisateurs />} />

        <Route path="/ConsulterTest" element={<ConsulterTest />} />
        <Route path="/ConsulterQuestion" element={<ConsulterQuestion />} />
      </Routes>
    </Router>
  );
}

export default App;