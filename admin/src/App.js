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

      setUpdated(Math.random());
      setSeries([...series]);
      console.log(series);
      console.log(data);
    });
  }, []);

  useEffect(() => {
    console.log("Data change");
  }, [series]);
  return updated !== 100 ? (
    <LineChart width={size.width} height={size.height}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis
        dataKey="category"
        type="category"
        allowDuplicatedCategory={false}
      />
      <YAxis dataKey="value" />
      <Tooltip />
      <Legend />
      {updated !== 0
        ? series.map((s) => (
            <Line dataKey="value" data={s.data} name={s.name} key={s.name} />
          ))
        : series.map((s) => (
            <Line dataKey="value" data={s.data} name={s.name} key={s.name} />
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
