import React, { useState } from "react";
import ScrollPicker from "./components/ScrollPicker";

import "./styles.css";

const data = [...new Array(12)].map((item, index) => {
  return { label: `${index + 1}月`, value: index + 1 };
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
