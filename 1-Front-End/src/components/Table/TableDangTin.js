import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil, faTrash} from '@fortawesome/free-solid-svg-icons'
const TableDangTin = (props) => {
    const [isAsc, setIsAsc] = useState(false);//trạng thái sắp xếp tăng dần
    //hàm sắp xếp
    const handleClickSort = (value) => {//Xử lý click cột sắp xếp
        if (isAsc) {
            props.setdataUser({ ...props.dataUser, sortBy: value, sortOrder: 'asc',page:1 })
            setIsAsc(false)
            if (value === 'NgayDang')
                props.addNotification(`Sắp xếp cũ nhất tới mới nhất theo ${value}`, 'success', 3000)
            else
                props.addNotification(`Sắp xếp tăng dần theo ${value}`, 'success', 3000)
        } else {
            props.setdataUser({ ...props.dataUser, sortBy: value, sortOrder: 'desc',page:1 })
            setIsAsc(true)
            if (value === 'NgayDang')
                props.addNotification(`Sắp xếp mới nhất đến cũ nhất theo ${value}`, 'success', 3000)
            else
                props.addNotification(`Sắp xếp giảm dần theo ${value}`, 'success', 3000)
        }


    };



    //xử lý Sửa hàng loạt

    const [selectAll, setSelectAll] = useState(false);
    //dùng để reset ô selectAll khi thực hiện tìm kiếm hoặc sắp xếp
    useEffect(() => {
        setSelectAll(false)
    }, [props.duLieuHienThi]);
// dùng để reset khi bấm nút quay lại
    useEffect(() => {
        if (props.selectedIds.length == 0) {
            const checkboDangTins = document.querySelectorAll('.checkboxCon');
            checkboDangTins.forEach(checkbox => {
                checkbox.checked = false;
            });
            setSelectAll(false);
        }
    }, [props.selectedIds]);
    //Kiểm tra ô sửa hàng loạt
    function handleSelectAllChange(event) {
        const isChecked = event.target.checked;
        if (isChecked) {
            //lấy các class để tạo hành động check toàn bộ
            const checkboDangTins = document.querySelectorAll('.checkboxCon');
            checkboDangTins.forEach(checkbox => {
                checkbox.checked = true;
            });
            //$(".checkboxCon").prop("checked", true);
            const allIds = props.duLieuHienThi.map((item) => item.MaDangTin.toString());
            console.log("allIds:", allIds); // Kiểm tra danh sách các id đã chọn
            props.setSelectedIds(allIds);
            setSelectAll(true);
        } else {
            //$(".checkboxCon").prop("checked", false);
            const checkboDangTins = document.querySelectorAll('.checkboxCon');
            checkboDangTins.forEach(checkbox => {
                checkbox.checked = false;
            });
            props.setSelectedIds([]);
            setSelectAll(false);
        }
    }

    //kiểm tra ô checkbox được check
    function handleCheckboxChange(event) {
        // togglePopup5(); //bật popup sửa hàng loạt
        const id = event.target.value;
        const isChecked = event.target.checked;

        let newSelectedIds;
        if (isChecked) {
            newSelectedIds = [...props.selectedIds, id];
        } else {
            newSelectedIds = props.selectedIds.filter((selectedId) => selectedId !== id);
            setSelectAll(false);
        }

        console.log("newSelectedIds:", newSelectedIds); // Kiểm tra mảng selectedIds mới
        props.setSelectedIds(newSelectedIds);

        const allChecked = newSelectedIds.length === props.duLieuHienThi.length;
        console.log("allChecked:", allChecked); // Kiểm tra trạng thái của checkbox "Chọn tất cả"
        setSelectAll(allChecked);

    }
    //hết xử lý Sửa hàng loạt

    return (
        <table class="table align-items-center mb-0">
            <thead>
                <tr >
                    <th style={{ textAlign: 'center' }}><input
                        type="checkbox"
                        checked={selectAll}
                        onChange={handleSelectAllChange}
                    /></th>
                    {/* <th style={{ padding: 8, textAlign:'center'}} onClick={() => handleClickSort('MaDangTin')} class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10">Mã Nhóm Loại DangTin</th> */}
                    <th style={{ padding: 8 }} onClick={() => handleClickSort('TenChuDe')} class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10">Chủ Đề</th>
                    <th style={{ padding: 8 }} onClick={() => handleClickSort('TieuDe')} class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10">Tiêu Đề</th>
                    <th style={{ padding: 8 }} onClick={() => handleClickSort('NoiDung')} class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10">Nội Dung</th>
                    <th style={{ textAlign: 'center',padding: 8 }} onClick={() => handleClickSort('NgayDang')} class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10">Ngày Đăng</th>
                    <th style={{ padding: 8 }} onClick={() => handleClickSort('TenThanhVien')} class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10">Người Đăng </th>
                    <th style={{ textAlign: 'center', padding: 8 }} class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10 ps-2">Hành Động</th>
                </tr>
            </thead>
            <tbody>
                {
                    props.duLieuHienThi.map((dulieu, index) =>
                        //<div  onClick={() => handleRowClick(thanhvien)}>
                        <tr style={{ 'textAlign': 'center' }} id='trdata' key={dulieu.MaDangTin} onClick={() => {
                            props.setIsInsert(false)
                            props.setIDAction(dulieu.MaDangTin)
                            props.setPopupInsertUpdate(true)
                        }} >
                            <td >
                                <input
                                    type="checkbox"
                                    value={dulieu.MaDangTin}
                                    className='checkboxCon'
                                    checked={props.selectedIds.includes(dulieu.MaDangTin.toString())}
                                    onClick={(e) => e.stopPropagation()}
                                    onChange={handleCheckboxChange}
                                />

                            </td>
                            {/* <td >{dulieu.MaDangTin}</td> */}
                            <td style={{ textAlign: 'left' }}>
                                {
                                    dulieu.TenChuDe ?
                                        dulieu.TenChuDe.length > 20 ?
                                            dulieu.TenChuDe.slice(0, 20) + '...' :
                                            dulieu.TenChuDe
                                        : ''
                                }
                            </td>
                            <td style={{ textAlign: 'left' }}>
                                {
                                    dulieu.TieuDe ?
                                        dulieu.TieuDe.length > 25 ?
                                            dulieu.TieuDe.slice(0, 25) + '...' :
                                            dulieu.TieuDe
                                        : ''
                                }
                            </td>
                            <td style={{ textAlign: 'left' }}>
                                {
                                    dulieu.NoiDung ?
                                        dulieu.NoiDung.length > 30 ?
                                            dulieu.NoiDung.slice(0, 30) + '...' :
                                            dulieu.NoiDung
                                        : ''
                                }
                            </td>
                            <td >{dulieu.NgayDang}</td>
                            <td style={{ textAlign: 'left' }}>
                                {
                                    dulieu.TenThanhVien ?
                                        dulieu.TenThanhVien.length > 25 ?
                                            dulieu.TenThanhVien.slice(0, 25) + '...' :
                                            dulieu.TenThanhVien
                                        : ''
                                }
                            </td>
                            
                            <td>
                                <a onClick={(e) => {
                                    e.stopPropagation();
                                    props.setIsInsert(false)
                                    props.setIDAction(dulieu.MaDangTin)
                                    props.setPopupInsertUpdate(true)
                                }}>
                                    <i class="fas fa-pencil-alt text-dark me-2" aria-hidden="true" />
                                    < FontAwesomeIcon icon={faPencil} />
                                    {/* < FontAwesomeIcon icon={faPencil}style={{color:'cb0c9f'}} /> */}
                                </a>
                                ㅤ
                                <a onClick={(e) => {
                                    e.stopPropagation(); props.openPopupAlert(
                                        `Bạn có chắc chắn muốn xoá ${dulieu.TieuDe}`,
                                        () => { props.deleteData(dulieu.MaDangTin) }
                                    )
                                }} class='btnEdit'><FontAwesomeIcon icon={faTrash} /></a>

                            </td>

                        </tr>
                        //</div>
                    )
                }
            </tbody>
        </table>
    )
};

export default TableDangTin;