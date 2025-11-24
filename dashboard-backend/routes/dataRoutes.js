// dashboard-backend/routes/dataRoutes.js
const express = require('express');
const Data = require('../models/Data');
const router = express.Router();

// @route   GET /api/data
// @desc    Fetch all data, with optional filtering and searching
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { 
        end_year, topics, sector, region, pestle, 
        source, country, city, 
        search // <-- NEW: Search term
    } = req.query;
    
    const query = {};

    // 1. Static Filters (Exact Match)
    // Note: 'year' in the DB is used for 'end_year'
    if (end_year) query.year = parseInt(end_year);
    if (topics) query.topics = topics;
    if (sector) query.sector = sector;
    if (region) query.region = region;
    if (pestle) query.pestle = pestle; 
    if (source) query.source = source;
    if (country) query.country = country;
    if (city) query.city = city;

    // 2. Dynamic Search Filter (Text Search using $or and $regex)
    if (search) {
        const searchRegex = new RegExp(search, 'i'); // 'i' for case-insensitive
        
        // Add $or condition to the existing query object
        query.$or = [
            { source: { $regex: searchRegex } },
            { country: { $regex: searchRegex } },
            { topics: { $regex: searchRegex } },
            { region: { $regex: searchRegex } },
            { sector: { $regex: searchRegex } },
            { title: { $regex: searchRegex } }, // Assuming your data has a 'title' field
            // You can add more text fields here
        ];
    }

    const data = await Data.find(query);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET /api/data/filters
// @desc    Get distinct values for filters
// @access  Public
router.get('/filters', async (req, res) => {
    try {
        const filters = await Data.aggregate([
            {
                $group: {
                    _id: null,
                    years: { $addToSet: "$year" },
                    topics: { $addToSet: "$topics" },
                    sectors: { $addToSet: "$sector" },
                    regions: { $addToSet: "$region" },
                    pestles: { $addToSet: "$pestle" },
                    sources: { $addToSet: "$source" },
                    countries: { $addToSet: "$country" },
                    cities: { $addToSet: "$city" },
                }
            }
        ]);

        if (filters.length > 0) {
            // Clean up and filter null/empty values
            const filterData = filters[0];
            const cleanFilters = (arr) => arr.filter(f => f && typeof f === 'string' ? f.trim() !== '' : f !== null);

            res.json({
                years: cleanFilters(filterData.years).sort((a, b) => a - b),
                topics: cleanFilters(filterData.topics).sort(),
                sectors: cleanFilters(filterData.sectors).sort(),
                regions: cleanFilters(filterData.regions).sort(),
                pestles: cleanFilters(filterData.pestles).sort(),
                sources: cleanFilters(filterData.sources).sort(),
                countries: cleanFilters(filterData.countries).sort(),
                cities: cleanFilters(filterData.cities).sort(),
            });
        } else {
            res.json({});
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});


module.exports = router;