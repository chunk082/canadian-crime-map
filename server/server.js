import express from 'express';
import fetch from 'node-fetch';

const app = express();
const PORT = 3000;

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});

/**
 * GET crime value by vector + year
 */
app.get('/api/value', async (req, res) => {
    const { vector, year } = req.query;

    if (!vector || !year) {
        return res.status(400).json({ error: 'Missing vector or year' });
    }

    const vectorId = Number(vector);

    console.log(`📊 StatCan vector: ${vectorId} year: ${year}`);

    try {
        const response = await fetch(
            'https://www150.statcan.gc.ca/t1/wds/rest/getDataFromVectorsAndLatestNPeriods',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify([
                    {
                        vectorId,
                        latestN: 50 // get enough years
                    }
                ])
            }
        );

        const json = await response.json();

        const points =
            json?.[0]?.object?.vectorDataPoint ?? [];

        // 🔍 FILTER YEAR CLIENT-SIDE
        const match = points.find(p =>
            p.refPerRaw?.startsWith(year)
        );

        if (!match) {
            console.warn(`⚠️ No data for ${year}`);
            return res.json({ value: null });
        }

        console.log(`✅ Found value: ${match.value}`);
        res.json({ value: match.value });

    } catch (err) {
        console.error('❌ StatCan error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});
