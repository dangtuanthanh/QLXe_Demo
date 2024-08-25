import React, { useState, useEffect } from "react";
import { getCookie, setCookie } from "../components/Cookie";
import curvedImage from '../assets/img/logos/logo.png';
//import curvedImage2 from '../assets/img/curved-images/logo-removebg-preview2.png';
import unidecode from 'unidecode';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import { urlCheckLogin, urlLogin, urlRegister, urlRegisterCode } from "../components/url";
function Login() {
    //Kiểm tra đăng nhập trang login
    const navigate = useNavigate();
    const [isRegister, setIsRegister] = useState(false);// đăng ký
    const [isCode, setIsCode] = useState(false);// hiển thị trang mã xác thực
    const [isLoading, setIsLoading] = useState(true);// kiểm tra đăng nhập

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
        const url = urlCheckLogin; // Đường dẫn API của bạn
        const data = {
            ss: getCookie("ss")
            //ss: '1'
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
                setIsLoading(false);
                if (result.success == true) {
                    const menuPath = unidecode(result.menu[0]).replace(/\s+/g, '') // Loại bỏ dấu cách
                    //window.location.href = `/${menuPath}`;//Chuyển trang
                    navigate(`/${menuPath}`);
                    //router.push("/NhanVien");
                }
            })
            .catch(error => {
                alert("Không thể kết nối tới máy chủ")
            });
    }, []);

    //--
    //hàm xử lý  bắt lỗi
    const [email, setEmail] = useState('admin@gmail.com');
    const [ten, setTen] = useState('');
    const [password, setPassword] = useState('admin');
    const [titleError, setTitleError] = useState('');
    const [error, setError] = useState(false);//hiển thị lỗi
    const [code, setCode] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);// trạng thái bấm nút đăng nhập
    const handleEmailChange = (event) => {
        setError(false);
        setEmail(event.target.value);
    };
    const handleTenChange = (event) => {
        setError(false);
        setTen(event.target.value);
    };
    const handleCodeChange = (event) => {
        setError(false);
        setCode(event.target.value);
    };
    const handlePasswordChange = (event) => {
        setError(false);
        setPassword(event.target.value);
    };
    const handleSubmit2 = () => {
        if (!code) {
            setTitleError("Vui lòng nhập mã xác thực.");
            setError(true);
            setIsSubmitting(false); // Đặt isSubmitting thành false nếu có lỗi không nhập
            return;
        }
        if (isSubmitting) {
            return; // Ngăn chặn việc bấm nút nếu đã gửi yêu cầu trước đó
        }

        setIsSubmitting(true);

        setError(false);
        // Gọi API
        const data = {
            Code: code
        };
        fetch(urlRegisterCode, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => {
                setIsSubmitting(false);
                if (response.status === 200) {
                    return response.json();
                } else if (response.status === 401) {
                    return response.json().then(errorData => { throw new Error(errorData.message); });
                }
                else if (response.status === 400) {
                    return response.json().then(errorData => { throw new Error(errorData.message); });
                } else if (response.status === 500) {
                    return response.json().then(errorData => { throw new Error(errorData.message); });
                } else {
                    return;

                }
            })
            .then(data => {
                addNotification('Đăng Ký Thành Công', 'success', 3000)
                setIsCode(false)
                setIsRegister(false)

            })
            .catch(error => {
                setIsSubmitting(false);
                if (error instanceof TypeError) {
                    console.log(error);
                    setTitleError("Không thể kết nối tới máy chủ")
                    setError(true);
                } else {
                    setTitleError(error.message)
                    setError(true);
                }

            });
    }
    const emailRegex = /^[^ @]+@[^ @]+\.[^ @]+$/;
    const [timeLeft, setTimeLeft] = useState(30);
    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(time => time - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timeLeft]);
    const handleSubmit = () => {
        if (isRegister) {
            if (!email || !password || !ten) {
                setTitleError("Vui lòng nhập đầy đủ thông tin đăng nhập.");
                setError(true);
                setIsSubmitting(false); // Đặt isSubmitting thành false nếu có lỗi không nhập
                return;
            } else if (!emailRegex.test(email)) {
                setTitleError("Email không đúng định dạng.");
                setError(true);
                setIsSubmitting(false);
                return;
            }
            if (isSubmitting) {
                return; // Ngăn chặn việc bấm nút nếu đã gửi yêu cầu trước đó
            }

            setIsSubmitting(true);

            setError(false);
            // Gọi API
            const data = {
                TenThanhVien: ten,
                Email: email,
                MatKhau: password
            };
            fetch(urlRegister, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then(response => {
                    setIsSubmitting(false);
                    if (response.status === 200) {
                        return response.json();
                    } else if (response.status === 401) {
                        return response.json().then(errorData => { throw new Error(errorData.message); });
                    } else if (response.status === 400) {
                        return response.json().then(errorData => { throw new Error(errorData.message); });
                    }
                    else if (response.status === 500) {
                        return response.json().then(errorData => { throw new Error(errorData.message); });
                    } else {
                        return;

                    }
                })
                .then(data => {
                    if (data.success) {
                        setIsCode(true)
                        setTimeLeft(30);
                    }

                })
                .catch(error => {
                    setIsSubmitting(false);
                    if (error instanceof TypeError) {
                        setTitleError("Không thể kết nối tới máy chủ")
                        setError(true);
                    } else {
                        setTitleError(error.message)
                        setError(true);
                    }

                });
        } else {
            if (!email || !password) {
                setTitleError("Vui lòng nhập đầy đủ thông tin đăng nhập.");
                setError(true);
                setIsSubmitting(false); // Đặt isSubmitting thành false nếu có lỗi không nhập
                return;
            } else if (!emailRegex.test(email)) {
                setTitleError("Email không đúng định dạng.");
                setError(true);
                setIsSubmitting(false);
                return;
            }
            if (isSubmitting) {
                return; // Ngăn chặn việc bấm nút nếu đã gửi yêu cầu trước đó
            }

            setIsSubmitting(true);

            setError(false);
            console.log('Đang đăng nhập');
            // Thực hiện xử lý đăng nhập
            // Gọi API
            const data = {
                Email: email,
                MatKhau: password
            };
            fetch(urlLogin, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then(response => {
                    setIsSubmitting(false);
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
                    setCookie('ss', `${data.cookieValue}`, 3);
                    window.location.reload();
                })
                .catch(error => {
                    setIsSubmitting(false);
                    if (error instanceof TypeError) {
                        setTitleError("Không thể kết nối tới máy chủ")
                        setError(true);
                    } else {
                        setTitleError(error.message)
                        setError(true);
                    }

                });
        }

    };
    const handleEnterKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSubmit();
        }
    };

    if (isLoading) {
        return <h4 className="loading">Đang Kiểm Tra Đăng Nhập...</h4>
    } else {
        return (
            <div class="container">
                <div class="row">
                    <div className="col-md-6">
                        <div className="d-none d-md-block">
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                <img style={{ width: '60%', marginTop: '25%' }} src={`${curvedImage}`} alt="Logo" />
                            </div>
                        </div>
                    </div>
                    <div class="col-xl-4 col-lg-5 col-md-6 d-flex flex-column mx-auto">
                        <div style={{ backgroundColor: 'white' }} class="card card-plain mt-8">
                            <NotificationContainer notifications={notifications} />
                            {!isRegister ?
                                <div class="card-header pb-0 text-left bg-transparent">
                                    <h3 class="font-weight-bolder text-info text-gradient">Đăng Nhập</h3>
                                    <p class="mb-0">Truy Cập Vào Hệ Thống Của Bạn</p>
                                </div>
                                : <div class="card-header pb-0 text-left bg-transparent">
                                    <h3 class="font-weight-bolder text-info text-gradient">Đăng Ký</h3>
                                    <p class="mb-0">Tạo Tài Khoản Mới</p>
                                </div>
                            }

                            <div class="card-body" style={{ paddingTop: '10px' }}>
                                {isCode ?
                                    <form role="form">
                                        <div>
                                            <label>Nhập Mã Xác Thực Đã Được Gửi Đến Email</label>
                                            <div class="mb-3">
                                                <input
                                                    type="text"
                                                    value={code}
                                                    onChange={handleCodeChange}
                                                    class="form-control"
                                                    placeholder="Nhập Mã"
                                                />
                                            </div>
                                        </div>
                                        {error && <div style={{ color: 'red' }}>{titleError}</div>}
                                        <div className="text-center">
                                            <button onClick={handleSubmit2} disabled={isSubmitting} type="button" className="btn bg-gradient-info w-100 mb-0">
                                                {isSubmitting ? 'Đang xử lý...' : 'Xác Thực'}
                                            </button>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: '5px', flexDirection: 'column' }}>
                                            {
                                                timeLeft > 0 ?
                                                    <span
                                                        style={{ color: '#17c1e8', textAlign: 'center' }}
                                                        onClick={(e) => { e.preventDefault(); }}
                                                    >Gửi Lại Mã ({timeLeft} giây)
                                                    </span>
                                                    : <span
                                                        style={{ color: '#17c1e8', textAlign: 'center' }}
                                                        onClick={(e) => { e.preventDefault(); handleSubmit() }}
                                                    >Gửi Lại Mã
                                                    </span>
                                            }
                                            <span style={{ color: '#17c1e8', textAlign: 'center', fontWeight: 'bolder' }}
                                                onClick={() => { window.location.reload(); }}
                                            >Quay Lại</span>
                                        </div>

                                    </form>
                                    :
                                    <form role="form">
                                        {isRegister &&
                                            <div>
                                                <label>Tên</label>
                                                <div class="mb-3">
                                                    <input
                                                        type="text"
                                                        value={ten}
                                                        onChange={handleTenChange}
                                                        class="form-control"
                                                        placeholder="Nhập Tên"
                                                        onKeyDown={handleEnterKeyPress}
                                                    />
                                                </div>
                                            </div>
                                        }
                                        <label>Email</label>
                                        <div class="mb-3">
                                            <input
                                                autoFocus
                                                value={email}
                                                onChange={handleEmailChange}
                                                type="email"
                                                class="form-control"
                                                placeholder="Nhập Email"
                                                aria-label="Email"
                                                ria-describedby="email-addon"
                                                onKeyDown={handleEnterKeyPress}
                                            />
                                        </div>
                                        <label>Mật Khẩu</label>
                                        <div class="mb-3">
                                            <input
                                                type="password"
                                                value={password}
                                                onChange={handlePasswordChange}
                                                class="form-control"
                                                placeholder="Nhập Mật Khẩu"
                                                aria-label="Mật Khẩu"
                                                aria-describedby="password-addon"
                                                onKeyDown={handleEnterKeyPress}
                                            />
                                        </div>
                                        {error && <p class="mb-0" style={{ color: 'red' }}>{titleError}</p>}
                                        <div className="text-center">
                                            <button onClick={handleSubmit} disabled={isSubmitting} type="button" className="btn bg-gradient-info w-100 mt-4 mb-0">
                                                {isSubmitting ? 'Đang xử lý...' : isRegister ? 'Đăng Ký' : 'Đăng Nhập'}
                                            </button>
                                        </div>
                                        {
                                            !isRegister ? <p style={{ marginTop: '3%', fontSize: '0.9em' }}>Bạn chưa có tài khoản ? <span style={{ color: '#17c1e8', fontWeight: 'bold' }}
                                                onClick={() => { setIsRegister(true) }}
                                            >Đăng Ký</span></p>
                                                : <p style={{ marginTop: '3%', fontSize: '0.9em' }}>Bạn đã có tài khoản ? <span style={{ color: '#17c1e8', fontWeight: 'bold' }}
                                                    onClick={() => { setIsRegister(false) }}
                                                >Đăng Nhập</span></p>

                                        }
                                        <p style={{ margin: '0', fontSize: '0.7em', textAlign: 'center', fontWeight: 'bolder' }}>Tài Khoản Trải Nghiệm</p>
                                        <table class="table align-items-center mb-0" style={{fontSize:'0.7em', textAlign: 'center'}}>
                                            <thead>
                                                <tr>
                                                    <th style={{ textAlign: 'center', padding: 8 }} class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10"></th>
                                                    <th style={{ textAlign: 'center', padding: 8}} class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10">Email</th>
                                                    <th style={{ textAlign: 'center', padding: 8 }} class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10">Mật Khẩu</th>
                                                </tr>

                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>Quản Trị Viên</td>
                                                    <td>admin@gmail.com</td>
                                                    <td>admin</td>
                                                </tr>
                                                <tr>
                                                    <td>Thành Viên</td>
                                                    <td>thanhvien@gmail.com</td>
                                                    <td>thanhvien</td>
                                                </tr>
                                            </tbody>

                                        </table>
                                    </form>
                                }
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        );
    }
}
export default Login