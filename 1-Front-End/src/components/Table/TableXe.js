import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil, faTrash} from '@fortawesome/free-solid-svg-icons'
const TableXe = (props) => {
    const [isAsc, setIsAsc] = useState(false);//trạng thái sắp xếp tăng dần
    //hàm sắp xếp
    const handleClickSort = (value) => {//Xử lý click cột sắp xếp
        if (isAsc) {
            props.setdataUser({ ...props.dataUser, sortBy: value, sortOrder: 'asc',page:1 })
            setIsAsc(false)
            if (value === 'NamSanXuat' || value === 'NgayMua')
                props.addNotification(`Sắp xếp cũ nhất tới mới nhất theo ${value}`, 'success', 3000)
            else
                props.addNotification(`Sắp xếp tăng dần theo ${value}`, 'success', 3000)
        } else {
            props.setdataUser({ ...props.dataUser, sortBy: value, sortOrder: 'desc',page:1 })
            setIsAsc(true)
            if (value === 'NamSanXuat' || value === 'NgayMua')
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
            const checkboxes = document.querySelectorAll('.checkboxCon');
            checkboxes.forEach(checkbox => {
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
            const checkboxes = document.querySelectorAll('.checkboxCon');
            checkboxes.forEach(checkbox => {
                checkbox.checked = true;
            });
            //$(".checkboxCon").prop("checked", true);
            const allIds = props.duLieuHienThi.map((item) => item.MaXe.toString());
            console.log("allIds:", allIds); // Kiểm tra danh sách các id đã chọn
            props.setSelectedIds(allIds);
            setSelectAll(true);
        } else {
            //$(".checkboxCon").prop("checked", false);
            const checkboxes = document.querySelectorAll('.checkboxCon');
            checkboxes.forEach(checkbox => {
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
        props.setSelectedIds(newSelectedIds);

        const allChecked = newSelectedIds.length === props.duLieuHienThi.length;
        console.log("allChecked:", allChecked); // Kiểm tra trạng thái của checkbox "Chọn tất cả"
        setSelectAll(allChecked);

    }
    //hết xử lý Sửa hàng loạt

    return (
        <table id="thanhvien" class="table align-items-center mb-0">
            <thead>
                <tr >
                    <th style={{ textAlign: 'center' }}><input
                        type="checkbox"
                        checked={selectAll}
                        onChange={handleSelectAllChange}
                    /></th>
                    {/* <th style={{ padding: 8, textAlign:'center'}} onClick={() => handleClickSort('MaXe')} class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10">Mã Nhóm Loại Xe</th> */}
                    <th style={{ padding: 8 }} onClick={() => handleClickSort('BienSoXe')} class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10">Biển Số Xe </th>
                    <th style={{ padding: 8 }} onClick={() => handleClickSort('NhanHieu')} class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10">Nhãn Hiệu</th>
                    <th style={{ textAlign: 'center',padding: 8 }} onClick={() => handleClickSort('NgayMua')} class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10">Ngày Mua</th>
                    <th style={{ padding: 8 }} onClick={() => handleClickSort('Mau')} class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10">Màu </th>
                    {/* <th style={{ padding: 8 }} onClick={() => handleClickSort('LinhKien')} class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10">Linh Kiện</th> */}
                    <th style={{ padding: 8 }} onClick={() => handleClickSort('TenLoaiXe')} class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10">Loại Xe</th>
                    <th style={{ padding: 8 }} onClick={() => handleClickSort('TenNhomLoaiXe')} class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10">Nhóm Loại Xe</th>
                    <th style={{ padding: 8 }} onClick={() => handleClickSort('MoTaTinhTrangXe')} class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10">Tình Trạng</th>
                    <th style={{ textAlign: 'center', padding: 8 }} class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10 ps-2">Hành Động</th>
                </tr>
            </thead>
            <tbody>
                {
                    props.duLieuHienThi.map((dulieu, index) =>
                        //<div  onClick={() => handleRowClick(thanhvien)}>
                        <tr style={{ 'textAlign': 'center' }} id='trdata' key={dulieu.MaXe} onClick={() => {
                            props.setIsInsert(false)
                            props.setIDAction(dulieu.MaXe)
                            props.setPopupInsertUpdate(true)
                        }} >
                            <td >
                                <input
                                    type="checkbox"
                                    value={dulieu.MaXe}
                                    className='checkboxCon'
                                    checked={props.selectedIds.includes(dulieu.MaXe.toString())}
                                    onClick={(e) => e.stopPropagation()}
                                    onChange={handleCheckboxChange}
                                />

                            </td>
                            {/* <td >{dulieu.MaXe}</td> */}
                            <td style={{ textAlign: 'left' }}>
                                {
                                    dulieu.BienSoXe ?
                                        dulieu.BienSoXe.length > 10 ?
                                            dulieu.BienSoXe.slice(0, 10) + '...' :
                                            dulieu.BienSoXe
                                        : ''
                                }
                            </td>
                            <td style={{ textAlign: 'left' }} >{dulieu.NhanHieu}</td>
                            <td >{dulieu.NgayMua}</td>
                            <td style={{ textAlign: 'left' }} >{dulieu.Mau}</td>
                            {/* <td style={{ textAlign: 'left' }}>
                                {
                                    dulieu.LinhKien ?
                                        dulieu.LinhKien.length > 35 ?
                                            dulieu.LinhKien.slice(0, 35) + '...' :
                                            dulieu.LinhKien
                                        : ''
                                }
                            </td> */}
                            <td style={{ textAlign: 'left' }}>
                                {
                                    dulieu.TenLoaiXe ?
                                        dulieu.TenLoaiXe.length > 15 ?
                                            dulieu.TenLoaiXe.slice(0, 15) + '...' :
                                            dulieu.TenLoaiXe
                                        : ''
                                }
                            </td>
                            <td style={{ textAlign: 'left' }}>
                                {
                                    dulieu.TenNhomLoaiXe ?
                                        dulieu.TenNhomLoaiXe.length > 15 ?
                                            dulieu.TenNhomLoaiXe.slice(0, 15) + '...' :
                                            dulieu.TenNhomLoaiXe
                                        : ''
                                }
                            </td>
                            <td style={{ textAlign: 'left' }}>
                                {
                                    dulieu.MoTaTinhTrangXe ?
                                        dulieu.MoTaTinhTrangXe.length > 20 ?
                                            dulieu.MoTaTinhTrangXe.slice(0, 20) + '...' :
                                            dulieu.MoTaTinhTrangXe
                                        : ''
                                }
                            </td>
                            {/* <td style={{ padding: '0' }}>
                                <img
                                    height={'35px'}
                                    src={dulieu.HinhAnh}></img>
                            </td> */}
                            <td>
                                <a onClick={(e) => {
                                    e.stopPropagation();
                                    props.setIsInsert(false)
                                    props.setIDAction(dulieu.MaXe)
                                    props.setPopupInsertUpdate(true)
                                }}>
                                    <i class="fas fa-pencil-alt text-dark me-2" aria-hidden="true" />
                                    < FontAwesomeIcon icon={faPencil} />
                                    {/* < FontAwesomeIcon icon={faPencil}style={{color:'cb0c9f'}} /> */}
                                </a>
                                ㅤ
                                <a onClick={(e) => {
                                    e.stopPropagation(); props.openPopupAlert(
                                        `Bạn có chắc chắn muốn xoá ${dulieu.BienSoXe}`,
                                        () => { props.deleteData(dulieu.MaXe) }
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

export default TableXe;