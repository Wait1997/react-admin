import { useEffect, useMemo, useState } from 'react';
import { Table, Tag, Popconfirm, Space, Button } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
// import TableRow from '@/pages/Table/TableRow';
// import TableCell from '@/pages/Table/TableCell';

export interface TableDataProps {
  key: string | number;
  name: string;
  age: number;
  address: string;
  tags: string[];
}

export default () => {
  const [tableData, setTableData] = useState<TableDataProps[]>([]);

  const columns = useMemo(() => {
    return [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        editable: true,
      },
      {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
      },
      {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
      },
      {
        title: 'Tags',
        key: 'tags',
        dataIndex: 'tags',
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
  }, [tableData]);

  useEffect(() => {
    const data = [
      {
        key: '1',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
        tags: ['nice', 'developer'],
      },
      {
        key: '2',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park',
        tags: ['loser'],
      },
      {
        key: '3',
        name: 'Joe Black',
        age: 32,
        address: 'Sidney No. 1 Lake Park',
        tags: ['cool', 'teacher'],
      },
    ];
    setTableData(data);
  }, []);

  const handleSave = (row: TableDataProps): void => {
    const newData = [...tableData];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setTableData(newData);
  };

  return (
    <PageContainer>
      <Table
        columns={columns.map((col) => {
          if (!col.editable) {
            return col;
          }
          return {
            ...col,
            onCell: (record: TableDataProps) => ({
              record,
              editable: col.editable,
              dataIndex: col.dataIndex,
              title: col.title,
              handleSave,
            }),
          };
        })}
        dataSource={tableData}
        bordered
      />
    </PageContainer>
  );
};
