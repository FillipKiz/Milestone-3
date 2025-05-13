import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const SizeRatioBubble = ({ data }) => {
  const ref = useRef();

  useEffect(() => {
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const width = 400, height = 300;
    svg.attr("width", width).attr("height", height);

    const x = d3.scaleLinear().domain([0, d3.max(data, d => d.num_students) || 1]).range([50, width - 30]);
    const y = d3.scaleLinear().domain([0, d3.max(data, d => d.student_staff_ratio) || 1]).range([height - 30, 30]);
    const size = d3.scaleSqrt().domain([0, 80]).range([2, 20]);

    svg.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => x(d.num_students))
      .attr("cy", d => y(d.student_staff_ratio))
      .attr("r", d => size(d.international_students))
      .attr("fill", "#2a9d8f")
      .attr("opacity", 0.7);
  }, [data]);

  return <svg ref={ref}></svg>;
};

export default SizeRatioBubble;