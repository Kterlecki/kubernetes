import express, { Request, Response, Application, NextFunction } from 'express';
import cors from 'cors';
import promClient from 'prom-client';

const app = express();
const PORT = process.env.PORT || 3001;

// ============ PROMETHEUS METRICS SETUP ============

// Create a Registry to register metrics
const register = new promClient.Registry();

// Add default metrics (CPU, memory, event loop, etc.)
promClient.collectDefaultMetrics({ register });

// Custom metric: HTTP request counter
const httpRequestsTotal = new promClient.Counter({
    name: 'backend_http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'path', 'status'],
    registers: [register]
});

// Custom metric: HTTP request duration histogram
const httpRequestDuration = new promClient.Histogram({
    name: 'backend_http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'path', 'status'],
    buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5],
    registers: [register]
});

// Custom metric: Active requests gauge
const activeRequests = new promClient.Gauge({
    name: 'backend_http_active_requests',
    help: 'Number of active HTTP requests',
    registers: [register]
});

// Middleware to track metrics for all requests
app.use((req: Request, res: Response, next: NextFunction) => {
    // Skip metrics endpoint to avoid recursion
    if (req.path === '/metrics') {
        return next();
    }

    const startTime = Date.now();
    activeRequests.inc();

    res.on('finish', () => {
        const duration = (Date.now() - startTime) / 1000;
        const labels = {
            method: req.method,
            path: req.route?.path || req.path,
            status: res.statusCode.toString()
        };

        httpRequestsTotal.inc(labels);
        httpRequestDuration.observe(labels, duration);
        activeRequests.dec();
    });

    next();
});

// ============ END PROMETHEUS SETUP ============

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Metrics endpoint for Prometheus to scrape
app.get('/metrics', async (req: Request, res: Response) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
});

app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString()
    });
});

app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Welcome to the Backend API' });
});

app.get('/api/data', (req: Request, res: Response) => {
    res.status(200).json({
        data: {
            "test": 'This is some sample data from the backend API',
            "test-two": 'This is some more sample data from the backend API'
            }
        });
    });

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
