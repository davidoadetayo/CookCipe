searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchTerm = searchInput.value.trim();

  console.log("Search Term:", searchTerm);

  if (!searchTerm) {
    searchForm.classList.add("error");
    searchInput.placeholder = "Please enter a recipe";
    return;
  }

  searchForm.classList.remove("error");
  searchInput.placeholder = "Search for a recipe (e g Chicken)";

  recipeGrid.classList.remove("hidden");
  recipeCards.innerHTML = `
    <div class="recipe-card loading"></div>
    <div class="recipe-card loading"></div>
    <div class="recipe-card loading"></div>
  `;

  searchRecipe(searchTerm);
});

searchInput.addEventListener("input", () => {
  searchForm.classList.remove("error");
});

async function searchRecipe(query) {
  try {
    const response = await fetch(`${searchAPI}${query}`);

    if (!response.ok) throw new Error("Failed to find results on " + query);

    const data = await response.json();
    console.log(data);

    recipeCards.innerHTML = "";

    if (!data.meals) {
      console.log("No recipes found for this search.");
      recipeCards.innerHTML = `<p class="error-msg">No recipes found for "${query}"  Try another search!</p>`;
      return;
    }

    const cardsHTML = data.meals
      .map((meal) => {
        return `
          <div class="recipe-card" data-id="${meal.idMeal}">
            <div class="recipe-img">
              <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
            </div>
            <h3 class="recipe-name">${meal.strMeal}</h3>
          </div>
        `;
      })
      .join("");

    recipeCards.innerHTML = cardsHTML;

    document.querySelectorAll(".recipe-card").forEach((card) => {
      card.addEventListener("click", () => {
        const mealId = card.getAttribute("data-id");

        const meal = data.meals.find((m) => m.idMeal === mealId);

        if (!meal) return;

        let ingredientsHTML = "";
        for (let i = 1; i <= 20; i++) {
          const ingredient = meal[`strIngredient${i}`];
          const measure = meal[`strMeasure${i}`];

          if (ingredient && ingredient.trim() !== "") {
            ingredientsHTML += `<li><strong>${measure ? measure.trim() : ""}</strong> ${ingredient.trim()}</li>`;
          }
        }

        const instructionsHTML = meal.strInstructions
          .split(/\r?\n/)
          .filter((step) => step.trim() !== "")
          .map((step) => `<li>${step.trim()}</li>`)
          .join("");

        modalBody.innerHTML = `
          <header class="recipe-header">
            <span class="recipe-category">${meal.strCategory || ""} • ${meal.strArea || ""}</span>
            <h1 class="recipe-title">${meal.strMeal}</h1>
          </header>

          <figure class="recipe-hero">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
          </figure>

          <div class="recipe-body">
            <section class="recipe-ingredients">
              <h2>Ingredients</h2>
              <ul>${ingredientsHTML}</ul>
            </section>

            <section class="recipe-instructions">
              <h2>Instructions</h2>
              <ol>${instructionsHTML}</ol>
            </section>
          </div>

          <footer class="recipe-footer">
            ${
              meal.strYoutube
                ? `
              <a href="${meal.strYoutube}" target="_blank" rel="noopener" class="video-btn">
                <span>▶</span> Watch Video Tutorial
              </a>
            `
                : ""
            }
          </footer>
        `;

        modal.classList.add("active");
      });
    });
  } catch (error) {
    console.error("Failed to find results on ", query);
    recipeCards.innerHTML = `<p class="error-msg">No recipes found for "${query}". Try another search!</p>`;
  }
}
