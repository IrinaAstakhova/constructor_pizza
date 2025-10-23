const availableIngredients = [
  { id: 1, name: "Пепперони", type: "meat", price: 50 },
  { id: 2, name: "Грибы", type: "vegetable", price: 30 },
  { id: 3, name: "Моцарелла", type: "cheese", price: 40 },
  { id: 4, name: "Помидоры", type: "vegetable", price: 25 },
  { id: 5, name: "Ветчина", type: "meat", price: 45 },
  { id: 6, name: "Оливки", type: "vegetable", price: 35 },
];

const log = console.log;
let selectedIngredients = [];
const ingredientsList = document.querySelector("#ingredientsList");
const selectedList = document.querySelector("#selectedList");

//Сумма добавок
const sumIngridienst = () => {
  const price = document.querySelector("#totalPrice");
  const totalSum = selectedIngredients.reduce(
    (sum, item) => sum + item.price,
    0
  );
  return (price.textContent = totalSum);
};

//Слушатель на удаление из списка добавленных ингридиентов
selectedList.addEventListener("click", (e) => {
  const elemTarget = e.target;
  if (elemTarget.classList.contains("del-btn")) {
    const targetParentElem = elemTarget.parentElement;
    const deleteItem = parseInt(targetParentElem.getAttribute("data-id"));
    selectedIngredients = selectedIngredients.filter(
      (obj) => obj.id !== deleteItem
    );
    targetParentElem.remove();
    sumIngridienst();
  }
});

//Рендерим карточки
const renderIngredientList = (array) => {
  array.map((obj) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.id = obj.id;

    const nameContainer = document.createElement("p");
    nameContainer.classList.add("name-card");
    const priceContainer = document.createElement("p");
    priceContainer.classList.add("price-card");

    const nameCard = obj.name;
    const priceCard = obj.price + " руб.";

    const btnCardAdd = document.createElement("button");
    btnCardAdd.textContent = "Добавить";
    nameContainer.append(nameCard);
    priceContainer.append(priceCard);
    card.append(nameContainer, priceContainer, btnCardAdd);
    ingredientsList.append(card);

    btnCardAdd.addEventListener("click", () => {
      selectedIngredients = [
        ...selectedIngredients,
        { id: obj.id, name: obj.name, type: obj.type, price: obj.price },
      ];

      const selectCard = document.createElement("div");
      selectCard.classList.add("selected-card");
      selectCard.dataset.id = obj.id;

      const selectNameContainer = document.createElement("p");
      selectNameContainer.classList.add("select-name-card");
      const selectPriceContainer = document.createElement("p");
      selectPriceContainer.classList.add("select-price-card");

      const selectNameCard = obj.name;
      const selectPriceCard = obj.price + " руб.";

      const btnCardDelete = document.createElement("button");
      btnCardDelete.classList.add("del-btn");
      btnCardDelete.textContent = "Удалить";
      selectNameContainer.append(selectNameCard);
      selectPriceContainer.append(selectPriceCard);
      selectCard.append(
        selectNameContainer,
        selectPriceContainer,
        btnCardDelete
      );
      selectedList.append(selectCard);
      sumIngridienst();
    });
  });
};

//Фильтруем карточки
const select = document.querySelector("#ingridients-select");

const filterFn = (type) => {
  let filterAvailableIngredients = availableIngredients.filter(
    (item) => item.type === type
  );
  return renderIngredientList(filterAvailableIngredients);
};

select.addEventListener("change", () => {
  ingredientsList.innerHTML = "";
  if (select.value === "meat") {
    filterFn("meat");
  } else if (select.value === "vegetable") {
    filterFn("vegetable");
  } else if (select.value === "cheese") {
    filterFn("cheese");
  } else {
    renderIngredientList(availableIngredients);
  }
});

renderIngredientList(availableIngredients);
