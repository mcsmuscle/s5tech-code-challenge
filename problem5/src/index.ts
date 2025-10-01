import express, { Application } from 'express';
import cors from 'cors';
import productRoutes from './features/product/routes/product.route';
import { errorHandler } from './middleware/errorHandler';

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Express CRUD API with TypeScript, PostgreSQL, and Prisma',
    version: '1.0.0',
    endpoints: {
      products: '/api/products',
    },
  });
});

app.use('/api/products', productRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
