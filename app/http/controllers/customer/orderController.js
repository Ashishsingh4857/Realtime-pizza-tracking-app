const Order = require("../../../models/order");
const moment = require("moment"); //date formet lib

// customers
function orderController() {
  return {
    store(req, res) {
      //   validate request

      const { phone, address, pincode } = req.body;
      if (!phone || !address || !pincode) {
        console.log(req.body);
        req.flash("error", "all fields are required");
        return res.redirect("/cart");
      }
      const order = new Order({
        customerId: req.user._id,
        items: req.session.cart.items,
        phone: phone,
        address: `${address}  ${pincode}`,
      });

      order
        .save()
        .then((result) => {
          Order.populate(result, { path: "customerId" }).then((placedOrder) => {
            req.flash("success", "Order placed Successfully");
            delete req.session.cart;
            // emit
            const eventEmitter = req.app.get("eventEmitter");
            eventEmitter.emit("orderPlaced", placedOrder);
            return res.redirect("/customer/orders");
          });
        })
        .catch((err) => {
          req.flash("error", "Something went wrong");
          return res.redirect("/cart");
        });
    },

    async index(req, res) {
      const orders = await Order.find({ customerId: req.user._id }, null, {
        sort: { createdAt: -1 },
      });
      res.header("Cache-Control", "no-store");
      return res.render("customers/orders", { orders: orders, moment: moment });
    },
    async show(req, res) {
      const order = await Order.findById(req.params.id);
      //authorize user
      if (req.user._id.toString() === order.customerId.toString()) {
        return res.render("customers/singleOrder", { order });
      }
      return res.redirect("/");
    },
  };
}

module.exports = orderController;
