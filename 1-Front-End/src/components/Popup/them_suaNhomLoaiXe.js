import React, { useState, useEffect, useRef } from "react";
import { useDispatch ,useSelector} from 'react-redux'
import { getCookie } from "../Cookie";
import {  urlInsertGroupTypeCar, urlGetGroupTypeCar, urlUpdateGroupTypeCar } from "../url"
import Them_suaXe from "./them_suaXe";
import SearchComBoBox from "../SearchCombobox";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faInfoCircle } from '@fortawesome/free-solid-svg-icons'

const Them_suaNhomLoaiXe = (props) => {
    //xử lý redux
    const dispatch = useDispatch()
    //lưu trữ dữ liệu gửi đi
    const [dataReq, setDataReq] = useState({});
    useEffect(() => {
        console.log('dữ liệu gửi đi: ', dataReq);
    }, [dataReq]);
    const [dataUser, setdataUser] = useState({});//
    const [popupXe, setPopupXe] = useState(false);
    const [popupSearch2, setPopupSearch2] = useState(false);
    const [iDAction, setIDAction] = useState();//giá trị của id khi thực hiện sửa xoá
    const [isInsert, setIsInsert] = useState(false);
    //bắt buộc nhập
    const batBuocNhap = <span style={{ color: 'red' }}>*</span>;
    useEffect(() => {
        if (props.iDAction) {
            dispatch({ type: 'SET_LOADING', payload: true })
            const fetchGetAccount = fetch(`${urlGetGroupTypeCar}?id=${props.iDAction}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'ss': getCookie('ss'),
                },
            })
            Promise.all([fetchGetAccount])
                .then(responses => {
                    const processedResponses = responses.map(response => {
                        if (response.status === 200) {
                            return response.json();
                        } else if (response.status === 401 || response.status === 400 || response.status === 500) {
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
                    //xử lý dữ liệu hiển thị nếu là sửa dữ liệu
                    if (props.isInsert === false) {
                        setDataReq(data[0])
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
        }
    }, [dataUser]);
    //xử lý xác nhận
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!dataReq.TenNhomLoaiXe
        ) props.openPopupAlert('Vui lòng nhập đầy đủ thông tin. Các trường có dấu * là bắt buộc nhập')
        else {
            dispatch({ type: 'SET_LOADING', payload: true })
            const data = {
                MaNhomLoaiXe:dataReq.MaNhomLoaiXe,
                TenNhomLoaiXe:dataReq.TenNhomLoaiXe,
                MoTa: dataReq.MoTa
            };
            if (props.isInsert === true) {
                fetch(urlInsertGroupTypeCar, {
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
                        props.setdataUser({ ...props.dataUser, sortBy: 'MaNhomLoaiXe', sortOrder: 'desc' })
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
                fetch(urlUpdateGroupTypeCar, {
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
                        }else if (response.status === 400) {
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
    }
    const isMobile = useSelector(state => state.isMobile.isMobile)
    const handleSelectCar = (selectedValue)=>{
        setIsInsert(false)
        setIDAction(selectedValue)
        setPopupXe(true)
}
    return (
        <div className="popup-box">
            <div className="box"style={{
                width: isMobile && '100%'
            }}>
                <div className="conten-modal">
                    <div>
                        <div className="bg-light px-4 py-3">
                            <h4 id='tieudepop'>Thông Tin Nhóm Loại Xe<span style={{ color: 'blue' }}>ㅤ{props.iDAction}</span></h4>
                            <form onSubmit={handleSubmit}
                             style={{
                                maxHeight:  isMobile ? '74vh':'530px',
                                overflow: 'auto',
                                overflowX: 'hidden'
                            }}>
                            <div className="">
                                    <div className="form-group">
                                        <label>Tên Nhóm Loại Xe {batBuocNhap}</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={dataReq.TenNhomLoaiXe}
                                            onChange={(event) => {
                                                setDataReq({
                                                    ...dataReq,
                                                    TenNhomLoaiXe: event.target.value
                                                });
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="">
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
                                </div>
                                {!props.isInsert &&<div>
                                <div style={{display:'flex',alignItems:'center'}}>
                                        <label style={{marginBottom:'0px'}}>Danh Sách Xe : </label>
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
                                        <div style={{display:'flex',alignItems:'center',marginTop:'0.7rem'}}
                                        onClick={() => {
                                            setIsInsert(false)
                                            setIDAction(item.MaXe)
                                            setPopupXe(true)
                                        }}
                                        >
                                            <label style={{marginBottom:'0px'}}>{index + 1}. {item.BienSoXe}</label>
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

export default Them_suaNhomLoaiXe;