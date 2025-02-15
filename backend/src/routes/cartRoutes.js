import express from 'express';
import Cart from '../models/Cart.js';
import verifyToken from '../middleware/authMiddleware.js';

const router = express.Router();

// Add product to cart
router.post('/', verifyToken, async (req, res) => {
    const { productId, quantity } = req.body;
    let cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) cart = new Cart({ userId: req.user.id, items: [] });

    const itemIndex = cart.items.findIndex(item => item.productId === productId);
    if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
    } else {
        cart.items.push({ productId, quantity });
    }

    await cart.save();
    res.json(cart);
});

export default router;
