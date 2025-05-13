import React from 'react';

const CountryDropdown = ({ countries, selectedCountry, onChange }) => {
  return (
    <div>
      <label htmlFor="country">Country: </label>
      <select id="country" value={selectedCountry} onChange={e => onChange(e.target.value)}>
        <option value="All">All</option>
        {countries.map((country, i) => (
          <option key={i} value={country}>{country}</option>
        ))}
      </select>
    </div>
  );
};

export default CountryDropdown;