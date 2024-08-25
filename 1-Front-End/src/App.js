
import React from "react";
import { Provider } from 'react-redux';
import store from "./store";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
//import Navigation from './components/Navigation';
// import {
//   createBrowserRouter,
//   RouterProvider,
// } from "react-router-dom";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ThanhVien from "./pages/ThanhVien"
import Xe from "./pages/Xe"
import DichVu from "./pages/DichVu"
import HopDong from "./pages/HopDong"
import BangDieuKhien from "./pages/BangDieuKhien"
import BangTin from "./pages/BangTin"

import NotFound from "./pages/NotFound";
import Login from './login/Login';
import TrangCaNhan from "./pages/TrangCaNhan"
function App() {
  return (

    //  <RouterProvider router={router} />
    //Chuyển trang
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/ThanhVien" element={<ThanhVien />} />
          <Route path="/Xe" element={<Xe />} />
          <Route path="/DichVu" element={<DichVu />} />
          <Route path="/HopDong" element={<HopDong />} />

          <Route path="/BangDieuKhien" element={<BangDieuKhien />} />
          <Route path="/TrangCaNhan" element={<TrangCaNhan />} />
          <Route path="/BangTin" element={<BangTin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );

}

export default App;
