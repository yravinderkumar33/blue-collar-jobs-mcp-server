"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const jobs_1 = __importDefault(require("./routes/jobs"));
const response_1 = require("./utils/response");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// MongoDB connection (update URI as needed)
mongoose_1.default.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/jobs', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));
// Mount job-related routes
app.use('/api/jobs', jobs_1.default);
// Centralized error handling middleware
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json((0, response_1.buildResponsePayload)({
        id: 'api.error',
        result: {},
        responseCode: err.status ? 'ERROR' : 'INTERNAL_ERROR',
        params: {
            status: 'FAILED',
            err: err.name || 'INTERNAL_ERROR',
            errmsg: err.message || 'Internal Server Error'
        }
    }));
});
exports.default = app;
