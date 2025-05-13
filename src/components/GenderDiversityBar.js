import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const GenderDiversityBar = ({ data }) => {
  const ref = useRef();

  useEffect(() => {
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const width = 300;
    const height = 250;
    svg.attr("width", width).attr("height", height);

    const top5 = data.slice(0, 5);

    const x = d3.scaleLinear()
      .domain([0, 1])
      .range([0, width - 140]);

    svg.selectAll("rect")
      .data(top5)
      .enter()
      .append("rect")
      .attr("x", 160)
      .attr("y", (d, i) => i * 30)
      .attr("width", d => {
        const [f, m] = (d.female_male_ratio || "").split(":").map(Number);
        const percent = f && m ? f / (f + m) : 0;
        return x(percent);
      })
      .attr("height", 20)
      .attr("fill", "sandybrown");

    svg.selectAll("text.label")
      .data(top5)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", 0)
      .attr("y", (d, i) => i * 30 + 15)
      .attr("font-size", "12px")
      .attr("text-anchor", "start")
      .text(d => {
        const name = d.university_name;
        return name.length > 30 ? name.slice(0, 27) + "..." : name;
      })
      .append("title")
      .text(d => d.university_name);

    svg.selectAll("text.percent")
      .data(top5)
      .enter()
      .append("text")
      .attr("class", "percent")
      .attr("x", d => {
        const [f, m] = (d.female_male_ratio || "").split(":").map(Number);
        const percent = f && m ? f / (f + m) : 0;
        return 160 + x(percent) + 5;
      })
      .attr("y", (d, i) => i * 30 + 15)
      .attr("font-size", "10px")
      .attr("fill", "#333")
      .text(d => {
        const [f, m] = (d.female_male_ratio || "").split(":").map(Number);
        return f && m ? `${Math.round((f / (f + m)) * 100)}%` : 'N/A';
      });
  }, [data]);

  return <svg ref={ref}></svg>;
};

export default GenderDiversityBar;
