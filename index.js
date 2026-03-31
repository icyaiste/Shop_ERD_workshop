import express from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const app = express();
app.use(express.json());

//Create a product
app.post('/products', async (req, res) => {
  try {
    const newProduct = await prisma.product.create({
      data: req.body,
    });
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product' });
  }
});

//Get products with query filters
app.get('/products', async (req, res) => {
  try {
    const { category, priceMax } = req.query;
    const numericPriceMax = priceMax !== undefined ? Number(priceMax) : undefined; //Converts priceMax from string to number

    const products = await prisma.product.findMany({
      where: {
        category: category ? { name: { equals: (category) } } : undefined,
        price:
          numericPriceMax !== undefined && !Number.isNaN(numericPriceMax) //isNan protects against invalid priceMax values
            ? { lte: numericPriceMax }//if both true - applies filter to price
            : undefined,
      },
      include: { category: true },
    });
    res.json(products);
  } catch (error) {
    console.error('Get filtered /products failed:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.patch('/products/:id', async (req, res) => {
  try {
    const updatedProduct = await prisma.product.update({
      where: { id: Number(req.params.id) },
      data: req.body,
    });
    res.json(updatedProduct);
  } catch (error) {
    console.error('Patch /products/:id failed:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});