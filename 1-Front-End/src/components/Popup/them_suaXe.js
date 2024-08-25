import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { getCookie } from "../Cookie";
import Combobox from "../Combobox";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle, faSearchPlus, faSearch, faAngleDown } from '@fortawesome/free-solid-svg-icons'
import SearchComBoBox from "../SearchCombobox";
import { urlInsertCar, urlGetCar, urlUpdateCar, urlGetTypeCar, urlGetStatusCar } from "../url"
import Them_suaLoaiXe from "./them_suaLoaiXe";
import Them_suaTinhTrangXe from "./them_suaTinhTrangXe";
import Them_suaDangKiem from "./them_suaDangKiem";
import Them_suaBaoHiem from "./them_suaBaoHiem";
import Them_suaPhuHieu from "./them_suaPhuHieu";
import Them_suaDinhVi from "./them_suaDinhVi";
import Them_suaBaoDuong from "./them_suaBaoDuong";
import Them_suaLichSuSuDung from "./them_suaLichSuSuDung";
import Them_suaHopDong from "./them_suaHopDong";

const Them_suaXe = (props) => {
    const dispatch = useDispatch()
    const [dataReq, setDataReq] = useState({});
    useEffect(() => {
        console.log('dữ liệu gửi đi: ', dataReq);
    }, [dataReq]);
    const [dataUser, setdataUser] = useState({});//
    // popup
    const [themVTTC, setThemVTTC] = useState(false);
    const [themVTTC2, setThemVTTC2] = useState(false);
    const [popupSearch, setPopupSearch] = useState(false);
    const [popupSearch2, setPopupSearch2] = useState(false);
    //popup dich vụ
    const [DV1, setDV1] = useState(false);
    const [DV2, setDV2] = useState(false);
    const [DV3, setDV3] = useState(false);
    const [DV4, setDV4] = useState(false);
    const [DV5, setDV5] = useState(false);
    const [DV6, setDV6] = useState(false);
    const [DV7, setDV7] = useState(false);
    const [iDAction, setIDAction] = useState();//giá trị của id khi thực hiện sửa xoá

    const [iDAction2, setIDAction2] = useState();//giá trị của id khi thực hiện sửa xoá
    const [iDAction3, setIDAction3] = useState();//giá trị của id khi thực hiện sửa xoá
    // combobox
    const [combosKhuVuc, setCombosKhuVuc] = useState([]);//danh sách vai trò
    const [combosTinhTrang, setCombosTinhTrang] = useState([]);//danh sách vai trò
    //bắt buộc nhập
    const batBuocNhap = <span style={{ color: 'red' }}>*</span>;
    useEffect(() => {
        dispatch({ type: 'SET_LOADING', payload: true })
        if (props.iDAction) {
            const fetchGetTable = fetch(`${urlGetCar}?id=${props.iDAction}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'ss': getCookie('ss'),
                },
            })

            const fetchGetArea = fetch(`${urlGetTypeCar}?limit=10000`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'ss': getCookie('ss'),
                },
            })
            const fetchGetArea2 = fetch(`${urlGetStatusCar}?limit=10000`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'ss': getCookie('ss'),
                },
            })
            Promise.all([fetchGetTable, fetchGetArea, fetchGetArea2])
                .then(responses => {
                    const processedResponses = responses.map(response => {
                        if (response.status === 200) {
                            return response.json();
                        } else if (response.status === 401 || response.status === 500 || response.status === 400) {
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
                    setCombosKhuVuc(data[1].data)
                    setCombosTinhTrang(data[2].data)
                    if (props.isInsert === false) {
                        let DuLieu = data[0];
                        const dateParts = DuLieu.NgayMua.split('/');
                        const formattedDate = `${dateParts[2]}-${dateParts[1].padStart(2, '0')}-${dateParts[0].padStart(2, '0')}`;
                        DuLieu = {
                            ...DuLieu,
                            NgayMua: formattedDate
                        }
                        setDataReq(DuLieu);
                        //setDataReq(data[0])
                    }
                    else setDataReq({
                        ...dataReq,
                        MaLoaiXe: data[1].data[0].MaLoaiXe,
                        MaTinhTrangXe: data[2].data[0].MaTinhTrangXe
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
        } else {
            const fetchGetArea = fetch(`${urlGetTypeCar}?limit=10000`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'ss': getCookie('ss'),
                },
            })
            const fetchGetArea2 = fetch(`${urlGetStatusCar}?limit=10000`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'ss': getCookie('ss'),
                },
            })
            Promise.all([fetchGetArea, fetchGetArea2])
                .then(responses => {
                    const processedResponses = responses.map(response => {
                        if (response.status === 200) {
                            return response.json();
                        } else if (response.status === 401 || response.status === 500 || response.status === 400) {
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
                    setCombosKhuVuc(data[0].data)
                    setCombosTinhTrang(data[1].data)
                    setDataReq({
                        ...dataReq,
                        MaLoaiXe: data[0].data[0].MaLoaiXe,
                        MaTinhTrangXe: data[1].data[0].MaTinhTrangXe
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
    function handleKhuVucChange(selectedValue) {
        setDataReq({
            ...dataReq,
            MaLoaiXe: selectedValue
        });
    }
    //combo combosKhuVuc
    function handleTinhTrangChange(selectedValue) {
        setDataReq({
            ...dataReq,
            MaTinhTrangXe: selectedValue
        });
    }

    //xử lý xác nhận

    const handleSubmit = (e) => {
        e.preventDefault();
        if (dataReq.BienSoXe && dataReq.MaTinhTrangXe && dataReq.MaLoaiXe) {
            dispatch({ type: 'SET_LOADING', payload: true })

            const formDataReq = { ...dataReq };
            formDataReq.BaoHiem = undefined;
            formDataReq.PhuHieu = undefined;
            formDataReq.DangKiem = undefined;
            formDataReq.DinhVi = undefined;
            formDataReq.BaoDuong = undefined;
            formDataReq.LichSuSuDung = undefined;
            formDataReq.HopDong = undefined;
            const formData = new FormData();
            for (const key in formDataReq) {
                if (dataReq.hasOwnProperty(key)) {
                    formData.append(key, dataReq[key]);
                }
            }
            if (props.isInsert === true) {
                fetch(urlInsertCar, {
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
                fetch(urlUpdateCar, {
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
        else props.openPopupAlert('Vui lòng nhập đầy đủ thông tin. Các trường có dấu * là bắt buộc nhập')

    }
    const Dropdown = ({
        title,
        items,
        onItemClick,
        isLSSD,
        isHopDong
    }) => {

        const [open, setOpen] = useState(false);

        const toggle = () => setOpen(prev => !prev);

        return (
            <div className="card" style={{ margin: '2%' }}>
                <button
                    className="btn bg-gradient-link btn-sm mb-0"
                    onClick={(e) => { e.preventDefault(); toggle(); }}>
                    {title} ({items?.length || 0})
                </button>
                {open && (
                    <table class="table align-items-center mb-0">
                        <thead>
                            <tr >

                                <th style={{ textAlign: 'center', padding: 8 }} class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10">{isHopDong ? 'Mã HĐ' : 'Lần'} </th>

                                <th style={{ textAlign: 'center', padding: 8 }} class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10">{isLSSD ? 'Ngày Đi' : 'Ngày'}</th>

                                <th style={{ textAlign: 'center', padding: 8 }} class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10">{isLSSD ? 'Ngày Về' : 'Ngày Hết Hạn'}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items?.map((dulieu, index) =>
                                <tr style={{ 'textAlign': 'center' }} id='trdata' key={index} onClick={() => {
                                    onItemClick(dulieu)
                                }} >

                                    <td>{isHopDong ? dulieu.SoHopDong : dulieu.Lan}</td>
                                    <td>{dulieu.Ngay}</td>
                                    <td>{dulieu.NgayHetHan}</td>
                                </tr>
                                //</div>
                            )
                            }
                        </tbody>
                    </table>



                )}
            </div>
        );
    }
    const handleDropdownItemClickDangKiem = item => {
        setIDAction(props.iDAction)
        setIDAction2(item.Lan)
        setIDAction3(dataReq.BienSoXe)
        setDV1(true)
    };
    const handleDropdownItemClickBaoHiem = item => {
        setIDAction(props.iDAction)
        setIDAction2(item.Lan)
        setIDAction3(dataReq.BienSoXe)
        setDV2(true)
    };
    const handleDropdownItemClickPhuHieu = item => {
        setIDAction(props.iDAction)
        setIDAction2(item.Lan)
        setIDAction3(dataReq.BienSoXe)
        setDV3(true)
    };
    const handleDropdownItemClickDinhVi = item => {
        setIDAction(props.iDAction)
        setIDAction2(item.Lan)
        setIDAction3(dataReq.BienSoXe)
        setDV4(true)
    };
    const handleDropdownItemClickBaoDuong = item => {
        setIDAction(props.iDAction)
        setIDAction2(item.Lan)
        setIDAction3(dataReq.BienSoXe)
        setDV5(true)
    };
    const handleDropdownItemClickLichSuSuDung = item => {
        setIDAction(props.iDAction)
        setIDAction2(item.Lan)
        setIDAction3(dataReq.BienSoXe)
        setDV6(true)
    };
    const handleDropdownItemClickHopDong = item => {
        setIDAction(item.Lan)
        setDV7(true)
    };
    // xử lý ảnh
    //url xử lý hiển thị hình ảnh
    const [urlAnh, setUrlAnh] = useState();
    const [urlAnh2, setUrlAnh2] = useState();
    const [urlAnh3, setUrlAnh3] = useState();
    const [urlAnh4, setUrlAnh4] = useState();
    useEffect(() => {
        if (dataReq.HinhAnh && dataReq.HinhAnh instanceof File) { // Kiểm tra kiểu dữ liệu
            setUrlAnh(URL.createObjectURL(dataReq.HinhAnh));
        } else setUrlAnh(dataReq.HinhAnh);
    }, [dataReq.HinhAnh]);
    useEffect(() => {
        if (dataReq.HinhAnh2 && dataReq.HinhAnh2 instanceof File) { // Kiểm tra kiểu dữ liệu
            setUrlAnh2(URL.createObjectURL(dataReq.HinhAnh2));
        } else setUrlAnh2(dataReq.HinhAnh2);
    }, [dataReq.HinhAnh2]);
    useEffect(() => {
        if (dataReq.HinhAnh3 && dataReq.HinhAnh3 instanceof File) { // Kiểm tra kiểu dữ liệu
            setUrlAnh3(URL.createObjectURL(dataReq.HinhAnh3));
        } else setUrlAnh3(dataReq.HinhAnh3);
    }, [dataReq.HinhAnh3]);
    useEffect(() => {
        if (dataReq.HinhAnh4 && dataReq.HinhAnh4 instanceof File) { // Kiểm tra kiểu dữ liệu
            setUrlAnh4(URL.createObjectURL(dataReq.HinhAnh4));
        } else setUrlAnh4(dataReq.HinhAnh4);
    }, [dataReq.HinhAnh4]);
    function ImageUpload({ imageColumn, url }) {
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
                            [imageColumn]: file // Lưu file hình ảnh vào dataReq
                        });
                    };
                    reader.readAsDataURL(file);
                } else {
                    props.openPopupAlert('Bạn chỉ có thể chọn file hình ảnh.')
                }
            } else {
                setDataReq({
                    ...dataReq,
                    [imageColumn]: undefined
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
                            [imageColumn]: file // Lưu file hình ảnh vào dataReq
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
                <div
                    style={{ textAlign: 'center', border: '1px dashed #ccc', padding: '20px' }}
                    onClick={handleChooseFileClick}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                >
                    <span style={{ color: 'blue' }}>Chọn file</span> hoặc Kéo ảnh vào đây
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*" // Chỉ chấp nhận các file hình ảnh
                        style={{ display: 'none' }}
                        onChange={handleImageChange}
                    />
                    {dataReq[imageColumn] && (
                        <img
                            src={url} // Sử dụng URL.createObjectURL để hiển thị hình ảnh đã chọn
                            alt="Selected"
                            style={{ maxHeight: '112px', marginTop: '10px' }}
                        />
                    )}
                </div>
                {dataReq[imageColumn] && <div style={{ display: 'flex', justifyContent: 'end' }}>
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontSize: '1.3em' }}
                    >
                        <FontAwesomeIcon icon={faSearchPlus} />
                    </a>
                </div>}
            </div>

        );
    }
    const [activeDropdown, setActiveDropdown] = useState(1);
    const [openDropdown, setOpenDropdown] = useState("Hình Ảnh 1");
    function DropdownImage({
        imageColumn,
        url,
        title,
        active,
        onClick
    }) {
        return (
            <div
                className={`dropdown ${active ? 'active' : ''}`}
                onClick={onClick}
            >
                <button
                    onClick={(e) => { e.preventDefault(); onClick(); }}
                    className="btn bg-gradient-link btn-sm mb-2"
                    style={{ width: '100%' }}
                >
                    {title}
                    <FontAwesomeIcon icon={faAngleDown} style={{ marginLeft: '1em' }} />
                </button>

                {openDropdown === title && (
                    <ImageUpload
                        imageColumn={imageColumn}
                        url={url}
                    />
                )}

            </div>
        )
    }
    const isMobile = useSelector(state => state.isMobile.isMobile)
    return (
        <div className="lg-popup-box">
            <div className="lg-box" style={{
                width: isMobile && '100%'
            }}>
                <div className="conten-modal">
                    <div>
                        <div className="bg-light px-4 py-3"
                        >
                            <h4 id='tieudepop'>Thông Tin Xe<span style={{ color: 'blue' }}>ㅤ{dataReq.BienSoXe}</span></h4>
                            <form onSubmit={handleSubmit}
                                style={{
                                    maxHeight: isMobile ? '74vh' : '530px',
                                    overflow: 'auto',
                                    overflowX: 'hidden'
                                }}
                            >
                                <div className={`${isMobile ? 'flex-column' : 'row'}`}>
                                    <div className={`${isMobile ? 'col-12' : 'col-4 '}`}>
                                        <div className="form-group">
                                            <label>Biển Số Xe {batBuocNhap}</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={dataReq.BienSoXe}
                                                onChange={(event) => {
                                                    setDataReq({
                                                        ...dataReq,
                                                        BienSoXe: event.target.value
                                                    });
                                                }}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Nhãn Hiệu</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={dataReq.NhanHieu}
                                                onChange={(event) => {
                                                    setDataReq({
                                                        ...dataReq,
                                                        NhanHieu: event.target.value
                                                    });
                                                }}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Trọng Tải</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={dataReq.TrongTai}
                                                onChange={(event) => {
                                                    setDataReq({
                                                        ...dataReq,
                                                        TrongTai: event.target.value
                                                    });
                                                }}
                                            /></div>
                                        <div className="form-group">
                                            <label>Năm Sản Xuất</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={dataReq.NamSanXuat}
                                                onChange={(event) => {
                                                    setDataReq({
                                                        ...dataReq,
                                                        NamSanXuat: event.target.value
                                                    });
                                                }}
                                            /></div>
                                        <div className="row" style={{ display: 'flex' }}>
                                            <div className="col-10" style={{ display: 'flex' }}>
                                                <Combobox
                                                    combos={combosKhuVuc}
                                                    columnValue="MaLoaiXe"
                                                    columnAdd="TenLoaiXe"
                                                    nameCombo="Loại Xe: "
                                                    batBuocNhap={batBuocNhap}
                                                    value={dataReq.MaLoaiXe}
                                                    onChange={handleKhuVucChange}
                                                    maxWord={21}
                                                />
                                            </div>
                                            <div className="col-2" style={{ display: 'flex', padding: '0px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center' }}
                                                    onClick={() => setThemVTTC(true)}
                                                >
                                                    <FontAwesomeIcon icon={faPlusCircle} />
                                                </div>
                                                <div style={{ marginLeft: '0.5rem', display: 'flex', alignItems: 'center' }}
                                                    onClick={() => setPopupSearch(true)}
                                                >
                                                    <FontAwesomeIcon icon={faSearch} />
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                    <div className={`${isMobile ? 'col-12' : 'col-4 '}`}>
                                        <div className="form-group">
                                            <label>Màu</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={dataReq.Mau}
                                                onChange={(event) => {
                                                    setDataReq({
                                                        ...dataReq,
                                                        Mau: event.target.value
                                                    });
                                                }}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Mô Tả</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={dataReq.MoTa}
                                                onChange={(event) => {
                                                    setDataReq({
                                                        ...dataReq,
                                                        MoTa: event.target.value
                                                    });
                                                }}
                                            /></div>
                                        <div className="form-group">
                                            <label>Linh Kiện</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={dataReq.LinhKien}
                                                onChange={(event) => {
                                                    setDataReq({
                                                        ...dataReq,
                                                        LinhKien: event.target.value
                                                    });
                                                }}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Ngày Mua</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                value={dataReq.NgayMua}
                                                onChange={(event) => {
                                                    setDataReq({
                                                        ...dataReq,
                                                        NgayMua: event.target.value
                                                    });
                                                }}
                                            />
                                        </div>
                                        <div className="row" >
                                            <div className="col-10">
                                                <Combobox
                                                    combos={combosTinhTrang}
                                                    columnValue="MaTinhTrangXe"
                                                    columnAdd="MoTa"
                                                    nameCombo="Tình Trạng: "
                                                    batBuocNhap={batBuocNhap}
                                                    value={dataReq.MaTinhTrangXe}
                                                    onChange={handleTinhTrangChange}
                                                    maxWord={18}
                                                />
                                            </div>
                                            <div className="col-2" style={{ display: 'flex', padding: '0px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center' }}
                                                    onClick={() => setThemVTTC2(true)}
                                                >
                                                    <FontAwesomeIcon icon={faPlusCircle} />
                                                </div>
                                                <div style={{ marginLeft: '0.5rem', display: 'flex', alignItems: 'center' }}
                                                    onClick={() => setPopupSearch2(true)}
                                                >
                                                    <FontAwesomeIcon icon={faSearch} />
                                                </div>
                                            </div>

                                        </div>


                                    </div>
                                    <div className={`${isMobile ? 'col-12' : 'col-4 '}`}>
                                        <DropdownImage
                                            imageColumn="HinhAnh"
                                            url={urlAnh}
                                            title="Hình Ảnh 1"
                                            active={activeDropdown === 1}
                                            onClick={() => {
                                                setOpenDropdown("Hình Ảnh 1");
                                                setActiveDropdown(1);
                                            }}
                                        />

                                        <DropdownImage
                                            imageColumn="HinhAnh2"
                                            url={urlAnh2}
                                            title="Hình Ảnh 2"
                                            active={activeDropdown === 2}
                                            onClick={() => {
                                                setOpenDropdown("Hình Ảnh 2");
                                                setActiveDropdown(2);
                                            }}
                                        />
                                        <DropdownImage
                                            imageColumn="HinhAnh3"
                                            url={urlAnh3}
                                            title="Hình Ảnh 3"
                                            active={activeDropdown === 3}
                                            onClick={() => {
                                                setOpenDropdown("Hình Ảnh 3");
                                                setActiveDropdown(3);
                                            }}
                                        />
                                        <DropdownImage
                                            imageColumn="HinhAnh4"
                                            url={urlAnh4}
                                            title="Hình Ảnh 4"
                                            active={activeDropdown === 4}
                                            onClick={() => {
                                                setOpenDropdown("Hình Ảnh 4");
                                                setActiveDropdown(4);
                                            }}
                                        />

                                    </div>
                                </div>
                                <hr class="horizontal dark" />
                                {!props.isInsert && <div className={`${isMobile ? 'flex-column' : 'row'}`}>
                                    <div className={`${isMobile ? 'col-12' : 'col-4 '}`}>
                                        <Dropdown
                                            title="Xem Đăng kiểm"
                                            items={dataReq.DangKiem}
                                            onItemClick={handleDropdownItemClickDangKiem} />
                                        <Dropdown
                                            title="Xem Bảo Hiểm"
                                            items={dataReq.BaoHiem}
                                            onItemClick={handleDropdownItemClickBaoHiem} />
                                        <Dropdown
                                            title="Xem Hợp Đồng"
                                            items={dataReq.HopDong}
                                            onItemClick={handleDropdownItemClickHopDong}
                                            isHopDong={true} />
                                    </div>
                                    <div className={`${isMobile ? 'col-12' : 'col-4 '}`}>
                                        <Dropdown
                                            title="Xem Phù Hiệu"
                                            items={dataReq.PhuHieu}
                                            onItemClick={handleDropdownItemClickPhuHieu} />

                                        <Dropdown
                                            title="Xem Định Vị"
                                            items={dataReq.DinhVi}
                                            onItemClick={handleDropdownItemClickDinhVi} />
                                    </div>
                                    <div className={`${isMobile ? 'col-12' : 'col-4 '}`}>
                                        <Dropdown
                                            title="Xem Bảo Dưỡng"
                                            items={dataReq.BaoDuong}
                                            onItemClick={handleDropdownItemClickBaoDuong} />

                                        <Dropdown
                                            title="Xem Lịch Sử Sử Dụng"
                                            items={dataReq.LichSuSuDung}
                                            onItemClick={handleDropdownItemClickLichSuSuDung}
                                            isLSSD={true}
                                        />
                                    </div>


                                </div>
                                }
                            </form>
                            <div>
                                <button style={{ marginBottom: '0px' }} onClick={() => { props.setPopupInsertUpdate(false) }} type="button" className="btn btn-danger mt-3" >Huỷ Bỏ</button>
                                <button
                                    onClick={handleSubmit}
                                    style={{ float: "right", marginBottom: '0px' }} type="button"
                                    className="btn bg-gradient-info mt-3"
                                >
                                    Xác Nhận
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {
                    themVTTC && <div className="popup">
                        <Them_suaLoaiXe
                            isInsert={true}
                            setPopupInsertUpdate={setThemVTTC}
                            dataUser={dataUser}
                            setdataUser={setdataUser}
                            addNotification={props.addNotification}
                            openPopupAlert={props.openPopupAlert}
                        />
                    </div>
                }
                {
                    themVTTC2 && <div className="popup">
                        <Them_suaTinhTrangXe
                            isInsert={true}
                            setPopupInsertUpdate={setThemVTTC2}
                            dataUser={dataUser}
                            setdataUser={setdataUser}
                            addNotification={props.addNotification}
                            openPopupAlert={props.openPopupAlert}
                        />
                    </div>
                }
                {
                    DV1 && <div className="popup">
                        <Them_suaDangKiem
                            isInsert={false}
                            setPopupInsertUpdate={setDV1}
                            dataUser={dataUser}
                            setdataUser={setdataUser}
                            addNotification={props.addNotification}
                            openPopupAlert={props.openPopupAlert}
                            iDAction={iDAction}
                            iDAction2={iDAction2}
                            iDAction3={iDAction3}
                        />
                    </div>
                }
                {
                    DV2 && <div className="popup">
                        <Them_suaBaoHiem
                            isInsert={false}
                            setPopupInsertUpdate={setDV2}
                            dataUser={dataUser}
                            setdataUser={setdataUser}
                            addNotification={props.addNotification}
                            openPopupAlert={props.openPopupAlert}
                            iDAction={iDAction}
                            iDAction2={iDAction2}
                            iDAction3={iDAction3}
                        />
                    </div>
                }
                {
                    DV3 && <div className="popup">
                        <Them_suaPhuHieu
                            isInsert={false}
                            setPopupInsertUpdate={setDV3}
                            dataUser={dataUser}
                            setdataUser={setdataUser}
                            addNotification={props.addNotification}
                            openPopupAlert={props.openPopupAlert}
                            iDAction={iDAction}
                            iDAction2={iDAction2}
                            iDAction3={iDAction3}
                        />
                    </div>
                }
                {
                    DV4 && <div className="popup">
                        <Them_suaDinhVi
                            isInsert={false}
                            setPopupInsertUpdate={setDV4}
                            dataUser={dataUser}
                            setdataUser={setdataUser}
                            addNotification={props.addNotification}
                            openPopupAlert={props.openPopupAlert}
                            iDAction={iDAction}
                            iDAction2={iDAction2}
                            iDAction3={iDAction3}
                        />
                    </div>
                }
                {
                    DV5 && <div className="popup">
                        <Them_suaBaoDuong
                            isInsert={false}
                            setPopupInsertUpdate={setDV5}
                            dataUser={dataUser}
                            setdataUser={setdataUser}
                            addNotification={props.addNotification}
                            openPopupAlert={props.openPopupAlert}
                            iDAction={iDAction}
                            iDAction2={iDAction2}
                            iDAction3={iDAction3}
                        />
                    </div>
                }
                {
                    DV6 && <div className="popup">
                        <Them_suaLichSuSuDung
                            isInsert={false}
                            setPopupInsertUpdate={setDV6}
                            dataUser={dataUser}
                            setdataUser={setdataUser}
                            addNotification={props.addNotification}
                            openPopupAlert={props.openPopupAlert}
                            iDAction={iDAction}
                            iDAction2={iDAction2}
                            iDAction3={iDAction3}
                        />
                    </div>
                }
                {
                    DV7 && <div className="popup">
                        <Them_suaHopDong
                            isInsert={false}
                            setPopupInsertUpdate={setDV7}
                            dataUser={dataUser}
                            setdataUser={setdataUser}
                            addNotification={props.addNotification}
                            openPopupAlert={props.openPopupAlert}
                            iDAction={iDAction}
                        />
                    </div>
                }
                {
                    popupSearch && <div className="popup">
                        <SearchComBoBox
                            setPopupSearch={setPopupSearch}
                            combos={combosKhuVuc}
                            IDColumn={'MaLoaiXe'}
                            column={'TenLoaiXe'}
                            handleChange={handleKhuVucChange}
                        />
                    </div>
                }
                {
                    popupSearch2 && <div className="popup">
                        <SearchComBoBox
                            setPopupSearch={setPopupSearch2}
                            combos={combosTinhTrang}
                            IDColumn={'MaTinhTrangXe'}
                            column={'MoTa'}
                            handleChange={handleTinhTrangChange}
                        />
                    </div>
                }
            </div >
        </div >
    );
};
export default Them_suaXe;