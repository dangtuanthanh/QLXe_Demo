import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil, faTrash, faCheck, faBan } from '@fortawesome/free-solid-svg-icons'
const TableHopDong = (props) => {
    const [isAsc, setIsAsc] = useState(false);//trạng thái sắp xếp tăng dần
    //hàm sắp xếp
    const handleClickSort = (value) => {//Xử lý click cột sắp xếp
        if (isAsc) {
            props.setdataUser({ ...props.dataUser, sortBy: value, sortOrder: 'asc',page:1 })
            setIsAsc(false)
            if (value === 'NgayLamHopDong' || value === 'NgayHetHanHopDong')
                props.addNotification(`Sắp xếp cũ nhất tới mới nhất theo ${value}`, 'success', 3000)
            else
                props.addNotification(`Sắp xếp tăng dần theo ${value}`, 'success', 3000)
        } else {
            props.setdataUser({ ...props.dataUser, sortBy: value, sortOrder: 'desc',page:1 })
            setIsAsc(true)
            if (value === 'NgayLamHopDong' || value === 'NgayHetHanHopDong')
                props.addNotification(`Sắp xếp mới nhất đến cũ nhất theo ${value}`, 'success', 3000)
            else
                props.addNotification(`Sắp xếp giảm dần theo ${value}`, 'success', 3000)
        }


    };

    //hết xử lý Sửa hàng loạt

    return (
        <table id="thanhvien" class="table align-items-center mb-0">
            <thead>
                <tr >
                    {/* <th style={{ padding: 8, textAlign:'center'}} onClick={() => handleClickSort('MaHopDong')} class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10">Mã Nhóm Loại Xe</th> */}
                    <th style={{ textAlign: 'center',padding: 8 }} onClick={() => handleClickSort('SoHopDong')} class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10">Mã Hợp Đồng </th>
                    <th style={{padding: 8 }} onClick={() => handleClickSort('TenThanhVien')} class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10">Tên Người Ký</th>
                    <th style={{ textAlign: 'center', padding: 8 }} onClick={() => handleClickSort('NgayLamHopDong')} class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10">Ngày</th>
                    <th style={{ textAlign: 'center', padding: 8 }} onClick={() => handleClickSort('NgayHetHanHopDong')} class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10">Ngày Hết Hạn </th>
                    <th style={{ textAlign: 'center', padding: 8 }} class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10">Trạng Thái </th>
                    <th style={{ textAlign: 'center', padding: 8 }} onClick={() => handleClickSort('TongTien')} class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10">Tổng Tiền</th>
                    <th style={{ padding: 8 }} onClick={() => handleClickSort('GhiChu')} class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10">Ghi Chú</th>
                    <th style={{ textAlign: 'center', padding: 8 }} class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10 ps-2">Hành Động</th>
                </tr>
            </thead>
            <tbody>
                {
                    props.duLieuHienThi.map((dulieu, index) => 
                        //<div  onClick={() => handleRowClick(thanhvien)}>
                        <tr style={{ 'textAlign': 'center', backgroundColor: dulieu.SapHetHan ? 'rgb(255 246 207)' : dulieu.HetHan ?'#fff7f7':  null  }} id='trdata' key={index} onClick={() => {
                            props.setIsInsert(false)
                            props.setIDAction(dulieu.MaHopDong)
                            props.setPopupInsertUpdate(true)
                        }} >
                            {/* <td >{dulieu.MaHopDong}</td> */}
                            <td>{dulieu.SoHopDong}</td>
                            <td style={{ textAlign: 'left' }}>
                                {
                                    dulieu.TenThanhVien ?
                                        dulieu.TenThanhVien.length > 25 ?
                                            dulieu.TenThanhVien.slice(0, 25) + '...' :
                                            dulieu.TenThanhVien
                                        : ''
                                }
                            </td>
                            <td >{dulieu.NgayLamHopDong}</td>
                            <td >{dulieu.NgayHetHanHopDong}</td>
                            <td >{dulieu.HetHan ? 'Hết Hạn':dulieu.SapHetHan ? 'Sắp Hết Hạn' : 'Còn Hạn'}</td>
                            <td > {new Intl.NumberFormat('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND'
                                }).format(dulieu.TongTien)}</td>
                           <td style={{ textAlign: 'left' }}>
                                {
                                    dulieu.GhiChu ?
                                        dulieu.GhiChu.length > 15 ?
                                            dulieu.GhiChu.slice(0, 15) + '...' :
                                            dulieu.GhiChu
                                        : ''
                                }
                            </td>
                            <td>
                                <a onClick={(e) => {
                                    e.stopPropagation();
                                    props.setIsInsert(false)
                                    props.setIDAction(dulieu.MaHopDong)
                                    props.setPopupInsertUpdate(true)
                                }}>
                                    <i class="fas fa-pencil-alt text-dark me-2" aria-hidden="true" />
                                    < FontAwesomeIcon icon={faPencil} />
                                    {/* < FontAwesomeIcon icon={faPencil}style={{color:'cb0c9f'}} /> */}
                                </a>
                                ㅤ
                                <a onClick={(e) => {
                                    e.stopPropagation(); props.openPopupAlert(
                                        `Bạn có chắc chắn muốn xoá ${dulieu.MaHopDong}`,
                                        () => { props.deleteData(dulieu.MaHopDong) }
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

export default TableHopDong;