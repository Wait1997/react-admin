import React, { useCallback } from 'react';
import { useMemo, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Form, Table, Popconfirm, Input, InputNumber, Typography } from 'antd';
import CustomForm from './Form';
import type { PriceValue } from './Form/Item';

export interface Item {
  key: string;
  name: string;
  age: number;
  address: string;
}

export const originData: Item[] = new Array(100).fill(0).map((item, index) => {
  return {
    key: index.toString(),
    name: `EditRow${index}`,
    age: 18,
    address: 'Chinese Awesome',
  };
});

export interface EditTableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: number | string;
  record: Item;
  index: number;
  children: React.ReactNode;
}

function EditableCell({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}: EditTableCellProps) {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
}

export default function EditRow(): React.ReactNode {
  const [form] = Form.useForm();
  const [data, setData] = useState(originData);
  const [editingKey, setEditKey] = useState('');

  const isEditing = useMemo(() => (record: Item) => record.key === editingKey, [editingKey]);

  const edit = useCallback(
    (record: Item): void => {
      form.setFieldsValue({ ...record });
      setEditKey(record.key);
    },
    [form],
  );

  const save = useCallback(
    async (key: string): Promise<void> => {
      try {
        const row = await form.validateFields();
        const index = data.findIndex((item) => item.key === key);
        if (index > -1) {
          data.splice(index, 1, { ...data[index], ...row });
          setData([...data]);
          setEditKey('');
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    [form, data],
  );

  const cancel = useCallback((): void => {
    setEditKey('');
  }, []);

  const columns = useMemo(() => {
    return [
      {
        title: 'name',
        dataIndex: 'name',
        width: '25%',
        editable: true,
      },
      {
        title: 'age',
        dataIndex: 'age',
        width: '15%',
        editable: true,
      },
      {
        title: 'address',
        dataIndex: 'address',
        width: '40%',
        editable: true,
      },
      {
        title: 'operation',
        dataIndex: 'operation',
        render: (_: any, record: Item) => {
          const editable = isEditing(record);
          return editable ? (
            <span>
              <a onClick={() => save(record.key)} style={{ marginRight: 8 }}>
                Save
              </a>
              <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                <a>Cancel</a>
              </Popconfirm>
            </span>
          ) : (
            <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
              Edit
            </Typography.Link>
          );
        },
      },
    ];
  }, [editingKey, isEditing, save, cancel, edit]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getValue = (values: { price: PriceValue }) => {};

  return (
    <PageContainer>
      <CustomForm getValue={getValue} />
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          columns={columns.map((col) => {
            return col.editable
              ? {
                  ...col,
                  onCell: (record: Item) => {
                    return {
                      record,
                      inputType: col.dataIndex === 'age' ? 'number' : 'text',
                      dataIndex: col.dataIndex,
                      title: col.title,
                      editing: isEditing(record),
                    };
                  },
                }
              : col;
          })}
          dataSource={data}
          bordered
          pagination={{
            onChange: cancel,
          }}
        />
      </Form>
    </PageContainer>
  );
}
