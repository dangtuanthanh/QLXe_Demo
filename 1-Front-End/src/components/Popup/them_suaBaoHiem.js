import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle, faSearchPlus, faSearch, faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import { getCookie } from "../Cookie";
import Them_suaXe from "./them_suaXe";
import Combobox from "../Combobox";
import SearchComBoBox from "../SearchCombobox";
import { urlGetCar, urlInsertInsurance, urlGetInsurance, urlUpdateInsurance } from "../url"

const Them_suaBaoHiem = (props) => {
    //xử lý redux
    const dispatch = useDispatch()
    //lưu trữ dữ liệu gửi đi
    const [dataReq, setDataReq] = useState({});
    useEffect(() => {
        console.log('dữ liệu gửi đi: ', dataReq);
    }, [dataReq]);
    const [dataUser, setdataUser] = useState({});//
    const [popupSearch, setPopupSearch] = useState(false);
    // combobox
    const [combosVaiTro, setCombosVaiTro] = useState([]);//danh sách vai trò
    //hiển thị popup thêm vị trí công việc và vai trò truy cập
    const [themVTTC, setThemVTTC] = useState(false);
    const [iDAction, setIDAction] = useState();//giá trị của id khi thực hiện sửa xoá
    const [isInsert, setIsInsert] = useState(false);
    //bắt buộc nhập
    const batBuocNhap = <span style={{ color: 'red' }}>*</span>;
    useEffect(() => {
        dispatch({ type: 'SET_LOADING', payload: true })
        if (props.iDAction) {
            const fetchGetRole = fetch(`${urlGetCar}?limit=100000`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'ss': getCookie('ss'),
                },
            })
            const fetchGetAccount = fetch(`${urlGetInsurance}?id=${props.iDAction}&id2=${props.iDAction2}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'ss': getCookie('ss'),
                },
            })


            Promise.all([fetchGetRole, fetchGetAccount])
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
                    setCombosVaiTro(data[0].data)
                    //xử lý dữ liệu hiển thị nếu là sửa dữ liệu
                    if (props.isInsert === false) {
                        let DuLieu = data[1];
                        const dateParts = DuLieu.NgayMuaBaoHiem.split('/');
                        const formattedDate = `${dateParts[2]}-${dateParts[1].padStart(2, '0')}-${dateParts[0].padStart(2, '0')}`;
                        const dateParts2 = DuLieu.NgayHetHan.split('/');
                        const formattedDate2 = `${dateParts2[2]}-${dateParts2[1].padStart(2, '0')}-${dateParts2[0].padStart(2, '0')}`;
                        DuLieu = {
                            ...DuLieu,
                            NgayMuaBaoHiem: formattedDate,
                            NgayHetHan: formattedDate2
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
            const fetchGetRole = fetch(`${urlGetCar}?limit=100000`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'ss': getCookie('ss'),
                },
            })
            Promise.all([fetchGetRole])
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

                    setCombosVaiTro(data[0].data)
                    console.log('MaXe: data[0].data[0].MaXe', data[0].data[0].MaXe);
                    setDataReq({
                        ...dataReq,
                        MaXe: data[0].data[0].MaXe
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
            MaXe: Number(selectedValue)
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
            console.log('hành động thêm');
            fetch(urlInsertInsurance, {
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
            fetch(urlUpdateInsurance, {
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
                            <h4 id='tieudepop'>Thông Tin Mua Bảo Hiểm Xe {!props.isInsert && <span > <span style={{ color: 'blue' }}> {props.iDAction3} Lần {props.iDAction2} </span></span>}</h4>
                            <form onSubmit={handleSubmit}
                                style={{
                                    maxHeight: isMobile ? '74vh' : '530px',
                                    overflow: 'auto',
                                    overflowX: 'hidden'
                                }}
                            >
                                <div className={`${isMobile ? 'flex-column' : 'row'}`} style={{ marginTop: '2%' }}>
                                    <div className={`${isMobile ? 'col-12' : 'col-6 '}`}>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <div style={{ display: 'flex', pointerEvents: !props.isInsert && 'none', opacity: !props.isInsert && '0.5' }}>
                                                <Combobox
                                                    combos={combosVaiTro}
                                                    columnValue="MaXe"
                                                    columnAdd="BienSoXe"
                                                    nameCombo="Xe: "
                                                    batBuocNhap={batBuocNhap}
                                                    value={dataReq.MaXe}
                                                    onChange={handleKhuVucChange}
                                                    maxWord={19}
                                                />
                                                <div style={{ display: 'flex', alignItems: 'center' }}
                                                    onClick={() => {
                                                        setIsInsert(true)
                                                        setIDAction()
                                                        setThemVTTC(true)
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
                                                    setThemVTTC(true)
                                                }}
                                            >
                                                <FontAwesomeIcon icon={faInfoCircle} />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>Ngày Mua Bảo Hiểm</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                onChange={(event) => {
                                                    setDataReq({
                                                        ...dataReq,
                                                        NgayMuaBaoHiem: event.target.value
                                                    });
                                                }}
                                                value={dataReq.NgayMuaBaoHiem}
                                            />
                                        </div>
                                        <div className="form-group" >
                                            <label>Ngày Hết Hạn</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                value={dataReq.NgayHetHan}
                                                onChange={(event) => {
                                                    setDataReq({
                                                        ...dataReq,
                                                        NgayHetHan: event.target.value
                                                    });
                                                }}
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Loại Bảo Hiểm</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                onChange={(event) => {
                                                    setDataReq({
                                                        ...dataReq,
                                                        LoaiBaoHiem: event.target.value
                                                    });
                                                }}
                                                value={dataReq.LoaiBaoHiem}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Người Mua Bảo Hiểm</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                onChange={(event) => {
                                                    setDataReq({
                                                        ...dataReq,
                                                        NguoiMuaBaoHiem: event.target.value
                                                    });
                                                }}
                                                value={dataReq.NguoiMuaBaoHiem}
                                            />
                                        </div>


                                    </div>
                                    <div className={`${isMobile ? 'col-12' : 'col-6 '}`}>
                                        {!props.isInsert &&
                                            <div className="form-group" style={{ pointerEvents: !props.isInsert && 'none', opacity: !props.isInsert && '0.5' }}>
                                                <label>Lần Mua Bảo Hiểm{batBuocNhap}</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    value={dataReq.LanMuaBaoHiem}
                                                    onChange={(event) => {
                                                        setDataReq({
                                                            ...dataReq,
                                                            LanMuaBaoHiem: event.target.value
                                                        });
                                                    }}
                                                />
                                            </div>
                                        }
                                        <div className="form-group">
                                            <label>Ghi Chú</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={dataReq.GhiChu}
                                                onChange={(event) => {
                                                    setDataReq({
                                                        ...dataReq,
                                                        GhiChu: event.target.value
                                                    });
                                                }}
                                            />
                                        </div>
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
                                        {/* <div className="form-group">
                                            <label>Tình Trạng Áp Dụng{batBuocNhap} ㅤ</label>
                                            <label>
                                                <input
                                                    type="radio"
                                                    value="true"
                                                    checked={dataReq.TinhTrangApDung == true}
                                                    onChange={(event) => {
                                                        setDataReq({
                                                            ...dataReq,
                                                            TinhTrangApDung: true
                                                        });
                                                    }}
                                                />
                                                Áp Dụngㅤ
                                            </label>
                                            <label>
                                                <input
                                                    type="radio"
                                                    value='false'
                                                    checked={dataReq.TinhTrangApDung == false}
                                                    onChange={(event) => {
                                                        setDataReq({
                                                            ...dataReq,
                                                            TinhTrangApDung: false
                                                        });
                                                    }}
                                                />
                                                Không Áp Dụng
                                            </label>
                                        </div> */}

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
                                themVTTC && <div className="popup">
                                    <Them_suaXe
                                        iDAction={iDAction}
                                        isInsert={isInsert}
                                        setPopupInsertUpdate={setThemVTTC}
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
                                        combos={combosVaiTro}
                                        IDColumn={'MaXe'}
                                        column={'BienSoXe'}
                                        handleChange={handleKhuVucChange}
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

export default Them_suaBaoHiem;