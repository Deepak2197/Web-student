import { Select, Spin } from "antd";
import PropTypes from "prop-types";
const { Option } = Select;

const MySelect = ({
  title,
  fetching,
  onChangeHandler,
  searchHandler,
  abroad,
  type,
  yearArr,
  value,
}) => {
  return (
    <>
      {type === "1" ? (
        <div className="form-group position-relative">
          <label htmlFor="name">{title}</label>
          <Select
            size="large"
            allowClear={true}
            style={{ width: "100%" }}
            showSearch
            value={value}
            placeholder="Search..."
            onSearch={searchHandler}
            onChange={onChangeHandler}
            notFoundContent={
              fetching ? <Spin size="small" /> : "No results found"
            }
            filterOption={false}
          >
            {abroad?.map((option) => (
              <Option key={option.value !== undefined ? option.value : "other"} value={option.value !== undefined ? option.value : "other"}>
                {option.label}
              </Option>
            ))}
          </Select>
        </div>
      ) : (
        <div className="form-group position-relative">
          <label htmlFor="name">{title}</label>
          <Select
            defaultValue="Select Year"
            size="large"
            options={yearArr}
            style={{ width: "100%" }}
            onChange={onChangeHandler} // Set selected year
          />
        </div>
      )}
    </>
  );
};

MySelect.propTypes = {
  title: PropTypes.string.isRequired,
  fetching: PropTypes.bool,
  onChangeHandler: PropTypes.func,
  searchHandler: PropTypes.func,
  abroad: PropTypes.array,
  type: PropTypes.string,
  yearArr: PropTypes.array,
  value: PropTypes.any,
};

export default MySelect;
