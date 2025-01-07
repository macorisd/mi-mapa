import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "../app/components/Header";
import Footer from "../app/components/Footer";

import MapMainPage from "../maps/MapMainPage";
import MapSearchPage from "../maps/MapSearchPage";

import MarcadorViewPage from "../maps/MarcadorViewPage";
import MarcadorCreatePage from "../maps/MarcadorCreatePage";
import MarcadorEditPage from "../maps/MarcadorEditPage";

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
          <Route path="/mapa" element={wrap(<MapMainPage />, { header: true, footer: true })}/>
          <Route path="/mapa/buscar" element={wrap(<MapSearchPage />, { header: true, footer: true })}/>
          <Route path="/marcadores/create" element={wrap(<MarcadorCreatePage />)} />  
          <Route path="/marcadores/:id" element={wrap(<MarcadorViewPage />)} />
          <Route path="/marcadores/:id/edit" element={wrap(<MarcadorEditPage />)} />
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
