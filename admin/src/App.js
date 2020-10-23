import React, { PureComponent, useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import socketIOClient from "socket.io-client";

function App() {
  const [ready, setReady] = useState(false);
  const [series, setSeries] = useState([]);
  const size = useWindowSize();
  const [updated, setUpdated] = useState(100);
  const colors = [
    "#011627",
    "#2ec4b6",
    "#e71d36",
    "#ff9f1c",
    "#4f000b",
    "#00509d",
    "#6a4c93",
    "#344e41",
  ];
  useEffect(() => {
    const socket = socketIOClient("http://localhost:8080");
    socket.on("admin", (data) => {
      try {
        series
          .find((item) => item.name === data.name)
          .data.push({ category: data.category, value: data.value });
      } catch (error) {
        data.name
          ? series.push({
              name: data.name,
              data: [{ category: data.category, value: data.value }],
            })
          : console.log("Hello World");
      }
      setReady(true);
      setUpdated(Math.random());
      console.log(series);
      console.log(data);
    });
  }, []);

  return ready ? (
    <LineChart width={size.width} height={size.height - updated}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis
        dataKey="category"
        type="category"
        allowDuplicatedCategory={false}
      />
      <YAxis dataKey="value" />
      <Tooltip />
      <Legend />

      {series.map((s, index) => (
        <Line
          dataKey="value"
          type="monotone"
          stroke={colors[index]}
          strokeWidth={2}
          data={s.data}
          name={s.name}
          key={s.name}
        />
      ))}
    </LineChart>
  ) : (
    <div>Data Waiting</div>
  );
}

function useWindowSize() {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount

  return windowSize;
}

export default App;
