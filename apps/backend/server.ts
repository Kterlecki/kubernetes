import express, { Request, Response, Application } from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
