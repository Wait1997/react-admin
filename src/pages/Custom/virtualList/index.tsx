import { useEffect, useRef, useState } from 'react';
import './index.less';

export default function Virtual() {
  const box = useRef<HTMLDivElement>(null);
  const scroll = useRef<HTMLDivElement>(null);
  const context = useRef<HTMLDivElement>(null);
  const scrollInfo = useRef({
    height: 540,
    bufferCount: 8 /** 缓存区的个数 */,
    itemHeight: 60,
    renderCount: 0,
  });

  const [dataList, setDataList] = useState<number[]>([]);
  const [renderList, setRenderList] = useState<number[]>([]);
  const [position, setPosition] = useState<number[]>([0, 0]);

  useEffect(() => {
    if (box.current) {
      const height = box.current.clientHeight;
      const { itemHeight, bufferCount } = scrollInfo.current;
      // 一共要渲染的个数
      const renderCount = height && Math.ceil(height / itemHeight) + bufferCount;
      scrollInfo.current = { renderCount, height, bufferCount, itemHeight };
      const list = new Array(200).fill(1).map((item, index) => index + 1);
      setDataList(list);
      setPosition([0, renderCount]);
      setRenderList(list.slice(0, renderCount));
    }
  }, []);

  const handleScroll = (): void => {
    if (scroll.current) {
      const { scrollTop } = scroll.current;
      const { itemHeight, renderCount } = scrollInfo.current;
      const currentOffset = scrollTop - (scrollTop % itemHeight); // 滚动出去的整数个itemHeight的偏移量
      const start = Math.floor(scrollTop / itemHeight); // 滚动出去的item的个数
      if (context.current) {
        context.current.style.transform = `translate3d(0, ${currentOffset}px, 0)`; /* 偏移，造成下滑效果 */
      }
      const end = Math.floor(scrollTop / itemHeight + renderCount + 1);
      if (end !== position[1] || start !== position[0]) {
        /* 如果render内容发生改变，那么截取  */
        setPosition([start, end]);
        setRenderList(dataList.slice(start, end));
      }
    }
  };

  const { itemHeight, height } = scrollInfo.current;
  return (
    <div className="list_box" ref={box}>
      <div className="scroll_box" style={{ height }} ref={scroll} onScroll={handleScroll}>
        <div className="scroll_hold" style={{ height: dataList.length * itemHeight }}></div>
        <div className="context" ref={context}>
          {renderList.map((item) => (
            <div className="list" style={{ height: itemHeight }} key={item}>
              {item}项
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
