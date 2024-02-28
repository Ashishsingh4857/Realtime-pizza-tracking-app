function cartController() {
  return {
    index(req, res) {
      res.render("customers/cart");
    },
    update(req, res) {
      // Example
      // let cart = {
      //     items: {
      //         pizzaId: { item: pizzaObject, qty:0 },
      //         pizzaId: { item: pizzaObject, qty:0 },
      //         pizzaId: { item: pizzaObject, qty:0 },
      //     },
      //     totalQty: 0,
      //     totalPrice: 0
      // }
      // for the first time creating cart and adding basic object structure
      if (!req.session.cart) {
        req.session.cart = {
          items: {},
          totalQuantity: 0,
          totalPrice: 0,
        };
      }
      let cart = req.session.cart;
      // Check if item does not exist in cart
      if (!cart.items[req.body._id]) {
        cart.items[req.body._id] = {
          item: req.body,
          Quantity: 1,
        };
        cart.totalQuantity = cart.totalQuantity + 1;
        cart.totalPrice = cart.totalPrice + req.body.price;
      } else {
        cart.items[req.body._id].Quantity =
          cart.items[req.body._id].Quantity + 1;
        cart.totalQuantity = cart.totalQuantity + 1;
        cart.totalPrice = cart.totalPrice + req.body.price;
      }
      // console.log(cart);

      return res.json({ totalQuantity: req.session.cart.totalQuantity });
    },
  };
}
module.exports = cartController;
