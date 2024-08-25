import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faRotate, faAdd, faArrowLeft, faFilter, faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons'
import { useDispatch } from 'react-redux'

import { getCookie } from "../Cookie";
import { urlGetContract, urlDeleteContract } from "../url";
import Pagination from "../Pagination";
import ItemsPerPage from "../ItemsPerPage";
import TableHopDong from "../Table/TableHopDong";
import Them_suaHopDong from "../Popup/them_suaHopDong";
function TabHopDong(props) {
    //xử lý redux
    const dispatch = useDispatch();
    //xử lý trang dữ liệu 
    const [duLieuHienThi, setDuLieuHienThi] = useState([]);//lưu trạng thái dữ liệu
    const [dataUser, setdataUser] = useState({//dữ liệu người dùng
        sortBy: 'MaHopDong',
        sortOrder: 'asc',
        searchBy: 'TenThanhVien',
        search: '',
        searchExact: 'false'
    });//
    const [dataRes, setDataRes] = useState({});//dữ liệu nhận được khi getRole
    //Xử lý hiển thị các nút chức năng
    const [showButtonFunction, setShowButtonFunction] = useState(!props.isMobile);
    const handleToggleButtonFunction = () => {
        setShowButtonFunction(!showButtonFunction);
    };
    // popup hộp thoại thông báo
    const [popupAlert, setPopupAlert] = useState(false);//trạng thái thông báo
    const [popupMessageAlert, setPopupMessageAlert] = useState('');
    const [onAction, setOnAction] = useState(() => { });
    const [prIsMobile, setPrIsMobile] = useState(props.isMobile);
    useEffect(() => {
        setPrIsMobile(props.isMobile)
    }, [props.isMobile]);
    const PopupAlert = (props) => {
        return (
            <div className="popup">
                <div className="popup-box">
                    <div className="box" style={{ textAlign: 'center', width: prIsMobile && '100%' }}>
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

    //popup thêm,sửa nhân viên
    const [popupInsertUpdate, setPopupInsertUpdate] = useState(false);//trạng thái popupInsertUpdate
    const [isInsert, setIsInsert] = useState(true);//trạng thái thêm
    const [iDAction, setIDAction] = useState();//giá trị của id khi thực hiện sửa xoá


    //hàm tìm kiếm
    const handleSearch = (event) => {
        setdataUser({
            ...dataUser,
            sortBy: 'MaHopDong',
            sortOrder: 'asc',
            page: 1,
            search: event.target.value
        });

    };

    //hàm lọc tìm kiếm
    const handleSearchBy = (event) => {
        setdataUser({
            ...dataUser,
            sortBy: 'MaHopDong',
            sortOrder: 'asc',
            page: 1,
            searchBy: event.target.value
        });

    };
    //hàm chế độ tìm kiếm
    const handleSearchExact = (event) => {
        setdataUser({
            ...dataUser,
            sortBy: 'MaHopDong',
            sortOrder: 'asc',
            page: 1,
            searchExact: event.target.value
        });

    };


    //Xoá dữ liệu
    const deleteData = (ID) => {
        dispatch({ type: 'SET_LOADING', payload: true })
        let IDs = [ID]
        if (Array.isArray(ID)) {
            IDs = ID.map(item => Number(item));
        } else IDs = [ID];
        fetch(`${urlDeleteContract}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'ss': getCookie('ss'),
            },
            body: JSON.stringify({ IDs })
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
                addNotification(data.message, 'success', 4000)
                //ẩn loading
                dispatch({ type: 'SET_LOADING', payload: false })
                setSelectedIds([])
                TaiDuLieu()

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
    const filterHetHan = () => {
        setdataUser({
            ...dataUser,
            page: 1,
           search: 'Đang áp dụng bộ lọc',
            searchBy: 'HetHan'
        });
    };
    const filterSapHetHan = () => {
        setdataUser({
            ...dataUser,
            page: 1,
           search: 'Đang áp dụng bộ lọc',
            searchBy: 'SapHetHan'
        });
    };
    const filterConHan = () => {
        setdataUser({
            ...dataUser,
            page: 1,
           search: 'Đang áp dụng bộ lọc',
            searchBy: 'ConHan'
        });
    };
    // sửa hàng loạt
    const [selectedIds, setSelectedIds] = useState([]);//mảng chọn

    //hàm tải dữ liệu
    useEffect(() => {
        TaiDuLieu()
    }, [dataUser]);
    const TaiDuLieu = () => {
        dispatch({ type: 'SET_LOADING', payload: true })
        fetch(`${urlGetContract}?page=${dataUser.page}&limit=${dataUser.limit}&sortBy=${dataUser.sortBy}&sortOrder=${dataUser.sortOrder}&search=${dataUser.search}&searchBy=${dataUser.searchBy}&searchExact=${dataUser.searchExact}`, {
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
                //cập nhật dữ liệu hiển thị
                setDuLieuHienThi(data.data)
                //cập nhật thông số trang
                setDataRes({
                    currentPage: data.currentPage,
                    itemsPerPage: data.itemsPerPage,
                    sortBy: data.sortBy,
                    sortOrder: data.sortOrder,
                    totalItems: data.totalItems,
                    totalPages: data.totalPages
                });
                if (data.currentPage > data.totalPages && data.totalPages !== null) {
                    setdataUser({
                        ...dataUser,
                        page: data.totalPages
                    });

                }
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
    return (
        <div>
            <div class="card" style={{ minHeight: '92vh', position: 'relative' }}>
                <div class="card-header pb-0">
                    <h2 onClick={handleToggleButtonFunction}> Quản Lý Hợp Đồng
                        <button type="button" className="btn btn-link btn-sm mb-0 " style={{ width: '100px', float: 'right' }}><FontAwesomeIcon icon={showButtonFunction ? faArrowUp : faArrowDown} /></button>
                        <label
                            style={{ float: 'right', color: 'gray', fontSize: '1rem' }}>
                            Số Hợp Đồng: {dataRes.itemsPerPage} | Tổng Tiền:ㅤ
                            {new Intl.NumberFormat('vi-VN', {
                                style: 'currency',
                                currency: 'VND'
                            }).format(duLieuHienThi.reduce((total, item) => {
                                return total + item.TongTien
                            }, 0))}
                        </label>
                    </h2>
                    <NotificationContainer notifications={notifications} />
                    {/* Thanh Chức Năng : Làm mới, thêm, sửa, xoá v..v */}
                    {showButtonFunction &&
                        <div>
                            {
                                selectedIds.length == 0
                                    ? <div style={{ 'display': "inline-block", float: 'left' }}>
                                        <button
                                            style={{ 'display': "inline-block" }}
                                            onClick={() => { TaiDuLieu(); }}
                                            className="btn btn-sm bg-gradient-info">
                                            <FontAwesomeIcon icon={faRotate} />
                                            ㅤLàm Mới
                                        </button>ㅤ
                                        <button
                                            style={{ 'display': "inline-block" }}
                                            onClick={() => {
                                                setIsInsert(true)
                                                setPopupInsertUpdate(true)
                                                setIDAction()
                                            }}

                                            className="btn btn-sm bg-gradient-info">
                                            <FontAwesomeIcon icon={faAdd} />
                                            ㅤThêm
                                        </button>ㅤ
                                        <button
                                            style={{ 'display': "inline-block" }}
                                            onClick={filterHetHan}
                                            className="btn btn-sm btn-light">
                                            <FontAwesomeIcon icon={faFilter} />
                                            ㅤ Hết Hạn
                                        </button>ㅤ
                                        <button
                                            style={{ 'display': "inline-block" }}
                                            onClick={filterSapHetHan}
                                            className="btn btn-sm btn-light">
                                            <FontAwesomeIcon icon={faFilter} />
                                            ㅤ Sắp Hết Hạn
                                        </button>ㅤ
                                        <button
                                            style={{ 'display': "inline-block" }}
                                            onClick={filterConHan}
                                            className="btn btn-sm btn-light">
                                            <FontAwesomeIcon icon={faFilter} />
                                            ㅤ Còn Hạn
                                        </button>ㅤ
                                    </div>
                                    : <div style={{ 'display': "inline-block", float: 'left' }}>
                                        <button
                                            style={{ display: "inline-block" }}
                                            //onClick={setSelectedIds([])}
                                            onClick={() => { setSelectedIds([]); }}
                                            className="btn btn-danger">
                                            <FontAwesomeIcon icon={faArrowLeft} />
                                            ㅤQuay Lại
                                        </button>ㅤ
                                        {/* <button
                                                        style={{ display: "inline-block" }}
                                                        //onClick={() => {togglePopup6();}}
                                                        className="btn bg-gradient-info">
                                                        <FontAwesomeIcon icon={faPencil} />
                                                        ㅤSửa ô đã chọn
                                                    </button>ㅤ */}
                                        <button
                                            style={{ display: "inline-block" }}
                                            onClick={() => {
                                                openPopupAlert(
                                                    `Bạn có chắc chắn muốn xoá các lựa chọn này:  ${Object.values(selectedIds).join(' | ')}`,
                                                    () => { deleteData(selectedIds) }
                                                )
                                            }}
                                            className="btn bg-gradient-info">
                                            <FontAwesomeIcon icon={faTrash} />
                                            ㅤXoá ô đã chọn
                                        </button>ㅤ
                                    </div>
                            }

                            <div style={{ 'display': "inline-block", float: 'right' }}>
                                {/* số hàng trên trang */}
                                <ItemsPerPage
                                    dataRes={dataRes}
                                    openPopupAlert={openPopupAlert}
                                    dataUser={dataUser}
                                    setdataUser={setdataUser}
                                />
                                ㅤ
                                <input id="search" value={dataUser.search} onChange={handleSearch} placeholder='Tìm Kiếm' type="text" className="form-control-sm" autoFocus/>
                                {
                                    dataUser.search !== '' &&
                                    <button
                                        className="btn btn-close"
                                        style={{ color: 'red', marginLeft: '4px', marginTop: '10px' }}
                                        onClick={() => {
                                            if (dataUser.searchBy === 'HetHan' || dataUser.searchBy === 'SapHetHan' || dataUser.searchBy === 'ConHan')
                                                setdataUser({
                                                    ...dataUser,
                                                    search: '',
                                                    searchBy: 'TenThanhVien'
                                                });
                                            else
                                                setdataUser({
                                                    ...dataUser,
                                                    search: ''
                                                });
                                        }}
                                    >
                                        X
                                    </button>
                                }
                                ㅤ
                                {dataUser.searchBy === 'HetHan'
                                    || dataUser.searchBy === 'SapHetHan'
                                    || dataUser.searchBy === 'ConHan'
                                    ? <i style={{ fontSize: '0.8rem' }}> Đang áp dụng bộ lọc</i>

                                    :
                                    <select class="form-select-sm" value={dataUser.searchBy} onChange={handleSearchBy}>
                                        <option value="TenThanhVien">Tìm theo Tên Người Ký</option>
                                        <option value="SoHopDong">Tìm theo Mã Hợp Đồng</option>
                                        <option value="NgayLamHopDong">Tìm theo Ngày</option>
                                        <option value="NgayHetHanHopDong">Tìm theo Ngày Hết Hạn</option>
                                        <option value="MaThanhVien">Tìm theo Mã Thành Viên</option>
                                        <option value="GhiChu">Tìm theo Ghi Chú</option>
                                    </select>}
                                ㅤ
                                <select class="form-select-sm" value={dataUser.searchExact} onChange={handleSearchExact}>
                                    <option value='false'>Chế độ tìm: Gần đúng</option>
                                    <option value="true">Chế độ tìm: Chính xác</option>
                                </select>

                            </div>
                        </div>
                    }
                </div>
                <div class="card-body px-0 pt-0 pb-2">
                    <div class="table-responsive p-0">
                        <TableHopDong
                            duLieuHienThi={duLieuHienThi}
                            setdataUser={setdataUser}
                            dataUser={dataUser}
                            addNotification={addNotification}
                            setIsInsert={setIsInsert}
                            setIDAction={setIDAction}
                            setPopupInsertUpdate={setPopupInsertUpdate}
                            openPopupAlert={openPopupAlert}
                            deleteData={deleteData}
                            selectedIds={selectedIds}
                            setSelectedIds={setSelectedIds}
                        />
                    </div>
                    {!props.isMobile ? <div>
                        <div style={{ height: '7vh' }}></div>
                        <div style={{
                            display: 'flex', width: '100%', position: 'absolute',
                            right: 0,
                            bottom: 0, margin: '1rem'
                        }} >
                            <div style={{ marginLeft: '2rem', marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: '30%' }}><label style={{
                                fontFamily: '"Comic Sans MS", cursive, sans-serif', fontStyle: 'italic', color: '#cfcfcf'
                            }}></label></div>

                            <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', width: '70%' }}>
                                <div style={{ marginRight: '2rem' }}>
                                    {duLieuHienThi.length === 0 ? <h5 style={{ color: 'darkgray', 'textAlign': 'center' }}>Rất tiếc! Không có dữ liệu để hiển thị</h5> : null}
                                    <label style={{ borderTop: '1px solid black', color: 'darkgray' }} >Đang hiển thị: {duLieuHienThi.length}/{dataRes.totalItems} | Sắp xếp{dataRes.sortBy === "NgayLamHopDong" || dataRes.sortBy === "NgayHetHanHopDong" ?
                                        (dataRes.sortOrder === 'asc'
                                            ? <label style={{ color: 'darkgray', marginRight: '3px' }}>cũ nhất đến mới nhất </label>
                                            : <label style={{ color: 'darkgray', marginRight: '3px' }}>mới nhất đến cũ nhất </label>)
                                        : (
                                            dataRes.sortOrder === 'asc'
                                                ? <label style={{ color: 'darkgray', marginRight: '3px' }}>tăng dần </label>
                                                : <label style={{ color: 'darkgray', marginRight: '3px' }}>giảm dần</label>)}
                                        theo cột {dataRes.sortBy}   </label>
                                </div>
                                {/* phân trang */}
                                <Pagination
                                    setdataUser={setdataUser}
                                    dataUser={dataUser}
                                    dataRes={dataRes}
                                />
                            </div>
                        </div>
                    </div> : <Pagination
                        setdataUser={setdataUser}
                        dataUser={dataUser}
                        dataRes={dataRes}
                    />
                    }

                </div>
            </div>

            {
                popupInsertUpdate && <div className="popup">
                    <Them_suaHopDong
                        isInsert={isInsert}
                        setPopupInsertUpdate={setPopupInsertUpdate}
                        tieuDe='Thông Tin Loại Xe'
                        dataUser={dataUser}
                        setdataUser={setdataUser}
                        addNotification={addNotification}
                        openPopupAlert={openPopupAlert}
                        iDAction={iDAction}
                    />
                </div>
            }
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

export default TabHopDong