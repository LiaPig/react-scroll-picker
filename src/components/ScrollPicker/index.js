import React, { useRef, useEffect, memo, useCallback } from "react";
import { debounce } from "../../utils";

import "./styles.css";

const ScrollPicker = memo(({ data = [], value, onChange, ...props }) => {
  const contentRef = useRef();
  const containerRef = useRef();
  // 单个选项元素的高度
  const itemHeight = useRef(50);
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
    // 四舍五入知道当前 index
    const index = Math.round(contentRef.current.scrollTop / itemHeight.current);
    // 吸附居中
    contentRef.current.scrollTop = index * itemHeight.current;
    // 触发 onChange
    if (onChange) {
      onChange(data[index].value, data[index]);
    }
  }, [onChange, data]);

  
  useEffect(() => {
    // 单个选项元素的高度 = 容器总高度 / （元素长度 + 前后空元素)
    itemHeight.current = Number(containerRef.current.offsetHeight / (data.length + 2)).toFixed(2);
  }, [data])

  // 如果没有值，就设定第一个为默认值
  useEffect(() => {
    // 设定初始值
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
        <div ref={containerRef}>
          <div className="scroll-picker-content-item">
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
    </div>
  );
});

export default ScrollPicker;
