import React from "react";
import Select from "../Select/Select";

const HeaderTitle: React.FC = () => {
  return (
    <div className="h-[100px] my-[100px] mx-[20px] text-black flex justify-between items-center w-[calc(100%-237px)]">
      <h2>HeaderTitle</h2>
      <Select />
    </div>
  );
};

export default HeaderTitle;
