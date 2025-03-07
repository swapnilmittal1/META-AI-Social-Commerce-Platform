import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Props {
  token: string;
}

const Products: React.FC<Props> = ({ token }) => {
  const [products, setProducts] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [imageUrl, setImageUrl] = useState('');

  const fetchProducts = async () => {
    try {
      const resp = await axios.get('/api/products');
      setProducts(resp.data);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const createProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/products', 
        { title, description, price, imageUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Product created!');
      setTitle('');
      setDescription('');
      setPrice(0);
      setImageUrl('');
      fetchProducts();
    } catch (err) {
      console.error('Error creating product:', err);
    }
  };

  const syncToFacebook = async (productId: number) => {
    try {
      // In real usage, you'd get the page token from user-service 
      // or ask the user to provide. For demonstration:
      const pageAccessToken = prompt('Enter your FB Page Access Token:');
      const catalogId = prompt('Enter your Facebook Catalog ID:');
      if (!pageAccessToken || !catalogId) return;

      const resp = await axios.post(
        `/api/products/${productId}/sync`,
        { pageAccessToken, catalogId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(resp.data.message);
      fetchProducts();
    } catch (err) {
      console.error('Error syncing to FB:', err);
    }
  };

  return (
    <div style={{ padding: '10px' }}>
      <h2>Products</h2>
      <div style={{ marginBottom: '20px' }}>
        <h3>Create Product</h3>
        <form onSubmit={createProduct}>
          <div>
            <label>Title:</label><br />
            <input value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div>
            <label>Description:</label><br />
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
          </div>
          <div>
            <label>Price:</label><br />
            <input type="number" value={price} onChange={(e) => setPrice(parseFloat(e.target.value))} required />
          </div>
          <div>
            <label>Image URL:</label><br />
            <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
          </div><br />
          <button type="submit">Create</button>
        </form>
      </div>

      <div>
        <h3>Existing Products</h3>
        {products.map((prod) => (
          <div key={prod.id} style={{ border: '1px solid #ccc', margin: '5px', padding: '5px' }}>
            <strong>{prod.title}</strong><br />
            {prod.description}<br />
            Price: ${prod.price}<br />
            <img src={prod.imageUrl} alt="product" style={{ maxHeight: '80px' }}/>
            <div>
              {prod.fbItemId ? (
                <span>Synced to FB as {prod.fbItemId}</span>
              ) : (
                <button onClick={() => syncToFacebook(prod.id)}>Sync to Facebook</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
