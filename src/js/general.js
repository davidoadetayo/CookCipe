const searchForm = document.querySelector(".search-form");
const searchInput = document.querySelector(".search-bar");
const searchBtn = document.querySelector(".search-btn");
const searchIcon = document.querySelector(".icon");
const recipeGrid = document.querySelector(".recipe-display");
const recipeCards = document.querySelector(".recipe-cards")
const recipeCard = document.querySelectorAll(".recipe-card");
const recipeName = document.querySelectorAll(".recipe-name");
const recipeImg = document.querySelectorAll(".recipe-img img");
const modal = document.querySelector("#recipe-modal");
const modalBody = document.querySelector(".modal-body");
const closeBtn = document.querySelector(".close-btn");

const searchAPI = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
const lookupAPI = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
const randomAPI = "https://www.themealdb.com/api/json/v1/1/random.php";

window.addEventListener("scroll", () => {
  const nav = document.querySelector(".nav");
  if (window.scrollY > 50) {
    nav.classList.add("scrolled");
  } else {
    nav.classList.remove("scrolled");
  }
});

closeBtn.addEventListener("click", () => modal.classList.remove("active"));
modal.addEventListener("click", (e) => {
  if (e.target === modal) modal.classList.remove("active");
});
