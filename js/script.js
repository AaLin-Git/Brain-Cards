import { createCategory } from './components/createCategory.js';
import { createEditCategory } from './components/createEditCategory.js';
import { createPairs } from './components/createPairs.js';
import { createHeader } from './components/createHeader.js';
import { createElement } from './helper/createElement.js';
import {
  fetchCards,
  fetchCategories,
  fetchEditCategory,
  fetchCreateCategory,
  fetchDeleteCategory,
} from './service/api.service.js';
import { showAlert } from './components/showAlert.js';

const initApp = async () => {
  const headerParent = document.querySelector('.header');
  const app = document.querySelector('#app');

  const headerObj = createHeader(headerParent);
  const categoryObj = createCategory(app);
  const editCategoryObj = createEditCategory(app);
  const pairsObj = createPairs(app);

  const allSectionUnmount = () => {
    [categoryObj, editCategoryObj, pairsObj].forEach(obj => obj.unmount());
  };

  const postHandler = async () => {
    const data = editCategoryObj.parseData();
    const dataCategories = await fetchCreateCategory(data);

    if (dataCategories.error) {
      showAlert(dataCategories.error?.message);
      return;
    }

    showAlert(`Category ${data.title} has been updated`);
    allSectionUnmount();
    headerObj.updateHeaderTitle('Categories');
    categoryObj.mount(dataCategories);
  };

  const patchHandler = async () => {
    const data = editCategoryObj.parseData();
    const dataCategories = await fetchEditCategory(
      editCategoryObj.btnSave.dataset.id,
      data,
    );

    if (dataCategories.error) {
      showAlert(dataCategories.error?.message);
      return;
    }

    showAlert(`New category ${data.title} was added`);
    allSectionUnmount();
    headerObj.updateHeaderTitle('Categories');
    categoryObj.mount(dataCategories);
  };

  const renderIndex = async e => {
    e?.preventDefault();
    allSectionUnmount();
    const categories = await fetchCategories();
    headerObj.updateHeaderTitle('Categories');

    if (categories.error) {
      const errorText = createElement('p', {
        className: 'server-error',
        textContent: 'Error',
      });
      app.append(errorText);
      return;
    }
    categoryObj.mount(categories);
  };

  renderIndex();

  headerObj.headerLogoLink.addEventListener('click', renderIndex);

  headerObj.headerBtn.addEventListener('click', () => {
    allSectionUnmount();
    headerObj.updateHeaderTitle('New category');
    editCategoryObj.mount();
    editCategoryObj.btnSave.addEventListener('click', postHandler);
    editCategoryObj.btnSave.removeEventListener('click', patchHandler);
  });

  categoryObj.categoryList.addEventListener('click', async ({ target }) => {
    const categoryItem = target.closest('.category__item');

    if (target.closest('.category__edit')) {
      const dataCards = await fetchCards(categoryItem.dataset.id);
      allSectionUnmount();
      headerObj.updateHeaderTitle(
        `Editing a category "${dataCards.title}"`,
      );
      editCategoryObj.mount(dataCards);
      editCategoryObj.btnSave.addEventListener('click', patchHandler);
      editCategoryObj.btnSave.removeEventListener('click', postHandler);
      return;
    }

    if (target.closest('.category__del')) {
      if (confirm('Are you sure you want to delete the category?')) {
        const result = fetchDeleteCategory(categoryItem.dataset.id);

        if (result.error) {
          showAlert(result.error.message);
          return;
        }

        showAlert('Category removed');
        categoryItem.remove();
      }
      return;
    }

    if (categoryItem) {
      const dataCards = await fetchCards(categoryItem.dataset.id);
      allSectionUnmount();
      headerObj.updateHeaderTitle(dataCards.title);
      pairsObj.mount(dataCards);
    }
  });

  pairsObj.buttonReturn.addEventListener('click', renderIndex);
};

initApp();
