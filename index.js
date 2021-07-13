"use stricts";
import Fuse from "fuse.js";

const loginInfo = document.getElementById("login-info");
const row = document.getElementById("row");

fetch("https://jsonplaceholder.typicode.com/users/1")
  .then((response) => response.json())
  .then((json) => {
    loginInfo.innerHTML = `${json.username}`;
  });

const loadData = () => {
  row.classList.add("spinner-border");
  fetch("https://jsonplaceholder.typicode.com/todos ")
    .then((response) => response.json())
    .then((json) => {
      json.forEach((item) => {
        row.classList.remove("spinner-border");
        let foodCard = document.createElement("div");
        foodCard.classList.add(
          "food-card",
          "col-lg-3",
          "my-3",
          "mx-2",
          "text-center"
        );
        row.appendChild(foodCard);
        let foodTitle = document.createElement("div");
        foodTitle.classList.add("title");
        foodCard.appendChild(foodTitle);
        foodTitle.innerHTML = `${item.title}`;
        let badge = document.createElement("span");
        badge.classList.add("badge", "rounded-pill", "mb-4", "px-3", "py-2");
        foodCard.appendChild(badge);
        badge.classList.add(item.completed ? "bg-success" : "bg-secondary");
        badge.innerHTML = item.completed ? `Completed` : `Not Completed`;
      });
    });
};

loadData();
