import React, { useState,useEffect } from "react";
import { useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faCog, faBell, faTimes, faBars, faSignOut ,faAddressCard, faUserCircle } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux'

import { getCookie, deleteCookie } from "../components/Cookie";
import { urlLogout } from "../components/url";
import CheckLogin from "../components/CheckLogin"
import Navigation from "../components/Navigation"
import loadingGif from '../assets/img/loading/loading1.gif'
import TabHoSo from "../components/Tabs/TabHoSo";
import TabTaiKhoan from "../components/Tabs/TabTaiKhoan";
import '../App.css';
function TrangCaNhan() {
    const [thongTinDangNhap, setThongTinDangNhap] = useState({
        menu: [],
        ThanhVien: {}
    });
    const xuLyLayThongTinDangNhap = (data) => {
        setThongTinDangNhap(data);
    };
    //xử lý redux
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const loading = useSelector(state => state.loading.loading)
    const logout = () => {
            dispatch({ type: 'SET_LOADING', payload: true })
            fetch(urlLogout, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'ss': getCookie('ss')
                },
            })
                .then(response => {
                    if (response.status === 200) {
                        deleteCookie('ss')
                        dispatch({ type: 'SET_LOADING', payload: false })
                        navigate(`/`);
                        //window.location.href = "/";//Chuyển trang
                    } else if (response.status === 401) {
                        return response.json().then(errorData => { throw new Error(errorData.message); });
                    } else if (response.status === 500) {
                        return response.json().then(errorData => { throw new Error(errorData.message); });
                    } else {
                        return;
                    }
                })
                .catch(error => {
                    dispatch({ type: 'SET_LOADING', payload: false })
                    if (error instanceof TypeError) {
                        alert('Không thể kết nối tới máy chủ');
                    } else {
                        alert(error);
                    }

                });
        
    }

    const [isMobile, setIsMobile] = useState(() => {
        return window.innerWidth < 1250;
    });
    const [errHeight, setErrHeight] = useState(false);
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1250);
            const isMobileRedux = window.innerWidth < 1250;
            dispatch({
                type: 'SET_ISMOBILE',
                payload: isMobileRedux
            });
            if (window.innerHeight < 700) {
                setErrHeight(true)
            } else setErrHeight(false)
        }

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, []);

    const [showNavigation, setShowNavigation] = useState(() => {
        return isMobile ? false : true;
    });
    const handleToggleNavigation = () => {
        setShowNavigation(!showNavigation);
    };
    const navigationColumnClass = showNavigation ? "col-2" : "col-0";
    const contentColumnClass = showNavigation ? "col-10" : "col-12";


    const tabs = {
        tab1: 'TabHoSo',
        tab2:'TabTaiKhoan'
    }

    const [activeTab, setActiveTab] = useState(tabs.tab1);

    const handleTabClick = tab => {
        setActiveTab(tab);
    }
    let TabComponent;

    if (activeTab === tabs.tab1) {
        TabComponent = TabHoSo;
    }
    if (activeTab === tabs.tab2) {
        TabComponent = TabTaiKhoan;
    }


    return (
        <CheckLogin thongTinDangNhap={xuLyLayThongTinDangNhap}  >
            {loading && <div className="loading">
                <img src={loadingGif} style={{ width: '30%' }} />
            </div>}
            {errHeight ? <div className="popup">
                <div className="popup-box">
                    <div className="box">
                        <div className="conten-modal" >
                            <h6>Bạn đang sử dụng thiết bị có chiều cao nhỏ hơn 700px.</h6>
                            <p>Để đảm bảo ứng dụng được hiển thị đầy đủ hãy sử dụng thiết bị có chiều cao lớn hơn như máy tính, máy tính bảng.</p>
                            <strong style={{ fontSize: '0.9rem',color:'red' }}>Nếu bạn đang sử dụng điện thoại, hãy xoay dọc điện thoại của mình.</strong>
                        </div>
                    </div>
                </div>
            </div>
                :
            <div className="row">
                <div className={navigationColumnClass}>
                    {showNavigation && <Navigation menu={thongTinDangNhap.menu} />}
                </div>
                <div className={contentColumnClass} style={{
                    opacity: isMobile && showNavigation ? 0.3 : 1,
                    pointerEvents: isMobile && showNavigation ? 'none' : 'auto'
                }}>
                    <div style={{ marginLeft: '2%', marginRight: '1%' }}>
                        <div style={{ marginLeft: '0px' }} className="row">
                            <ul class="nav nav-tabs col-6">
                                <li class="nav-item">
                                    <button style={{ color: 'blue' }} class="nav-link " onClick={handleToggleNavigation}>
                                        {showNavigation ? "<<" : ">>"}
                                    </button>
                                </li>
                                <li class="nav-item">
                                    <button
                                        className={activeTab === 'TabHoSo' ? 'nav-link active' : 'nav-link'}
                                        style={{ color: 'blue' }}
                                        onClick={() => handleTabClick(tabs.tab1)}>{isMobile ? (
                                            <FontAwesomeIcon icon={faAddressCard} />
                                        ) : (
                                            'Hồ Sơ'
                                        )}
                                        </button>
                                </li>
                                <li class="nav-item">
                                    <button
                                        className={activeTab === 'TabTaiKhoan' ? 'nav-link active' : 'nav-link'}
                                        style={{ color: 'blue' }}
                                        onClick={() => handleTabClick(tabs.tab2)}>{isMobile ? (
                                            <FontAwesomeIcon icon={faUserCircle} />
                                        ) : (
                                            'Tài Khoản'
                                        )}
                                        </button>
                                </li>
                            </ul>
                            <div className="col-6 d-flex justify-content-end align-items-center">
                                <span style={{ marginLeft: '20px' }} className="mb-0 d-sm-inline d-none text-body font-weight-bold px-0">
                                    <div onClick={() => {
                                        navigate(`/TrangCaNhan`);
                                    }}>
                                        <FontAwesomeIcon icon={faUser} />  Chào! <span style={{ color: 'blue' }}>{thongTinDangNhap.ThanhVien.TenThanhVien}</span>
                                    </div>
                                </span>
                                <button style={{ marginLeft: '20px' }} onClick={() => logout()} className="btn bg-gradient-info btn-sm mb-0">
                                    Đăng Xuất <FontAwesomeIcon icon={faSignOut} />
                                </button>
                            </div>
                        </div>
                        <TabComponent  thongTinDangNhap={thongTinDangNhap}/>
                    </div>
                </div>
                <button
                    id="ButtonMenu"
                    className="btn bg-gradient-info"
                    style={{
                        position: 'fixed',
                        top: '3rem',
                        right: '1.5rem',
                        padding: '8px 16px',
                        width: '3rem'
                    }}
                    onClick={() => {
                        setShowNavigation(!showNavigation)
                    }}
                >
                    {showNavigation ? (
                        <FontAwesomeIcon icon={faTimes} />
                    ) : (
                        <FontAwesomeIcon icon={faBars} />
                    )}
                </button>
            </div>
}
        </CheckLogin>
    );
}

export default TrangCaNhan