"use stricts";
import Fuse from "fuse.js";

const loginInfo = document.getElementById("login-info");
const row = document.getElementById("row");
const input = document.getElementById("input");
const wannaEat = document.getElementById("wanna-eat");
let tabIndex = 1;

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
      //
      data.record.forEach((meal) => {
        let isFavorite = checkFavorite(meal.idMeal);
        if (isFavorite) console.log(meal);
        return Object.assign(meal, { isFavorited: isFavorite });
      });
      console.log(data);

      const fuse = new Fuse(data.record, {
        keys: ["strMeal", "strArea", "strCategory"],
      });

      //removing spinner to after load data

      row.classList.remove("spinner-border");

      input.addEventListener("input", (event) => {
        // deleted old values
        row.innerHTML = "";

        // setting search text
        let searchValue = input.value;
        wannaEat.innerHTML = `Do you wanna eat <span>${input.value}</span> ? 👌🤤`;
        if (searchValue === "")
          wannaEat.innerHTML = `Are you having trouble with making a decision ? 🤔`;

        const results = fuse.search(input.value);
        results.map(({ item }) => {
          row.appendChild(Card(item));
        });
      });
    });
};

const checkFavorite = (mealId) => {
  let favoritedData = getLocalFavorites();

  return favoritedData !== null && favoritedData.length !== 0
    ? isFavorited(favoritedData, mealId)
    : false;
};

const getLocalFavorites = () => {
  let localFavoritedData = localStorage.getItem(LOCAL_FAVORITED_DB);
  return localFavoritedData ? JSON.parse(localFavoritedData) : null;
};

const updateFavorites = (newFavoriteArray) => {
  localStorage.setItem(LOCAL_FAVORITED_DB, JSON.stringify(newFavoriteArray));
};

const addFavoriteItem = (mealId) => {
  updateFavorites([...getLocalFavorites(), mealId]);
};

const deleteFavoriteItem = (mealId, favoriteArray) => {
  let newFavoriteArray = favoriteArray.filter((favorite) => {
    favorite != mealId;
  });
  updateFavorites(newFavoriteArray);
  // dom fav button uptade
  document.getElementById("fav-" + mealId).style.color = "black";
};

const LOCAL_FAVORITED_DB = "favorite-meals";

const isFavorited = (favoritedData, mealId) => {
  favoritedData.findIndex((favorite) => {
    return favorite === mealId;
  }) !== -1
    ? true
    : false;
};

const saveToLocalFavorited = (mealId) => {
  let favoritedData = getLocalFavorites();
  console.log(favoritedData);
  //favorited data var ise
  if (favoritedData !== null) {
    isFavorited(favoritedData, mealId)
      ? deleteFavoriteItem(mealId, favoritedData)
      : addFavoriteItem(mealId);
  } else {
    updateFavorites([mealId]);
  }
};

const Card = ({
  idMeal,
  strMeal,
  strMealThumb,
  strYoutube,
  strCategory,
  strArea,
}) => {
  const foodCard = document.createElement("div");
  const foodTitle = document.createElement("div");
  const imageThumb = document.createElement("img");
  const youtube = document.createElement("div");
  const favoriteButton = document.createElement("i");
  const BadgeParent = document.createElement("div");
  const category = document.createElement("span");
  const area = document.createElement("span");

  //Card Container
  foodCard.classList.add(
    "food-card",
    "col-lg-4",
    "col-md-6",
    "my-3",
    "mx-auto"
  );
  foodCard.setAttribute("tabIndex", tabIndex);
  tabIndex++;
  foodCard.setAttribute("id", `card-${idMeal}`);
  // Card image
  imageThumb.classList.add("img-top");
  imageThumb.src = strMealThumb;
  // Card favorite button
  favoriteButton.classList.add("fas", "fa-2x", "fa-heart", "mt-2");
  favoriteButton.setAttribute("id", `fav-${idMeal}`);
  // Card title
  foodTitle.classList.add("title");
  foodTitle.innerHTML = strMeal;
  // badge parent
  BadgeParent.classList.add("d-flex", "justify-content-between", "mb-3");
  // category badge
  category.classList.add("badge", "rounded-pill", "bg-success");
  category.innerHTML = strCategory;
  //are badge
  area.classList.add("badge", "rounded-pill", "bg-dark");
  area.innerHTML = strArea;
  // Card youtube link
  youtube.classList.add("more-btn");
  youtube.innerHTML =
    "<a href='" + strYoutube + "' target='_blank'>Watch The Video</a>";
  // add to card containers
  foodCard.appendChild(imageThumb);
  foodCard.appendChild(favoriteButton);
  foodCard.appendChild(foodTitle);
  foodCard.appendChild(BadgeParent);
  BadgeParent.appendChild(category);
  BadgeParent.appendChild(area);
  foodCard.appendChild(youtube);

  // Click Events
  foodCard.addEventListener("click", function () {
    // Focus on the exact box
    foodCard.focus();
    console.log("You've cliked to : ", this.id);
  });

  // Key Events
  foodCard.addEventListener("keyup", (event) => {
    console.log("You've pressed : ", event.key);
  });
  // When we click outside of a <div>
  foodCard.addEventListener("focusout", (event) => {
    console.log("You've focused out of : " + event.target.id);
  });

  favoriteButton.addEventListener("click", (event) => {
    favoriteButton.style.color = "pink";
    console.log(foodCard.id.substr(5));
    saveToLocalFavorited(foodCard.id.substr(5));
  });

  return foodCard;
};

loadData();
