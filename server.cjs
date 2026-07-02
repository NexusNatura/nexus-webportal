const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const LEDGER_DIR = 'C:\\NEXUS-OS_PROD\\Ledger';

// Ensure the Ledger directory exists
if (!fs.existsSync(LEDGER_DIR)) {
    fs.mkdirSync(LEDGER_DIR, { recursive: true });
}

// Write to ledger
app.post('/api/ledger', (req, res) => {
    try {
        const data = req.body;
        const timestamp = new Date().getTime();
        const filename = `web_asset_${timestamp}.json`;
        const filepath = path.join(LEDGER_DIR, filename);
        
        fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf8');
        console.log(`[Ledger] Web-asset written: ${filename}`);
        
        res.json({ success: true, message: 'Saved to Ledger', filename });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Read from ledger
app.get('/api/ledger', (req, res) => {
    try {
        const files = fs.readdirSync(LEDGER_DIR).filter(f => f.endsWith('.json'));
        const entries = files.map(f => {
            const content = fs.readFileSync(path.join(LEDGER_DIR, f), 'utf8');
            try { return JSON.parse(content); } catch (e) { return null; }
        }).filter(Boolean);
        
        res.json(entries);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Nexus-OS Web-to-Ledger Bridge running on port ${PORT}`);
});
