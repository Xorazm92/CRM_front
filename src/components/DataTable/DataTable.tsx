import { FC } from 'react';
import { Table, Spin } from 'antd';
import type { ColumnsType } from 'antd/es/table';

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
    return <Spin size="large" className="flex justify-center items-center w-full py-10" />;
  }

  return (
    <Table 
      dataSource={data}
      columns={columns}
      rowKey="id"
      pagination={false}
      className={`w-full ${type}-table`}
    />
  );
};

export default DataTable;