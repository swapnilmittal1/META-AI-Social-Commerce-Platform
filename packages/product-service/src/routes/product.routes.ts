import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import Product from '../models/Product.model';

const router = Router();

// Middleware to require auth (optional for product mgmt)
function requireAuth(req: Request, res: Response, next: Function) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'No authorization header' });

  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    (req as any).user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalid' });
  }
}

// CREATE product
router.post('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const { title, description, price, imageUrl } = req.body;
    const product = await Product.create({ title, description, price, imageUrl });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create product.' });
  }
});

// GET all products
router.get('/', async (req: Request, res: Response) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products.' });
  }
});

// SYNC product to Facebook Catalog
router.post('/:id/sync', requireAuth, async (req: Request, res: Response) => {
  // In a real scenario, you’d retrieve the user’s FB token from the user-service
  // or from the request if it’s included. For demo, assume we have `pageAccessToken`.
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    
    const { pageAccessToken, catalogId } = req.body; 
    // `catalogId` could be retrieved from user-service or stored in DB once created

    // Example: Using the Graph API to create a product item
    // This is a simplified approach. For production, see:
    // https://developers.facebook.com/docs/marketing-api/catalog-management
    const createItemUrl = `https://graph.facebook.com/v15.0/${catalogId}/products`;
    const payload = {
      retailer_id: `product_${product.id}`,
      name: product.title,
      description: product.description,
      image_url: product.imageUrl,
      price: product.price.toString(),
      availability: 'in stock',
      currency: 'USD'
    };
    const responseFB = await axios.post(
      createItemUrl,
      payload,
      { 
        params: { access_token: pageAccessToken }
      }
    );

    product.fbItemId = responseFB.data.id;
    await product.save();

    res.json({ message: 'Product synced to FB', fbItemId: product.fbItemId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to sync product to Facebook.' });
  }
});

export default router;
