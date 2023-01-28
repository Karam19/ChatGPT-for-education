import React from "react";
import Select from "react-select";
// import { customStyles } from "../constants/customStyles";
import { languageOptions } from "../constants/languageOptions";

const LanguagesDropdown = ({ onSelectChange }: { onSelectChange: any }) => {
  return (
    <Select
      placeholder={`Filter By Category`}
      options={languageOptions}
      defaultValue={languageOptions[0]}
      onChange={(selectedOption: any) => onSelectChange(selectedOption)}
    />
  );
};

// styles={customStyles}

export default LanguagesDropdown;
