import React from 'react';
import { Form, Button } from 'antd';
import type { PriceValue } from './Item';
import Item from './Item';

export interface CustomFormProps {
  getValue: (value: { price: PriceValue }) => void;
}

const CustomForm: React.FC<CustomFormProps> = ({ getValue }) => {
  const onFinish = (values: { price: PriceValue }) => {
    getValue(values);
  };

  const checkPrice = (_: any, value: { number: number }): Promise<void> => {
    if (value.number > 0) {
      return Promise.resolve();
    }
    return Promise.reject(new Error('Price must be greater than zero!'));
  };

  return (
    <Form
      layout="inline"
      onFinish={onFinish}
      initialValues={{
        price: {
          number: 9,
          currency: 'rmb',
        },
      }}
    >
      <Form.Item name="price" label="Price" rules={[{ validator: checkPrice }]}>
        <Item />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CustomForm;
