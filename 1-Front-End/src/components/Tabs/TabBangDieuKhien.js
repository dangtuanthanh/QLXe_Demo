import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import { Link, useLocation } from "react-router-dom"
import { getCookie } from "../Cookie";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons'

import { urlGetTotalCar, urlGetTotalMember, urlGetYearContract, urlGetRevenueYear, urlGetListRevenueYear } from "../url";
function TabBangDieuKhien() {
    //xử lý redux
    const dispatch = useDispatch();
    const isMobile = useSelector(state => state.isMobile.isMobile)
    const [tongSoXe, setTongSoXe] = useState('...');
    const [tongThanhVien, setTongThanhVien] = useState('...');
    const [hopDongNamNay, setHopDongNamNay] = useState('...');
    const [doanhThuNamNay, setDoanhThuNamNay] = useState('...');
    const [label, setLabel] = useState([]);
    const [dataSetNow, setDataSetNow] = useState([]);
    const [dataSetoldYear, setDataSetoldYear] = useState([]);
    const currentYear = new Date().getFullYear();
    const previousYear = currentYear - 1;
    const [dataUser, setdataUser] = useState({//dữ liệu người dùng
        oldYear: previousYear,
        year: currentYear
    });//
    const handleChangeYear = (e) => {
        setdataUser({
            ...dataUser,
            year: e.target.value
        });
    }
    const handleChangeOldYear = (e) => {
        setdataUser({
            ...dataUser,
            oldYear: e.target.value
        });
    }
    const handleSwap = () => {
        setdataUser({
            year: dataUser.oldYear,
            oldYear: dataUser.year
        });
    }
    const years = [];
    for (let i = 2000; i <= 2099; i++) {
        years.push(i);
    }
    const dataDoThi = {
        labels: label,
        datasets: [
            {
                label: dataUser.oldYear,
                data: dataSetoldYear,
                borderColor: 'rgb(255, 99, 132)'
            },
            {
                label: dataUser.year,
                data: dataSetNow,
                borderColor: 'rgb(75, 192, 192)'
            }

        ]
    }
    const optionsDoThi = {
        scales: {
            yAxes: [
                {
                    ticks: {
                        max: 70,
                        min: 0,
                        stepSize: 10
                    }
                }
            ]
        },
        elements: {
            point: {
                radius: 3
            }
        },
        animation: {
            tension: 0.4
        },
        hover: {
            animationDuration: 0
        },
        responsiveAnimationDuration: 0,
        cubicInterpolationMode: 'monotone'
    };

    // popup hộp thoại thông báo
    const [popupAlert, setPopupAlert] = useState(false);//trạng thái thông báo
    const [popupMessageAlert, setPopupMessageAlert] = useState('');
    const [onAction, setOnAction] = useState(() => { });
    const PopupAlert = (props) => {
        return (
            <div className="popup">
                <div className="popup-box">
                    <div className="box" style={{ textAlign: 'center',width:isMobile && '100%' }}>
                        <h5>Thông Báo</h5>

                        <p>{props.message}</p>
                        {props.onAction ? <div>
                            <button style={{ float: 'left' }} className="btn btn-danger" onClick={props.onClose}>Thoát</button>
                            <button style={{ float: 'right' }} className="btn btn-success" onClick={handleConfirm}>Xác Nhận</button>
                        </div> :
                            <button className="btn btn-success" onClick={props.onClose}>Xác Nhận</button>
                        }
                    </div>
                </div>
            </div>
        );
    };
    const openPopupAlert = (message, actionHandler) => {
        setPopupMessageAlert(message);
        setPopupAlert(true);
        setOnAction(() => actionHandler);
    }
    const closePopupAlert = () => {
        setPopupAlert(false);
    };
    const handleConfirm = () => {
        onAction();
        closePopupAlert();
    }

    //popup thông báo góc màn hình
    const [notifications, setNotifications] = useState([]);
    const addNotification = (message, btn, duration = 3000) => {
        const newNotification = {
            id: Date.now(),
            message,
            btn,
            duration,
        };
        setNotifications(prevNotifications => [...prevNotifications, newNotification]);
        setTimeout(() => {
            removeNotification(newNotification.id);
        }, duration);
    };
    const removeNotification = (id) => {
        setNotifications(prevNotifications =>
            prevNotifications.filter(notification => notification.id !== id)
        );
    };
    const NotificationContainer = ({ notifications }) => {
        return (
            <div className="notification-container">
                {notifications.map(notification => (
                    <div
                        key={notification.id}
                        className={` btn btn-${notification.btn}`}
                        onClick={() => removeNotification(notification.id)}
                    >
                        {notification.message}
                    </div>
                ))}
            </div>
        );
    };
    useEffect(() => {
        TaiDuLieu()
    }, [dataUser]);
    const TaiDuLieu = () => {
        dispatch({ type: 'SET_LOADING', payload: true })
        fetch(`${urlGetListRevenueYear}?oldYear=${dataUser.oldYear}&year=${dataUser.year}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'ss': getCookie('ss'),
            },
        })
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                } else if (response.status === 401) {
                    return response.json().then(errorData => { throw new Error(errorData.message); });
                } else if (response.status === 500) {
                    return response.json().then(errorData => { throw new Error(errorData.message); });
                } else {
                    return;
                }
            })
            .then(data => {
                const label = [];
                const dataSetoldYear = [];
                const dataSetNow = [];

                data.oldYear.forEach(item => {
                    label.push(item.Month);
                    dataSetoldYear.push(item.Revenue);
                });

                data.year.forEach(item => {
                    dataSetNow.push(item.Revenue);
                });

                setLabel(label);
                setDataSetoldYear(dataSetoldYear);
                setDataSetNow(dataSetNow);
                //ẩn loading
                dispatch({ type: 'SET_LOADING', payload: false })
            })
            .catch(error => {
                dispatch({ type: 'SET_LOADING', payload: false })
                if (error instanceof TypeError) {
                    openPopupAlert('Không thể kết nối tới máy chủ. Vui lòng kiểm tra đường truyền kết nối!')
                } else {
                    addNotification(error.message, 'warning', 5000)
                }

            });
    };
    useEffect(() => {
        dispatch({ type: 'SET_LOADING', payload: true })
        //lấy 1 sản phẩm
        const fetch1 = fetch(`${urlGetTotalCar}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'ss': getCookie('ss'),
            },
        })
        const fetch2 = fetch(`${urlGetTotalMember}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'ss': getCookie('ss'),
            },
        })
        const fetch3 = fetch(`${urlGetYearContract}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'ss': getCookie('ss'),
            },
        })
        const fetch4 = fetch(`${urlGetRevenueYear}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'ss': getCookie('ss'),
            },
        })

        Promise.all([fetch1, fetch2, fetch3, fetch4])
            .then(responses => {
                const processedResponses = responses.map(response => {
                    if (response.status === 200) {
                        return response.json();
                    } else if (response.status === 400 || response.status === 401 || response.status === 500) {
                        return response.json().then(errorData => {
                            throw new Error(errorData.message);
                        });
                    } else {
                        return null;
                    }
                });
                return Promise.all(processedResponses);
            })
            .then(data => {
                setTongSoXe(data[0]) //số bàn có khách
                setTongThanhVien(data[1])
                setHopDongNamNay(data[2])
                setDoanhThuNamNay(data[3])

                //ẩn loading
                dispatch({ type: 'SET_LOADING', payload: false })
            })
            .catch(error => {
                if (error instanceof TypeError) {
                    openPopupAlert('Không thể kết nối tới máy chủ. Vui lòng kiểm tra đường truyền kết nối!')
                } else {
                    addNotification(error.message, 'warning', 5000)
                }
                dispatch({ type: 'SET_LOADING', payload: false })
            });



    }, []);
    
    return (
        <div>
            <div class="card" style={{ minHeight: '92vh', position: 'relative' }} >
                <div class="card-header pb-0" >
                    <h2>Bảng Điều Khiển</h2>
                    <NotificationContainer notifications={notifications} />
                    {/* Thanh Chức Năng : Làm mới, thêm, sửa, xoá v..v */}

                    <div>
                    </div>
                </div>
                <div class="card-body px-0 pt-0 pb-2 mt-2" >
                    <div className="" style={{ marginLeft: '10px', marginRight: '10px' }}>
                        <div className={`${isMobile ? 'flex-column' : 'row'}`} >
                            <div className={`${isMobile ? 'col-12' : 'col-3 '}`} >
                                <div class="card-body p-3" style={{ borderRadius: '15px', backgroundColor: 'rgb(239 244 255)' }}>
                                    <Link class="row" to={`/Xe`} >

                                        <div class="col-8">
                                            <div class="numbers">
                                                <p class="text-sm mb-0 text-capitalize font-weight-bold" >Tổng Số Xe</p>
                                                <h5 class="font-weight-bolder mb-0">
                                                    {tongSoXe}
                                                </h5>

                                            </div>
                                        </div>
                                        <div class="col-4 text-end">
                                            <div class="icon icon-shape bg-gradient-info shadow text-center border-radius-md">
                                                <i class="ni ni-delivery-fast text-lg opacity-10" aria-hidden="true"></i>
                                            </div>
                                        </div>
                                    </Link>
                                </div>


                            </div>
                            <div className={`${isMobile ? 'col-12' : 'col-3 '}`} style={{ marginTop: isMobile && '1rem' }}>
                                <div class="card-body p-3" style={{ borderRadius: '15px', backgroundColor: 'rgb(239 244 255)' }}>
                                    <Link class="row" to={`/ThanhVien`}>
                                        <div class="col-8">
                                            <div class="numbers">
                                                <p class="text-sm mb-0 text-capitalize font-weight-bold" >Tổng Số Thành Viên</p>
                                                <h5 class="font-weight-bolder mb-0">
                                                    {tongThanhVien}
                                                </h5>
                                            </div>
                                        </div>
                                        <div class="col-4 text-end">
                                            <div class="icon icon-shape bg-gradient-info shadow text-center border-radius-md">
                                                <i class="ni ni-circle-08 text-lg opacity-10" aria-hidden="true"></i>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                            <div className={`${isMobile ? 'col-12' : 'col-3 '}`} style={{ marginTop: isMobile && '1rem' }}>
                                <div class="card-body p-3" style={{ borderRadius: '15px', backgroundColor: 'rgb(239 244 255)' }}>
                                    <Link class="row" to={`/HopDong`}>
                                        <div class="col-8">
                                            <div class="numbers">
                                                <p class="text-sm mb-0 text-capitalize font-weight-bold" >Hợp Đồng Năm Nay</p>
                                                <h5 class="font-weight-bolder mb-0">
                                                    {hopDongNamNay}
                                                </h5>
                                            </div>
                                        </div>
                                        <div class="col-4 text-end">
                                            <div class="icon icon-shape bg-gradient-info shadow text-center border-radius-md">
                                                <i class="ni ni-folder-17 text-lg opacity-10" aria-hidden="true"></i>

                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                            <div className={`${isMobile ? 'col-12' : 'col-3 '}`} style={{ marginTop: isMobile && '1rem' }}>
                                <div class="card-body p-3" style={{ borderRadius: '15px', backgroundColor: 'rgb(239 244 255)' }}>
                                    <Link class="row" to={`/HopDong`}>
                                        <div class="col-8">
                                            <div class="numbers">
                                                <p class="text-sm mb-0 text-capitalize font-weight-bold" >Doanh Thu Năm Nay</p>
                                                <h5 class="font-weight-bolder mb-0">
                                                    {new Intl.NumberFormat('vi-VN', {
                                                        style: 'currency',
                                                        currency: 'VND'
                                                    }).format(doanhThuNamNay)}

                                                </h5>
                                            </div>
                                        </div>
                                        <div class="col-4 text-end">
                                            <div class="icon icon-shape bg-gradient-info shadow text-center border-radius-md">
                                                <i class="ni ni-money-coins text-lg opacity-10" aria-hidden="true"></i>

                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        {isMobile && <hr class="horizontal dark" />}
                        <div style={{ marginTop: isMobile ? '2%' : '1%', display: 'flex', alignItems: 'center' }}>
                            <div style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
                                <h4 style={{ textAlign: 'center', textDecoration: 'underline' }}> Doanh Thu Năm
                                </h4>
                            </div>
                            {!isMobile &&
                                <div>
                                    <select
                                        value={dataUser.oldYear}
                                        onChange={handleChangeOldYear}
                                        className="form-select-sm"
                                        style={{ marginLeft: 'auto', border: '2px solid rgb(255, 99, 132)' }}
                                    >
                                        {years.map(year => (
                                            <option key={year} value={year}>
                                                {year}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            }
                            {!isMobile && <div style={{ display: 'flex', alignItems: 'center' }}>
                                ㅤ <FontAwesomeIcon icon={faExchangeAlt} onClick={() => { handleSwap() }} /> ㅤ</div>}
                            {!isMobile &&
                                <div>
                                    <select
                                        value={dataUser.year}
                                        onChange={handleChangeYear}
                                        className="form-select-sm"
                                        style={{ marginLeft: 'auto', border: '2px solid rgb(75, 192, 192)' }}
                                    >
                                        {years.map(year => (
                                            <option key={year} value={year}>
                                                {year}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            }
                        </div>
                        <div style={{ width: isMobile ?'100%': '80%', display: 'flex', justifyContent: 'center', margin: '0 2% 0 2%' }}>
                            <Line
                                data={dataDoThi}
                                options={optionsDoThi}
                            >
                            </Line>
                        </div>

                    </div>

                </div>
            </div>
            {
                popupAlert && <PopupAlert
                    message={popupMessageAlert}
                    onClose={closePopupAlert}
                    onAction={onAction}
                />
            }
        </div>
    )

}

export default TabBangDieuKhien