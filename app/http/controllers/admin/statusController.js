const Order = require("../../../models/order");

function statusController() {
  return {
    update(req, res) {
      //   console.log(req.body);
      Order.updateOne({ _id: req.body.orderId }, { status: req.body.status })
        .then((data) => {
          // emit event
          const eventEmitter = req.app.get("eventEmitter");
          eventEmitter.emit("orderUpdated", {
            id: req.body.orderId,
            status: req.body.status,
          });
          return res.redirect("/admin/orders");
        })
        .catch((err) => res.redirect("/admin/orders"));
    },
  };
}
module.exports = statusController;
