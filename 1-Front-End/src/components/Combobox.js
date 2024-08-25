import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'
function Combobox(props) {
  const [selected, setSelected] = useState([]);
  useEffect(() => {
    props.onChange(selected);
  }, [selected]);
  var maxWord = 40
  if(props.maxWord){
    maxWord =props.maxWord
  }
  const handleComboboxChange = (event) => {
    if (props.multiple === true) {
      if (selected.includes(event.target.value)) {
        setSelected(selected.filter(i => i !== event.target.value));
      } else {
        setSelected([...selected, event.target.value]);
      }

    } else {
      props.onChange(event.target.value);
    }

  };
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <label
        style={{
          marginBottom: '0px',
          marginRight: '10px',
          flexShrink: 0,
          ...props.labelStyle
        }}
      >
        {props.nameCombo}{props.batBuocNhap}
      </label>

      <select
        className="form-select-sm"
        style={{
          marginRight: '10px'
        }}
        value={props.value}
        onChange={handleComboboxChange}
        disabled={props.disabled}
        multiple={props.multiple ? true : undefined}
      >
        {props.combos.map((combo) => (
          <option
            key={combo[props.columnValue]}
            value={combo[props.columnValue]}
          >
            {
              combo[props.columnAdd] ?
              combo[props.columnAdd].length > maxWord ?
              combo[props.columnAdd].slice(0,maxWord) + '...' :
              combo[props.columnAdd]
                : ''
            }
          </option>
        ))}
      </select>
      {
        props.isAdd && <div onClick={() => props.onClick()}>
          < FontAwesomeIcon icon={faPlusCircle} />
        </div>
      }

    </div>
  );
}

export default Combobox;
