import { useEffect, useState } from 'react';
import './index.less';

export interface ListProps {
  renderCount: number;
  itemHeight: number;
  dataList: number[];
}

export default function TimeSlice({ renderCount, itemHeight, dataList }: ListProps) {
  const [renderList, setRenderList] = useState<JSX.Element[]>([]);

  useEffect(() => {
    let timer: any = null;
    const toRenderList = (index: number, times: number): void => {
      if (index <= times) {
        const list = dataList.slice((index - 1) * renderCount, index * renderCount);
        renderList.push(
          ...list.map((item) => (
            <div className="list" style={{ height: itemHeight }} key={item}>
              {item}项
            </div>
          )),
        );
        setRenderList([...renderList]);
        timer = setTimeout(() => {
          // eslint-disable-next-line no-param-reassign
          index += 1;
          toRenderList(index, times);
        }, 200);
      }
    };
    toRenderList(1, Math.ceil(dataList.length / renderCount));
    return () => {
      timer = null;
      clearTimeout(timer);
    };
  }, [dataList, renderCount, itemHeight]);

  return <div className="list_wrap">{renderList}</div>;
}
