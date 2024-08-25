import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { getCookie } from "../Cookie";
import Combobox from "../Combobox";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle, faSearchPlus, faSearch, faAngleDown } from '@fortawesome/free-solid-svg-icons'
import SearchComBoBox from "../SearchCombobox";
import { urlGetPost, urlInsertPost, urlUpdatePost, urlGetTopic } from "../url"
import Them_suaChuDe from "./them_suaChuDe";

const Them_suaDangTin = (props) => {
    const dispatch = useDispatch()
    const [dataReq, setDataReq] = useState({});
    useEffect(() => {
        console.log('dữ liệu gửi đi: ', dataReq);
    }, [dataReq]);
    const [dataUser, setdataUser] = useState({});//
    // popup
    const [themVTTC, setThemVTTC] = useState(false);
    const [popupSearch, setPopupSearch] = useState(false);
    // combobox
    const [combosKhuVuc, setCombosKhuVuc] = useState([]);//danh sách vai trò
    //bắt buộc nhập
    const batBuocNhap = <span style={{ color: 'red' }}>*</span>;
    useEffect(() => {
        dispatch({ type: 'SET_LOADING', payload: true })
        if (props.iDAction) {
            const fetchGetTable = fetch(`${urlGetPost}?id=${props.iDAction}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'ss': getCookie('ss'),
                },
            })

            const fetchGetArea = fetch(`${urlGetTopic}?limit=10000`, {
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
                    setDataReq(data[0]);
                    //ẩn loading
                    dispatch({ type: 'SET_LOADING', payload: false })
                })
                .catch(error => {
                    console.log('err', error);
                    if (error instanceof TypeError) {
                        props.openPopupAlert('Không thể kết nối tới máy chủ. Vui lòng kiểm tra đường truyền kết nối!')
                    } else {
                        props.addNotification(error.message, 'warning', 5000)
                    }
                    dispatch({ type: 'SET_LOADING', payload: false })
                });
        } else {
            const fetchGetArea = fetch(`${urlGetTopic}?limit=10000`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'ss': getCookie('ss'),
                },
            })
            Promise.all([fetchGetArea])
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
                    setDataReq({
                        ...dataReq,
                        MaChuDe: data[0].data[0].MaChuDe,
                        MaThanhVien: props.MaThanhVien
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
            MaChuDe: selectedValue
        });
    }

    //xử lý xác nhận

    const handleSubmit = (e) => {
        e.preventDefault();
        if (dataReq.TieuDe && dataReq.NoiDung && dataReq.MaThanhVien) {
            dispatch({ type: 'SET_LOADING', payload: true })
            const formData = new FormData();
            for (const key in dataReq) {
                if (dataReq.hasOwnProperty(key)) {
                    formData.append(key, dataReq[key]);
                }
            }
            if (props.isInsert === true) {
                fetch(urlInsertPost, {
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
                        props.setdataUser({ ...props.dataUser, page: 1, sortBy: 'MaDangTin', sortOrder: 'desc' })
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
                fetch(urlUpdatePost, {
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

    // Xử lý file
    const [fileName, setFileName] = useState('');
    const [fileName2, setFileName2] = useState('');
    const [fileName3, setFileName3] = useState('');
    const [fileName4, setFileName4] = useState('');
    useEffect(() => {
        if (dataReq.Tep) {
            if (typeof dataReq.Tep === 'string') {
                setFileName(
                    dataReq.Tep
                    // <a href={dataReq.Tep} target="_blank">
                    //     {dataReq.Tep}
                    // </a>
                );
            } else {
                setFileName(dataReq.Tep.name);
            }
        }
    }, [dataReq.Tep]);

    useEffect(() => {
        if (dataReq.Tep2) {
            if (typeof dataReq.Tep2 === 'string') {
                setFileName2(
                    <a href={dataReq.Tep2} target="_blank">
                        {dataReq.Tep2}
                    </a>
                );
            } else {
                setFileName2(dataReq.Tep2.name);
            }
        }
    }, [dataReq.Tep2]);
    useEffect(() => {
        if (dataReq.Tep3) {
            if (typeof dataReq.Tep3 === 'string') {
                setFileName3(
                    <a href={dataReq.Tep3} target="_blank">
                        {dataReq.Tep3}
                    </a>
                );
            } else {
                setFileName3(dataReq.Tep3.name);
            }
        }
    }, [dataReq.Tep3]);
    useEffect(() => {
        if (dataReq.Tep4) {
            if (typeof dataReq.Tep4 === 'string') {
                setFileName4(
                    <a href={dataReq.Tep4} target="_blank">
                        {dataReq.Tep4}
                    </a>
                );
            } else {
                setFileName4(dataReq.Tep4.name);
            }
        }
    }, [dataReq.Tep4]);
    function FileUpload({ fileColumn, fn }) {
        const fileInputRef = useRef(null);
        const handleChange = (e) => {
            const file = e.target.files[0];
            if (file) {
                setDataReq({
                    ...dataReq,
                    [fileColumn]: file
                });
                //setFileNameFn(file.name);
            }
        }

        const handleChooseFile = () => {
            fileInputRef.current.click();
        }
        return (
            <div style={{ textAlign: 'center' }}>
                {
                    dataReq[fileColumn] ? (
                        <label onClick={handleChooseFile}>
                            {fn.substring(fn.lastIndexOf('/') + 1).split('-')[0] }
                        </label>
                    ) : (
                        <div onClick={handleChooseFile}>
                            Chọn file
                        </div>
                    )
                }

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleChange}
                    style={{ display: 'none' }}
                />
            </div>
        )
    }
    const [activeDropdown, setActiveDropdown] = useState(1);
    const [openDropdown, setOpenDropdown] = useState("Tệp Đính Kèm 1");
    function DropdownImage({
        fn,
        fileColumn,
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
                    <FileUpload
                        fileColumn={fileColumn}
                        fn={fn}
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
                            <h4 id='tieudepop'>Thông Tin Bài Viết<span style={{ color: 'blue' }}>ㅤ{dataReq.MaDangTin}</span></h4>
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
                                            <label>Tiêu Đề {batBuocNhap}</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={dataReq.TieuDe}
                                                onChange={(event) => {
                                                    setDataReq({
                                                        ...dataReq,
                                                        TieuDe: event.target.value
                                                    });
                                                }}
                                            />
                                        </div>

                                        {!props.isInsert && <div className="form-group">
                                            <label>Ngày Đăng</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={dataReq.NgayDang}
                                                onChange={(event) => {
                                                    setDataReq({
                                                        ...dataReq,
                                                        NgayDang: event.target.value
                                                    });
                                                }}
                                                disabled
                                            />
                                        </div>
                                        }
                                        {!props.isInsert && <div className="form-group">
                                            <label>Tên Người Đăng</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={dataReq.TenThanhVien}
                                                onChange={(event) => {
                                                    setDataReq({
                                                        ...dataReq,
                                                        TenThanhVien: event.target.value
                                                    });
                                                }}
                                                disabled
                                            />
                                        </div>
                                        }
                                        <div className="row" style={{ display: 'flex' }}>
                                            <div className="col-10" style={{ display: 'flex' }}>
                                                <Combobox
                                                    combos={combosKhuVuc}
                                                    columnValue="MaChuDe"
                                                    columnAdd="TenChuDe"
                                                    nameCombo="Chủ Đề: "
                                                    value={dataReq.MaChuDe}
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
                                            <label>Nội Dung {batBuocNhap}</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={dataReq.NoiDung}
                                                onChange={(event) => {
                                                    setDataReq({
                                                        ...dataReq,
                                                        NoiDung: event.target.value
                                                    });
                                                }}
                                            />
                                        </div>

                                    </div>
                                    <div className={`${isMobile ? 'col-12' : 'col-4 '}`}>
                                        <DropdownImage
                                            fn={fileName}
                                            fileColumn="Tep"
                                            title="Tệp Đính Kèm 1"
                                            active={activeDropdown === 1}
                                            onClick={() => {
                                                setOpenDropdown("Tệp Đính Kèm 1");
                                                setActiveDropdown(1);
                                            }}
                                        />

                                        <DropdownImage
                                            fn={fileName2}
                                            fileColumn="Tep2"
                                            title="Tệp Đính Kèm 2"
                                            active={activeDropdown === 2}
                                            onClick={() => {
                                                setOpenDropdown("Tệp Đính Kèm 2");
                                                setActiveDropdown(2);
                                            }}
                                        />
                                        <DropdownImage
                                        fn={fileName3}
                                            fileColumn="Tep3"
                                            //url={urlAnh3}
                                            title="Tệp Đính Kèm 3"
                                            active={activeDropdown === 3}
                                            onClick={() => {
                                                setOpenDropdown("Tệp Đính Kèm 3");
                                                setActiveDropdown(3);
                                            }}
                                        />
                                        <DropdownImage
                                        fn={fileName4}
                                            fileColumn="Tep4"
                                            title="Tệp Đính Kèm 4"
                                            active={activeDropdown === 4}
                                            onClick={() => {
                                                setOpenDropdown("Tệp Đính Kèm 4");
                                                setActiveDropdown(4);
                                            }}
                                        />

                                    </div>
                                </div>
                                <hr class="horizontal dark" />
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
                        <Them_suaChuDe
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
                    popupSearch && <div className="popup">
                        <SearchComBoBox
                            setPopupSearch={setPopupSearch}
                            combos={combosKhuVuc}
                            IDColumn={'MaChuDe'}
                            column={'TenChuDe'}
                            handleChange={handleKhuVucChange}
                        />
                    </div>
                }
            </div >
        </div >
    );
};
export default Them_suaDangTin;