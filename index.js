"use stricts";
import Fuse from "fuse.js";

const loginInfo = document.getElementById("login-info");
const row = document.getElementById("row");

fetch("https://jsonplaceholder.typicode.com/users/1")
  .then((response) => response.json())
  .then((json) => {
    loginInfo.innerHTML = `${json.username}`;
  });

fetch("https://api.jsonbin.io/v3/b/60ef40fdc1256a01cb6f37ad", {
  headers: {
    "X-Master-Key":
      "$2b$10$WJx4a/x7fH5t4H/dSIoCf.9NRJ6b1j4giOf4aBEOw0OknnCEE9GWG",
  },
})
  .then((response) => response.json())
  .then((data) => console.log(data));

const loadData = () => {
  row.classList.add("spinner-border");
  fetch("https://jsonplaceholder.typicode.com/todos ")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      row.classList.remove("spinner-border");
      data.map((item) => {
        row.appendChild(Card(item));
      });
    });
};

const Card = ({ id, title, completed }) => {
  let foodCard = document.createElement("div");
  let foodTitle = document.createElement("div");
  let badge = document.createElement("span");

  //Card Container
  foodCard.classList.add(
    "food-card",
    "col-lg-3",
    "my-3",
    "mx-2",
    "text-center"
  );
  foodCard.setAttribute("id", `card-${id}`);
  // Card title
  foodTitle.classList.add("title");
  foodTitle.innerHTML = title;
  // card  favorite badge
  badge.classList.add("badge", "rounded-pill", "mb-4", "px-3", "py-2");
  badge.classList.add(completed ? "bg-success" : "bg-secondary");
  badge.innerHTML = completed ? `Favorited` : `Not Favorited`;
  // add to card containers
  foodCard.appendChild(foodTitle);
  foodCard.appendChild(badge);

  return foodCard;
};

loadData();
