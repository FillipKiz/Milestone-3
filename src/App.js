import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';

import TopUniversity from './components/TopUniversity';
import PerformanceChart from './components/PerformanceChart';
import GenderDiversityBar from './components/GenderDiversityBar';
import SizeRatioBubble from './components/SizeRatioBubble';
import InternationalStudentsPie from './components/InternationalStudentsPie';
import CountryDropdown from './components/CountryDropdown';
import GlobalDistributionMap from './components/GlobalDistributionMap';
import TrendTimeline from './components/TrendTimeline';

import csvData from './data/timesData.csv';

function App() {
  const [data, setData] = useState([]);
  const [country, setCountry] = useState('All');
  const [selectedYear, setSelectedYear] = useState(null);
  const [sortBy, setSortBy] = useState('world_rank');

  const fieldLabels = {
    world_rank: 'World Rank',
    income: 'Income',
    teaching: 'Teaching',
    international: 'International Score',
    research: 'Research Score',
  };

  useEffect(() => {
    d3.csv(csvData, d => ({
      world_rank: +d.world_rank,
      university_name: d.university_name,
      country: d.country,
      teaching: +d.teaching,
      international: +d.international,
      research: +d.research,
      citations: +d.citations,
      income: +d.income,
      total_score: +d.total_score || 0,
      num_students: +d.num_students.replace(/,/g, '') || 0,
      student_staff_ratio: +d.student_staff_ratio || 0,
      international_students: parseFloat(d.international_students.replace('%', '')) || 0,
      female_male_ratio: d.female_male_ratio,
      year: +d.year,
    })).then(loaded => {
      setData(loaded);
      const allYears = loaded.map(d => d.year).filter(Boolean);
      setSelectedYear(d3.max(allYears));
    });
  }, []);

  if (!data.length || selectedYear === null) return <div>Loading data...</div>;

  const uniqueCountries = Array.from(new Set(data.map(d => d.country))).sort();

  const filteredData = data.filter(d =>
    (country === 'All' || d.country === country) &&
    d.year === selectedYear
  );

  const sortedTopData = [...filteredData].sort((a, b) => {
    if (sortBy === 'world_rank') return a[sortBy] - b[sortBy];
    return b[sortBy] - a[sortBy];
  }).slice(0, 10);

  const countryLabel = country === 'All' ? 'All Countries' : country;

  const sectionStyle = {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '16px',
    backgroundColor: '#f9f9f9'
  };

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px', background: '#fff' }}>
      <h1 style={{ marginBottom: '10px' }}>World University Rankings Dashboard</h1>

      <CountryDropdown
        countries={uniqueCountries}
        selectedCountry={country}
        onChange={setCountry}
      />

      <div style={{ marginTop: '20px' }}>
        <label htmlFor="year-slider">Select Year: {selectedYear}</label>
        <input
          id="year-slider"
          type="range"
          min={d3.min(data, d => d.year)}
          max={d3.max(data, d => d.year)}
          value={selectedYear}
          onChange={e => setSelectedYear(+e.target.value)}
          style={{ width: '100%' }}
        />
      </div>

      <div style={{ marginTop: '20px' }}>
        <p><strong>Sort Top Universities By:</strong></p>
        {Object.keys(fieldLabels).map(option => (
          <label key={option} style={{ marginRight: '15px' }}>
            <input
              type="radio"
              name="sortBy"
              value={option}
              checked={sortBy === option}
              onChange={(e) => setSortBy(e.target.value)}
            />
            {' '}
            {fieldLabels[option]}
          </label>
        ))}
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)', 
        gap: '30px', 
        marginTop: '30px' 
      }}>
        <div style={{ gridColumn: 'span 2', ...sectionStyle }}>
          <h3>Top 10 Universities ({countryLabel}, {selectedYear})</h3>
          <TopUniversity data={sortedTopData} />
        </div>

        <div style={{ gridColumn: 'span 2', ...sectionStyle }}>
          <h3>Global Distribution</h3>
          <GlobalDistributionMap data={filteredData} />
        </div>

        <div style={sectionStyle}>
          <h3>Performance Breakdown</h3>
          {filteredData.length > 0 && <PerformanceChart data={filteredData[0]} />}
        </div>

        <div style={sectionStyle}>
          <h3>Gender Diversity: female to male</h3>
          <GenderDiversityBar data={filteredData} />
        </div>

        <div style={sectionStyle}>
          <h3>Size vs Ratio</h3>
          <SizeRatioBubble data={filteredData} />
        </div>

        <div style={sectionStyle}>
          <h3>International Students</h3>
          <InternationalStudentsPie data={filteredData} />
        </div>

        <div style={{ gridColumn: '1 / -1', ...sectionStyle }}>
          <h3>Trend Over Time</h3>
          <TrendTimeline data={data.filter(d => country === 'All' || d.country === country)} />
        </div>
      </div>
    </div>
  );
}

export default App;
