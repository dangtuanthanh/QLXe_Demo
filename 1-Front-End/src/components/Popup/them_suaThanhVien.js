import React, { useState, useEffect, useRef } from "react";
import { useDispatch,useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { getCookie } from "../Cookie";
import Insert_updateRole from "./Insert_updateRole";
import { urlGetRole, urlInsertMember, urlGetMember, urlUpdateMember } from "../url"
import Them_suaHopDong from "./them_suaHopDong";
const Them_suaThanhVien = (props) => {
    //xử lý redux
    const dispatch = useDispatch()
    //lưu trữ dữ liệu gửi đi
    const [dataReq, setDataReq] = useState({});
    const [iDAction, setIDAction] = useState();//giá trị của id khi thực hiện sửa xoá
    useEffect(() => {
        console.log('dữ liệu gửi đi: ', dataReq);
    }, [dataReq]);
    const [dataUser, setdataUser] = useState({});//
    //xử lý hiển thị ô tài khoản, mật khẩu
    const [isChecked, setIsChecked] = useState(false);

    const [isDisabled, setIsDisabled] = useState(true);
    // combobox
    const [combosVaiTro, setCombosVaiTro] = useState([]);//danh sách vai trò
    //hiển thị popup thêm vị trí công việc và vai trò truy cập
    const [themVTTC, setThemVTTC] = useState(false);
    //bắt buộc nhập
    const batBuocNhap = <span style={{ color: 'red' }}>*</span>;
    const [resTaiKhoan, setResTaiKhoan] = useState(false);
    useEffect(() => {
        dispatch({ type: 'SET_LOADING', payload: true })
        if (props.iDAction) {
            const fetchGetAccount = fetch(`${urlGetMember}?id=${props.iDAction}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'ss': getCookie('ss'),
                },
            })

            const fetchGetRole = fetch(`${urlGetRole}?limit=10000`, {
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
                        setDataReq(data[1])
                        if (data[1].MaVaiTro.length > 0) {
                            setResTaiKhoan(true)
                            setIsChecked(true);
                            setIsDisabled(false);
                        }
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
            const fetchGetRole = fetch(`${urlGetRole}?limit=10000`, {
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
    const [DV7, setDV7] = useState(false);
    //combo vai trò
    const handleVaiTroChange = (ID) => {
        let updatedDataReq = { ...dataReq };
        let MaVaiTro = updatedDataReq.MaVaiTro;
        if (MaVaiTro.includes(ID)) {
            MaVaiTro = MaVaiTro.filter(item => item !== ID)
        } else {
            MaVaiTro.push(ID);
        }
        updatedDataReq.MaVaiTro = MaVaiTro;

        setDataReq(updatedDataReq);

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
            <div className="form-group">
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



    const handleCheckboxChange = (event) => {
        if (isDisabled === true) {//nếu đang hiện ô
            const updatedDataReq = { ...dataReq };
            if (!updatedDataReq.MaVaiTro) {
                updatedDataReq.MaVaiTro = [];
            }
            const MaVaiTro = updatedDataReq.MaVaiTro;
            MaVaiTro.push(combosVaiTro[0].MaVaiTro);
            updatedDataReq.MaVaiTro = MaVaiTro;
            setDataReq(updatedDataReq);
        } else {
            const inputElement2 = document.getElementById('passwordInput');

            if (inputElement2) {
                inputElement2.value = '';
            }
            const updatedDataReq = { ...dataReq };
            delete updatedDataReq.MaVaiTro;
            delete updatedDataReq.MatKhau;

            setDataReq(updatedDataReq);
        }
        setIsChecked(!isChecked);
        setIsDisabled(!event.target.checked);
    };
    const labelStyle = isDisabled ? { color: 'Silver' } : {};

    //xử lý xác nhận
    function handleFetchAPISubmit() {
        dispatch({ type: 'SET_LOADING', payload: true })
        const formData = new FormData();
        for (const key in dataReq) {
            if (dataReq.hasOwnProperty(key)) {
                formData.append(key, dataReq[key]);
            }
        }
        if (props.isInsert === true) {
            console.log('hành động thêm');
            fetch(urlInsertMember, {
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
                    props.setPopup1(false)
                    props.setdataUser({ ...props.dataUser, page: 1, sortBy: 'MaThanhVien', sortOrder: 'desc' })
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
            fetch(urlUpdateMember, {
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
                    props.setPopup1(false)
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
    const handleSubmit = (e) => {
        e.preventDefault();
        if (isChecked === true) {
            if (props.isInsert) {
                //trường hợp check và thêm
                if (!dataReq.MatKhau
                    || !dataReq.MaVaiTro
                    || !dataReq.Email
                    || !dataReq.MaVaiTro.length
                    || !dataReq.TenThanhVien
                ) props.openPopupAlert('Vui lòng nhập đầy đủ thông tin. Các trường có dấu * là bắt buộc nhập')
                else handleFetchAPISubmit();
                //check và sửa
            } else if (!dataReq.MaVaiTro
                || !dataReq.MaVaiTro.length
                || !dataReq.TenThanhVien
                || !dataReq.Email
                || !dataReq.MaThanhVien
            ) props.openPopupAlert('Vui lòng nhập đầy đủ thông tin. Các trường có dấu * là bắt buộc nhập')
            else handleFetchAPISubmit();
        } else if (!dataReq.TenThanhVien) {
            props.openPopupAlert('Vui lòng nhập đầy đủ thông tin. Các trường có dấu * là bắt buộc nhập')
        }
        else {
            handleFetchAPISubmit();
        }
    };
    const Dropdown = ({
        title,
        items,
        onItemClick
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

                                <th style={{ textAlign: 'center', padding: 8 }} class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10">Mã HĐ </th>

                                <th style={{ textAlign: 'center', padding: 8 }} class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10">Ngày</th>

                                <th style={{ textAlign: 'center', padding: 8 }} class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10">Ngày Hết Hạn</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items?.map((dulieu, index) =>
                                <tr style={{ 'textAlign': 'center' }} id='trdata' key={index} onClick={() => {
                                    onItemClick(dulieu)
                                }} >

                                    <td>{dulieu.SoHopDong}</td>
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
    const handleDropdownItemClickHopDong = item => {
        setIDAction(item.MaHopDong)
        setDV7(true)
    };
    const isMobile = useSelector(state => state.isMobile.isMobile)
    return (
        <div className="popup-box" >
            <div className="box" style={{
                width: isMobile && '100%'
            }}>
                <div className="conten-modal" >
                    <div>
                        <div className="bg-light px-4 py-3" >
                            <h4 id='tieudepop'>Thông Tin Thành Viên<span style={{ color: 'blue' }}>ㅤ{props.iDAction}</span></h4>
                            <form onSubmit={handleSubmit}
                                style={{
                                    maxHeight:  isMobile ? '74vh':'530px',
                                    overflow: 'auto',
                                    overflowX: 'hidden'
                                }}
                            >
                                {/* <div className="form-group">
                                    <label>Mã Nhân Viên</label>
                                    <input
                                        id="editSoHD"
                                        type="text"
                                        className="form-control"
                                        readOnly
                                        style={{ opacity: 0.5, cursor: "not-allowed" }}
                                        value=''
                                    />
                                </div> */}
                                <div className={`${isMobile ? 'flex-column' : 'row'}`}>
                                    <div className={`${isMobile ? 'col-12' : 'col-6 '}`}>
                                        <div className="form-group">
                                            <label>Tên Thành Viên {batBuocNhap}</label>
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
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Email {isChecked && <span style={{ color: 'red' }}>*</span>}</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                onChange={(event) => {
                                                    setDataReq({
                                                        ...dataReq,
                                                        Email: event.target.value
                                                    });
                                                }}
                                                value={dataReq.Email}
                                                //readOnly={props.isInsert ? false : true}
                                                disabled={props.isInsert ? false : true}
                                            //  defaultValue='' 
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Địa Chỉ</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={dataReq.DiaChi}
                                                onChange={(event) => {
                                                    setDataReq({
                                                        ...dataReq,
                                                        DiaChi: event.target.value
                                                    });
                                                }}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Số Điện Thoại</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={dataReq.SoDienThoai}
                                                onChange={(event) => {
                                                    setDataReq({
                                                        ...dataReq,
                                                        SoDienThoai: event.target.value
                                                    });
                                                }}
                                            />
                                        </div>
                                        {!props.isInsert &&<Dropdown
                                            title="Xem Hợp Đồng"
                                            items={dataReq.HopDong}
                                            onItemClick={handleDropdownItemClickHopDong}
                                        />}
                                    </div>
                                    <div className={` ${isMobile ? 'col-12' : 'col-6'}`}>
                                        <ImageUpload />
                                        <div className="form-group">
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    onChange={handleCheckboxChange}
                                                    checked={isChecked}
                                                />
                                                ㅤCho Phép Truy Cập Ứng Dụng Quản Lý
                                            </label>
                                        </div>
                                        <label style={{
                                            ...labelStyle,
                                            display: 'flex',
                                            alignItems: 'center'
                                        }}>

                                            Vai Trò Truy Cập:

                                            <div
                                                style={{
                                                    marginLeft: '10px'
                                                }}
                                                onClick={() => setThemVTTC(true)}
                                            >
                                                <FontAwesomeIcon icon={faPlusCircle} />
                                            </div>

                                            {isChecked && <span style={{ color: 'red' }}>*</span>}

                                        </label>
                                        <div className="form-group"
                                            style={{ maxHeight: '90px', overflow: 'auto' }}
                                        >

                                            {combosVaiTro.map(combo => (
                                                <div key={combo.MaVaiTro} >
                                                    <label style={labelStyle}>
                                                        <input
                                                            disabled={isDisabled}
                                                            type="checkbox"
                                                            checked={
                                                                (dataReq.MaVaiTro?.includes(combo.MaVaiTro)) || false
                                                            }
                                                            onChange={() => handleVaiTroChange(combo.MaVaiTro)}
                                                        />
                                                        {` ${combo["MaVaiTro"]} - ${combo["TenVaiTro"]}`}
                                                    </label>
                                                </div>
                                            ))}

                                            {/* <select
                                                className="form-select-sm"
                                                value={dataReq.IDVaiTro}
                                                onChange={handleVaiTroChange}
                                                disabled={isDisabled}
                                                multiple
                                                style={{ maxHeight: '100px', overflow: 'auto' }}
                                            >
                                                {combosVaiTro.map((combo) => (
                                                    <option key={combo["IDVaiTro"]} value={combo["IDVaiTro"]}>
                                                        {`${combo["IDVaiTro"]} - ${combo["TenVaiTro"]}`}
                                                    </option>
                                                ))}
                                            </select> */}

                                        </div>

                                        {/* <Combobox
                                            combos={combosVaiTro}
                                            columnValue="IDVaiTro"
                                            columnAdd="TenVaiTro"
                                            nameCombo="Vai Trò Truy Cập: "
                                            //defaultValue=''
                                            value={dataReq.IDVaiTro}
                                            onChange={handleVaiTroChange}
                                            labelStyle={labelStyle}
                                            disabled={isDisabled}
                                            batBuocNhap={isChecked && <span style={{ color: 'red' }}>*</span>}
                                            multiple={true}
                                            onReset={resetVaiTro}
                                        /> */}
                                        {/* <Multiselect
                                            name="Vai Trò Truy Cập"
                                            data={combosVaiTro}
                                            onChange={handleVaiTroChange}
                                        /> */}


                                        {(props.isInsert || (props.isInsert === false && resTaiKhoan === false)) && (
                                            <div className="form-group">
                                                <label style={labelStyle}>Mật Khẩu {isChecked && <span style={{ color: 'red' }}>*</span>}</label>
                                                <input
                                                    id="passwordInput"
                                                    type="text"
                                                    className="form-control"
                                                    onChange={(event) => {
                                                        setDataReq({
                                                            ...dataReq,
                                                            MatKhau: event.target.value
                                                        });
                                                    }}
                                                    value={dataReq.MatKhau}
                                                    disabled={isDisabled}
                                                />
                                            </div>
                                        )}


                                        {props.isInsert === false && resTaiKhoan === true && (<div className="form-group"
                                            style={{ display: 'flex', flexDirection: 'column' }}
                                        >
                                            <label style={labelStyle}>
                                                <input
                                                    type="checkbox"
                                                    value='1234'
                                                    checked={dataReq.MatKhau === '1234'}
                                                    onChange={(event) => {
                                                        if (dataReq.MatKhau === '1234') {
                                                            const updatedDataReq = { ...dataReq };
                                                            delete updatedDataReq.MatKhau;
                                                            setDataReq(updatedDataReq);
                                                        } else
                                                            setDataReq({
                                                                ...dataReq,
                                                                MatKhau: event.target.value
                                                            });
                                                    }}
                                                />
                                                ㅤĐặt lại mật khẩu mặc định: 1234
                                            </label>
                                        </div>
                                        )}
                                    </div>
                                </div>

                            </form>
                            <div>
                                <button onClick={() => { props.setPopup1(false) }} type="button" className="btn btn-danger mt-3" >Huỷ Bỏ</button>
                                <button
                                    onClick={handleSubmit}
                                    style={{ float: "right" }} type="button"
                                    className="btn bg-gradient-info mt-3"
                                >
                                    Xác Nhận
                                </button>
                            </div>
                            {
                                themVTTC && <div className="popup">
                                    <Insert_updateRole
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
                        </div>
                    </div>
                </div>
            </div >
        </div >
    );
};

export default Them_suaThanhVien;