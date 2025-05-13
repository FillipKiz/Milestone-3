import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const InternationalStudentsPie = ({ data }) => {
  const containerRef = useRef();
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 250, height = 250, radius = 100;
    svg.attr('width', width).attr('height', height);

    const g = svg.append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    const tooltip = d3.select(containerRef.current)
      .append('div')
      .style('position', 'absolute')
      .style('padding', '6px 10px')
      .style('background', '#333')
      .style('color', '#fff')
      .style('border-radius', '4px')
      .style('font-size', '12px')
      .style('pointer-events', 'none')
      .style('opacity', 0);

    const intlPercent = data[0]?.international_students || 0;
    const domesticPercent = 100 - intlPercent;

    const pie = d3.pie().sort(null);
    const arc = d3.arc().innerRadius(0).outerRadius(radius);

    const pieData = pie([intlPercent, domesticPercent]);
    const colors = d3.scaleOrdinal().range(['#264653', '#e76f51']);

    g.selectAll('path')
      .data(pieData)
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', (d, i) => colors(i))
      .attr('stroke', '#fff')
      .on('mouseover', (event, d) => {
        tooltip
          .style('opacity', 1)
          .html(`${d.index === 0 ? 'International' : 'Domestic'}: ${d.value.toFixed(1)}%`);
      })
      .on('mousemove', event => {
        tooltip
          .style('left', `${event.offsetX + 10}px`)
          .style('top', `${event.offsetY - 10}px`);
      })
      .on('mouseout', () => {
        tooltip.style('opacity', 0);
      });

  }, [data]);

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '250px', height: '250px', overflow: 'hidden' }}>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default InternationalStudentsPie;
