import React from 'react';
import { Form } from 'antd';
import type { FormInstance } from 'antd/lib/form';

export const EditableContext = React.createContext<FormInstance<any> | null>(null);

export interface TableRowProps {
  index: number;
}
export default function TableRow({ index, ...props }: TableRowProps) {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
}
