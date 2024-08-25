import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil, faTrash, faCheck, faBan } from '@fortawesome/free-solid-svg-icons'
const TableBaoDuong = (props) => {
    const [isAsc, setIsAsc] = useState(false);//trạng thái sắp xếp tăng dần
    //hàm sắp xếp
    const handleClickSort = (value) => {//Xử lý click cột sắp xếp
        if (isAsc) {
            props.setdataUser({ ...props.dataUser, sortBy: value, sortOrder: 'asc',page:1 })
            setIsAsc(false)
            if (value === 'NgayBaoDuong' || value === 'NgayBaoDuongTiepTheo')
                props.addNotification(`Sắp xếp cũ nhất tới mới nhất theo ${value}`, 'success', 3000)
            else
                props.addNotification(`Sắp xếp tăng dần theo ${value}`, 'success', 3000)
        } else {
            props.setdataUser({ ...props.dataUser, sortBy: value, sortOrder: 'desc',page:1 })
            setIsAsc(true)
            if (value === 'NgayBaoDuong' || value === 'NgayBaoDuongTiepTheo')
                props.addNotification(`Sắp xếp mới nhất đến cũ nhất theo ${value}`, 'success', 3000)
            else
                props.addNotification(`Sắp xếp giảm dần theo ${value}`, 'success', 3000)
        }


    };
    return (
        <table class="table align-items-center mb-0">
            <thead>
                <tr >
                    {/* <th style={{ padding: 8, textAlign:'center'}} onClick={() => handleClickSort('MaXe')} class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10">Mã Nhóm Loại Xe</th> */}
                    <th style={{ textAlign: 'center',padding: 8 }} onClick={() => handleClickSort('BienSoXe')} class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10">Biển Số Xe </th>
                    <th style={{ textAlign: 'center',padding: 8 }} onClick={() => handleClickSort('LanBaoDuong')} class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10">Lần Bảo Dưỡng</th>

                    <th style={{ padding: 8 }} onClick={() => handleClickSort('TenHangMuc')} class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10">Hạng Mục</th>

                    <th style={{ textAlign: 'center', padding: 8 }} onClick={() => handleClickSort('NgayBaoDuong')} class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10">Ngày Bảo Dưỡng</th>
                    <th style={{ textAlign: 'center', padding: 8 }} onClick={() => handleClickSort('NgayBaoDuongTiepTheo')} class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10">Ngày Tiếp Theo </th>

                    <th style={{ padding: 8 }} onClick={() => handleClickSort('NguoiDiBaoDuong')} class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10">Người Đi Bảo Dưỡng</th>
                    <th style={{ textAlign: 'center', padding: 8 }} class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10">Trạng Thái</th>
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
                            props.setIDAction(dulieu.MaXe)
                            props.setIDAction2(dulieu.LanBaoDuong)
                            props.setIDAction3(dulieu.BienSoXe)
                            props.setPopupInsertUpdate(true)
                        }} >
                            {/* <td >{dulieu.MaXe}</td> */}
                            <td>{dulieu.BienSoXe}</td>
                            <td >{dulieu.LanBaoDuong}</td>
                            <td style={{ textAlign: 'left' }}>
                                {
                                    dulieu.TenHangMuc ?
                                        dulieu.TenHangMuc.length > 15 ?
                                            dulieu.TenHangMuc.slice(0, 15) + '...' :
                                            dulieu.TenHangMuc
                                        : ''
                                }
                            </td>
                            <td >{dulieu.NgayBaoDuong}</td>
                            <td >{dulieu.NgayBaoDuongTiepTheo}</td>
                            <td style={{ textAlign: 'left' }}>
                                {
                                    dulieu.NguoiDiBaoDuong ?
                                        dulieu.NguoiDiBaoDuong.length > 10 ?
                                            dulieu.NguoiDiBaoDuong.slice(0, 10) + '...' :
                                            dulieu.NguoiDiBaoDuong
                                        : ''
                                }
                            </td>
                            <td >{dulieu.HetHan ? 'Hết Hạn':dulieu.SapHetHan ? 'Sắp Hết Hạn' : 'Còn Hạn'}</td>
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
                                    props.setIDAction(dulieu.MaXe)
                                    props.setIDAction2(dulieu.LanBaoDuong)
                                    props.setIDAction3(dulieu.BienSoXe)
                                    props.setPopupInsertUpdate(true)
                                }}>
                                    <i class="fas fa-pencil-alt text-dark me-2" aria-hidden="true" />
                                    < FontAwesomeIcon icon={faPencil} />
                                    {/* < FontAwesomeIcon icon={faPencil}style={{color:'cb0c9f'}} /> */}
                                </a>
                                ㅤ
                                <a onClick={(e) => {
                                    e.stopPropagation(); props.openPopupAlert(
                                        `Bạn có chắc chắn muốn xoá ${dulieu.BienSoXe} lần ${dulieu.LanBaoDuong}`,
                                        () => { props.deleteData(dulieu.MaXe, dulieu.LanBaoDuong) }
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

export default TableBaoDuong;