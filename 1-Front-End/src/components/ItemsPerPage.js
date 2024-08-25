import React, { useState, useEffect } from "react";
const ItemsPerPage = (props) => {
    //hàm số hàng trên trang
    const [optionsDisplay, setOptionsDisplay] = useState([//số hàng hiển thị
        { value: "10", label: "Hiển thị: 10" },
        { value: "30", label: "Hiển thị: 30" },
        { value: "50", label: "Hiển thị: 50" },
        { value: "100", label: "Hiển thị: 100" },
        { value: '', label: `Hiển thị toàn bộ` },
        { value: "custom", label: "Tùy chọn khác" },
    ]);
    const handleChangeDisplayRow = (event) => {
        const selectedValue = event.target.value;
        if (selectedValue === "custom") {
            const customValue = prompt("Nhập số hàng trên mỗi trang:");
            if (customValue) {
                if (customValue > props.dataRes.totalItems) {
                    props.openPopupAlert('Bạn vừa nhập số hàng hiển thị lớn hơn số hàng dữ liệu sẵn có. Hệ thống sẽ hiển thị tất cả dữ liệu')
                } else {
                    setOptionsDisplay((prevoptionsDisplay) => [
                        ...prevoptionsDisplay,
                        { value: customValue, label: `Hiển thị: ${customValue}` },
                    ]);
                }
                props.setdataUser({ ...props.dataUser, page: 1, limit: customValue });
            }
        } else props.setdataUser({ ...props.dataUser, page: 1, limit: selectedValue });
    };

    useEffect(() => {
        // Render lại khi props thay đổi
        handleItemsPerPage()
    }, [props]);

    const handleItemsPerPage = () => {
        //cập nhật combobox hiển thị số hàng trên trang
        setOptionsDisplay((prevOptions) => {
            let updatedOptions = prevOptions.map((option) => {
                if (option.label === "Hiển thị toàn bộ") {
                    return { ...option, value: props.dataRes.totalItems };
                }
                return option;
            });

            if (props.dataRes.totalItems < 100) {
                // Xoá option dựa trên giá trị (value)
                updatedOptions = updatedOptions.filter((option) => option.value !== "100");
            }

            if (props.dataRes.totalItems < 50) {
                updatedOptions = updatedOptions.filter((option) => option.value !== "50");
            }

            if (props.dataRes.totalItems < 30) {
                updatedOptions = updatedOptions.filter((option) => option.value !== "30");
            }

            return updatedOptions;
        });
    }

    return (
        <select
            class="form-select-sm"
            value={props.dataRes.itemsPerPage}
            onChange={handleChangeDisplayRow}//đặt thay đổi khi giá trị thay đổi
        >
            {optionsDisplay.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
};

export default ItemsPerPage;