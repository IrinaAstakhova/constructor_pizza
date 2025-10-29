import { availableIngredients } from "./ingridients.js";

const log = console.log;

let selectedIngredients = [];
const ingredientsList = document.querySelector("#ingredientsList");
const selectedList = document.querySelector("#selectedList");
const selectedPanel = document.querySelector(".selected-panel");
const btnCart = document.querySelector(".cart button");

//Скрываем и показываем выбранные ингридиенты в моб версии
btnCart.addEventListener("click", (e) => {
  e.stopPropagation();
  selectedPanel.classList.toggle("visible");
});

document.addEventListener("click", () => {
  if (selectedPanel.classList.contains("visible")) {
    selectedPanel.classList.toggle("visible");
  }
});

//Функция для блокировки карточек с тестом, если выбрано хоть одно, а так же разблокировка при удалении из списка
const fnDisableCardWithDough = (elem) => {
  const doughCard = document.querySelectorAll(".dough");

  if (elem) {
    Array.from(doughCard).map((dough) => {
      const doughCardBtn = dough.querySelector("button");
      doughCardBtn.disabled = !true;
      doughCardBtn.classList.toggle("disable-dought");
    });
  }
};

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
  e.stopPropagation();
  const elemTarget = e.target;
  if (elemTarget.classList.contains("del-btn")) {
    const targetParentElem = elemTarget.parentElement;
    const deleteItem = parseInt(targetParentElem.getAttribute("data-id"));
    if (targetParentElem.classList.contains("dough")) {
      fnDisableCardWithDough(targetParentElem);
    }
    selectedIngredients = selectedIngredients.filter((obj) => {
      obj.id !== deleteItem;
    });

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

    if (obj.type === "dough") {
      card.classList.add("dough");
    }

    const imageBox = document.createElement("div");
    imageBox.classList.add("img-box");
    const img = document.createElement("img");

    const nameContainer = document.createElement("p");
    nameContainer.classList.add("name-card");
    const priceContainer = document.createElement("p");
    priceContainer.classList.add("price-card");

    const imgSource = obj.img;
    const nameCard = obj.name;
    const priceCard = obj.price + " руб.";

    const btnCardAdd = document.createElement("button");
    btnCardAdd.textContent = "Добавить";

    img.srcset = imgSource;
    imageBox.append(img);
    nameContainer.append(nameCard);
    priceContainer.append(priceCard);
    card.append(imageBox, nameContainer, priceContainer, btnCardAdd);
    ingredientsList.append(card);

    btnCardAdd.addEventListener("click", (e) => {
      e.stopPropagation();
      const existingIngredient = selectedIngredients.find(
        (item) => item.name === obj.name
      );

      if (obj.type === "dough") {
        const doughCardActive = e.target.parentElement;
        fnDisableCardWithDough(doughCardActive);
      }

      const selectCard = document.createElement("div");
      selectCard.classList.add("selected-card");
      selectCard.dataset.id = obj.id;

      const selectContainer = document.createElement("div");
      selectContainer.classList.add("select-container");
      const selectNameContainer = document.createElement("p");
      selectNameContainer.classList.add("select-name-card");
      const selectPriceContainer = document.createElement("p");
      selectPriceContainer.classList.add("select-price-card");

      const selectNameCard = obj.name;
      const selectPriceCard = obj.price + " руб.";

      const btnCardDelete = document.createElement("button");
      btnCardDelete.classList.add("del-btn");
      btnCardDelete.textContent = "🗑️";

      //Если добавленный ингридиент в список выбранных является тестом, добавляем класс
      if (obj.type === "dough") {
        selectCard.classList.add("dough");
      }

      //Выводим список выбранных ингридиентов
      if (existingIngredient) {
        existingIngredient.price += obj.price;
        const selectedCard = document.querySelector(
          `.selected-card[data-id="${obj.id}"]`
        );
        const priceElement = selectedCard.querySelector(".select-price-card");
        priceElement.textContent = `${existingIngredient.price} руб.`;
      } else {
        selectedIngredients = [
          ...selectedIngredients,
          {
            id: obj.id,
            name: obj.name,
            type: obj.type,
            price: obj.price,
          },
        ];

        selectNameContainer.append(selectNameCard);
        selectPriceContainer.append(selectPriceCard);
        selectContainer.append(selectNameContainer, selectPriceContainer);
        selectCard.append(selectContainer, btnCardDelete);
        selectedList.append(selectCard);
      }
      sumIngridienst();
    });
  });
};

//Фильтруем карточки с ингридиентами
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
  } else if (select.value === "fruit") {
    filterFn("fruit");
  } else if (select.value === "seafood") {
    filterFn("seafood");
  } else if (select.value === "sauce") {
    filterFn("sauce");
  } else if (select.value === "dough") {
    filterFn("dough");
  } else {
    renderIngredientList(availableIngredients);
  }
});

renderIngredientList(availableIngredients);
