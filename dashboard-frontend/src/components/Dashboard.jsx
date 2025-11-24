// dashboard-frontend/src/components/Dashboard.jsx
import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import { 
    Chart as ChartJS, CategoryScale, LinearScale, BarElement, 
    ArcElement, Title, Tooltip, Legend 
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const API_URL = 'http://localhost:5000/api/data';

// --- Helper Functions for Data Transformation ---

// Function to aggregate data for a Bar Chart (e.g., Intensity by Topic)
const getBarChartData = (data, valueKey, labelKey) => {
    const aggregatedData = data.reduce((acc, item) => {
        // Ensure keys are treated consistently (e.g., non-null/non-empty strings)
        const key = (item[labelKey] && String(item[labelKey]).trim() !== '') ? item[labelKey] : 'N/A';
        const value = item[valueKey] || 0;
        acc[key] = (acc[key] || 0) + value;
        return acc;
    }, {});

    // Sort by value (descending) and limit to top 10 for readability
    const sortedKeys = Object.keys(aggregatedData).sort((a, b) => aggregatedData[b] - aggregatedData[a]);
    const topLabels = sortedKeys.slice(0, 10);
    const topValues = topLabels.map(key => aggregatedData[key]);

    return {
        labels: topLabels,
        datasets: [{
            label: `Total ${valueKey} by ${labelKey}`,
            data: topValues,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
        }],
    };
};

// Function to aggregate data for a Pie Chart (e.g., Count by Region)
const getPieChartData = (data, labelKey) => {
    const counts = data.reduce((acc, item) => {
        const key = (item[labelKey] && String(item[labelKey]).trim() !== '') ? item[labelKey] : 'N/A';
        acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {});

    const labels = Object.keys(counts);
    const values = Object.values(counts);

    return {
        labels,
        datasets: [{
            data: values,
            backgroundColor: [
                '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', 
                '#A7D7C5', '#F8B195', '#C06C84', '#6C5B7B'
            ],
            hoverBackgroundColor: [
                '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', 
                '#A7D7C5', '#F8B195', '#C06C84', '#6C5B7B'
            ]
        }]
    };
};


const Dashboard = () => {
    const [data, setData] = useState([]);
    const [filterOptions, setFilterOptions] = useState({});
    const [loading, setLoading] = useState(true);
    
    // NEW: Include 'search' in initial state
    const [filters, setFilters] = useState({
        end_year: '', topics: '', sector: '', region: '', pestle: '', 
        source: '', country: '', city: '', 
        search: '' 
    });

    // Fetch Filter Options (Distinct Values) - Only runs once
    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const response = await axios.get(`${API_URL}/filters`);
                setFilterOptions(response.data);
            } catch (error) {
                console.error("Error fetching filter options:", error);
            }
        };
        fetchFilters();
    }, []);

    // Fetch Filtered Data - Runs whenever 'filters' state changes
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Construct query string, filtering out empty values
                const activeFilters = Object.fromEntries(
                    Object.entries(filters).filter(([, value]) => value)
                );
                const queryString = new URLSearchParams(activeFilters).toString();
                
                const response = await axios.get(`${API_URL}?${queryString}`);
                setData(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        // Debounce the fetch call for search input to prevent excessive API calls
        const handler = setTimeout(() => {
            fetchData();
        }, 300); // 300ms debounce

        return () => {
            clearTimeout(handler);
        };
    }, [filters]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        // The value will be passed as a query string parameter
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    // Derived Chart Data (Use useMemo for performance)
    const intensityByTopic = useMemo(() => getBarChartData(data, 'intensity', 'topics'), [data]);
    const likelihoodByCountry = useMemo(() => getBarChartData(data, 'likelihood', 'country'), [data]);
    const relevanceByRegion = useMemo(() => getPieChartData(data, 'region'), [data]);

    if (loading) return <div className="text-center p-5">Loading Dashboard Data...</div>;

    return (
        <div className="container-fluid p-4">
            <header className="mb-4">
                <h1 className="text-primary">📊 Data Visualization Dashboard</h1>
                <p className="lead">Displaying **{data.length}** records based on current filters.</p>
            </header>

            {/* --- Filters Section --- */}
            <div className="card shadow-sm mb-4">
                <div className="card-header bg-light">
                    <h5 className="mb-0">Control Panel & Filters</h5>
                </div>
                <div className="card-body">
                    
                    {/* --- NEW: Global Search Input Field --- */}
                    <div className="row mb-4">
                        <div className="col-12">
                            <label htmlFor="globalSearch" className="form-label fw-bold">Global Search</label>
                            <input 
                                type="text"
                                className="form-control form-control-lg"
                                id="globalSearch"
                                name="search" 
                                placeholder="Search by Source, Country, Topic, Sector, or Title..."
                                value={filters.search}
                                onChange={handleFilterChange}
                            />
                        </div>
                    </div>
                    
                    {/* --- Existing Dropdown Filters --- */}
                    <div className="row g-3">
                        {/* Map over filter keys, excluding the 'search' key */}
                        {Object.keys(filters)
                            .filter(key => key !== 'search') 
                            .map(key => (
                            <div className="col-md-3 col-sm-6" key={key}>
                                <label htmlFor={key} className="form-label text-capitalize">{key.replace('_', ' ')}</label>
                                <select 
                                    className="form-select" 
                                    id={key} 
                                    name={key} 
                                    value={filters[key]}
                                    onChange={handleFilterChange}
                                >
                                    <option value="">All {key.replace('_', ' ')}</option>
                                    {/* Dynamically get the array of options */}
                                    {filterOptions[key === 'end_year' ? 'years' : key === 'pestle' ? 'pestles' : key + 's']?.map((option, index) => (
                                        <option key={index} value={option}>{option}</option>
                                    ))}
                                </select>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- Data Overview Cards --- */}
            <div className="row mb-4">
                <div className="col-md-3">
                    <div className="card text-white bg-primary mb-3 shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title">Total Records</h5>
                            <p className="card-text fs-2">{data.length}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card text-white bg-success mb-3 shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title">Avg. Intensity</h5>
                            <p className="card-text fs-2">{(data.reduce((sum, item) => sum + (item.intensity || 0), 0) / data.length || 0).toFixed(1)}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card text-white bg-warning mb-3 shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title">Avg. Likelihood</h5>
                            <p className="card-text fs-2">{(data.reduce((sum, item) => sum + (item.likelihood || 0), 0) / data.length || 0).toFixed(1)}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card text-white bg-danger mb-3 shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title">Avg. Relevance</h5>
                            <p className="card-text fs-2">{(data.reduce((sum, item) => sum + (item.relevance || 0), 0) / data.length || 0).toFixed(1)}</p>
                        </div>
                    </div>
                </div>
            </div>


            {/* --- Charts Section --- */}
            <div className="row g-4">
                
                {/* 1. Intensity by Topic */}
                <div className="col-lg-6">
                    <div className="card shadow h-100">
                        <div className="card-header">Top 10 Intensity by Topic</div>
                        <div className="card-body">
                            <Bar 
                                data={intensityByTopic} 
                                options={{ 
                                    responsive: true, 
                                    maintainAspectRatio: false,
                                    plugins: { legend: { position: 'top' } },
                                    scales: { y: { beginAtZero: true } }
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* 2. Likelihood by Country */}
                <div className="col-lg-6">
                    <div className="card shadow h-100">
                        <div className="card-header">Top 10 Likelihood by Country</div>
                        <div className="card-body">
                            <Bar 
                                data={likelihoodByCountry} 
                                options={{ 
                                    indexAxis: 'y', 
                                    responsive: true, 
                                    maintainAspectRatio: false,
                                    plugins: { legend: { position: 'top' } },
                                    scales: { x: { beginAtZero: true } }
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* 3. Relevance Distribution by Region (Pie Chart) */}
                <div className="col-lg-4">
                    <div className="card shadow h-100">
                        <div className="card-header">Record Count Distribution by Region</div>
                        <div className="card-body d-flex align-items-center justify-content-center">
                            <div style={{ height: '300px', width: '300px' }}>
                                <Pie data={relevanceByRegion} options={{ responsive: true, maintainAspectRatio: false }} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Add more charts for Year, Source, PESTLE analysis, etc. */}
            </div>
        </div>
    );
};

export default Dashboard;