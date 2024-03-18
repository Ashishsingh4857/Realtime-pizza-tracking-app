const addToCart = document.querySelectorAll(".add-to-cart");
import axios from "axios";
let cartCounter = document.querySelector("#cartCounter");
import { Notyf } from "notyf";
import "notyf/notyf.min.css"; // for React, Vue and Svelte
import { initAdmin } from "./admin";
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

initAdmin();
