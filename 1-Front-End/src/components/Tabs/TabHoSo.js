import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import { useNavigate } from 'react-router-dom';
import { getCookie } from "../Cookie";
import { urlChangeInfo, urlGetInvoiceToday, urlGetRevenueToday, urlGetRevenueMonth, urlGetListRevenueMonth } from "../url";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen } from '@fortawesome/free-solid-svg-icons'

function TabHoSo(props) {
    //xử lý redux
    const dispatch = useDispatch()
    const isMobile = useSelector(state => state.isMobile.isMobile)
    const [dataReq, setDataReq] = useState({});
    useEffect(() => {
        console.log('props.thongTinDangNhap.ThanhVien: ', props.thongTinDangNhap.ThanhVien.HinhAnh);
    }, [props.thongTinDangNhap]);
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
    const [soDienThoai, setSoDienThoai] = useState(props.thongTinDangNhap.ThanhVien.SoDienThoai ? props.thongTinDangNhap.ThanhVien.SoDienThoai: null);
    const [tenThanhVien, setTenThanhVien] = useState(props.thongTinDangNhap.ThanhVien.TenThanhVien);
    const [diaChi, setDiaChi] = useState(props.thongTinDangNhap.ThanhVien.DiaChi ? props.thongTinDangNhap.ThanhVien.DiaChi : null);
    const [hinhAnh, setHinhAnh] = useState(props.thongTinDangNhap.ThanhVien.HinhAnh? props.thongTinDangNhap.ThanhVien.HinhAnh :undefined);
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
    const lines = JSON.stringify(props.thongTinDangNhap.ThanhVien)
        .replace(/{/g, '{\n')
        .replace(/}/g, '\n}')
        .replace(/,/g, ',\n')
        .split('\n');
    // xử lý ảnh
    //url xử lý hiển thị hình ảnh
    const [urlAnh, setUrlAnh] = useState();
    useEffect(() => {
        if (hinhAnh && hinhAnh instanceof File) { // Kiểm tra kiểu dữ liệu
            setUrlAnh(URL.createObjectURL(hinhAnh));
        } else setUrlAnh(hinhAnh);
    }, [hinhAnh]);
    function ImageUpload() {
        const fileInputRef = useRef(null);

        const handleImageChange = (event) => {
            const file = event.target.files[0];
            if (file) {
                // Kiểm tra xem file có phải là hình ảnh hay không
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = () => {
                        setHinhAnh(file)
                        // setDataReq({
                        //     ...dataReq,
                        //     HinhAnh: file // Lưu file hình ảnh vào dataReq
                        // });
                    };
                    reader.readAsDataURL(file);
                } else {
                   openPopupAlert('Bạn chỉ có thể chọn file hình ảnh.')
                }
            } else {
                setHinhAnh(undefined)
                // setDataReq({
                //     ...dataReq,
                //     HinhAnh: undefined
                // });
            }
        };

        const handleChooseFileClick = () => {
            fileInputRef.current.click();
        };

        const handleDrop = (event) => {
            event.preventDefault();
            const file = event.dataTransfer.files[0];

            if (file) {
                // Kiểm tra xem file có phải là hình ảnh hay không
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = () => {
                        setHinhAnh(file)
                        // setDataReq({
                        //     ...dataReq,
                        //     HinhAnh: file // Lưu file hình ảnh vào dataReq
                        // });
                    };
                    reader.readAsDataURL(file);
                } else {
                    openPopupAlert('Bạn chỉ có thể chọn file hình ảnh.')
                }
            }
        };

        const handleDragOver = (event) => {
            event.preventDefault();
        };

        return (
            <div className="form-group">
                <div
                    style={{ width: '100%', textAlign: 'center', margin: '1% 0 2% 0' }}
                    onClick={handleChooseFileClick}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                >
                    {!hinhAnh && <span><span style={{ color: 'blue' }}>Chọn file</span> hoặc Kéo và thả ảnh vào đây</span>}
                    
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*" // Chỉ chấp nhận các file hình ảnh
                        style={{ display: 'none' }}
                        onChange={handleImageChange}
                    />
                    {hinhAnh && (
                        <div style={{position: 'relative',
                        display: 'inline-block' }} >
                            <img
                                src={urlAnh} // Sử dụng URL.createObjectURL để hiển thị hình ảnh đã chọn
                                alt="Selected"
                                style={{
                                    width: '200px',
                                    height: '200px',
                                    objectFit: 'cover',
                                    borderRadius: '50%',
                                    border: '5px solid #6d6dff',
                                    boxShadow: 'rgba(0, 0, 0, 0.05) 0px 20px 27px 0px'
                                }}
                            />
                            <FontAwesomeIcon icon={faPen} 
                            style={{
                                position: 'absolute',
                                bottom: 0,
                                right: 0,
                                cursor: 'pointer' ,
                                width: 20, // Thêm độ rộng
                                height: 20 // Thêm chiều cao 
                              }} 
                            /> 
                            </div>
                    )}
                </div>
            </div>
        );
    }
    const navigate = useNavigate()
    const phoneRegex = /^0\d{9}$/;
    const handleSubmit = () => {
        if ( !tenThanhVien)
            addNotification('Vui lòng nhập đầy đủ thông tin.', 'warning', 4000)
        else if (soDienThoai && !phoneRegex.test(soDienThoai)) {
            addNotification('Số điện thoại không hợp lệ.', 'warning', 4000)
        } 
        else {
            dispatch({ type: 'SET_LOADING', payload: true })
            const formData = new FormData();
            formData.append('TenThanhVien', tenThanhVien);
            formData.append('DiaChi', diaChi);
            formData.append('SoDienThoai', soDienThoai);
            formData.append('HinhAnh', hinhAnh);
            fetch(urlChangeInfo, {
                method: 'PUT',
                headers: {
                    'ss': getCookie('ss'),
                },
                body: formData
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
                    addNotification(data.message, 'success', 3000)
                    navigate(0)
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

        }
    }

    return (
        <div>
            <div class="card" style={{ minHeight: '92vh', position: 'relative' }} >
                <div class="card-header pb-0" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <NotificationContainer notifications={notifications} />
                    <h2 style={{ width: '100%', textAlign: 'center', textDecoration: 'underline' }}>Thông Tin Hồ Sơ</h2>
                    <div style={{ width: '100%', textAlign: 'center', margin: '1% 0 2% 0' }}>
                        <ImageUpload />
                    </div>
                    <div className={`${isMobile ? 'flex-column' : 'row'}`} style={{ width: '80%' }}>
                        <div className={`${isMobile ? 'col-12' : 'col-6 '}`}>
                            <div className="form-group">
                                <label >Mã Thành Viên</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={props.thongTinDangNhap.ThanhVien.MaThanhVien}
                                    onClick={() => {
                                        addNotification('Bạn cần liên hệ với QTV để cập nhật những thông tin này', 'warning', 4000)
                                    }}
                                    style={{
                                        opacity: 0.9,
                                        cursor: 'not-allowed'
                                    }}
                                />
                            </div>
                            <div className="form-group">
                                <label>Tên Thành Viên</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={tenThanhVien}
                                    onChange={(event) => {
                                        setTenThanhVien(event.target.value);
                                    }}
                                />
                            </div>

                        </div>
                        <div className={`${isMobile ? 'col-12' : 'col-6 '}`}>
                            <div className="form-group">
                                <label>Số Điện Thoại</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={soDienThoai}
                                    onChange={(event) => {
                                        setSoDienThoai(event.target.value);
                                    }}
                                    
                                />
                            </div>


                            <div className="form-group">
                                <label>Địa Chỉ</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={diaChi}
                                    onChange={(event) => {
                                        setDiaChi(event.target.value);
                                    }}
                                />
                            </div>
                            <button style={{ float: 'right' }} className="btn bg-gradient-info" onClick={() => {
                                handleSubmit()
                            }}>Cập nhật thông tin</button>
                        </div>
                    </div>

                    {/* <pre
                        style={{
                            background: '#333',
                            color: '#fff',
                            padding: '10px',
                            margin: '20px auto',
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-all'
                        }}
                    >
                        Đã chọn: {lines.map(line => <div>{line}</div>)}
                    </pre> */}
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

export default TabHoSo