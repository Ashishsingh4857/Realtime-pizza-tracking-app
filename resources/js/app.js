const addToCart = document.querySelectorAll(".add-to-cart");
import axios from "axios";
let cartCounter = document.querySelector("#cartCounter");
import { Notyf } from "notyf";
import "notyf/notyf.min.css"; // for React, Vue and Svelte
import { initAdmin } from "./admin";
import moment from "moment";
const notyf = new Notyf();

const updateCart = (pizza) => {
  axios
    .post("/update-cart", pizza)
    .then((res) => {
      // console.log(res);
      cartCounter.innerText = res.data.totalQuantity;
      notyf.success("item added to cart");
    })
    .catch((err) => notyf.error("Something went wrong"));
};

addToCart.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const pizza = JSON.parse(btn.dataset.pizza);
    // console.log(pizza);
    updateCart(pizza);
  });
});




// remove alert message after x secound
const alertMsg = document.getElementById("success-alert");
if (alertMsg) {
  setTimeout(() => {
    alertMsg.remove();
  }, 3000);
}

// change order status
let statuses = document.querySelectorAll(".status_line");

let hiddenInput = document.querySelector("#hiddenInput");
let time = document.createElement("small");
let order = hiddenInput ? hiddenInput.value : null;
order = JSON.parse(order);
// console.log(order);

function updateStatus(order) {
  statuses.forEach((status) => {
    status.classList.remove("step-completed");
    status.classList.remove("current");
  });
  let stepCompleted = true;
  statuses.forEach((li) => {
    let dataprop = li.dataset.status;
    if (stepCompleted) {
      li.classList.add("step-completed");
    }
    if (dataprop === order.status) {
      stepCompleted = false;
      time.innerText = moment(order.updatedAt).format("hh:mm A");
      li.appendChild(time);

      if (li.nextSibling) {
        li.nextElementSibling.classList.add("current");
      }
    }
  });
}
updateStatus(order);

// socket
let socket = io();

// join
if (order) {
  socket.emit("join", `order_${order._id}`);
}

let adminAreaPath = window.location.pathname;
if (adminAreaPath.includes("admin")) {
  initAdmin(socket);
  socket.emit("join", "adminRoom");
}

socket.on("orderUpdated", (data) => {
  const updatedOrder = { ...order };
  updatedOrder.updatedAt = moment().format();
  updatedOrder.status = data.status;
  updateStatus(updatedOrder);
  notyf.success("Order Updated");
});


