import { FC } from 'react';
import { Table, Spin } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import './DataTable.css';

interface DataTableProps<T> {
  data?: T[];
  loading?: boolean;
  columns: ColumnsType<T>;
  type: 'students' | 'teachers' | 'parents' | 'groups';
}

const DataTable: FC<DataTableProps<any>> = ({ 
  data = [], 
  loading = false,
  columns,
  type 
}) => {
  if (loading) {
    return <Spin size="large" className="table-loader" />;
  }

  return (
    <Table 
      dataSource={data}
      columns={columns}
      rowKey="id"
      pagination={false}
      className={`data-table ${type}-table`}
    />
  );
};

export default DataTable;