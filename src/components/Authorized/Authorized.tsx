import React from 'react';
import { Result } from 'antd';
import check from './CheckPermissions';
import type { IAuthorityType } from './CheckPermissions';
import type AuthorizedRoute from './AuthorizedRoute';
import type Secured from './Secured';

type AuthorizedProps = {
  authority: IAuthorityType;
  noMatch?: React.ReactNode;
};

// authorized组件 最终返回的类型(包装为交叉类型)
type IAuthorizedType = React.FunctionComponent<AuthorizedProps> & {
  Secured: typeof Secured;
  check: typeof check;
  AuthorizedRoute: typeof AuthorizedRoute;
};

const Authorized: React.FunctionComponent<AuthorizedProps> = ({
  children,
  authority,
  noMatch = (
    <Result
      status="403"
      title="403"
      subTitle="Sorry, you are not authorized to access this page."
    />
  ),
}) => {
  // children 是 React.ReactNode
  const childrenRender: React.ReactNode = typeof children === 'undefined' ? null : children;
  // dom返回的是匹配或者不匹配的组件
  const dom = check(authority, childrenRender, noMatch);
  return <>{dom}</>;
};

export default Authorized as IAuthorizedType;
