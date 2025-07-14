// data-handler.js
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.resolve(__dirname, 'data'); // always use project/data/

// Ensure the data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

class KVStore {
    constructor(filename = 'store.json') {
        if (!filename.endsWith('.json')) {
            throw new Error(`Invalid filename: ${filename} must end with .json`);
        }

        this.file = path.join(DATA_DIR, filename);
        this.data = {};

        if (fs.existsSync(this.file)) {
            try {
                const raw = fs.readFileSync(this.file);
                this.data = JSON.parse(raw);
            } catch (err) {
                console.error(`Error reading ${this.file}:`, err);
            }
        } else {
            this._save();
        }
    }

    _save() {
        fs.writeFileSync(this.file, JSON.stringify(this.data, null, 4));
    }

    set(key, value) {
        this.data[key] = value;
        this._save();
    }

    get(key) {
        return this.data[key];
    }

    delete(key) {
        delete this.data[key];
        this._save();
    }

    has(key) {
        return Object.prototype.hasOwnProperty.call(this.data, key);
    }

    all() {
        return this.data;
    }

    clear() {
        this.data = {};
        this._save();
    }
}

module.exports = KVStore;
