const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const verifyToken = require('../middleware/authMiddleware');


router.post('/', verifyToken, async (req, res) => {
    if (req.usertype !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
    }

    try {
        const { productId, productName, productDescription, productPrice } = req.body;
        const product = new Product({ productId, productName, productDescription, productPrice });
        await product.save();
        res.status(201).json({ message: 'Product created successfully', product });
    } catch (error) {
        console.error('Product creation error:', error);
        res.status(500).json({ error: 'Product creation failed' });
    }
});


router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        console.error('Fetching products error:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});


router.put('/:productId', verifyToken, async (req, res) => {
    if (req.usertype !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
    }

    try {
        const { productId } = req.params;
        const { productName, productDescription, productPrice } = req.body;

        const updatedProduct = await Product.findOneAndUpdate(
            { productId },
            { productName, productDescription, productPrice },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
    } catch (error) {
        console.error('Product update error:', error);
        res.status(500).json({ error: 'Product update failed' });
    }
});


router.delete('/:productId', verifyToken, async (req, res) => {
    if (req.usertype !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
    }

    try {
        const { productId } = req.params;

        const deletedProduct = await Product.findOneAndDelete({ productId });

        if (!deletedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Product deletion error:', error);
        res.status(500).json({ error: 'Product deletion failed' });
    }
});

module.exports = router;
