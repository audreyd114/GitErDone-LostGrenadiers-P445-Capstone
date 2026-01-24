import { get_floor_corners } from './js/getMockRoute.js';

app.get('/api/floor-corners/:buildingId', async (req, res) => {
    try {
        const buildingId = Number(req.params.buildingId);
        const corners = await get_floor_corners(buildingId);
        res.json(corners);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch floor corners' });
    }
});
