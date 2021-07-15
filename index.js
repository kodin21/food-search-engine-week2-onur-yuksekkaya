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
  // adding spinner to before load data
  row.classList.add("spinner-border");
  fetch("https://api.jsonbin.io/v3/b/60ef40fdc1256a01cb6f37ad", {
    headers: {
      "X-Master-Key":
        "$2b$10$WJx4a/x7fH5t4H/dSIoCf.9NRJ6b1j4giOf4aBEOw0OknnCEE9GWG",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      //removing spinner to after load data
      row.classList.remove("spinner-border");
      console.log(data.record);
      data.record.map((item) => {
        row.appendChild(Card(item));
      });
    });
};

const Card = ({ idMeal, strMeal, strMealThumb, strYoutube }) => {
  let foodCard = document.createElement("div");
  let foodTitle = document.createElement("div");
  let imageThumb = document.createElement("img");
  let youtube = document.createElement("div");

  //Card Container
  foodCard.classList.add(
    "food-card",
    "col-lg-4",
    "col-md-6",
    "my-3",
    "mx-auto"
  );
  foodCard.setAttribute("id", `card-${idMeal}`);
  // Card title
  foodTitle.classList.add("title");
  foodTitle.innerHTML = strMeal;
  // Card image
  imageThumb.classList.add("img-top");
  imageThumb.src = strMealThumb;
  // Card youtube link
  youtube.classList.add("more-btn");
  youtube.innerHTML =
    "<a href='" + strYoutube + "' target='_blank'>Watch The Video</a>";
  // add to card containers
  foodCard.appendChild(imageThumb);
  foodCard.appendChild(foodTitle);
  foodCard.appendChild(youtube);

  return foodCard;
};

loadData();
