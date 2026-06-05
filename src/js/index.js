recipeCards.innerHTML = `
  <div class="recipe-card loading"><div class="recipe-img"></div><h3></h3></div>
  <div class="recipe-card loading"><div class="recipe-img"></div><h3></h3></div>
  <div class="recipe-card loading"><div class="recipe-img"></div><h3></h3></div>
  <div class="recipe-card loading"><div class="recipe-img"></div><h3></h3></div>
  <div class="recipe-card loading"><div class="recipe-img"></div><h3></h3></div>
  <div class="recipe-card loading"><div class="recipe-img"></div><h3></h3></div>
  <div class="recipe-card loading"><div class="recipe-img"></div><h3></h3></div>
  <div class="recipe-card loading"><div class="recipe-img"></div><h3></h3></div>

`;

window.addEventListener("load", () => {
  fetchRecipe();
});

const recipeList = [];

async function fetchRecipe() {
  try {
    for (let i = 0; i <= 7; i++) {
      const response = await fetch(randomAPI);
      if (!response.ok) throw new Error("Unable to fetch recipes");
      const data = await response.json();
      recipeList.push(...data.meals);
    }

    if (recipeList.length === 0) {
      recipeCards.innerHTML = `<p class="error-msg">Unable to fetch recipes. Reload the site</p>`;
      return;
    }
    recipeCards.innerHTML = "";

    const cardsHTML = recipeList
      .map(
        (meal) => `
        <div class="recipe-card" data-id="${meal.idMeal}">
          <div class="recipe-img">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
          </div>
          <h3 class="recipe-name">${meal.strMeal}</h3>
        </div>
      `,
      )
      .join("");
    recipeCards.innerHTML = cardsHTML;

    document.querySelectorAll(".recipe-card").forEach((card) => {
      card.addEventListener("click", () => {
        const mealId = card.getAttribute("data-id");
        const meal = recipeList.find((m) => m.idMeal === mealId);

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
    console.error("Error:", error);
  }
}
