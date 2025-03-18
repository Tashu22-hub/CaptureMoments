import React, { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
//to hide the password 

const PasswordInput = ({ value, onChange, placeholder }) => {
  const [isShowPassword, setIsShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setIsShowPassword(!isShowPassword);
  };

  return (
    <div className="flex items-center bg-cyan-600/5 px-5 rounded mb-3">
      <input
        value={value}
        onChange={onChange}  // Corrected from `onchange`
        placeholder={placeholder || "Password"}
        type={isShowPassword ? "text" : "password"}
        className="w-full text-sm bg-transparent py-3 mr-3 rounded-lg outline-none"
      />

      {isShowPassword ? (
        <FaRegEye
          size={22}
          className="text-primary cursor-pointer"
          onClick={toggleShowPassword} // Corrected from `Onclick`
        />
      ) : (
        <FaRegEyeSlash
          size={22}
          className="text-slate-400 cursor-pointer" // Corrected `text-Slate-400`
          onClick={toggleShowPassword} // Fixed function call
        />
      )}
    </div>
  );
};

export default PasswordInput;
