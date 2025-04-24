import React from 'react';
import './HeaderTitle.css';
import Select from '../Select/Select';

const HeaderTitle: React.FC = () => {
  return (
    <div className="title-wrapper">
      <h2>HeaderTitle</h2>
      <Select />
    </div>
  );
};

export default HeaderTitle;
