import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const PerformanceChart = ({ data }) => {
  const ref = useRef();

  useEffect(() => {
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const width = 300, height = 300;
    const radius = 100;
    const centerX = width / 2;
    const centerY = height / 2;

    svg.attr("width", width).attr("height", height);

    const metrics = ['teaching', 'research', 'citations', 'income', 'international'];
    const values = metrics.map(m => data[m]);
    const maxValue = 100;
    const levels = 5;

    const angleSlice = (Math.PI * 2) / metrics.length;
    const rScale = d3.scaleLinear().domain([0, maxValue]).range([0, radius]);

    const g = svg.append("g").attr("transform", `translate(${centerX}, ${centerY})`);

    for (let level = 1; level <= levels; level++) {
      const r = (radius / levels) * level;
      g.append("circle")
        .attr("r", r)
        .attr("fill", "none")
        .attr("stroke", "#ddd")
        .attr("stroke-dasharray", "3,2");
    }

    metrics.forEach((metric, i) => {
      const angle = angleSlice * i - Math.PI / 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      g.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", x)
        .attr("y2", y)
        .attr("stroke", "#bbb");

      g.append("text")
        .attr("x", x * 1.27)
        .attr("y", y * 1.27)
        .text(metric)
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .attr("font-size", "11px")
        .attr("fill", "#333");
    });

    const line = d3.lineRadial()
      .radius((d) => rScale(d))
      .angle((d, i) => i * angleSlice)
      .curve(d3.curveLinearClosed);

    g.append("path")
      .datum(values)
      .attr("d", line)
      .attr("fill", "#4f81bd")
      .attr("stroke", "#1f4e79")
      .attr("stroke-width", 2)
      .attr("opacity", 0.6);
  }, [data]);

  return <svg ref={ref}></svg>;
};

export default PerformanceChart;
