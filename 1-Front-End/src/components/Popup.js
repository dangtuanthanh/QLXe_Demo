import React from 'react';
import $ from 'jquery'
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil , faTrash, faRotate, faAdd } from '@fortawesome/free-solid-svg-icons'

const ThemNhanVien = props => {
  return (
    <div className="popup-box">
      <div className="box">
        <span className="close-icon" onClick={props.handleClose}>x</span>
        {props.content}
      </div>
    </div>
  );
};
const ThongBao = props => {
  return (
      <div className="Alert">
        {props.content}
      </div>
    
  );
}

const Xuat = props => {
  return (
    <div className="popup-box">
      <div className="box">
        <span className="close-icon" onClick={props.handleClose2}>x</span>
        {props.content2}
      </div>
    </div>
  );
};

const ThongTinHD = props => {
  return (
    <div className="popup-box">
      <div className="box">
        <span className="close-icon" onClick={props.handleClose3}>x</span>
        {props.content3}
      </div>
    </div>
  );
};

const Nhap = props => {
  return (
    <div className="popup-box">
      <div className="box">
        <span className="close-icon" onClick={props.handleClose4}>x</span>
        {props.content4}
      </div>
    </div>
  );
};
function Demoa(){
    alert("aaaa")
}

const LuaChon = props => {
  return (
    <div className="popup-box">
      <div className="box">
        <span className="close-icon" onClick={props.handleClose5}>x</span>
        {props.content5}
      </div>
    </div>
  );
};

const DataTable = props => {
  return (
    <div className="popup-box">
      <div className="box">
        <span className="close-icon" onClick={props.handleClose6}>x</span>
        {props.content6}
      </div>
    </div>
  );
};

const XacNhan = props => {
  return (
    <div className="popup-box2">
      <div className="box2">
        <span className="close-icon" onClick={props.handleClose7}>x</span>
        {props.content7}
      </div>
    </div>
  );
};

export {
    Demoa,
    ThemNhanVien,
    ThongBao,
    Xuat,
    ThongTinHD,
    Nhap,
    LuaChon,
    DataTable,
    XacNhan
  }
