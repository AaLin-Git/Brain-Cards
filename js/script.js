import { createCategory } from "./components/createCategory.js";
import { createHeader } from "./components/createHeader.js";
import { createElement } from "./helper/createElement.js";
import { fetchCategories } from "./service/api.service.js";

const initApp = async () => {
  const headerParent = document.querySelector(".header");
  const app = document.querySelector("#app");

  const headerObj = createHeader(headerParent);
  const categoryObj = createCategory(app);

  const categories = await fetchCategories();
  if (categories.error) {
    app.append(
      createElement("p", {
        className: "server-error",
        textContent: "Error",
      })
    );
    return;
  }

  categoryObj.mount(categories);

  const returnIndex = (e) => {
    e.preventDefault();
    headerObj.updateHeaderTitle("Категории");
  };

  headerObj.headerLogoLink.addEventListener("click", returnIndex);
  headerObj.headerBtn.addEventListener("click", () => {
    headerObj.updateHeaderTitle("Новая категория");
  });
};

initApp();
