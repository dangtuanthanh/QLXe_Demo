import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { useSelector } from 'react-redux'
function SearchComBoBox(props) {
  const [search, setSearch] = useState('');
  const [combos, setCombos] = useState(props.combos);
  const handleSearch = (event) => {
    // Lọc dữ liệu
    const filteredCombos =props.combos&& props.combos.filter(combo => {
      // So sánh giá trị của cột props.column với giá trị tìm kiếm
      return combo[props.column].toLowerCase().includes(event.target.value.toLowerCase());
    });
    // Cập nhật lại state
    setCombos(filteredCombos);
    setSearch(event.target.value);
  }
  const isMobile = useSelector(state => state.isMobile.isMobile)
  return (
    <div className="popup-box">
      <div className="box" style={{
        width: isMobile && '100%'
      }}>
        <div className="conten-modal">
          <div>
            <div className="bg-light px-4 py-3">
              <h4 style={{ textAlign: 'center' }}>Tìm Kiếm</h4>
              <div className='row'>
                <div className='col-11'>
                  <input
                    id="search"
                    value={search}
                    onChange={handleSearch}
                    placeholder='Tìm Kiếm'
                    type="text"
                    className="form-control"
                    autoFocus
                  />
                </div>
                <div className='col-1'>
                  {
                    search !== '' &&
                    <button
                      className="btn btn-close"
                      style={{ color: 'red', marginLeft: '4px', fontSize: '1rem' }}
                      onClick={() => {
                        setSearch('')
                        setCombos(props.combos);
                      }}
                    >
                      X
                    </button>
                  }
                </div>
              </div>
              <div style={{
                height: '28rem',
                overflowY: 'auto'
              }}>
                {combos &&combos.map((combo, index) => (
                  <div key={index} style={{ marginTop: '1rem' }}>
                    <label style={{ fontSize: '1rem' }}
                      onClick={() => { props.handleChange(combo[props.IDColumn]); props.setPopupSearch(false) }}
                    >{index + 1}. {
                        combo[props.column] ?
                          combo[props.column].length > 60 ?
                            combo[props.column].slice(0, 60) + '...' :
                            combo[props.column]
                          : ''
                      }</label>
                  </div>
                ))}
              </div>
              <button onClick={() => { props.setPopupSearch(false) }} type="button" className="btn btn-danger mt-3" >Huỷ Bỏ</button>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}

export default SearchComBoBox;
