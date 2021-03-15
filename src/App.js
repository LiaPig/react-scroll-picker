import React, { useRef, useEffect, memo, useCallback, useState } from "react";
import "./styles.css";

const data = [...new Array(12)].map((item, index) => {
  return { label: `${index + 1}月`, value: index + 1 };
});

const ScrollPicker = memo(({ data = [], value, onChange, ...props }) => {
  const contentRef = useRef();
  const itemRef = useRef();
  // 记录拖动开始的纵坐标
  const lastStartY = useRef(0);

  const handleTouchStart = useCallback((e) => {
    const touch = e.targetTouches[0];
    lastStartY.current = touch.pageY;
  }, []);

  const handleTouchMove = useCallback((e) => {
    const touch = e.targetTouches[0];
    const distance = touch.pageY - lastStartY.current;
    contentRef.current.scrollTop -= distance;
    lastStartY.current = touch.pageY;
  }, []);

  const handleTouchEnd = useCallback(() => {
    // 获取一个单位的高度
    const itemHeight = itemRef.current.offsetHeight;
    // 四舍五入知道当前 index
    const index = Math.round(contentRef.current.scrollTop / itemHeight);
    // 吸附居中
    contentRef.current.scrollTop = index * itemHeight;
    // 触发 onChange
    if (onChange) {
      onChange(data[index].value, data[index]);
    }
  }, [onChange, data]);

  // 如果没有值，就设定第一个为默认值
  useEffect(() => {
    if (!value && onChange) {
      onChange(data[0].value, data[0]);
    }
    // 仅初始化才调用，不需要填依赖项
    // eslint-disable-next-line
  }, []);

  return (
    <div className="scroll-picker" {...props}>
      <div className="scroll-picker-mask1"></div>
      <div className="scroll-picker-mask2"></div>
      <div
        ref={contentRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="scroll-picker-content"
      >
        <div ref={itemRef} className="scroll-picker-content-item">
          &nbsp;
        </div>
        {data.map((item) => (
          <div key={item.value} className="scroll-picker-content-item">
            {item.label}
          </div>
        ))}
        <div className="scroll-picker-content-item">&nbsp;</div>
      </div>
    </div>
  );
});

export default function App() {
  const [currentValue, setCurrentValue] = useState("");
  return (
    <div className="App">
      <ScrollPicker
        data={data}
        value={currentValue}
        onChange={setCurrentValue}
      ></ScrollPicker>
      <p>当前选中的月份为：{currentValue}</p>
    </div>
  );
}
