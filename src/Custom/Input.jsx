/* eslint-disable react/prop-types */
export const Input = ({ type, placeholder, value, onChange, ...rest }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      {...rest}
    />
  );
};
