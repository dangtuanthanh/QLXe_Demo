import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { getCookie } from "../Cookie";
import Combobox from "../Combobox";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle, faSearch, faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import Them_suaNhomLoaiXe from "./them_suaNhomLoaiXe";
import Them_suaXe from "./them_suaXe";
import SearchComBoBox from "../SearchCombobox";
import { urlInsertTypeCar, urlGetTypeCar, urlUpdateTypeCar, urlGetGroupTypeCar } from "../url"

const Them_suaLoaiXe = (props) => {
    const dispatch = useDispatch()
    const [dataReq, setDataReq] = useState({});
    useEffect(() => {
        console.log('dữ liệu gửi đi: ', dataReq);
    }, [dataReq]);
    const [dataUser, setdataUser] = useState({});//
    // combobox
    const [themVTTC, setThemVTTC] = useState(false);
    const [popupSearch, setPopupSearch] = useState(false);
    const [popupSearch2, setPopupSearch2] = useState(false);
    const [combosKhuVuc, setCombosKhuVuc] = useState([]);//danh sách vai trò
    const [iDAction, setIDAction] = useState();//giá trị của id khi thực hiện sửa xoá
    const [isInsert, setIsInsert] = useState(false);

    const [popupXe, setPopupXe] = useState(false);

    //bắt buộc nhập
    const batBuocNhap = <span style={{ color: 'red' }}>*</span>;
    useEffect(() => {
        dispatch({ type: 'SET_LOADING', payload: true })
        if (props.iDAction) {
            const fetchGetTable = fetch(`${urlGetTypeCar}?id=${props.iDAction}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'ss': getCookie('ss'),
                },
            })

            const fetchGetArea = fetch(`${urlGetGroupTypeCar}?limit=10000`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'ss': getCookie('ss'),
                },
            })
            Promise.all([fetchGetTable, fetchGetArea])
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
                    if (props.isInsert === false) {
                        setDataReq(data[0])
                    }
                    else setDataReq({
                        ...dataReq,
                        MaNhomLoaiXe: data[1].data[0].MaNhomLoaiXe
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
            fetch(`${urlGetGroupTypeCar}?limit=10000`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'ss': getCookie('ss'),
                },
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error', response.message);
                    }
                    return response.json();
                })
                .then(data => {
                    setCombosKhuVuc(data.data)
                    setDataReq({
                        ...dataReq,
                        MaNhomLoaiXe: data.data[0].MaNhomLoaiXe
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
            MaNhomLoaiXe: selectedValue
        });
    }

    //xử lý xác nhận

    const handleSubmit = (e) => {
        e.preventDefault();
        if (dataReq.TenLoaiXe && dataReq.MaNhomLoaiXe) {
            dispatch({ type: 'SET_LOADING', payload: true })
            const data = {
                MaLoaiXe: dataReq.MaLoaiXe,
                TenLoaiXe: dataReq.TenLoaiXe,
                MoTa: dataReq.MoTa,
                MaNhomLoaiXe: dataReq.MaNhomLoaiXe
            };
            if (props.isInsert === true) {
                fetch(urlInsertTypeCar, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'ss': getCookie('ss'),
                    },
                    body: JSON.stringify(data)
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
                        props.setdataUser({ ...props.dataUser, page: 1, sortBy: 'MaLoaiXe', sortOrder: 'desc' })
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
                fetch(urlUpdateTypeCar, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'ss': getCookie('ss'),
                    },
                    body: JSON.stringify(data)
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

    const isMobile = useSelector(state => state.isMobile.isMobile)
    const handleSelectCar = (selectedValue) => {
        setIsInsert(false)
        setIDAction(selectedValue)
        setPopupXe(true)
    }
    return (
        <div className="popup-box">
            <div className="box" style={{
                width: isMobile && '100%'
            }}>
                <div className="conten-modal">
                    <div>
                        <div className="bg-light px-4 py-3">
                            <h4 id='tieudepop'>Thông Tin Loại Xe<span style={{ color: 'blue' }}>ㅤ{props.iDAction}</span></h4>
                            <form onSubmit={handleSubmit}
                                style={{
                                    maxHeight: isMobile ? '74vh' : '530px',
                                    overflow: 'auto',
                                    overflowX: 'hidden'
                                }}
                            >
                                <div className="form-group">
                                    <label>Tên Loại Xe {batBuocNhap}</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={dataReq.TenLoaiXe}
                                        onChange={(event) => {
                                            setDataReq({
                                                ...dataReq,
                                                TenLoaiXe: event.target.value
                                            });
                                        }}
                                    />
                                </div>
                                <div style={{ display: 'flex' }}>
                                    <Combobox
                                        combos={combosKhuVuc}
                                        columnValue="MaNhomLoaiXe"
                                        columnAdd="TenNhomLoaiXe"
                                        nameCombo="Nhóm Loại Xe: "
                                        batBuocNhap={batBuocNhap}
                                        value={dataReq.MaNhomLoaiXe}
                                        onChange={handleKhuVucChange}
                                        maxWord={isMobile && 14}
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
                                    <div style={{ marginLeft: isMobile ? '0.5rem' : '1rem', display: 'flex', alignItems: 'center' }}
                                        onClick={() => setPopupSearch(true)}
                                    >
                                        <FontAwesomeIcon icon={faSearch} />
                                    </div>
                                    <div style={{ marginLeft: isMobile ? '0.5rem' : '1rem', display: 'flex', alignItems: 'center' }}
                                        onClick={() => {
                                            setIsInsert(false)
                                            setIDAction(dataReq.MaNhomLoaiXe)
                                            setThemVTTC(true)
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faInfoCircle} />
                                    </div>
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
                                    />
                                </div>
                                {!props.isInsert &&<div>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <label style={{ marginBottom: '0px' }}>Danh Sách Xe : </label>
                                    <div style={{ marginLeft: '1rem', display: 'flex', alignItems: 'center' }}
                                        onClick={() => setPopupSearch2(true)}
                                    >
                                        <FontAwesomeIcon icon={faSearch} />
                                    </div>
                                </div>
                                <div className="form-group" style={{
                                    maxHeight: !isMobile && '220px',
                                    overflow: !isMobile && 'auto',
                                    overflowX: !isMobile && 'hidden'
                                }}>
                                    {dataReq.DanhSachXe && dataReq.DanhSachXe.map((item, index) => (
                                        <div style={{ display: 'flex', alignItems: 'center', marginTop: '0.7rem' }}
                                            onClick={() => {
                                                setIsInsert(false)
                                                setIDAction(item.MaXe)
                                                setPopupXe(true)
                                            }}
                                        >
                                            <label style={{ marginBottom: '0px' }}>{index + 1}. {item.BienSoXe}</label>
                                            <div style={{ marginLeft: '1rem', display: 'flex', alignItems: 'center' }}
                                            >
                                                <FontAwesomeIcon icon={faInfoCircle} />
                                            </div>
                                        </div>
                                    )
                                    )}

                                </div>
                                </div>
                                }
                            </form>
                            <button onClick={() => { props.setPopupInsertUpdate(false) }} type="button" className="btn btn-danger mt-3" >Huỷ Bỏ</button>
                            <button
                                onClick={handleSubmit}
                                style={{ float: "right" }} type="button"
                                className="btn bg-gradient-info mt-3"
                            >
                                Xác Nhận
                            </button>
                        </div>
                    </div>
                </div>
                {
                    themVTTC && <div className="popup">
                        <Them_suaNhomLoaiXe
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
                    popupXe && <div className="popup">
                        <Them_suaXe
                            iDAction={iDAction}
                            isInsert={isInsert}
                            setPopupInsertUpdate={setPopupXe}
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
                            combos={combosKhuVuc}
                            IDColumn={'MaNhomLoaiXe'}
                            column={'TenNhomLoaiXe'}
                            handleChange={handleKhuVucChange}
                        />
                    </div>
                }
                {
                    popupSearch2 && <div className="popup">
                        <SearchComBoBox
                            setPopupSearch={setPopupSearch2}
                            combos={dataReq.DanhSachXe}
                            IDColumn={'MaXe'}
                            column={'BienSoXe'}
                            handleChange={handleSelectCar}
                        />
                    </div>
                }
            </div >
        </div >
    );
};
export default Them_suaLoaiXe;