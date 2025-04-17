import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const LoadingSpinner = () => (
  <div style={{ textAlign: 'center', margin: '50px 0' }}>
    <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
  </div>
);

export default LoadingSpinner;