import React, { useState, useEffect } from "react";
import { getCookie } from "./Cookie";
import { useNavigate } from 'react-router-dom';
import { urlCheckLogin } from "./url";
function CheckLogin({ children,thongTinDangNhap }) {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);
  useEffect(() => {
    const url = urlCheckLogin; // Đường dẫn API của bạn
    const data = {
      ss: getCookie("ss")
    };
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(result => {
        if (result.success === true) {
          thongTinDangNhap(result)
          setIsAuthorized(true);
        } else {
          navigate(`/`);
          //window.location.href = "/";//Chuyển trang
        }
      })
      .catch(error => {
        console.log(error);
        //alert("Không thể kết nối tới máy chủ");
      });
  }, []);

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}

export default CheckLogin;