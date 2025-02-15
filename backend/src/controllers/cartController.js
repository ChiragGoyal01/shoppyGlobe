export const addToCart = async (req, res) => {
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
};

export const updateCartQuantity = async (req, res) => {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    const item = cart.items.find(item => item.productId === req.params.productId);
    if (item) {
        item.quantity = quantity;
        await cart.save();
        res.json(cart);
    } else {
        res.status(404).json({ message: 'Product not in cart' });
    }
};

export const removeFromCart = async (req, res) => {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    cart.items = cart.items.filter(item => item.productId !== req.params.productId);
    await cart.save();
    res.json(cart);
};
