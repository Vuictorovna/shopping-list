const PRODUCTS = [
  "salt",
  "sugar",
  "flour",
  "butter",
  "eggs",
  "milk",
  "whipping cream",
  "oil",
  "garlic",
  "onion",
  "carrot",
  "pepper",
  "tomato",
  "chicken",
  "rice",
  "cheese",
  "lemon",
  "vanilla",
  "cinnamon",
  "chocolate",
  "honey",
  "cream",
  "bacon",
  "potato",
  "parsley",
  "oregano",
  "thyme",
];

const recipesData = JSON.parse(localStorage.getItem("recipes"));

for (const recipeId in recipesData) {
  const savedRecipe = recipesData[recipeId];
  const recipe = makeRecipe(recipeId, savedRecipe.name);

  const main = recipe.querySelector(".main");
  savedRecipe.ingredients.forEach((ingredient) => {
    const { name, amount } = ingredient;
    const productSelect = makeProductSelect(name, amount);
    main.appendChild(productSelect);
  });

  document.body.appendChild(recipe);
}

const addBtn = document.getElementById("add_recipe");
addBtn.addEventListener("click", () => {
  const recipe = makeRecipe(crypto.randomUUID());
  document.body.appendChild(recipe);
});

const shoppingListBtn = document.getElementById("shopping_list");
shoppingListBtn.addEventListener("click", () => createShoppingList());

function makeRecipe(recipeID, recipeName) {
  const recipe = document.createElement("div");
  recipe.classList.add("recipe");
  recipe.dataset.id = recipeID;

  const tools = document.createElement("div");
  tools.classList.add("tools");

  const main = document.createElement("div");
  main.classList.add("main");

  const recipeNameInput = document.createElement("input");
  recipeNameInput.type = "text";
  recipeNameInput.placeholder = "Add recipe";
  if (recipeName) {
    recipeNameInput.value = recipeName;
  }
  recipeNameInput.classList.add("recipe-input");

  const addBtn = document.createElement("button");
  addBtn.classList.add("add");
  addBtn.innerHTML = '<i class="fas fa-plus"></i>';
  addBtn.addEventListener("click", () => {
    const productSelect = makeProductSelect();
    main.appendChild(productSelect);
  });

  const saveBtn = document.createElement("button");
  saveBtn.classList.add("saveBtn");
  saveBtn.innerHTML = '<i class="fas fa-save"></i>';
  saveBtn.addEventListener("click", () => {
    saveRecipe(recipe);
  });

  const deleteRecipeBtn = document.createElement("button");
  deleteRecipeBtn.classList.add("deleterecipe");
  deleteRecipeBtn.innerHTML = '<i class="fas fa-times"></i>';
  deleteRecipeBtn.addEventListener("click", () => {
    recipe.remove();
    deleteRecipe(recipe);
  });

  const downloadBtn = document.createElement("button");
  downloadBtn.classList.add("downloadBtn");
  downloadBtn.innerHTML = '<i class="fas fa-download"></i>';
  downloadBtn.addEventListener("click", (event) => createDownload(event));

  tools.appendChild(addBtn);
  tools.appendChild(saveBtn);
  tools.appendChild(downloadBtn);
  tools.appendChild(deleteRecipeBtn);

  main.appendChild(recipeNameInput);
  recipe.appendChild(tools);
  recipe.appendChild(main);

  return recipe;
}

function makeProductSelect(selectedIngredientName, selectedIngredientAmount) {
  console.log(selectedIngredientName, selectedIngredientAmount);
  const container = document.createElement("div");
  container.classList.add("product-container");

  // Create the options
  const select = document.createElement("select");
  select.classList.add("product-select");

  const noneOption = document.createElement("option");
  noneOption.value = "";
  noneOption.text = "Select product";
  select.add(noneOption);

  for (const product of PRODUCTS) {
    const option = document.createElement("option");
    option.value = product;
    option.text = product;
    if (selectedIngredientName === product) {
      option.selected = true;
    }
    select.add(option);
  }

  // Create the amount input
  const amountInput = document.createElement("input");
  amountInput.classList.add("amount-input");

  amountInput.type = "number";
  amountInput.min = 1;
  amountInput.max = 10000;
  amountInput.value = 1;
  if (selectedIngredientAmount) {
    amountInput.value = selectedIngredientAmount;
  }

  //Create delete button
  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("delete");
  deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
  deleteBtn.addEventListener("click", () => {
    container.remove();
  });

  container.appendChild(select);
  container.appendChild(amountInput);
  container.appendChild(deleteBtn);

  return container;
}

function saveRecipe(recipe) {
  const recipeId = recipe.dataset.id;
  const recipeNameInput = recipe.querySelector(".recipe-input");
  const productContainers = recipe.querySelectorAll(".product-container");

  const recipeName = recipeNameInput.value.trim();
  if (!recipeName) {
    alert("Please enter a recipe name");
    return;
  }

  const ingredients = [];

  for (const container of productContainers) {
    const select = container.querySelector(".product-select");
    const amount = container.querySelector(".amount-input");
    const ingredient = {
      name: select.value.trim(),
      amount: amount.value.trim(),
    };

    if (!ingredient.name) {
      alert("Please select ingredient");
      return;
    }

    ingredients.push(ingredient);
  }

  const recipesData = JSON.parse(localStorage.getItem("recipes")) || {};

  recipesData[recipeId] = {
    name: recipeName,
    ingredients: ingredients,
  };

  localStorage.setItem("recipes", JSON.stringify(recipesData));
}

function deleteRecipe(recipe) {
  const recipeId = recipe.dataset.id;

  const recipesData = JSON.parse(localStorage.getItem("recipes")) || {};

  delete recipesData[recipeId];

  localStorage.setItem("recipes", JSON.stringify(recipesData));
}

function createDownload(event) {
  const selectedRecipe = event.target.closest(".recipe");
  const recipeId = selectedRecipe.dataset.id;
  const recipeName = selectedRecipe.querySelector(".recipe-input").value.trim();

  const recipesData = JSON.parse(localStorage.getItem("recipes")) || {};
  const recipe = findRecipeById(recipesData, recipeId);

  if (!recipe) {
    console.log("Recipe not found.");
    return;
  }

  const shoppingListContent = recipe.ingredients
    .map((ingredient) => `${ingredient.name} ${ingredient.amount}`)
    .join("\n");

  const blob = new Blob([shoppingListContent], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${recipeName}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function findRecipeById(recipesData, recipeId) {
  for (const key in recipesData) {
    if (key === recipeId) {
      return recipesData[key];
    }
  }
  return null;
}

function createShoppingList() {
  const recipesData = JSON.parse(localStorage.getItem("recipes")) || {};
  const shoppingList = {};

  for (const recipeId in recipesData) {
    const recipe = recipesData[recipeId];
    recipe.ingredients.forEach((ingredient) => {
      const { name, amount } = ingredient;
      if (shoppingList[name]) {
        shoppingList[name] += parseInt(amount);
      } else {
        shoppingList[name] = parseInt(amount);
      }
    });
  }

  const shoppingListContent = Object.entries(shoppingList)
    .map(([product, amount]) => `${product} ${amount}`)
    .join("\n");

  if (!shoppingListContent) {
    alert("Shopping list is empty.");
    return;
  }
  const blob = new Blob([shoppingListContent], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "shopping-list.txt";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
