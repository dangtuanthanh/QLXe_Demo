import React, { useState, useEffect, useRef } from "react";
import { useDispatch,useSelector } from 'react-redux'
import { getCookie } from "../Cookie";
import Combobox from "../Combobox";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle, faSearch, faSearchPlus, faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import Them_suaHangMucBaoDuong from "./them_suaHangMucBaoDuong";
import SearchComBoBox from "../SearchCombobox";
import { urlGetMaintenance, urlInsertMaintenance, urlUpdateMaintenance, urlGetMaintenanceItem, urlGetCar } from "../url"
import Them_suaXe from "./them_suaXe";

const Them_suaBaoDuong = (props) => {
    //xử lý redux
    const dispatch = useDispatch()
    //lưu trữ dữ liệu gửi đi
    const [dataReq, setDataReq] = useState({});
    useEffect(() => {
        console.log('dữ liệu gửi đi: ', dataReq);
    }, [dataReq]);
    const [dataUser, setdataUser] = useState({});//
    const [popupSearch, setPopupSearch] = useState(false);
    const [popupSearch2, setPopupSearch2] = useState(false);
    // combobox
    const [combosHangMuc, setCombosHangMuc] = useState([]);//danh sách vai trò
    const [combosXe, setCombosXe] = useState([]);//danh sách vai trò
    //hiển thị popup thêm vị trí công việc và vai trò truy cập
    const [themXe, setThemXe] = useState(false);
    const [themHangMuc, setThemHangMuc] = useState(false);
    const [iDAction, setIDAction] = useState();//giá trị của id khi thực hiện sửa xoá
    const [isInsert, setIsInsert] = useState(false);
    //bắt buộc nhập
    const batBuocNhap = <span style={{ color: 'red' }}>*</span>;
    useEffect(() => {
        dispatch({ type: 'SET_LOADING', payload: true })
        if (props.iDAction) {
            const fetchHangMuc = fetch(`${urlGetMaintenanceItem}?limit=10000`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'ss': getCookie('ss'),
                },
            })
            const fetchBaoDuong = fetch(`${urlGetMaintenance}?id=${props.iDAction}&id2=${props.iDAction2}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'ss': getCookie('ss'),
                },
            })
            const fetchXe = fetch(`${urlGetCar}?limit=100000`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'ss': getCookie('ss'),
                },
            })

            Promise.all([fetchHangMuc, fetchXe, fetchBaoDuong])
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
                    setCombosHangMuc(data[0].data)
                    setCombosXe(data[1].data)
                    //xử lý dữ liệu hiển thị nếu là sửa dữ liệu
                    if (props.isInsert === false) {
                        let DuLieu = data[2];
                        const dateParts = DuLieu.NgayBaoDuong.split('/');
                        const formattedDate = `${dateParts[2]}-${dateParts[1].padStart(2, '0')}-${dateParts[0].padStart(2, '0')}`;
                        const dateParts2 = DuLieu.NgayBaoDuongTiepTheo.split('/');
                        const formattedDate2 = `${dateParts2[2]}-${dateParts2[1].padStart(2, '0')}-${dateParts2[0].padStart(2, '0')}`;
                        DuLieu = {
                            ...DuLieu,
                            NgayBaoDuong: formattedDate,
                            NgayBaoDuongTiepTheo: formattedDate2
                        }
                        setDataReq(DuLieu);
                    }
                    //ẩn loading
                    dispatch({ type: 'SET_LOADING', payload: false })
                })
                .catch(error => {
                    if (error instanceof TypeError) {
                        props.openPopupAlert('Không thể kết nối tới máy chủ. Vui lòng kiểm tra đường truyền kết nối!')
                    } else {
                        props.addNotification(error.message, 'warning', 5000)
                    }
                    dispatch({ type: 'SET_LOADING', payload: false })
                });
        } else {
            const fetchHangMuc = fetch(`${urlGetMaintenanceItem}?limit=10000`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'ss': getCookie('ss'),
                },
            })
            const fetchXe = fetch(`${urlGetCar}?limit=100000`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'ss': getCookie('ss'),
                },
            })
            Promise.all([fetchHangMuc, fetchXe])
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

                    setCombosHangMuc(data[0].data)
                    setCombosXe(data[1].data)
                    setDataReq({
                        ...dataReq,
                        MaHangMucBaoDuong: data[0].data[0].MaHangMucBaoDuong,
                        MaXe: data[1].data[0].MaXe,
                    });
                    //ẩn loading
                    dispatch({ type: 'SET_LOADING', payload: false })
                })
                .catch(error => {
                    if (error instanceof TypeError) {
                        props.openPopupAlert('Không thể kết nối tới máy chủ. Vui lòng kiểm tra đường truyền kết nối!')
                    } else {
                        props.addNotification(error.message, 'warning', 5000)
                    }
                    dispatch({ type: 'SET_LOADING', payload: false })
                });
        }
    }, [dataUser]);

    //combo combosKhuVuc
    function handleXeChange(selectedValue) {
        setDataReq({
            ...dataReq,
            MaXe: Number(selectedValue)
        });
    }
    function handleHangMucChange(selectedValue) {
        setDataReq({
            ...dataReq,
            MaHangMucBaoDuong: Number(selectedValue)
        });
    }
    // xử lý ảnh
    //url xử lý hiển thị hình ảnh
    const [urlAnh, setUrlAnh] = useState();
    useEffect(() => {
        if (dataReq.HinhAnh && dataReq.HinhAnh instanceof File) { // Kiểm tra kiểu dữ liệu
            setUrlAnh(URL.createObjectURL(dataReq.HinhAnh));
        } else setUrlAnh(dataReq.HinhAnh);
    }, [dataReq.HinhAnh]);
    function ImageUpload() {
        const fileInputRef = useRef(null);

        const handleImageChange = (event) => {
            const file = event.target.files[0];
            if (file) {
                // Kiểm tra xem file có phải là hình ảnh hay không
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = () => {
                        setDataReq({
                            ...dataReq,
                            HinhAnh: file // Lưu file hình ảnh vào dataReq
                        });
                    };
                    reader.readAsDataURL(file);
                } else {
                    props.openPopupAlert('Bạn chỉ có thể chọn file hình ảnh.')
                }
            } else {
                setDataReq({
                    ...dataReq,
                    HinhAnh: undefined
                });
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
                        setDataReq({
                            ...dataReq,
                            HinhAnh: file // Lưu file hình ảnh vào dataReq
                        });
                    };
                    reader.readAsDataURL(file);
                } else {
                    props.openPopupAlert('Bạn chỉ có thể chọn file hình ảnh.')
                }
            }
        };

        const handleDragOver = (event) => {
            event.preventDefault();
        };

        return (
            <div className="form-group" style={{ marginBottom: '0px' }}>
                <label>Hình Ảnh</label>
                <div
                    style={{ textAlign: 'center', border: '1px dashed #ccc', padding: '20px' }}
                    onClick={handleChooseFileClick}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                >
                    <span style={{ color: 'blue' }}>Chọn file</span> hoặc Kéo và thả ảnh vào đây
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*" // Chỉ chấp nhận các file hình ảnh
                        style={{ display: 'none' }}
                        onChange={handleImageChange}
                    />
                    {dataReq.HinhAnh && (
                        <img
                            src={urlAnh} // Sử dụng URL.createObjectURL để hiển thị hình ảnh đã chọn
                            alt="Selected"
                            style={{ maxHeight: '112px', marginTop: '10px' }}
                        />
                    )}
                </div>
            </div>
        );
    }

    //xử lý xác nhận

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch({ type: 'SET_LOADING', payload: true })
        const formData = new FormData();
        for (const key in dataReq) {
            if (dataReq.hasOwnProperty(key)) {
                formData.append(key, dataReq[key]);
            }
        }
        if (props.isInsert === true) {
            fetch(urlInsertMaintenance, {
                method: 'POST',
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
                    } else if (response.status === 400) {
                        return response.json().then(errorData => { throw new Error(errorData.message); });
                    } else if (response.status === 500) {
                        return response.json().then(errorData => { throw new Error(errorData.message); });
                    } else {
                        return;
                    }
                })
                .then(data => {
                    props.addNotification(data.message, 'success', 3000)
                    //ẩn loading
                    dispatch({ type: 'SET_LOADING', payload: false })
                    props.setPopupInsertUpdate(false)
                    props.setdataUser({ ...props.dataUser, page: 1, sortBy: 'MaXe', sortOrder: 'desc' })
                })
                .catch(error => {
                    dispatch({ type: 'SET_LOADING', payload: false })
                    if (error instanceof TypeError) {
                        props.openPopupAlert('Không thể kết nối tới máy chủ. Vui lòng kiểm tra đường truyền kết nối!')
                    } else {
                        props.addNotification(error.message, 'warning', 5000)
                    }

                });
        } else {
            fetch(urlUpdateMaintenance, {
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
                    props.addNotification(data.message, 'success', 3000)
                    //ẩn loading
                    dispatch({ type: 'SET_LOADING', payload: false })
                    props.setPopupInsertUpdate(false)
                    props.setdataUser({ ...props.dataUser })
                })
                .catch(error => {
                    dispatch({ type: 'SET_LOADING', payload: false })
                    if (error instanceof TypeError) {
                        props.openPopupAlert('Không thể kết nối tới máy chủ. Vui lòng kiểm tra đường truyền kết nối!')
                    } else {
                        props.addNotification(error.message, 'warning', 5000)
                    }

                });
        }

    }
    const isMobile = useSelector(state => state.isMobile.isMobile)
    return (
        <div className="popup-box">
            <div className="box" style={{
                width: isMobile && '100%'
            }}>
                <div className="conten-modal">
                    <div>
                        <div className="bg-light px-4 py-3">
                            <h4 id='tieudepop'>Thông Tin Bảo Dưỡng Xe {!props.isInsert && <span > <span style={{ color: 'blue' }}> {props.iDAction3} Lần {props.iDAction2} </span></span>}</h4>
                            <form onSubmit={handleSubmit}
                            style={{
                                maxHeight:  isMobile ? '74vh':'530px',
                                overflow: 'auto',
                                overflowX: 'hidden'
                            }}>
                                <div className={`${isMobile ? 'flex-column' : 'row'}`} style={{ marginTop: '2%' }}>
                                    <div className={`${isMobile ? 'col-12' : 'col-6 '}`}>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <div style={{ display: 'flex', pointerEvents: !props.isInsert && 'none', opacity: !props.isInsert && '0.5' }}>
                                                <Combobox
                                                    combos={combosXe}
                                                    columnValue="MaXe"
                                                    columnAdd="BienSoXe"
                                                    nameCombo="Xe: "
                                                    batBuocNhap={batBuocNhap}
                                                    value={dataReq.MaXe}
                                                    onChange={handleXeChange}
                                                    maxWord={19}
                                                />
                                                <div style={{ display: 'flex', alignItems: 'center' }}
                                                    onClick={() => {
                                                        setIsInsert(true)
                                                        setIDAction()
                                                        setThemXe(true)
                                                    }}
                                                >
                                                    <FontAwesomeIcon icon={faPlusCircle} />
                                                </div>
                                                <div style={{ marginLeft: '1rem', display: 'flex', alignItems: 'center' }}
                                                    onClick={() => setPopupSearch(true)}
                                                >
                                                    <FontAwesomeIcon icon={faSearch} />
                                                </div>
                                            </div>
                                            <div style={{ marginLeft: '1rem', display: 'flex', alignItems: 'center' }}
                                                onClick={() => {
                                                    setIsInsert(false)
                                                    setIDAction(dataReq.MaXe)
                                                    setThemXe(true)
                                                }}
                                            >
                                                <FontAwesomeIcon icon={faInfoCircle} />
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', marginTop: '1rem' }}>
                                            <Combobox
                                                combos={combosHangMuc}
                                                columnValue="MaHangMucBaoDuong"
                                                columnAdd="TenHangMuc"
                                                nameCombo="HM Bảo Dưỡng: "
                                                batBuocNhap={batBuocNhap}
                                                value={dataReq.MaHangMucBaoDuong}
                                                onChange={handleHangMucChange}
                                                maxWord={15}
                                            />
                                            <div style={{ display: 'flex', alignItems: 'center' }}
                                                onClick={() => {
                                                    setIsInsert(true)
                                                    setIDAction()
                                                    setThemHangMuc(true)
                                                }}
                                            >
                                                <FontAwesomeIcon icon={faPlusCircle} />
                                            </div>

                                            <div style={{ marginLeft: '1rem', display: 'flex', alignItems: 'center' }}
                                                onClick={() => setPopupSearch2(true)}
                                            >
                                                <FontAwesomeIcon icon={faSearch} />
                                            </div>
                                            <div style={{ marginLeft: '1rem', display: 'flex', alignItems: 'center' }}
                                                onClick={() => {
                                                    setIsInsert(false)
                                                    setIDAction(dataReq.MaHangMucBaoDuong)
                                                    setThemHangMuc(true)
                                                }}
                                            >
                                                <FontAwesomeIcon icon={faInfoCircle} />
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label>Ngày Bảo Dưỡng</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                onChange={(event) => {
                                                    setDataReq({
                                                        ...dataReq,
                                                        NgayBaoDuong: event.target.value
                                                    });
                                                }}
                                                value={dataReq.NgayBaoDuong}
                                            />
                                        </div>
                                        <div className="form-group" >
                                            <label>Ngày Bảo Dưỡng Tiếp Theo</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                value={dataReq.NgayBaoDuongTiepTheo}
                                                onChange={(event) => {
                                                    setDataReq({
                                                        ...dataReq,
                                                        NgayBaoDuongTiepTheo: event.target.value
                                                    });
                                                }}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Người Đi Bảo Dưỡng</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                onChange={(event) => {
                                                    setDataReq({
                                                        ...dataReq,
                                                        NguoiDiBaoDuong: event.target.value
                                                    });
                                                }}
                                                value={dataReq.NguoiDiBaoDuong}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Ghi Chú</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                onChange={(event) => {
                                                    setDataReq({
                                                        ...dataReq,
                                                        GhiChu: event.target.value
                                                    });
                                                }}
                                                value={dataReq.GhiChu}
                                            />
                                        </div>



                                    </div>
                                    <div className={`${isMobile ? 'col-12' : 'col-6 '}`}>
                                        {!props.isInsert &&
                                            <div className="form-group" style={{ pointerEvents: !props.isInsert && 'none', opacity: !props.isInsert && '0.5' }}>
                                                <label>Lần Bảo Dưỡng{batBuocNhap}</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    value={dataReq.LanBaoDuong}
                                                    onChange={(event) => {
                                                        setDataReq({
                                                            ...dataReq,
                                                            LanBaoDuong: event.target.value
                                                        });
                                                    }}
                                                />
                                            </div>
                                        }
                                        <ImageUpload />
                                        {dataReq.HinhAnh && <div style={{ display: 'flex', justifyContent: 'end' }}>
                                            <a
                                                href={urlAnh}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{ fontSize: '1.3em' }}
                                            >
                                                <FontAwesomeIcon icon={faSearchPlus} />
                                            </a>
                                        </div>}

                                    </div>
                                </div>
                                
                            </form>
                            <button onClick={() => { props.setPopupInsertUpdate(false) }} type="button" className="btn btn-danger mt-3" >Huỷ Bỏ</button>
                                <button
                                    onClick={handleSubmit}
                                    style={{ float: "right" }} type="button"
                                    className="btn bg-gradient-info mt-3"
                                >
                                    Xác Nhận
                                </button>
                            {
                                themXe && <div className="popup">
                                    <Them_suaXe
                                        iDAction={iDAction}
                                        isInsert={isInsert}
                                        setPopupInsertUpdate={setThemXe}
                                        dataUser={dataUser}
                                        setdataUser={setdataUser}
                                        addNotification={props.addNotification}
                                        openPopupAlert={props.openPopupAlert}
                                    />
                                </div>
                            }
                            {
                                popupSearch && <div className="popup">
                                    <SearchComBoBox
                                        setPopupSearch={setPopupSearch}
                                        combos={combosXe}
                                        IDColumn={'MaXe'}
                                        column={'BienSoXe'}
                                        handleChange={handleXeChange}
                                    />
                                </div>
                            }
                            {
                                themHangMuc && <div className="popup">
                                    <Them_suaHangMucBaoDuong
                                        iDAction={iDAction}
                                        isInsert={isInsert}
                                        setPopupInsertUpdate={setThemHangMuc}
                                        dataUser={dataUser}
                                        setdataUser={setdataUser}
                                        addNotification={props.addNotification}
                                        openPopupAlert={props.openPopupAlert}
                                    />
                                </div>
                            }
                            {
                                popupSearch2 && <div className="popup">
                                    <SearchComBoBox
                                        setPopupSearch={setPopupSearch2}
                                        combos={combosHangMuc}
                                        IDColumn={'MaHangMucBaoDuong'}
                                        column={'TenHangMuc'}
                                        handleChange={handleHangMucChange}
                                    />
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div >
        </div >
    );
};
export default Them_suaBaoDuong;