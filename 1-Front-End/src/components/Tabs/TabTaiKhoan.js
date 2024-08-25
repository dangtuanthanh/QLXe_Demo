import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux'

import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import { Link, useLocation } from "react-router-dom"
import { getCookie } from "../Cookie";
import * as ExcelJS from 'exceljs';
import * as FileSaver from 'file-saver';
import { urlChangePassword, urlGetMember, urlGetCar, urlGetUsageHistory, urlGetRegistry, urlGetEmblem, urlGetInsurance, urlGetLocate, urlGetMaintenance, urlGetContract } from "../url";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileExcel } from '@fortawesome/free-solid-svg-icons'
function TabTaiKhoan(props) {
    //xử lý redux
    const dispatch = useDispatch()
    const isMobile = useSelector(state => state.isMobile.isMobile)
    const [dataReq, setDataReq] = useState({});
    useEffect(() => {
        console.log('dữ liệu gửi đi: ', dataReq);
    }, [dataReq]);
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
    // popup hộp thoại thông báo
    const [popupAlert, setPopupAlert] = useState(false);//trạng thái thông báo
    const [popupMessageAlert, setPopupMessageAlert] = useState('');
    const [onAction, setOnAction] = useState(() => { });
    const PopupAlert = (props) => {
        return (
            <div className="popup">
                <div className="popup-box">
                    <div className="box" style={{ textAlign: 'center', width: isMobile && '100%' }}>
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
    const handleSubmit = () => {
        if (!dataReq.MatKhauCu || !dataReq.MatKhauMoi || !dataReq.NhapLaiMatKhauMoi)
            addNotification('Vui lòng nhập đầy đủ thông tin.', 'warning', 4000)
        else if (dataReq.MatKhauMoi != dataReq.NhapLaiMatKhauMoi) {
            addNotification('Mật khẩu và Nhập lại mật khẩu không khớp.', 'warning', 4000)
        } else if (dataReq.MatKhauMoi === dataReq.MatKhauCu) {
            addNotification('Mật khẩu cũ và Mật khẩu mới không được trùng nhau.', 'warning', 4000)
        }
        else {
            dispatch({ type: 'SET_LOADING', payload: true })

            fetch(urlChangePassword, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'ss': getCookie('ss'),
                },
                body: JSON.stringify(dataReq)
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

    //Xuất Excel
    const handleExport = () => {
        dispatch({ type: 'SET_LOADING', payload: true })
        //thêm ngày tháng hiện tại
        const date = new Date();
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const formattedDate = `${day}/${month}/${year}`;
        const fetchGetMember = fetch(`${urlGetMember}?limit=100000`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'ss': getCookie('ss'),
            },
        })
        const fetchGetCar = fetch(`${urlGetCar}?limit=100000`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'ss': getCookie('ss'),
            },
        })
        const fetchGetUsageHistory = fetch(`${urlGetUsageHistory}?limit=100000`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'ss': getCookie('ss'),
            },
        })
        const fetchGetRegistry = fetch(`${urlGetRegistry}?limit=100000`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'ss': getCookie('ss'),
            },
        })
        const fetchGetEmblem = fetch(`${urlGetEmblem}?limit=100000`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'ss': getCookie('ss'),
            },
        })
        const fetchGetInsurance = fetch(`${urlGetInsurance}?limit=100000`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'ss': getCookie('ss'),
            },
        })
        const fetchGetLocate = fetch(`${urlGetLocate}?limit=100000`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'ss': getCookie('ss'),
            },
        })
        const fetchGetMaintenance = fetch(`${urlGetMaintenance}?limit=100000`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'ss': getCookie('ss'),
            },
        })
        const fetchGetContract = fetch(`${urlGetContract}?limit=100000`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'ss': getCookie('ss'),
            },
        })
        Promise.all([fetchGetMember,
            fetchGetCar,
            fetchGetUsageHistory,
            fetchGetRegistry,
            fetchGetEmblem,
            fetchGetInsurance,
            fetchGetLocate,
            fetchGetMaintenance,
            fetchGetContract
        ])
            .then(responses => {
                const processedResponses = responses.map(response => {
                    if (response.status === 200) {
                        return response.json();
                    } else if (response.status === 401 || response.status === 500) {
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
                const workbook = new ExcelJS.Workbook();
                //sheet thành viên
                const worksheetThanhVien = workbook.addWorksheet('Thành Viên');
                // Tạo tiêu đề cột
                worksheetThanhVien.columns = [
                    { header: 'Tên Thành Viên', key: 'TenThanhVien', width: 30 },
                    { header: 'Địa Chỉ', key: 'DiaChi', width: 30 },
                    { header: 'Email', key: 'Email', width: 30 },
                    { header: 'Số Điện Thoại', key: 'SoDienThoai', width: 30 },
                    { header: 'Mã Hợp Đồng', key: 'SoHopDong', width: 30 }
                ];

                // Thêm dữ liệu
                data[0].data.forEach(item => {
                    worksheetThanhVien.addRow({
                        TenThanhVien: item.TenThanhVien,
                        DiaChi: item.DiaChi,
                        Email: item.Email,
                        SoDienThoai: item.SoDienThoai,
                        SoHopDong: item.SoHopDong
                    });
                });

                // Chèn 3 dòng trắng vào đầu bảng dữ liệu
                worksheetThanhVien.insertRow(1, ['', '', '']);
                worksheetThanhVien.insertRow(1, ['', '', '']);
                worksheetThanhVien.insertRow(1, ['', '', '']);

                // Chèn dòng tiêu đề vào ô A1 và gộp các ô lại thành một ô duy nhất
                const columnCount = worksheetThanhVien.columnCount;
                worksheetThanhVien.getCell(`A1:${String.fromCharCode(64 + columnCount)}1`).value = 'Danh Sách Thành Viên';
                worksheetThanhVien.mergeCells(`A1:${String.fromCharCode(64 + columnCount)}1`);
                worksheetThanhVien.getCell('A1').alignment = { horizontal: 'center' };
                worksheetThanhVien.getCell('A1').font = { bold: true, size: 16 };
                worksheetThanhVien.getCell(`A2`).value = `Ngày xuất file: ${formattedDate}`;
                // Thiết lập căn giữa và font chữ cho các cột và dữ liệu
                const rows = worksheetThanhVien.getRows(2, worksheetThanhVien.rowCount);
                rows.forEach(row => {
                    row.eachCell(cell => {
                        // cell.alignment = { horizontal: 'center' };
                        if (cell.row === 4) {
                            cell.font = { bold: true, size: 12 };
                        }
                    });
                });

                //sheet xe
                const worksheetXe = workbook.addWorksheet('Xe');
                // Tạo tiêu đề cột
                worksheetXe.columns = [
                    { header: 'Biển Số Xe', key: 'BienSoXe', width: 15 },
                    { header: 'Nhãn Hiệu', key: 'NhanHieu', width: 15 },
                    { header: 'Ngày Mua', key: 'NgayMua', width: 15 },
                    { header: 'Màu', key: 'Mau', width: 15 },
                    { header: 'Mô Tả', key: 'MoTa', width: 15 },
                    { header: 'Tình Trạng Xe', key: 'MoTaTinhTrangXe', width: 15 },
                    { header: 'Loại Xe', key: 'TenLoaiXe', width: 15 },
                    { header: 'Nhóm Loại Xe', key: 'TenNhomLoaiXe', width: 15 },
                    { header: 'Năm Sản Xuất', key: 'NamSanXuat', width: 15 },
                    { header: 'Trọng Tải', key: 'TrongTai', width: 15 },
                    { header: 'Mã Hợp Đồng', key: 'SoHopDong', width: 15 }
                ];

                // Thêm dữ liệu
                data[1].data.forEach(item => {
                    worksheetXe.addRow({
                        BienSoXe: item.BienSoXe,
                        NhanHieu: item.NhanHieu,
                        NgayMua: item.NgayMua,
                        Mau: item.Mau,
                        MoTa: item.MoTa,
                        MoTaTinhTrangXe: item.MoTaTinhTrangXe,
                        TenLoaiXe: item.TenLoaiXe,
                        TenNhomLoaiXe: item.TenNhomLoaiXe,
                        NamSanXuat: item.NamSanXuat,
                        TrongTai: item.TrongTai,
                        SoHopDong: item.SoHopDong
                    });
                });

                // Chèn 3 dòng trắng vào đầu bảng dữ liệu
                worksheetXe.insertRow(1, ['', '', '']);
                worksheetXe.insertRow(1, ['', '', '']);
                worksheetXe.insertRow(1, ['', '', '']);

                // Chèn dòng tiêu đề vào ô A1 và gộp các ô lại thành một ô duy nhất
                const columnCountXe = worksheetXe.columnCount;
                worksheetXe.getCell(`A1:${String.fromCharCode(64 + columnCountXe)}1`).value = 'Danh Sách Xe';
                worksheetXe.mergeCells(`A1:${String.fromCharCode(64 + columnCountXe)}1`);
                worksheetXe.getCell('A1').alignment = { horizontal: 'center' };
                worksheetXe.getCell('A1').font = { bold: true, size: 16 };
                worksheetXe.getCell(`A2`).value = `Ngày xuất file: `;
                worksheetXe.getCell(`B2`).value = formattedDate;
                // Thiết lập căn giữa và font chữ cho các cột và dữ liệu
                const rowsXe = worksheetXe.getRows(2, worksheetXe.rowCount);
                rowsXe.forEach(row => {
                    row.eachCell(cell => {
                        // cell.alignment = { horizontal: 'center' };
                        if (cell.row === 4) {
                            cell.font = { bold: true, size: 12 };
                        }
                    });
                });



                //sheet lịch sử sử dụng
                const worksheetLichSuSuDung = workbook.addWorksheet('Lịch Sử Sử Dụng Xe');
                // Tạo tiêu đề cột
                worksheetLichSuSuDung.columns = [
                    { header: 'Biển Số Xe', key: 'BienSoXe', width: 15 },
                    { header: 'Lần Sử Dụng', key: 'LanSuDung', width: 15 },
                    { header: 'Ngày Đi', key: 'NgayDi', width: 15 },
                    { header: 'Ngày Về', key: 'NgayVe', width: 15 },
                    { header: 'Người Sử Dụng', key: 'NguoiSuDung', width: 15 },
                    { header: 'Khoảng Cách', key: 'KhoangCach', width: 15 },
                    { header: 'Mục Đích', key: 'MucDich', width: 15 }
                ];

                // Thêm dữ liệu
                data[2].data.forEach(item => {
                    worksheetLichSuSuDung.addRow({
                        BienSoXe: item.BienSoXe,
                        LanSuDung: item.LanSuDung,
                        NgayDi: item.NgayDi,
                        NgayVe: item.NgayVe,
                        NguoiSuDung: item.NguoiSuDung,
                        KhoangCach: item.KhoangCach,
                        MucDich: item.MucDich
                    });
                });

                // Chèn 3 dòng trắng vào đầu bảng dữ liệu
                worksheetLichSuSuDung.insertRow(1, ['', '', '']);
                worksheetLichSuSuDung.insertRow(1, ['', '', '']);
                worksheetLichSuSuDung.insertRow(1, ['', '', '']);

                // Chèn dòng tiêu đề vào ô A1 và gộp các ô lại thành một ô duy nhất
                const columnCountLichSuSuDung = worksheetLichSuSuDung.columnCount;
                worksheetLichSuSuDung.getCell(`A1:${String.fromCharCode(64 + columnCountLichSuSuDung)}1`).value = 'Lịch Sử Sử Dụng Xe';
                worksheetLichSuSuDung.mergeCells(`A1:${String.fromCharCode(64 + columnCountLichSuSuDung)}1`);
                worksheetLichSuSuDung.getCell('A1').alignment = { horizontal: 'center' };
                worksheetLichSuSuDung.getCell('A1').font = { bold: true, size: 16 };
                worksheetLichSuSuDung.getCell(`A2`).value = `Ngày xuất file: `;
                worksheetLichSuSuDung.getCell(`B2`).value = formattedDate;
                // Thiết lập căn giữa và font chữ cho các cột và dữ liệu
                const rowsLichSuSuDung = worksheetLichSuSuDung.getRows(2, worksheetLichSuSuDung.rowCount);
                rowsLichSuSuDung.forEach(row => {
                    row.eachCell(cell => {
                        // cell.alignment = { horizontal: 'center' };
                        if (cell.row === 4) {
                            cell.font = { bold: true, size: 12 };
                        }
                    });
                });



                //sheet đăng kiểm
                const worksheetDangKiem = workbook.addWorksheet('Đăng Kiểm');
                // Tạo tiêu đề cột
                worksheetDangKiem.columns = [
                    { header: 'Biển Số Xe', key: 'BienSoXe', width: 15 },
                    { header: 'Lần Đăng Kiểm', key: 'LanDangKiem', width: 15 },
                    { header: 'Ngày Đăng Kiểm', key: 'NgayDangKiem', width: 15 },
                    { header: 'Ngày Hết Hạn', key: 'NgayHetHan', width: 15 },
                    { header: 'Nơi Đăng Kiểm', key: 'NoiDangKiem', width: 15 },
                    { header: 'Người Đi Đăng Kiểm', key: 'NguoiDiDangKiem', width: 15 },
                    { header: 'Ghi Chú', key: 'GhiChu', width: 15 }
                ];

                // Thêm dữ liệu
                data[3].data.forEach(item => {
                    worksheetDangKiem.addRow({
                        BienSoXe: item.BienSoXe,
                        LanDangKiem: item.LanDangKiem,
                        NgayDangKiem: item.NgayDangKiem,
                        NgayHetHan: item.NgayHetHan,
                        NoiDangKiem: item.NoiDangKiem,
                        NguoiDiDangKiem: item.NguoiDiDangKiem,
                        GhiChu: item.GhiChu
                    });
                });

                // Chèn 3 dòng trắng vào đầu bảng dữ liệu
                worksheetDangKiem.insertRow(1, ['', '', '']);
                worksheetDangKiem.insertRow(1, ['', '', '']);
                worksheetDangKiem.insertRow(1, ['', '', '']);

                // Chèn dòng tiêu đề vào ô A1 và gộp các ô lại thành một ô duy nhất
                const columnCountDangKiem = worksheetDangKiem.columnCount;
                worksheetDangKiem.getCell(`A1:${String.fromCharCode(64 + columnCountDangKiem)}1`).value = 'Danh Sách Đăng Kiểm Xe';
                worksheetDangKiem.mergeCells(`A1:${String.fromCharCode(64 + columnCountDangKiem)}1`);
                worksheetDangKiem.getCell('A1').alignment = { horizontal: 'center' };
                worksheetDangKiem.getCell('A1').font = { bold: true, size: 16 };
                worksheetDangKiem.getCell(`A2`).value = `Ngày xuất file: `;
                worksheetDangKiem.getCell(`B2`).value = formattedDate;
                // Thiết lập căn giữa và font chữ cho các cột và dữ liệu
                const rowsDangKiem = worksheetDangKiem.getRows(2, worksheetDangKiem.rowCount);
                rowsDangKiem.forEach(row => {
                    row.eachCell(cell => {
                        // cell.alignment = { horizontal: 'center' };
                        if (cell.row === 4) {
                            cell.font = { bold: true, size: 12 };
                        }
                    });
                });


                //sheet phù hiệu
                const worksheetPhuHieu = workbook.addWorksheet('Phù Hiệu');
                // Tạo tiêu đề cột
                worksheetPhuHieu.columns = [
                    { header: 'Biển Số Xe', key: 'BienSoXe', width: 15 },
                    { header: 'Lần Phù Hiệu', key: 'LanPhuHieu', width: 15 },
                    { header: 'Ngày Cấp Phù Hiệu', key: 'NgayCapPhuHieu', width: 15 },
                    { header: 'Ngày Hết Hạn', key: 'NgayHetHan', width: 15 },
                    { header: 'Nơi Cấp Phù Hiệu', key: 'NoiCapPhuHieu', width: 15 },
                    { header: 'Người Đi Cấp Phù Hiệu', key: 'NguoiDiCapPhuHieu', width: 15 },
                    { header: 'Ghi Chú', key: 'GhiChu', width: 15 }
                ];

                // Thêm dữ liệu
                data[4].data.forEach(item => {
                    worksheetPhuHieu.addRow({
                        BienSoXe: item.BienSoXe,
                        LanPhuHieu: item.LanPhuHieu,
                        NgayCapPhuHieu: item.NgayCapPhuHieu,
                        NgayHetHan: item.NgayHetHan,
                        NoiCapPhuHieu: item.NoiCapPhuHieu,
                        NguoiDiCapPhuHieu: item.NguoiDiCapPhuHieu,
                        GhiChu: item.GhiChu
                    });
                });

                // Chèn 3 dòng trắng vào đầu bảng dữ liệu
                worksheetPhuHieu.insertRow(1, ['', '', '']);
                worksheetPhuHieu.insertRow(1, ['', '', '']);
                worksheetPhuHieu.insertRow(1, ['', '', '']);

                // Chèn dòng tiêu đề vào ô A1 và gộp các ô lại thành một ô duy nhất
                const PhuHieu = worksheetPhuHieu.columnCount;
                worksheetPhuHieu.getCell(`A1:${String.fromCharCode(64 + PhuHieu)}1`).value = 'Danh Sách Phù Hiệu';
                worksheetPhuHieu.mergeCells(`A1:${String.fromCharCode(64 + PhuHieu)}1`);
                worksheetPhuHieu.getCell('A1').alignment = { horizontal: 'center' };
                worksheetPhuHieu.getCell('A1').font = { bold: true, size: 16 };
                worksheetPhuHieu.getCell(`A2`).value = `Ngày xuất file: `;
                worksheetPhuHieu.getCell(`B2`).value = formattedDate;
                // Thiết lập căn giữa và font chữ cho các cột và dữ liệu
                const rowsPhuHieu = worksheetPhuHieu.getRows(2, worksheetPhuHieu.rowCount);
                rowsPhuHieu.forEach(row => {
                    row.eachCell(cell => {
                        // cell.alignment = { horizontal: 'center' };
                        if (cell.row === 4) {
                            cell.font = { bold: true, size: 12 };
                        }
                    });
                });


                //sheet bảo hiểm
                const worksheetBaoHiem = workbook.addWorksheet('Bảo Hiểm');
                // Tạo tiêu đề cột
                worksheetBaoHiem.columns = [
                    { header: 'Biển Số Xe', key: 'BienSoXe', width: 15 },
                    { header: 'Lần Mua Bảo Hiểm', key: 'LanMuaBaoHiem', width: 15 },
                    { header: 'Ngày Mua Bảo Hiểm', key: 'NgayMuaBaoHiem', width: 15 },
                    { header: 'Ngày Hết Hạn', key: 'NgayHetHan', width: 15 },
                    { header: 'Loại Bảo Hiểm', key: 'LoaiBaoHiem', width: 15 },
                    { header: 'Người Mua Bảo Hiểm', key: 'NguoiMuaBaoHiem', width: 15 },
                    { header: 'Ghi Chú', key: 'GhiChu', width: 15 }
                ];

                // Thêm dữ liệu
                data[5].data.forEach(item => {
                    worksheetBaoHiem.addRow({
                        BienSoXe: item.BienSoXe,
                        LanMuaBaoHiem: item.LanMuaBaoHiem,
                        NgayMuaBaoHiem: item.NgayMuaBaoHiem,
                        NgayHetHan: item.NgayHetHan,
                        LoaiBaoHiem: item.LoaiBaoHiem,
                        NguoiMuaBaoHiem: item.NguoiMuaBaoHiem,
                        GhiChu: item.GhiChu
                    });
                });

                // Chèn 3 dòng trắng vào đầu bảng dữ liệu
                worksheetBaoHiem.insertRow(1, ['', '', '']);
                worksheetBaoHiem.insertRow(1, ['', '', '']);
                worksheetBaoHiem.insertRow(1, ['', '', '']);

                // Chèn dòng tiêu đề vào ô A1 và gộp các ô lại thành một ô duy nhất
                const BaoHiem = worksheetBaoHiem.columnCount;
                worksheetBaoHiem.getCell(`A1:${String.fromCharCode(64 + BaoHiem)}1`).value = 'Danh Sách Bảo Hiểm Xe';
                worksheetBaoHiem.mergeCells(`A1:${String.fromCharCode(64 + BaoHiem)}1`);
                worksheetBaoHiem.getCell('A1').alignment = { horizontal: 'center' };
                worksheetBaoHiem.getCell('A1').font = { bold: true, size: 16 };
                worksheetBaoHiem.getCell(`A2`).value = `Ngày xuất file: `;
                worksheetBaoHiem.getCell(`B2`).value = formattedDate;
                // Thiết lập căn giữa và font chữ cho các cột và dữ liệu
                const rowsBaoHiem = worksheetBaoHiem.getRows(2, worksheetBaoHiem.rowCount);
                rowsBaoHiem.forEach(row => {
                    row.eachCell(cell => {
                        // cell.alignment = { horizontal: 'center' };
                        if (cell.row === 4) {
                            cell.font = { bold: true, size: 12 };
                        }
                    });
                });


                //sheet định vị
                const worksheetDinhVi = workbook.addWorksheet('Định Vị');
                // Tạo tiêu đề cột
                worksheetDinhVi.columns = [
                    { header: 'Biển Số Xe', key: 'BienSoXe', width: 15 },
                    { header: 'Lần Mua Định Vị', key: 'LanMuaDinhVi', width: 15 },
                    { header: 'Ngày Mua', key: 'NgayMua', width: 15 },
                    { header: 'Ngày Hết Hạn', key: 'NgayHetHan', width: 15 },
                    { header: 'Người Mua Định Vị', key: 'NguoiMuaDinhVi', width: 15 },
                    { header: 'URL Định Vị', key: 'URLDinhVi', width: 15 },
                    { header: 'UserName Định Vị', key: 'UserNameDinhVi', width: 15 },
                    { header: 'Mật Khẩu Định Vị', key: 'MatKhauDinhVi', width: 15 },
                    { header: 'Ghi Chú', key: 'GhiChu', width: 15 },
                ];

                // Thêm dữ liệu
                data[6].data.forEach(item => {
                    worksheetDinhVi.addRow({
                        BienSoXe: item.BienSoXe,
                        LanMuaDinhVi: item.LanMuaDinhVi,
                        NgayMua: item.NgayMua,
                        NgayHetHan: item.NgayHetHan,
                        NguoiMuaDinhVi: item.NguoiMuaDinhVi,
                        URLDinhVi: item.URLDinhVi,
                        UserNameDinhVi: item.UserNameDinhVi,
                        MatKhauDinhVi: item.MatKhauDinhVi,
                        GhiChu: item.GhiChu
                    });
                });

                // Chèn 3 dòng trắng vào đầu bảng dữ liệu
                worksheetDinhVi.insertRow(1, ['', '', '']);
                worksheetDinhVi.insertRow(1, ['', '', '']);
                worksheetDinhVi.insertRow(1, ['', '', '']);

                // Chèn dòng tiêu đề vào ô A1 và gộp các ô lại thành một ô duy nhất
                const DinhVi = worksheetDinhVi.columnCount;
                worksheetDinhVi.getCell(`A1:${String.fromCharCode(64 + DinhVi)}1`).value = 'Danh Sách Định Vị Xe';
                worksheetDinhVi.mergeCells(`A1:${String.fromCharCode(64 + DinhVi)}1`);
                worksheetDinhVi.getCell('A1').alignment = { horizontal: 'center' };
                worksheetDinhVi.getCell('A1').font = { bold: true, size: 16 };
                worksheetDinhVi.getCell(`A2`).value = `Ngày xuất file: `;
                worksheetDinhVi.getCell(`B2`).value = formattedDate;
                // Thiết lập căn giữa và font chữ cho các cột và dữ liệu
                const rowsDinhVi = worksheetDinhVi.getRows(2, worksheetDinhVi.rowCount);
                rowsDinhVi.forEach(row => {
                    row.eachCell(cell => {
                        // cell.alignment = { horizontal: 'center' };
                        if (cell.row === 4) {
                            cell.font = { bold: true, size: 12 };
                        }
                    });
                });



                //sheet bảo dưỡng
                const worksheetBaoDuong = workbook.addWorksheet('Bảo Dưỡng');
                // Tạo tiêu đề cột
                worksheetBaoDuong.columns = [
                    { header: 'Biển Số Xe', key: 'BienSoXe', width: 15 },
                    { header: 'Lần Bảo Dưỡng', key: 'LanBaoDuong', width: 15 },
                    { header: 'Hạng Mục Bảo Dưỡng', key: 'TenHangMuc', width: 15 },
                    { header: 'Ngày Bảo Dưỡng', key: 'NgayBaoDuong', width: 15 },
                    { header: 'Ngày Bảo Dưỡng Tiếp Theo', key: 'NgayBaoDuongTiepTheo', width: 15 },
                    { header: 'Người Đi Bảo Dưỡng', key: 'NguoiDiBaoDuong', width: 15 },
                    { header: 'Ghi Chú', key: 'GhiChu', width: 15 },
                ];

                // Thêm dữ liệu
                data[7].data.forEach(item => {
                    worksheetBaoDuong.addRow({
                        BienSoXe: item.BienSoXe,
                        LanBaoDuong: item.LanBaoDuong,
                        TenHangMuc: item.TenHangMuc,
                        NgayBaoDuong: item.NgayBaoDuong,
                        NgayBaoDuongTiepTheo: item.NgayBaoDuongTiepTheo,
                        NguoiDiBaoDuong: item.NguoiDiBaoDuong,
                        GhiChu: item.GhiChu
                    });
                });

                // Chèn 3 dòng trắng vào đầu bảng dữ liệu
                worksheetBaoDuong.insertRow(1, ['', '', '']);
                worksheetBaoDuong.insertRow(1, ['', '', '']);
                worksheetBaoDuong.insertRow(1, ['', '', '']);

                // Chèn dòng tiêu đề vào ô A1 và gộp các ô lại thành một ô duy nhất
                const BaoDuong = worksheetBaoDuong.columnCount;
                worksheetBaoDuong.getCell(`A1:${String.fromCharCode(64 + BaoDuong)}1`).value = 'Danh Sách Bảo Dưỡng Xe';
                worksheetBaoDuong.mergeCells(`A1:${String.fromCharCode(64 + BaoDuong)}1`);
                worksheetBaoDuong.getCell('A1').alignment = { horizontal: 'center' };
                worksheetBaoDuong.getCell('A1').font = { bold: true, size: 16 };
                worksheetBaoDuong.getCell(`A2`).value = `Ngày xuất file: `;
                worksheetBaoDuong.getCell(`B2`).value = formattedDate;
                // Thiết lập căn giữa và font chữ cho các cột và dữ liệu
                const rowsBaoDuong = worksheetBaoDuong.getRows(2, worksheetBaoDuong.rowCount);
                rowsBaoDuong.forEach(row => {
                    row.eachCell(cell => {
                        // cell.alignment = { horizontal: 'center' };
                        if (cell.row === 4) {
                            cell.font = { bold: true, size: 12 };
                        }
                    });
                });


                //sheet hợp đồng
                const worksheetHopDong = workbook.addWorksheet('Hợp Đồng');
                // Tạo tiêu đề cột
                worksheetHopDong.columns = [
                    { header: 'Mã Hợp Đồng', key: 'SoHopDong', width: 15 },
                    { header: 'Tên Người Ký', key: 'TenThanhVien', width: 15 },
                    { header: 'Ngày Ký', key: 'NgayLamHopDong', width: 15 },
                    { header: 'Ngày Hết Hạn', key: 'NgayHetHanHopDong', width: 15 },
                    { header: 'Tổng Tiền', key: 'TongTien', width: 15 },
                    { header: 'Xe', key: 'BienSoXe', width: 15 },
                    { header: 'Ghi Chú', key: 'GhiChu', width: 15 },
                ];

                // Thêm dữ liệu
                data[8].data.forEach(item => {
                    worksheetHopDong.addRow({
                        SoHopDong: item.SoHopDong,
                        TenThanhVien: item.TenThanhVien,
                        NgayLamHopDong: item.NgayLamHopDong,
                        NgayHetHanHopDong: item.NgayHetHanHopDong,
                        TongTien: item.TongTien,
                        BienSoXe: item.BienSoXe,
                        GhiChu: item.GhiChu,

                    });
                });

                // Chèn 3 dòng trắng vào đầu bảng dữ liệu
                worksheetHopDong.insertRow(1, ['', '', '']);
                worksheetHopDong.insertRow(1, ['', '', '']);
                worksheetHopDong.insertRow(1, ['', '', '']);

                // Chèn dòng tiêu đề vào ô A1 và gộp các ô lại thành một ô duy nhất
                const HopDong = worksheetHopDong.columnCount;
                worksheetHopDong.getCell(`A1:${String.fromCharCode(64 + HopDong)}1`).value = 'Danh Sách Hợp Đồng';
                worksheetHopDong.mergeCells(`A1:${String.fromCharCode(64 + HopDong)}1`);
                worksheetHopDong.getCell('A1').alignment = { horizontal: 'center' };
                worksheetHopDong.getCell('A1').font = { bold: true, size: 16 };
                worksheetHopDong.getCell(`A2`).value = `Ngày xuất file: `;
                worksheetHopDong.getCell(`B2`).value = formattedDate;
                // Thiết lập căn giữa và font chữ cho các cột và dữ liệu
                const rowsHopDong = worksheetHopDong.getRows(2, worksheetHopDong.rowCount);
                rowsHopDong.forEach(row => {
                    row.eachCell(cell => {
                        // cell.alignment = { horizontal: 'center' };
                        if (cell.row === 4) {
                            cell.font = { bold: true, size: 12 };
                        }
                    });
                });
                // fetchGetRegistry,
                // fetchGetEmblem,
                // fetchGetInsurance,
                // fetchGetLocate,
                // fetchGetMaintenance,
                // fetchGetContract
                // Xuất workbook sang tệp XLSX
                workbook.xlsx.writeBuffer()
                    .then(function (buffer) {
                        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                        FileSaver.saveAs(blob, 'DuLieu_QLXe.xlsx');
                    });
                dispatch({ type: 'SET_LOADING', payload: false })
            })
            .catch(error => {
                dispatch({ type: 'SET_LOADING', payload: false })
                if (error instanceof TypeError) {
                    props.openPopupAlert('Không thể kết nối tới máy chủ. Vui lòng kiểm tra đường truyền kết nối!')
                } else {
                    props.addNotification(error.message, 'warning', 5000)
                }
            });
    };


    const [canExport, setCanExport] = useState(false);
    useEffect(() => {
        if (Object.keys(props.thongTinDangNhap.ThanhVien).length > 0) {
            if (props.thongTinDangNhap.ThanhVien.Quyen) {
                const quyens = props.thongTinDangNhap.ThanhVien.Quyen.split(', ');
                if (
                    quyens.includes('Xem danh sách thành viên')
                    && quyens.includes('Xem danh sách xe')
                    && quyens.includes('Xem lịch sử sử dụng xe')
                    && quyens.includes('Xem danh sách đăng kiểm')
                    && quyens.includes('Xem danh sách phù hiệu')
                    && quyens.includes('Xem danh sách bảo hiểm')
                    && quyens.includes('Xem danh sách định vị')
                    && quyens.includes('Xem danh sách bảo dưỡng xe')
                    && quyens.includes('Xem danh sách hợp đồng')
                ) {
                    setCanExport(true);
                } else {
                    setCanExport(false);
                }
            }
        }
    }, [props.thongTinDangNhap.ThanhVien.Quyen]);
    return (
        <div>
            <div class="card" style={{ minHeight: '92vh', position: 'relative' }} >
                <div class="card-header pb-0" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <NotificationContainer notifications={notifications} />
                    <h2 style={{ width: '100%', textAlign: 'center', textDecoration: 'underline' }}>Thông Tin Tài Khoản</h2>
                    <div style={{ width: '100%', textAlign: 'center', margin: '1% 0 2% 0' }}>
                        <img
                            style={{
                                width: '200px',
                                height: '200px',
                                objectFit: 'cover',
                                borderRadius: '50%',
                                border: '5px solid #6d6dff'
                                , boxShadow: 'rgba(0, 0, 0, 0.05) 0px 20px 27px 0px'
                            }}
                            src={props.thongTinDangNhap.ThanhVien.HinhAnh}
                            onClick={() => {
                                addNotification('Để chỉnh sửa ảnh , vui lòng chuyển sang tab "Hồ Sơ"', 'warning', 4000)
                            }}
                        />
                    </div>
                    <div className={`${isMobile ? 'flex-column' : 'row'}`} style={{ width: '80%' }}>
                        <div className={`${isMobile ? 'col-12' : 'col-6 '}`}>
                            <h4>ㅤ</h4>
                            <div className="form-group">
                                <label >Email</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={props.thongTinDangNhap.ThanhVien.Email}
                                    onClick={() => {
                                        addNotification('Bạn cần liên hệ với QTV để cập nhật những thông tin này', 'warning', 4000)
                                    }}
                                    style={{
                                        opacity: 0.9,
                                        cursor: 'not-allowed'
                                    }}
                                />
                            </div>
                            {/* <div className="form-group">
                                <label>Mật Khẩu</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value='************'
                                    onClick={() => {
                                        addNotification('Bạn cần liên hệ với QTV để cập nhật những thông tin này', 'warning', 4000)
                                    }}
                                    style={{
                                        opacity: 0.9,
                                        cursor: 'not-allowed'
                                    }}
                                />
                            </div> */}
                            <div className="form-group">
                                <label>Vai Trò Truy Cập</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={props.thongTinDangNhap.ThanhVien.VaiTro}
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
                                <label>Quyền</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={props.thongTinDangNhap.ThanhVien.Quyen}
                                    onClick={() => {
                                        addNotification('Bạn cần liên hệ với QTV để cập nhật những thông tin này', 'warning', 4000)
                                    }}
                                    style={{
                                        opacity: 0.9,
                                        cursor: 'not-allowed'
                                    }}
                                />
                            </div>
                            {canExport && 
                            <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
                                <button className="btn bg-gradient-info" onClick={() => {
                                    handleExport()
                                }}> <FontAwesomeIcon icon={faFileExcel} />ㅤXuất Dữ Liệu</button>
                            </div>
                            }
                        </div>
                        <div className={`${isMobile ? 'col-12' : 'col-6 '}`}>
                            <h4 style={{ textAlign: 'center' }}>Đổi Mật Khẩu</h4>
                            <div className="form-group">
                                <label>Nhập Mật Khẩu Cũ</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    value={dataReq.MatKhauCu}
                                    onChange={(event) => {
                                        setDataReq({
                                            ...dataReq,
                                            MatKhauCu: event.target.value
                                        });
                                    }}
                                />
                            </div>
                            <div className="form-group">
                                <label>Nhập Mật Khẩu Mới</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    value={dataReq.MatKhauMoi}
                                    onChange={(event) => {
                                        setDataReq({
                                            ...dataReq,
                                            MatKhauMoi: event.target.value
                                        });
                                    }}
                                />
                            </div>
                            <div className="form-group">
                                <label>Nhập Lại Mật Khẩu Mới</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    value={dataReq.NhapLaiMatKhauMoi}
                                    onChange={(event) => {
                                        setDataReq({
                                            ...dataReq,
                                            NhapLaiMatKhauMoi: event.target.value
                                        });
                                    }}
                                />
                            </div>
                            {/* <div className="form-group">
                                <label>Ngày Vào</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={props.thongTinDangNhap.ThanhVien.NgayVao}
                                    onClick={() => {
                                        addNotification('Bạn cần liên hệ với QTV để cập nhật những thông tin này', 'warning', 4000)
                                    }}
                                    style={{
                                        opacity: 0.9,
                                        cursor: 'not-allowed'
                                    }}
                                />
                            </div> */}

                            <button style={{ float: 'right' }} className="btn bg-gradient-info" onClick={() => {
                                handleSubmit()
                            }}>Xác Nhận Đổi Mật Khẩu</button>

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
                <div class="card-body px-0 pt-0 pb-2 mt-2" >


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

export default TabTaiKhoan