import React, { useRef, useEffect, memo, useCallback } from "react";
import { debounce } from "../../utils/index";

import "./styles.css";

const isMobile = (() => {
  const u = navigator.userAgent;
  const isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1;
  const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
  return isAndroid || isiOS;
})();

const ScrollPicker = memo(({ data = [], value, onChange, ...props }) => {
  const contentRef = useRef();
  const containerRef = useRef();
  // 单个选项元素的高度
  const itemHeight = useRef(50);

  const handleScroll = useCallback(
    debounce(async (e) => {
      // 修复还在滚动但强行关闭了组件的情况
      if (!contentRef || !contentRef.current) {
        return;
      }
      // 四舍五入知道当前 index
      const index = Math.round(
        contentRef.current.scrollTop / itemHeight.current
      );
      // 判断滚动条位置有没变化
      // 判断滚动条位置有没变化;
      if (
        contentRef.current.scrollTop === index * itemHeight.current &&
        index !== 0 &&
        index !== data.length - 1 &&
        isMobile
      ) {
        return;
      }
      // console.log(contentRef.current.scrollTop, index * itemHeight.current);
      // console.log(data[index].value);
      // 吸附居中
      contentRef.current.scrollTop = index * itemHeight.current;
      // 触发 onChange
      if (onChange) {
        onChange(data[index].value, data[index]);
      }
    }, 50),
    [onChange, data]
  );

  useEffect(() => {
    // 单个选项元素的高度 = 容器总高度 / （元素长度 + 前后空元素)
    itemHeight.current = Number(
      containerRef.current.offsetHeight / (data.length + 2)
    ).toFixed(2);
  }, [data]);

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
        onScroll={handleScroll}
        className="scroll-picker-content"
      >
        <div ref={containerRef}>
          <div className="scroll-picker-content-item">&nbsp;</div>
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
