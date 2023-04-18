import { createElement } from "../helper/createElement";

export const createCategory = (app) => {
  const category = createElement("section", {
    className: "category section-offset",
  });

  const container = createElement("div", {
    className: "container",
  });

  category.append(container);

  const categoryList = createElement("ul", {
    className: "category__list",
  });

  const createCategoryCards = (data) => {
    const item = createElement("li", {
      className: "category__item",
      textContent: data.title,
    });

    item.dataset.id = data.id;

    return item;
  };

  container.append(ul);

  const mount = () => {
    categoryList.textContent = "";
    app.append(category);
    const cards = data.map(createCategoryCards);
    categoryList.append(...cards);
  };

  const unmount = () => {
    category.remove();
  }

  return { mount, unmount, categoryList }
};
