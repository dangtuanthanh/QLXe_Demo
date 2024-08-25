import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFastBackward,faStepBackward,faStepForward,faFastForward} from '@fortawesome/free-solid-svg-icons'
const Pagination = (props) => {
    const [buttons, setButtons] = useState([]);//Nút phân trang
    //hàm ngắt trang
    const handleClickButtonPage = (value) => {//chuyển trang
        props.setdataUser({ ...props.dataUser, page: value });//đặt số trang
    };

    useEffect(() => {
        // Render lại khi props thay đổi
        handlePagination() 
      }, [props]);

    const handlePagination = () => {
        if (props.dataRes.totalItems !== 0) {
            const pageNumbers = [];
            const visiblePageCount = 1; // Số lượng trang hiển thị bên trái và bên phải của trang hiện tại
            const ellipsis = '...';
    
            // Trang đầu tiên
            if (props.dataRes.currentPage !== 1) {
                pageNumbers.push(
                    <li key="first" className={'page-item'}>
                        <button className="page-link" onClick={() => handleClickButtonPage(1)}>
                        <FontAwesomeIcon icon={faFastBackward} />
                        </button>
                    </li>
                );
            }
    
    
            // Trang trước
            if (props.dataRes.currentPage !== 1) {
                pageNumbers.push(
                    <li key="prev" className={'page-item'}>
                        <button className="page-link" onClick={() => handleClickButtonPage(props.dataRes.currentPage - 1)}>
                        <FontAwesomeIcon icon={faStepBackward} />
                        </button>
                    </li>
                );
            }
    
    
            // Các trang hiển thị bên trái của trang hiện tại
            for (let i = props.dataRes.currentPage - visiblePageCount; i < props.dataRes.currentPage; i++) {
                if (i > 0) {
                    pageNumbers.push(
                        <li key={i} className="page-item">
                            <button className="page-link" onClick={() => handleClickButtonPage(i)}>
                                {i}
                            </button>
                        </li>
                    );
                }
            }
    
            // Trang hiện tại
            pageNumbers.push(
                <li key={props.dataRes.currentPage} className="page-item active">
                    <button style={{ color: 'white',backgroundColor:'#17c1e8',border:'none' }} className="page-link">{props.dataRes.currentPage}</button>
                </li>
            );
    
            // Các trang hiển thị bên phải của trang hiện tại
            for (let i = props.dataRes.currentPage + 1; i <= props.dataRes.currentPage + visiblePageCount; i++) {
                if (i <= props.dataRes.totalPages) {
                    pageNumbers.push(
                        <li key={i} className="page-item">
                            <button className="page-link" onClick={() => handleClickButtonPage(i)}>
                                {i}
                            </button>
                        </li>
                    );
                }
            }
    
            // Dấu '...' cho các trang ở giữa
            if (props.dataRes.currentPage - visiblePageCount > 1) {
                pageNumbers.splice(2, 0, (
                    <li key="ellipsisLeft" className="page-item disabled">
                        <span style={{ color: 'black', fontWeight: 'bolder' }}>{ellipsis}</span>
                    </li>
                ));
            }
    
    
    
            // Trang kế tiếp
            if (props.dataRes.currentPage !== props.dataRes.totalPages) {
                pageNumbers.push(
                    <li key="next" className={`page-item ${props.dataRes.currentPage === props.dataRes.totalPages ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => handleClickButtonPage(props.dataRes.currentPage + 1)}>
                        <FontAwesomeIcon icon={faStepForward} />
                        </button>
                    </li>
                );
            }
    
    
            // Trang cuối cùng
            if (props.dataRes.currentPage !== props.dataRes.totalPages) {
                pageNumbers.push(
                    <li key="last" className={`page-item ${props.dataRes.currentPage === props.dataRes.totalPages ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => handleClickButtonPage(props.dataRes.totalPages)}>
                        <FontAwesomeIcon icon={faFastForward} />
                        </button>
                    </li>
                );
            }
    
            if (props.dataRes.currentPage + visiblePageCount < props.dataRes.totalPages) {
                pageNumbers.splice(pageNumbers.length - 2, 0, (
                    <li key="ellipsisRight" className="page-item disabled">
                        <span style={{ color: 'black', fontWeight: 'bolder' }}>{ellipsis}</span>
                    </li>
                ));
            }
            setButtons(pageNumbers);
        } else setButtons([]);
        
      }
    
    
    return (
        <div className="pagination-container">
            <ul className="pagination">
                {buttons}
            </ul>
        </div>
    );
};

export default Pagination;