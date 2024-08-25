import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faCog, faBell, faTimes, faBars, faSignOut, faCar, faShareAlt, faExclamationTriangle, faSitemap, faClock } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux'

import { getCookie, deleteCookie } from "../components/Cookie";
import { urlLogout } from "../components/url";
import CheckLogin from "../components/CheckLogin"
import Navigation from "../components/Navigation"
import loadingGif from '../assets/img/loading/loading1.gif'
import TabTinhTrangXe from "../components/Tabs/TabTinhTrangXe";
import TabNhomLoaiXe from "../components/Tabs/TabNhomLoaiXe";
import TabLoaiXe from "../components/Tabs/TabLoaiXe";
import TabXe from "../components/Tabs/TabXe";
import TabLichSuSuDung from "../components/Tabs/TabLichSuSuDung";
import '../App.css';

function Xe() {
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
    const logout = () => {

        dispatch({ type: 'SET_LOADING', payload: true })
        fetch(urlLogout, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'ss': getCookie('ss'),
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

    //Xử lý menu
    const [isMobile, setIsMobile] = useState(() => {
        return window.innerWidth < 1250;
    });
    const [errHeight, setErrHeight] = useState(window.innerHeight < 700);
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

    const loading = useSelector(state => state.loading.loading)
    const tabs = {
        tab1: 'TabTinhTrangXe',
        tab2: 'TabNhomLoaiXe',
        tab3: 'TabLoaiXe',
        tab4: 'TabXe',
        tab5: 'TabLichSuSuDung'
    }

    const [activeTab, setActiveTab] = useState(tabs.tab4);

    const handleTabClick = tab => {
        setActiveTab(tab);
    }
    let TabComponent;

    if (activeTab === tabs.tab1) {
        TabComponent = TabTinhTrangXe;
    }

    if (activeTab === tabs.tab2) {
        TabComponent = TabNhomLoaiXe;
    }
    if (activeTab === tabs.tab3) {
        TabComponent = TabLoaiXe;
    }
    if (activeTab === tabs.tab4) {
        TabComponent = TabXe;
    }
    if (activeTab === tabs.tab5) {
        TabComponent = TabLichSuSuDung;
    }

    return (
        <CheckLogin thongTinDangNhap={xuLyLayThongTinDangNhap} >
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
                            <ul class={`nav nav-tabs  ${isMobile ? 'col-10' : 'col-8'} `} >
                                {!isMobile &&
                                    <li class="nav-item" >
                                        <button class="nav-link " style={{ color: 'blue' }} onClick={handleToggleNavigation}>
                                            {showNavigation ? "<<" : ">>"}
                                        </button>
                                    </li>
                                }
                                <li class="nav-item">
                                    <button
                                        className={activeTab === 'TabXe' ? 'nav-link active' : 'nav-link'}
                                        style={{ color: 'blue' }}
                                        onClick={() => handleTabClick(tabs.tab4)}>{isMobile ? (
                                            <FontAwesomeIcon icon={faCar} />
                                        ) : (
                                            'Xe'
                                        )}
                                    </button>
                                </li>
                                <li class="nav-item">
                                    <button
                                        className={activeTab === 'TabTinhTrangXe' ? 'nav-link active' : 'nav-link'}
                                        style={{ color: 'blue' }}
                                        onClick={() => handleTabClick(tabs.tab1)}>{isMobile ? (
                                            <FontAwesomeIcon icon={faExclamationTriangle} />
                                        ) : (
                                            'Tình Trạng Xe'
                                        )}
                                    </button>
                                </li>
                                <li class="nav-item">
                                    <button
                                        style={{ color: 'blue' }}
                                        className={activeTab === 'TabLoaiXe' ? 'nav-link active' : 'nav-link'}
                                        onClick={() => handleTabClick(tabs.tab3)}>{isMobile ? (
                                            <FontAwesomeIcon icon={faShareAlt} />
                                        ) : (
                                            'Loại Xe'
                                        )}
                                    </button>
                                </li>
                                <li class="nav-item">
                                    <button
                                        style={{ color: 'blue' }}
                                        className={activeTab === 'TabNhomLoaiXe' ? 'nav-link active' : 'nav-link'}
                                        onClick={() => handleTabClick(tabs.tab2)}>{isMobile ? (
                                            <FontAwesomeIcon icon={faSitemap} />
                                        ) : (
                                            'Nhóm Loại Xe'
                                        )}
                                    </button>
                                </li>
                                <li class="nav-item">
                                    <button
                                        style={{ color: 'blue' }}
                                        className={activeTab === 'TabLichSuSuDung' ? 'nav-link active' : 'nav-link'}
                                        onClick={() => handleTabClick(tabs.tab5)}>{isMobile ? (
                                            <FontAwesomeIcon icon={faClock} />
                                        ) : (
                                            'Lịch Sử Sử Dụng'
                                        )}
                                    </button>
                                </li>
                            </ul>
                            <div className={` ${isMobile ? 'col-2' : 'col-4'} d-flex justify-content-end align-items-center`}>
                                <span style={{ marginLeft: '20px',fontSize:'0.8rem' }} className="mb-0 d-sm-inline d-none text-body font-weight-bold px-0">
                                    <div onClick={() => {
                                        navigate(`/TrangCaNhan`);
                                    }}>
                                        <FontAwesomeIcon icon={faUser} />  Chào! <span style={{ color: 'blue' }}> {
                                                    thongTinDangNhap.ThanhVien.TenThanhVien ?
                                                    thongTinDangNhap.ThanhVien.TenThanhVien.length > 17 ?
                                                    thongTinDangNhap.ThanhVien.TenThanhVien.slice(0,17) + '...' :
                                                    thongTinDangNhap.ThanhVien.TenThanhVien
                                                        : ''
                                                }
                                        </span>
                                    </div>
                                </span>
                                <button style={{ marginLeft: '20px' }} onClick={() => logout()} className="btn bg-gradient-info btn-sm mb-0">
                                    {isMobile ? (
                                        <FontAwesomeIcon icon={faSignOut} />
                                    ) : (
                                        <>
                                            Đăng Xuất  <FontAwesomeIcon icon={faSignOut} />
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                        <TabComponent isMobile={isMobile} />

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

export default Xe