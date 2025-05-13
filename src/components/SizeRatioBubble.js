import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const SizeRatioBubble = ({ data }) => {
  const ref = useRef();

  useEffect(() => {
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const width = 400;
    const height = 300;
    const margin = { top: 20, right: 20, bottom: 40, left: 50 };

    svg.attr("width", width).attr("height", height);

    const chart = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const x = d3.scaleLog()
      .domain([d3.min(data, d => d.num_students || 1), d3.max(data, d => d.num_students || 1)])
      .range([0, innerWidth]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.student_staff_ratio || 1)])
      .range([innerHeight, 0]);

    const size = d3.scaleSqrt()
      .domain([0, d3.max(data, d => d.international_students || 0)])
      .range([2, 20]);

    chart.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x).ticks(5, "~s"));

    chart.append("g")
      .call(d3.axisLeft(y));

    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height - 5)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .text("Number of Students (log scale)");

    svg.append("text")
      .attr("x", -height / 2)
      .attr("y", 15)
      .attr("transform", "rotate(-90)")
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .text("Student-Staff Ratio");

    const tooltip = d3.select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("background", "#fff")
      .style("border", "1px solid #999")
      .style("padding", "8px")
      .style("pointer-events", "none")
      .style("opacity", 0);

    chart.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => x(d.num_students || 1))
      .attr("cy", d => y(d.student_staff_ratio || 0))
      .attr("r", d => size(d.international_students || 0))
      .attr("fill", "#2a9d8f")
      .attr("opacity", 0.7)
      .on("mouseover", function (event, d) {
        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltip.html(`
          <strong>${d.university_name}</strong><br/>
          Students: ${d.num_students.toLocaleString()}<br/>
          Staff Ratio: ${d.student_staff_ratio}<br/>
          Intl Students: ${d.international_students}%
        `)
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 28}px`);
      })
      .on("mouseout", () => {
        tooltip.transition().duration(300).style("opacity", 0);
      });
  }, [data]);

  return <svg ref={ref}></svg>;
};

export default SizeRatioBubble;
