import React, { useState, useEffect } from "react";
import { getMealRegions } from "../api";
import "../pages/Home.css";

interface Props {
  onSearch: (query: string, region?: string) => void;
}

const SearchBar: React.FC<Props> = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [regions, setRegions] = useState<string[]>([]);
  const [searchMode, setSearchMode] = useState<'direct' | 'region'>('direct');

  useEffect(() => {
    const fetchRegions = async () => {
      const data = await getMealRegions();
      const regionNames = data.map(region => region.strArea);
      setRegions(regionNames);
    };
    fetchRegions();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchMode === 'direct' && query.trim()) {
      onSearch(query.trim());
    } else if (searchMode === 'region' && selectedRegion && query.trim()) {
      onSearch(query.trim(), selectedRegion);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <div className="search-modes">
        <button
          type="button"
          className={`mode-button ${searchMode === 'direct' ? 'active' : ''}`}
          onClick={() => setSearchMode('direct')}
        >
          Search by Name
        </button>
        <button
          type="button"
          className={`mode-button ${searchMode === 'region' ? 'active' : ''}`}
          onClick={() => setSearchMode('region')}
        >
          Search by Region
        </button>
      </div>
      <div className="search-container">
        {searchMode === 'region' && (
          <select 
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="region-select"
            required
          >
            <option value="">Select a region</option>
            {regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        )}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={searchMode === 'direct' ? "Search any recipe..." : "Search in region..."}
          required
        />
        <button type="submit">Search</button>
      </div>
    </form>
  );
};

export default SearchBar;
