"use stricts";
import Fuse from "fuse.js";
import Card from "./component/card.js";

const loginInfo = document.getElementById("login-info");
const row = document.getElementById("row");
const input = document.getElementById("input");
const wannaEat = document.getElementById("wanna-eat");

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
      const fuse = new Fuse(data.record, {
        keys: ["strMeal", "strArea", "strCategory"],
      });

      //removing spinner to after load data
      let inputHandler = debounce(function () {
        // deleted old values
        row.innerHTML = "";

        // setting search text
        wannaEat.innerHTML = `Do you wanna eat <span>${input.value}</span> ? 👌🤤`;
        if (input.value === "")
          wannaEat.innerHTML = `Are you having trouble with making a decision ? 🤔`;

        const results = fuse.search(input.value);
        results.map(({ item }) => {
          row.appendChild(Card(item));
        });
      }, 800);

      input.addEventListener("input", inputHandler);

      row.classList.remove("spinner-border");
    });
};
// deponce settings
const debounce = (func, wait) => {
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    let timeout = setTimeout(later, wait);
  };
};

const checkFavorite = (mealId) => {
  let favoritedData = getLocalFavorites();

  return favoritedData
    ? favoritedData.findIndex((favorite) => {
        return favorite == mealId;
      }) > -1
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

loadData();
