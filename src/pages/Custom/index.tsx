import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Row, Col } from 'antd';
import Virtual from './virtualList';
import TimeSlice from './timeSlice';
import './index.less';

const Custom: React.FC = () => {
  const [dataList, setDataList] = useState<number[]>([]);

  useEffect(() => {
    const list = new Array(300).fill(1).map((item, index) => index + 1);
    setDataList(list);
  }, []);

  return (
    <PageContainer>
      <Row>
        <Col span={12}>
          <>
            <div className="virtual_head">虚拟列表</div>
            <Virtual />
          </>
        </Col>
        <Col span={12}>
          <>
            <div className="slice_head">时间分片(有问题的)</div>
            <TimeSlice renderCount={20} itemHeight={50} dataList={dataList} />
          </>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default Custom;
