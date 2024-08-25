import React, { useState, useEffect, useRef } from "react";
import { useDispatch,useSelector } from 'react-redux'
import { getCookie } from "../Cookie";
import { urlGetPermission, urlInsertRole, urlGetRole, urlUpdateRole } from "../url"
const Insert_updateRole = (props) => {
    //xử lý redux
    const dispatch = useDispatch()
    //lưu trữ dữ liệu gửi đi
    const [dataReq, setDataReq] = useState({
        MaQuyen: []
    });
    useEffect(() => {
        console.log('dữ liệu gửi đi: ', dataReq);
    }, [dataReq]);
    // combobox
    const [searchTerm, setSearchTerm] = useState('');
    const [combosQuyen, setCombosQuyen] = useState([]);//danh sách quyền
    const [combosQuyen2, setCombosQuyen2] = useState([]);
    //hàm tìm kiếm
    const handleSearch = (event) => {
        setSearchTerm(event.target.value)
        setCombosQuyen2(combosQuyen.filter(combo => {
            return combo.MoTa.toLowerCase().includes(event.target.value.toLowerCase());
        }))
    };
    useEffect(() => {
        setCombosQuyen2(combosQuyen)
    }, [combosQuyen]);
    //bắt buộc nhập
    const batBuocNhap = <span style={{ color: 'red' }}>*</span>;
    useEffect(() => {
        dispatch({ type: 'SET_LOADING', payload: true })
        const fetchGetPermission = fetch(`${urlGetPermission}?limit=10000`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'ss': getCookie('ss'),
            },
        })
        const fetchGetRole = fetch(`${urlGetRole}?id=${props.iDAction}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'ss': getCookie('ss'),
            },
        })
        Promise.all([fetchGetPermission, fetchGetRole])
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
                setCombosQuyen(data[0])
                if (props.isInsert === false) {
                    //xử lý chuyển mảng num sang string
                    let getRoleByID = data[1]
                    const stringsMaQuyen = data[1].MaQuyen.map(num => num.toString());
                    getRoleByID = ({
                        ...getRoleByID,
                        MaQuyen: stringsMaQuyen
                    });
                    setDataReq(getRoleByID)
                }

                //ẩn loading
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
    }, []);
    //combo vai trò
    const handleQuyenChange = (ID) => {
        let updatedDataReq = { ...dataReq };
        let MaQuyen = updatedDataReq.MaQuyen;
        if (MaQuyen.includes(ID)) {
            MaQuyen = MaQuyen.filter(item => item !== ID)
        } else {
            MaQuyen.push(ID);
        }
        updatedDataReq.MaQuyen = MaQuyen;
        setDataReq(updatedDataReq);
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!dataReq.TenVaiTro
            || !dataReq.MaQuyen
            || !dataReq.MaQuyen.length
        ) props.openPopupAlert('Vui lòng nhập đầy đủ thông tin. Các trường có dấu * là bắt buộc nhập')
        else {
            dispatch({ type: 'SET_LOADING', payload: true })
            const strMaQuyen = dataReq.MaQuyen.join(',');
            const data = {
                MaVaiTro: dataReq.MaVaiTro,
                TenVaiTro: dataReq.TenVaiTro,
                MaQuyen: strMaQuyen
            };
            if (props.isInsert === true) {
                fetch(urlInsertRole, {
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
                        props.setdataUser({ ...props.dataUser, sortBy: 'MaVaiTro', sortOrder: 'desc' })
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
                console.log('hành động sửa')
                fetch(urlUpdateRole, {
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
    }
    const isMobile = useSelector(state => state.isMobile.isMobile)
    return (
        <div className="popup-box">
            <div className="box"style={{
                width: isMobile && '100%'
            }}>
                <div className="conten-modal">
                    <div>
                        <div className="bg-light px-4 py-3">
                            <h4 id='tieudepop'>Thông Tin Vai Trò Truy Cập<span style={{ color: 'blue' }}>ㅤ{props.iDAction}</span></h4>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label>Tên Vai Trò {batBuocNhap}</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={dataReq.TenVaiTro}
                                        onChange={(event) => {
                                            setDataReq({
                                                ...dataReq,
                                                TenVaiTro: event.target.value
                                            });
                                        }}
                                    />
                                </div>
                                <div className="form-group"
                                    
                                >
                                    <label>Quyền: {batBuocNhap}ㅤ</label>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <input
                                            id="search"
                                            value={searchTerm} onChange={handleSearch}
                                            placeholder='Tìm Quyền'
                                            type="text"
                                            className="form-control-sm"
                                            style={{ width: '95%' }}
                                        />
                                        {
                                            searchTerm !== '' &&
                                            <button
                                                className="btn btn-close"
                                                style={{ color: 'red', marginLeft: '4px', fontSize: '0.6em' }}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setCombosQuyen2(combosQuyen)
                                                    setSearchTerm('')
                                                }}
                                            >
                                                X
                                            </button>
                                        }
                                    </div>
                                    <div style={{ maxHeight: '340px', overflow: 'auto',marginTop:'1rem' }}>
                                        {combosQuyen2.map(combo => (
                                            <div key={combo.MaQuyen} >
                                                <label >
                                                    <input
                                                        type="checkbox"
                                                        checked={
                                                            (dataReq.MaQuyen?.includes(combo.MaQuyen.toString())) || false
                                                        }
                                                        onChange={() => handleQuyenChange(combo.MaQuyen.toString())}
                                                    />
                                                    {` ${combo["MaQuyen"]} - ${combo["TenQuyen"]} - ${combo["MoTa"]}`}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <button onClick={() => { props.setPopupInsertUpdate(false) }} type="button" className="btn btn-danger mt-3" >Huỷ Bỏ</button>
                                <button
                                    onClick={handleSubmit}
                                    style={{ float: "right" }} type="button"
                                    className="btn bg-gradient-info mt-3"
                                >
                                    Xác Nhận
                                </button>
                            </form>

                        </div>
                    </div>
                </div>
            </div >
        </div >
    );
}
export default Insert_updateRole;