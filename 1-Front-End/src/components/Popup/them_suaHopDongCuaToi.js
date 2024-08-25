import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { getCookie } from "../Cookie";
import Combobox from "../Combobox";
import SearchComBoBox from "../SearchCombobox";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle, faSearch, faInfoCircle, faInfo } from '@fortawesome/free-solid-svg-icons'
import { ReadingConfig, doReadNumber, } from 'read-vietnamese-number'
import { urlInsertContract, urlGetMyContract, urlUpdateContract, urlGetMember, urlGetCar } from "../url"
import Them_suaThanhVien from "./them_suaThanhVien";
import Them_suaXe from "./Xthem_suaXe";

const Them_suaHopDongCuaToi = (props) => {
    const dispatch = useDispatch()
    const [dataReq, setDataReq] = useState({
        DanhSach: [],
    });
    useEffect(() => {
        console.log('dữ liệu gửi đi: ', dataReq);
    }, [dataReq]);
    const [dataUser, setdataUser] = useState({});//
    // combobox
    const [combosKhuVuc, setCombosKhuVuc] = useState([]);//danh sách vai trò
    const [ckbDinhMuc, setCkbDinhMuc] = useState([]);//danh sách định mức các nguyên liệu
    const [ckbDinhMuc2, setCkbDinhMuc2] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const [DV1, setDV1] = useState(false);
    const [isInsert, setIsInsert] = useState(false);
    const [iDAction, setIDAction] = useState();//giá trị của id khi thực hiện sửa xoá
    //hàm tìm kiếm
    const handleSearch = (event) => {
        setSearchTerm(event.target.value)
        setCkbDinhMuc2(ckbDinhMuc.filter(combo => {
            return combo.BienSoXe.toLowerCase().includes(event.target.value.toLowerCase());
        }))
    };
    useEffect(() => {
        setCkbDinhMuc2(ckbDinhMuc)
    }, [ckbDinhMuc]);
    //bắt buộc nhập
    const batBuocNhap = <span style={{ color: 'red' }}>*</span>;
    useEffect(() => {
        dispatch({ type: 'SET_LOADING', payload: true })
        if (props.iDAction) {
            const fetchGetTable = fetch(`${urlGetMyContract}?id=${props.iDAction}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'ss': getCookie('ss'),
                },
            })


            Promise.all([fetchGetTable])
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

                    if (props.isInsert === false) {
                        let DuLieu = data[0];
                        const dateParts = DuLieu.NgayLamHopDong.split('/');
                        const formattedDate = `${dateParts[2]}-${dateParts[1].padStart(2, '0')}-${dateParts[0].padStart(2, '0')}`;
                        const dateParts2 = DuLieu.NgayHetHanHopDong.split('/');
                        const formattedDate2 = `${dateParts2[2]}-${dateParts2[1].padStart(2, '0')}-${dateParts2[0].padStart(2, '0')}`;
                        DuLieu = {
                            ...DuLieu,
                            NgayLamHopDong: formattedDate,
                            NgayHetHanHopDong: formattedDate2
                        }
                        setDataReq(DuLieu);
                        //setDataReq(data[0])
                    }
                    else setDataReq({
                        ...dataReq
                    });
                    //ẩn loading
                    dispatch({ type: 'SET_LOADING', payload: false })
                })
                .catch(error => {
                    console.log(error);
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
    //đọc tiền bằng chữ
    // Config reading options
    const config = new ReadingConfig()
    config.unit = ['đồng']



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
                            <h4 id='tieudepop'>Thông Tin Hợp Đồng<span style={{ color: 'blue' }}>ㅤ{dataReq.SoHopDong}</span></h4>
                            <form style={{
                                maxHeight: isMobile ? '74vh' : '530px',
                                overflow: 'auto',
                                overflowX: 'hidden'
                            }}>
                                <div className={`${isMobile ? 'flex-column' : 'row'}`}>
                                    <div className={`${isMobile ? 'col-12' : 'col-6 '}`}>
                                        <div className="form-group" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                                            <label style={{ marginBottom: '0px' }}>Mã Hợp Đồng: {batBuocNhap}</label>
                                            <input
                                                style={{ width: '50%', marginLeft: '1em', boder: 'none' }}
                                                type="text"
                                                className="form-control-sm"
                                                value={dataReq.SoHopDong}
                                                disabled
                                            />
                                        </div>

                                    </div>
                                    <div className={`${isMobile ? 'col-12' : 'col-6'}`}>
                                        <label style={{ marginBottom: '0px' }}>Tên Thành Viên: {batBuocNhap}</label>
                                        <input
                                            style={{ width: '50%', marginLeft: '1em', boder: 'none' }}
                                            type="text"
                                            className="form-control-sm"
                                            value={dataReq.TenThanhVien}
                                            disabled
                                        />
                                    </div>
                                </div>
                                <div className={`${isMobile ? 'flex-column' : 'row'}`} style={{ display: 'flex', alignItems: 'center' }}>

                                    <div className={isMobile ? "col-12" : "col-4"}>
                                        <div className="form-group">
                                            <label>Ngày Làm Hợp Đồng</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                value={dataReq.NgayLamHopDong}
                                                disabled
                                            />
                                        </div>

                                    </div>
                                    <div className={isMobile ? "col-12" : "col-4"}>
                                        <div className="form-group">
                                            <label>Ngày Hết Hạn</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                value={dataReq.NgayHetHanHopDong}
                                                disabled
                                            />
                                        </div>
                                    </div>
                                    <div className={isMobile ? "col-12" : "col-4"}>
                                        <div className="form-group">
                                            <label>Ghi Chú</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={dataReq.GhiChu}
                                                disabled
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div style={{ borderBottom: '2px gray solid', marginBottom: '5px' }}></div>
                                <div className="">
                                    <div className="" >
                                        {/* <div style={{background:'#fff',borderRadius:'8px'}} className="col-9 " > */}
                                        <div className="form-group">
                                            <h6 style={{ textAlign: 'center' }}><u>Chi Tiết Hợp Đồng</u>        {batBuocNhap}</h6>
                                        </div>
                                        {!isMobile &&
                                            <div className='row' >
                                                <div className="col-2">
                                                    <label>Xe</label>
                                                </div>
                                                <div className="col-3">
                                                    <label>Ngày Ký</label>
                                                </div>
                                                {!props.isInsert && <div className="col-3">
                                                    <label>Ngày Hết Hạn</label>
                                                </div>}
                                                <div className="col-2">
                                                    <label>Đơn Giá</label>
                                                </div>
                                            </div>
                                        }
                                        <div className="form-group" style={{
                                            maxHeight: !isMobile && '220px',
                                            overflow: !isMobile && 'auto',
                                            overflowX: !isMobile && 'hidden'
                                        }}>
                                            {dataReq.DanhSach.map(item => (
                                                <div key={item.MaXe}
                                                    className={`${isMobile ? 'flex-column' : 'row'}`}>
                                                    <div className={`${isMobile ? 'col-12' : 'col-2'}`}>
                                                        <div
                                                            onClick={() => {
                                                                setIsInsert(false)
                                                                setIDAction(item.MaXe)
                                                                setDV1(true)
                                                            }}
                                                            style={{ display: 'flex' }}>
                                                            <label>{isMobile && 'Xe: '}{item.BienSoXe} </label>
                                                            <div style={{ marginLeft: '0.3rem', display: 'flex', alignItems: 'center' }}
                                                            >
                                                                <label style={{ color: '#7f7fff' }}><FontAwesomeIcon icon={faInfoCircle} /></label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className={`${isMobile ? 'col-12' : 'col-3'}`}>
                                                        {isMobile && <label>Ngày Ký Hơp Đồng</label>}
                                                        <input
                                                            type="date"
                                                            className="form-control"
                                                            value={item.NgayKiHopDong}
                                                            disabled
                                                        />
                                                    </div>
                                                    {!props.isInsert && <div className={`${isMobile ? 'col-12' : 'col-3'}`}>
                                                        {isMobile && <label>Ngày Hết Hạn</label>}
                                                        <input
                                                            type="date"
                                                            className="form-control"
                                                            value={item.NgayHetHan}
                                                            disabled
                                                        />
                                                    </div>}
                                                    <div className={`${isMobile ? 'col-12' : 'col-2'}`}>
                                                        {isMobile && <label>Đơn Giá</label>}
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={new Intl.NumberFormat('vi-VN', {
                                                                style: 'currency',
                                                                currency: 'VND'
                                                            }).format(item.DonGia)}
                                                            disabled
                                                        />
                                                    </div>
                                                    <div className={`${isMobile ? 'col-12' : 'col-2'}`}>
                                                        <label>{doReadNumber(config, item.DonGia.toString())}</label>

                                                    </div>
                                                    <hr></hr>
                                                </div>
                                            ))}
                                        </div>

                                    </div>
                                </div>
                                <hr class="horizontal dark" />
                            </form>
                            <div style={{ width: '100%', overflow: 'hidden' }}>
                                <label
                                    style={{ fontSize: '1.3rem', marginRight: '1rem', color: '#727272', marginBottom: '0px', float: 'right' }}
                                >
                                    Tổng Tiền: <span style={{ marginLeft: '1rem' }}>
                                        {new Intl.NumberFormat('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND'
                                        }).format(dataReq.DanhSach.reduce((sum, item) => {
                                            return sum + Number(item.DonGia);
                                        }, 0))}</span>
                                </label>
                            </div>
                            <div style={{ width: '100%' }}>
                                <button onClick={() => { props.setPopupInsertUpdate(false) }} type="button" className="btn btn-danger mt-3" >Huỷ Bỏ</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
            {
                DV1 && <div className="popup">
                    <Them_suaXe
                        iDAction={iDAction}
                        isInsert={isInsert}
                        setPopupInsertUpdate={setDV1}
                        dataUser={dataUser}
                        setdataUser={setdataUser}
                        addNotification={props.addNotification}
                        openPopupAlert={props.openPopupAlert}
                        maHopDong={dataReq.MaHopDong}
                    />
                </div>
            }
        </div >
    );
};
export default Them_suaHopDongCuaToi;