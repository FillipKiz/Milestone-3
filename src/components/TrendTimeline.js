import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const TrendTimeline = ({ data }) => {
  const ref = useRef();

  useEffect(() => {
    const svg = d3.select(ref.current);
    svg.selectAll('*').remove();

    const width = 1450;
    const height = 250;
    const margin = { top: 30, right: 30, bottom: 40, left: 50 };

    svg.attr('width', width).attr('height', height);

    const years = Array.from(new Set(data.map(d => d.year))).sort((a, b) => a - b);

    const avgScores = years.map(year => {
      const yearData = data.filter(d => d.year === year && !isNaN(d.total_score));
      const avg = d3.mean(yearData, d => d.total_score);
      return { year, avg };
    });

    const x = d3.scaleLinear()
      .domain(d3.extent(avgScores, d => d.year))
      .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(avgScores, d => d.avg) || 100])
      .range([height - margin.bottom, margin.top]);

    const line = d3.line()
      .x(d => x(d.year))
      .y(d => y(d.avg))
      .curve(d3.curveMonotoneX);

    const g = svg.append('g');

    // Axes
    g.append('g')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickFormat(d3.format('d')));

    g.append('g')
      .attr('transform', `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(y));

    // Axis Labels
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height - 5)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .text("Year");

    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", 15)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .text("Average Total Score");

    // Line
    g.append('path')
      .datum(avgScores)
      .attr('fill', 'none')
      .attr('stroke', 'tomato')
      .attr('stroke-width', 2)
      .attr('d', line);

    // Tooltip
    const tooltip = d3.select("body")
      .append("div")
      .style("position", "absolute")
      .style("padding", "6px 10px")
      .style("background", "#333")
      .style("color", "#fff")
      .style("font-size", "12px")
      .style("border-radius", "4px")
      .style("pointer-events", "none")
      .style("opacity", 0);

    g.selectAll("circle")
      .data(avgScores)
      .enter()
      .append("circle")
      .attr("cx", d => x(d.year))
      .attr("cy", d => y(d.avg))
      .attr("r", 4)
      .attr("fill", "#264653")
      .on("mouseover", (event, d) => {
        tooltip.transition().duration(150).style("opacity", 1);
        tooltip.html(`Year: ${d.year}<br/>Avg Score: ${d.avg.toFixed(1)}`)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", () => {
        tooltip.transition().duration(200).style("opacity", 0);
      });
  }, [data]);

  return <svg ref={ref} style={{ width: '100%' }}></svg>;
};

export default TrendTimeline;
