import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Table, Tag, Popconfirm, Space, Button, Form, Input } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';

export interface TableDataProps {
  key: string | number;
  name: string;
  age: number;
  sex: 0 | 1;
  code: string;
  address: string;
  tags: string[];
}

export default () => {
  const inputRef = useRef<Input>(null);
  const [editList, setEditList] = useState<boolean[]>([]);
  const [tableData, setTableData] = useState<TableDataProps[]>([]);
  const [form] = Form.useForm();

  const toggleEdit = useCallback(
    (record: TableDataProps, index: number) => {
      editList[index] = true;
      setEditList([...editList]);
      form.setFieldsValue({ [record.key]: record.name });
    },
    [editList, form],
  );

  const save = useCallback(
    async (record: TableDataProps, index: number): Promise<void> => {
      try {
        const values = await form.validateFields();
        editList[index] = false;
        setEditList([...editList]);
        const data = [...tableData];
        setTableData(
          data.map((item) => {
            if (item.key === record.key) {
              return {
                ...item,
                name: values[item.key],
              };
            }
            return item;
          }),
        );
      } catch (errInfo) {
        throw new Error(errInfo);
      }
    },
    [editList, tableData, form],
  );

  const addRow = (): void => {
    tableData.push({
      key: String(tableData.length),
      name: 'xiaoming',
      age: 0,
      sex: 0,
      code: '789',
      address: 'London No. 1 Lake Park',
      tags: ['loser'],
    });
    editList.push(false);
    setEditList([...editList]);
    setTableData([...tableData]);
  };

  const columns = useMemo(() => {
    return [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        fixed: 'left' as 'left',
        width: 180,
        render: (text: string, record: TableDataProps, index: number) => {
          const childNode = editList[index] ? (
            <Form form={form}>
              <Form.Item style={{ margin: 0 }} name={record.key}>
                <Input
                  ref={inputRef}
                  onBlur={() => {
                    save(record, index);
                  }}
                />
              </Form.Item>
            </Form>
          ) : (
            <div
              style={{ paddingRight: 24 }}
              onClick={() => {
                toggleEdit(record, index);
              }}
            >
              {text}
            </div>
          );
          return childNode;
        },
      },
      {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
        width: 180,
      },
      {
        title: 'Sex',
        dataIndex: 'sex',
        key: 'sex',
        width: 180,
        render: (text: 0 | 1) => {
          const sex = text === 1 ? <span>女</span> : <span>男</span>;
          return sex;
        },
      },
      {
        title: 'Code',
        dataIndex: 'code',
        key: 'code',
        width: 180,
      },
      {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
        width: 240,
      },
      {
        title: 'Tags',
        key: 'tags',
        dataIndex: 'tags',
        width: 200,
        render: (tags: string[]) => (
          <>
            {tags.map((tag) => {
              let color = tag.length > 5 ? 'geekblue' : 'green';
              if (tag === 'loser') {
                color = 'volcano';
              }
              return (
                <Tag color={color} key={tag}>
                  {tag.toUpperCase()}
                </Tag>
              );
            })}
          </>
        ),
      },
      {
        title: 'Action',
        key: 'action',
        width: 180,
        fixed: 'right' as 'right',
        render: (text: TableDataProps, record: TableDataProps) => {
          return (
            <Space>
              <Popconfirm title="sure to edit" onConfirm={() => {}}>
                <Button type="primary">edit</Button>
              </Popconfirm>
              <Popconfirm
                title="sure to delete"
                onConfirm={() => {
                  const data = [...tableData];
                  setTableData(data.filter((item) => item.key !== record.key));
                }}
              >
                <Button type="primary">delete</Button>
              </Popconfirm>
            </Space>
          );
        },
      },
    ];
  }, [editList, tableData, form, save, toggleEdit]);

  useEffect(() => {
    const data: TableDataProps[] = [
      {
        key: '1',
        name: 'John Brown',
        age: 32,
        sex: 0,
        code: '123',
        address: 'New York No. 1 Lake Park',
        tags: ['nice', 'developer'],
      },
      {
        key: '2',
        name: 'Jim Green',
        age: 42,
        sex: 1,
        code: '345',
        address: 'London No. 1 Lake Park',
        tags: ['loser'],
      },
      {
        key: '3',
        name: 'Joe Black',
        age: 32,
        sex: 1,
        code: '126',
        address: 'Sidney No. 1 Lake Park',
        tags: ['cool', 'teacher'],
      },
    ];
    setEditList(new Array(data.length).fill(false));
    setTableData(data);
  }, []);

  useEffect(() => {
    const bool = editList.find((item) => item === true);
    if (bool) {
      inputRef.current!.focus();
    }
  }, [editList]);

  return (
    <PageContainer>
      <div style={{ marginBottom: 10 }}>
        <Button type="primary" onClick={addRow}>
          add row
        </Button>
      </div>
      <Table columns={columns} dataSource={tableData} scroll={{ x: 1000 }} bordered />
    </PageContainer>
  );
};
