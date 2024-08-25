import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle, faSearchPlus, faSearch, faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import { getCookie } from "../Cookie";
import { urlViewMyUsageHistory } from "../url"

const Xthem_suaLichSuSuDung = (props) => {
    //xử lý redux
    const dispatch = useDispatch()
    //lưu trữ dữ liệu gửi đi
    const [dataReq, setDataReq] = useState({});
    const [dataUser, setdataUser] = useState({});//
    //bắt buộc nhập
    const batBuocNhap = <span style={{ color: 'red' }}>*</span>;
    useEffect(() => {
        dispatch({ type: 'SET_LOADING', payload: true })
        if (props.iDAction) {
            const fetchGetAccount = fetch(`${urlViewMyUsageHistory}?id=${props.iDAction}&id2=${props.iDAction2}`, {
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
                    //xử lý dữ liệu hiển thị nếu là sửa dữ liệu
                    if (props.isInsert === false) {
                        let DuLieu = data[0];
                        const dateParts = DuLieu.NgayDi.split('/');
                        const formattedDate = `${dateParts[2]}-${dateParts[1].padStart(2, '0')}-${dateParts[0].padStart(2, '0')}`;
                        const dateParts2 = DuLieu.NgayVe.split('/');
                        const formattedDate2 = `${dateParts2[2]}-${dateParts2[1].padStart(2, '0')}-${dateParts2[0].padStart(2, '0')}`;
                        DuLieu = {
                            ...DuLieu,
                            NgayDi: formattedDate,
                            NgayVe: formattedDate2
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
        }
    }, [dataUser]);
    const isMobile = useSelector(state => state.isMobile.isMobile)
    return (
        <div className="popup-box">
            <div className="box" style={{
                width: isMobile && '100%'
            }}>
                <div className="conten-modal">
                    <div>
                        <div className="bg-light px-4 py-3">
                            <h4 id='tieudepop'>Thông Tin Lịch Sử Sử Dụng {!props.isInsert && <span > <span style={{ color: 'blue' }}> {props.iDAction3} Lần {props.iDAction2} </span></span>}</h4>
                            <form
                                //  <form onSubmit={handleSubmit}
                                style={{
                                    maxHeight: isMobile ? '74vh' : '530px',
                                    overflow: 'auto',
                                    overflowX: 'hidden'
                                }}>
                                <div className={`${isMobile ? 'flex-column' : 'row'}`} style={{ marginTop: '2%' }}>
                                    <div className={`${isMobile ? 'col-12' : 'col-6 '}`}>
                                        <div className="form-group">
                                            <label>Xe</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                // onChange={(event) => {
                                                //     setDataReq({
                                                //         ...dataReq,
                                                //         NgayDangKiem: event.target.value
                                                //     });
                                                // }}
                                                value={dataReq.BienSoXe}
                                                disabled
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Ngày Đi</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                // onChange={(event) => {
                                                //     setDataReq({
                                                //         ...dataReq,
                                                //         NgayDi: event.target.value
                                                //     });
                                                // }}
                                                disabled
                                                value={dataReq.NgayDi}
                                            />
                                        </div>
                                        <div className="form-group" >
                                            <label>Ngày Về</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                value={dataReq.NgayVe}
                                                // onChange={(event) => {
                                                //     setDataReq({
                                                //         ...dataReq,
                                                //         NgayHetHan: event.target.value
                                                //     });
                                                // }}
                                                disabled
                                            />
                                        </div>


                                        <div className="form-group">
                                            <label>Người Sử Dụng</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                // onChange={(event) => {
                                                //     setDataReq({
                                                //         ...dataReq,
                                                //         NguoiSuDung: event.target.value
                                                //     });
                                                // }}
                                                value={dataReq.NguoiSuDung}
                                                disabled
                                            />
                                        </div>
                                       

                                    </div>
                                    <div className={`${isMobile ? 'col-12' : 'col-6 '}`}>
                                        {!props.isInsert &&
                                            <div className="form-group" style={{ pointerEvents: !props.isInsert && 'none', opacity: !props.isInsert && '0.5' }}>
                                                <label>Lần Sử Dụng{batBuocNhap}</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    value={dataReq.LanSuDung}
                                                    // onChange={(event) => {
                                                    //     setDataReq({
                                                    //         ...dataReq,
                                                    //         LanSuDung: event.target.value
                                                    //     });
                                                    // }}
                                                    disabled
                                                />
                                            </div>
                                        }
                                        <div className="form-group">
                                            <label>Ghi Chú</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={dataReq.GhiChu}
                                                // onChange={(event) => {
                                                //     setDataReq({
                                                //         ...dataReq,
                                                //         ThoiGian: Number(event.target.value)
                                                //     });
                                                // }}
                                                disabled
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Khoảng Cách</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                // onChange={(event) => {
                                                //     setDataReq({
                                                //         ...dataReq,
                                                //         KhoangCach: event.target.value
                                                //     });
                                                // }}
                                                disabled
                                                value={dataReq.KhoangCach}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Mục Đích</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                // onChange={(event) => {
                                                //     setDataReq({
                                                //         ...dataReq,
                                                //         MucDich: event.target.value
                                                //     });
                                                // }}
                                                disabled
                                                value={dataReq.MucDich}
                                            />
                                        </div>
                                    </div>
                                </div>

                            </form>
                            <button onClick={() => { props.setPopupInsertUpdate(false) }} type="button" className="btn btn-danger mt-3" >Huỷ Bỏ</button>
                        </div>
                    </div>
                </div>
            </div >
        </div >
    );
};

export default Xthem_suaLichSuSuDung;