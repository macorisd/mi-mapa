import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "../app/components/Header";
import Footer from "../app/components/Footer";

import MapsMainPage from "../maps/MapsMainPage";

import MapsViewPage from "../maps/MapsViewPage";
import MapCreatePage from "../maps/MapCreatePage";
import MapEditPage from "../maps/MapEditPage";

import LoginPage from "../login/LoginPage";
import LogoutPage from "../login/LogoutPage";
import Page404 from "../other/Page404";
import LoadingScreen from "./components/Loading";

function App() {
  return (
    <>
      <LoadingScreen />
      
        <Routes>
        <Route path="/" element={<LoginPage />} />
          <Route path="/home" element={wrap(<MapsMainPage />, { header: true, footer: true })}/>
          <Route path="/maps/create" element={wrap(<MapCreatePage />)} />
          <Route path="/maps/:id" element={wrap(<MapsViewPage />)} />
          <Route path="/maps/:id/edit" element={wrap(<MapEditPage />)} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/logout" element={<LogoutPage />} />
          <Route path="*" element={<Page404 />} />
        </Routes>      
    </>
  );
}

const wrap = (child, options = { header: true, footer: false }) => (
  <div className="app-container">
    {options.header ? <Header /> : null}
    <div className="content">{child}</div>
    {options.footer ? <Footer /> : null}
  </div>
);

export default App;
