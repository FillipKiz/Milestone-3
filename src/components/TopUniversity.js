import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const TopUniversity = ({ data }) => {
  const ref = useRef();

  const truncate = (str, maxChars) =>
    str.length > maxChars ? str.slice(0, maxChars - 3) + '…' : str;

  useEffect(() => {
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const top10 = data.slice(0, 10);
    if (!top10.length) return;

    const totalWidth = 700;
    const labelWidth = 300;
    const scoreLabelSpace = 100;
    const chartWidth = totalWidth - labelWidth - scoreLabelSpace;
    const barHeight = 20;
    const rowHeight = 25;
    const height = rowHeight * top10.length;

    svg.attr("width", totalWidth).attr("height", height);

    const x = d3.scaleLinear()
      .domain([0, d3.max(top10, d => d.total_score)])
      .range([0, chartWidth]);

    svg.selectAll("text.name")
      .data(top10)
      .enter()
      .append("text")
      .attr("class", "name")
      .attr("x", 0)
      .attr("y", (_, i) => i * rowHeight + barHeight * 0.75)
      .text(d => truncate(d.university_name, 50))
      .attr("font-size", "12px")
      .attr("text-anchor", "start");

    svg.selectAll("rect.bar")
      .data(top10)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", labelWidth)
      .attr("y", (_, i) => i * rowHeight)
      .attr("width", d => x(d.total_score))
      .attr("height", barHeight)
      .attr("fill", "#1f4e79");

    svg.selectAll("text.score")
      .data(top10)
      .enter()
      .append("text")
      .attr("class", "score")
      .attr("x", d => labelWidth + x(d.total_score) + 5)
      .attr("y", (_, i) => i * rowHeight + barHeight * 0.75)
      .text(d => d.total_score.toFixed(1))
      .attr("font-size", "11px")
      .attr("fill", "#333");
  }, [data]);

  return <svg ref={ref} />;
};

export default TopUniversity;
