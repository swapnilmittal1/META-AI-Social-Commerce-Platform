import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Sequelize } from 'sequelize-typescript';
import Product from './models/Product.model';
import productRoutes from './routes/product.routes';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// DB
const sequelize = new Sequelize(process.env.DATABASE_URL || '', {
  dialect: 'postgres',
  models: [Product],
  logging: false
});

sequelize.authenticate()
  .then(async () => {
    console.log('Product Service: DB connected');
    await sequelize.sync({ alter: true });
  })
  .catch((err) => console.error(err));

// Routes
app.use('/products', productRoutes);

const PORT = process.env.PORT || 7002;
app.listen(PORT, () => {
  console.log(`Product Service running on port ${PORT}`);
});
