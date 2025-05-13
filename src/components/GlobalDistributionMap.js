import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import worldData from '../data/world-110m.json';

const COUNTRY_NAME_FIXES = {
  "Czech Republic": "Czechia",
  "Republic of Ireland": "Ireland",
  "South Korea": "Korea, Republic of",
  "North Korea": "Korea, Democratic People's Republic of",
  "Iran": "Iran (Islamic Republic of)",
  "Syria": "Syrian Arab Republic",
  "Vietnam": "Viet Nam",
  "Venezuela": "Venezuela (Bolivarian Republic of)",
  "Tanzania": "Tanzania, United Republic of",
  "Moldova": "Republic of Moldova",
  "Bolivia": "Bolivia (Plurinational State of)",
  "Brunei": "Brunei Darussalam",
  "Laos": "Lao People's Democratic Republic",
  "Micronesia": "Micronesia (Federated States of)",
  "Palestine": "Palestine, State of",
  "Russia": "Russian Federation",
  "United States": "United States of America",
  "Unted Kingdom": "United Kingdom",
  "Unisted States of America": "United States of America"
};

const normalizeCountryName = name => COUNTRY_NAME_FIXES[name] || name;

const GlobalDistributionMap = ({ data }) => {
  const ref = useRef();

  useEffect(() => {
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const width = 600;
    const height = 350;
    svg.attr("width", width).attr("height", height);

    const projection = d3.geoMercator()
      .scale(100)
      .translate([width / 2, height / 1.4]);

    const path = d3.geoPath().projection(projection);

    const countryRanks = d3.rollups(
      data,
      v => {
        const validRanks = v.map(d => +d.world_rank).filter(r => !isNaN(r));
        return validRanks.length ? d3.mean(validRanks) : 100;
      },
      d => normalizeCountryName(d.country)
    );
    const rankMap = new Map(countryRanks);

    const countries = topojson.feature(worldData, worldData.objects.countries).features;

    const colorScale = d3.scaleLinear()
      .domain([0, 100])
      .range(["#e0f3f8", "#084081"]);

    const tooltip = d3.select("body")
      .append("div")
      .attr("class", "map-tooltip")
      .style("position", "absolute")
      .style("background", "#fff")
      .style("padding", "6px 10px")
      .style("border", "1px solid #ccc")
      .style("border-radius", "4px")
      .style("pointer-events", "none")
      .style("font-size", "12px")
      .style("box-shadow", "0 2px 6px rgba(0,0,0,0.15)")
      .style("opacity", 0);

    svg.selectAll("path")
      .data(countries)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("fill", d => {
        const normalized = normalizeCountryName(d.properties.name);
        const rank = rankMap.get(normalized);
        return rank !== undefined ? colorScale(rank) : "#ccc";
      })
      .attr("stroke", "#fff")
      .attr("stroke-width", 0.5)
      .on("mouseover", function (event, d) {
        const name = normalizeCountryName(d.properties.name);
        tooltip
          .style("opacity", 1)
          .html(`<strong>${name}</strong>`);
        d3.select(this)
          .attr("stroke-width", 1.5)
          .attr("stroke", "#000");
      })
      .on("mousemove", function (event) {
        tooltip
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 28}px`);
      })
      .on("mouseout", function () {
        tooltip.style("opacity", 0);
        d3.select(this)
          .attr("stroke-width", 0.5)
          .attr("stroke", "#fff");
      });

  }, [data]);

  return <svg ref={ref}></svg>;
};

export default GlobalDistributionMap;
