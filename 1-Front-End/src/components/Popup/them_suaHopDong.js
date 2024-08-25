import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { getCookie } from "../Cookie";
import Combobox from "../Combobox";
import SearchComBoBox from "../SearchCombobox";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle, faSearch, faInfoCircle, faInfo } from '@fortawesome/free-solid-svg-icons'
import { ReadingConfig, doReadNumber, } from 'read-vietnamese-number'
import { urlInsertContract, urlGetContract, urlUpdateContract, urlGetMember, urlGetCar } from "../url"
import Them_suaThanhVien from "./them_suaThanhVien";
import Them_suaXe from "./them_suaXe";
const Them_suaHopDong = (props) => {
    const dispatch = useDispatch()
    const [dataReq, setDataReq] = useState({
        DanhSach: [],
    });
    useEffect(() => {
        console.log('dữ liệu gửi đi: ', dataReq);
    }, [dataReq]);
    const [dataUser, setdataUser] = useState({});//
    // popup
    const [themVTTC, setThemVTTC] = useState(false);
    const [iDAction, setIDAction] = useState();//giá trị của id khi thực hiện sửa xoá
    const [isInsert, setIsInsert] = useState(false);
    const [popupSearch, setPopupSearch] = useState(false);
    const [DV1, setDV1] = useState(false);
    // combobox
    const [combosKhuVuc, setCombosKhuVuc] = useState([]);//danh sách vai trò
    const [ckbDinhMuc, setCkbDinhMuc] = useState([]);//danh sách định mức các nguyên liệu
    const [ckbDinhMuc2, setCkbDinhMuc2] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

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
            const fetchGetTable = fetch(`${urlGetContract}?id=${props.iDAction}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'ss': getCookie('ss'),
                },
            })

            const fetchGetArea = fetch(`${urlGetMember}?limit=10000`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'ss': getCookie('ss'),
                },
            })
            //lấy danh sách xe
            const fetch2 = fetch(`${urlGetCar}?limit=100000`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'ss': getCookie('ss'),
                },
            })
            Promise.all([fetchGetTable, fetchGetArea, fetch2])
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
                    setCkbDinhMuc(data[2].data)
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
                        ...dataReq,
                        MaThanhVien: data[1].data[0].MaThanhVien
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
        } else {
            const fetchGetArea = fetch(`${urlGetMember}?limit=10000`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'ss': getCookie('ss'),
                },
            })
            //lấy danh sách xe
            const fetch2 = fetch(`${urlGetCar}?limit=100000`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'ss': getCookie('ss'),
                },
            })

            Promise.all([fetchGetArea, fetch2])
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
                    setCkbDinhMuc(data[1].data)
                    setDataReq({
                        ...dataReq,
                        MaThanhVien: data[0].data[0].MaThanhVien,
                        TinhTrangApDung: true
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

    //combo combosKhuVuc
    function handleKhuVucChange(selectedValue) {
        setDataReq({
            ...dataReq,
            MaThanhVien: selectedValue
        });
    }

    //xử lý xác nhận

    const handleSubmit = (e) => {
        e.preventDefault();
        if (dataReq.MaThanhVien && dataReq.SoHopDong && dataReq.DanhSach.length) {
            dispatch({ type: 'SET_LOADING', payload: true })
            if (props.isInsert === true) {
                fetch(urlInsertContract, {
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
                fetch(urlUpdateContract, {
                    method: 'PUT',
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
    const handleListChange = (ID, Ten) => {
        let updatedDataReq = { ...dataReq };
        let newDanhSach = updatedDataReq.DanhSach;
        const today = new Date();

        // Lấy ngày tháng năm theo định dạng yyyy-mm-dd
        const todayString = today.getFullYear() + "-" +
            ('0' + (today.getMonth() + 1)).slice(-2) + "-" +
            ('0' + today.getDate()).slice(-2);

        if (newDanhSach.some(item => item.MaXe === ID)) {
            newDanhSach = newDanhSach.filter(item => item.MaXe !== ID);
        } else {
            newDanhSach.push({
                BienSoXe: Ten,
                MaXe: ID,
                NgayKiHopDong: todayString,
                ThoiGian: 12,
                DonGia: 0
            });
        }
        updatedDataReq.DanhSach = newDanhSach;
        setDataReq(updatedDataReq);
    }
    function handleDetailChange(ID, value, TenCot) {
        console.log('ID', ID);
        const index = dataReq.DanhSach.findIndex(
            item => {
                return item.MaXe === ID;
            }
        );
        if (TenCot === 'DonGia' || TenCot === 'ThoiGian') {
            dataReq.DanhSach[index][TenCot] = Number(value)
        } else dataReq.DanhSach[index][TenCot] = value
        setDataReq({
            ...dataReq,
            DanhSach: [...dataReq.DanhSach]
        })
    }
    //đọc tiền bằng chữ
    // Config reading options
    const config = new ReadingConfig()
    config.unit = ['đồng']



    const isMobile = useSelector(state => state.isMobile.isMobile)
    return (
        <div className="lg-popup-box">
            <div className="lg-box"
                style={{
                    width: isMobile && '100%'
                }}>
                <div className="conten-modal">
                    <div>
                        <div className="bg-light px-4 py-3"
                        >
                            <h4 id='tieudepop'>Thông Tin Hợp Đồng<span style={{ color: 'blue' }}>ㅤ{dataReq.SoHopDong}</span></h4>
                            <form onSubmit={handleSubmit}
                                style={{
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
                                                onChange={(event) => {
                                                    setDataReq({
                                                        ...dataReq,
                                                        SoHopDong: event.target.value
                                                    });
                                                }}
                                            />
                                        </div>

                                    </div>
                                    <div className={`${isMobile ? 'col-12' : 'col-6 '}`}>
                                        <div style={{ display: 'flex' }}>
                                            <Combobox
                                                combos={combosKhuVuc}
                                                columnValue="MaThanhVien"
                                                columnAdd="TenThanhVien"
                                                nameCombo="Thành Viên: "
                                                batBuocNhap={batBuocNhap}
                                                value={dataReq.MaThanhVien}
                                                onChange={handleKhuVucChange}
                                                maxWord={30}
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
                                            <div style={{ marginLeft: '1rem', display: 'flex', alignItems: 'center' }}
                                                onClick={() => {
                                                    setIsInsert(false)
                                                    setIDAction(dataReq.MaThanhVien)
                                                    setThemVTTC(true)
                                                }}
                                            >
                                                <FontAwesomeIcon icon={faInfoCircle} />

                                            </div>
                                        </div>
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
                                                onChange={(event) => {
                                                    setDataReq({
                                                        ...dataReq,
                                                        NgayLamHopDong: event.target.value
                                                    });
                                                }}
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
                                                onChange={(event) => {
                                                    setDataReq({
                                                        ...dataReq,
                                                        NgayHetHanHopDong: event.target.value
                                                    });
                                                }}
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
                                                onChange={(event) => {
                                                    setDataReq({
                                                        ...dataReq,
                                                        GhiChu: event.target.value
                                                    });
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div style={{ borderBottom: '2px gray solid', marginBottom: '5px' }}></div>
                                <div className={`${isMobile ? 'flex-column' : 'row'}`}>
                                    <div className={`${isMobile ? 'col-12' : 'col-2 '}`} style={{ borderRight: '2px gray solid' }}>
                                        <h6 style={{ textAlign: 'center' }}><u>Danh Sách Xe</u>   {batBuocNhap}</h6>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <input
                                                id="search"
                                                value={searchTerm} onChange={handleSearch}
                                                placeholder='Tìm Xe'
                                                type="text"
                                                className="form-control-sm"
                                                style={{ width: '95%' }}
                                            />
                                            {
                                                searchTerm !== '' &&
                                                <button
                                                    className="btn btn-close"
                                                    style={{ color: 'red', marginLeft: '4px', marginTop: '10px', fontSize: '0.6em' }}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setCkbDinhMuc2(ckbDinhMuc)
                                                        setSearchTerm('')
                                                    }}
                                                >
                                                    X
                                                </button>
                                            }
                                        </div>
                                        <div className="form-group"
                                            style={{
                                                maxHeight: '240px',
                                                overflow: 'auto'
                                            }}
                                        >
                                            {/* <label>Danh Sa {batBuocNhap}: </label> */}
                                            {ckbDinhMuc2.map(combo => {
                                                let checked = false;
                                                dataReq.DanhSach.forEach(item => {
                                                    if (item.MaXe === combo.MaXe)
                                                        checked = true;
                                                })
                                                return (
                                                    <>
                                                        <div key={combo.MaXe}>
                                                            <div style={{ display: 'flex' }}>
                                                                <label>

                                                                    <input
                                                                        style={{ marginRight: '4px' }}
                                                                        type="checkbox"
                                                                        checked={checked}
                                                                        onChange={() => handleListChange(combo.MaXe, combo.BienSoXe)}
                                                                    />

                                                                    {
                                                                        combo["BienSoXe"] ?
                                                                            combo["BienSoXe"].length > 10 ?
                                                                                combo["BienSoXe"].slice(0, 10) + '...' :
                                                                                combo["BienSoXe"]
                                                                            : ''
                                                                    }

                                                                </label>
                                                                <div style={{ marginLeft: '0.3rem', display: 'flex', alignItems: 'center' }}
                                                                    onClick={() => {
                                                                        setIsInsert(false)
                                                                        setIDAction(combo.MaXe)
                                                                        setDV1(true)
                                                                    }}
                                                                >
                                                                    <label style={{ color: '#7f7fff' }}><FontAwesomeIcon icon={faInfoCircle} /></label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </>
                                                )
                                            })
                                            }
                                        </div>
                                    </div>
                                    <div className={`${isMobile ? 'col-12' : 'col-10 '}`} >
                                        {/* <div style={{background:'#fff',borderRadius:'8px'}} className="col-9 " > */}
                                        <div className="form-group">
                                            <h6 style={{ textAlign: 'center' }}><u>Chi Tiết Hợp Đồng</u>        {batBuocNhap}</h6>
                                        </div>
                                        {!isMobile && <div className={`row`} >
                                            <div className="col-2">
                                                <label>Xe</label>
                                            </div>
                                            <div className="col-3">
                                                <label>Ngày Ký</label>
                                            </div>
                                            <div className="col-3">
                                                <label>Ngày Hết Hạn</label>
                                            </div>
                                            <div className="col-2">
                                                <label>Đơn Giá</label>
                                            </div>
                                        </div>}
                                        <div className="form-group" style={{
                                            maxHeight: !isMobile && '220px',
                                            overflow: !isMobile && 'auto',
                                            overflowX: !isMobile && 'hidden'
                                        }}>
                                            {dataReq.DanhSach.map(item => (
                                                <div key={item.MaXe}
                                                    className={`${isMobile ? 'flex-column' : 'row'}`}>
                                                    <div className={`${isMobile ? 'col-12' : 'col-2 '}`}>
                                                        <label>{isMobile && 'Xe: '}{item.BienSoXe} </label>
                                                    </div>
                                                    <div className={`${isMobile ? 'col-12' : 'col-3'}`}>
                                                        {isMobile && <label>Ngày Ký Hơp Đồng</label>}
                                                        <input
                                                            type="date"
                                                            className="form-control"
                                                            value={item.NgayKiHopDong}
                                                            onChange={(event) =>
                                                                handleDetailChange(item.MaXe,
                                                                    event.target.value,
                                                                    'NgayKiHopDong'
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                    <div className={`${isMobile ? 'col-12' : 'col-3'}`}>
                                                        {isMobile && <label>Ngày Hết Hạn</label>}
                                                        <input
                                                            type="date"
                                                            className="form-control"
                                                            value={item.NgayHetHan}
                                                            onChange={(event) => handleDetailChange(item.MaXe, event.target.value, 'NgayHetHan')}
                                                        />
                                                    </div>
                                                    <div className={`${isMobile ? 'col-12' : 'col-2 '}`}>
                                                        {isMobile && <label>Đơn Giá</label>}
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            value={item.DonGia}
                                                            onChange={(event) => { handleDetailChange(item.MaXe, event.target.value, 'DonGia'); }
                                                            }
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
                                <button
                                    style={{ float: 'right' }}
                                    onClick={handleSubmit}
                                    type="button"
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
                        <Them_suaThanhVien
                            iDAction={iDAction}
                            isInsert={isInsert}
                            setPopup1={setThemVTTC}
                            dataUser={dataUser}
                            setdataUser={setdataUser}
                            addNotification={props.addNotification}
                            openPopupAlert={props.openPopupAlert}
                        />
                    </div>
                }
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
                        />
                    </div>
                }
                {
                    popupSearch && <div className="popup">
                        <SearchComBoBox
                            setPopupSearch={setPopupSearch}
                            combos={combosKhuVuc}
                            IDColumn={'MaThanhVien'}
                            column={'TenThanhVien'}
                            handleChange={handleKhuVucChange}
                        />
                    </div>
                }
            </div >
        </div >
    );
};
export default Them_suaHopDong;