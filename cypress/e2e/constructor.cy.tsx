const selectors = {
  modalTitle: 'Детали ингредиента',
  orderButton: 'Оформить заказ',
  addButton: 'Добавить',
  emptyBunText: 'Выберите булки',
  emptyFillingText: 'Выберите начинку',
  modalClose: '[data-cy="modal-close"]',
  modalOverlay: '[data-cy="modal-overlay"]'
};

const ingredientNames = {
  bun: 'Краторная булка N-200i',
  sauce: 'Соус Spicy-X',
  main: 'Биокотлета из марсианской Магнолии'
};

const setupInterceptors = () => {
  cy.intercept('GET', '**/ingredients', { fixture: 'ingredients.json' }).as(
    'getIngredients'
  );
  cy.intercept('GET', '**/auth/user', { fixture: 'user.json' }).as('getUser');
  cy.intercept('POST', '**/orders', { fixture: 'order.json' }).as('createOrder');
};

const openApp = () => {
  setupInterceptors();
  cy.visit('/');
  cy.wait('@getIngredients');
  cy.contains('Соберите бургер').should('exist');
};

const addIngredientByName = (name: string) => {
  cy.contains('li', name).within(() => {
    cy.contains('button', selectors.addButton).click();
  });
};

describe('Страница конструктора бургера', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearCookie('accessToken');
  });

  afterEach(() => {
    cy.clearLocalStorage();
    cy.clearCookie('accessToken');
  });

  it('добавляет булку и начинку из списка ингредиентов в конструктор', () => {
    openApp();

    addIngredientByName(ingredientNames.bun);
    addIngredientByName(ingredientNames.main);
    addIngredientByName(ingredientNames.sauce);

    cy.contains(`${ingredientNames.bun} (верх)`).should('exist');
    cy.contains(`${ingredientNames.bun} (низ)`).should('exist');
    cy.contains(ingredientNames.main).should('exist');
    cy.contains(ingredientNames.sauce).should('exist');
  });

  it('открывает модальное окно ингредиента и закрывает его по крестику', () => {
    openApp();

    cy.contains('a', ingredientNames.main).click();

    cy.contains(selectors.modalTitle).should('exist');
    cy.contains(ingredientNames.main).should('exist');
    cy.contains(/Калории,\s*ккал/).should('exist');

    cy.get(selectors.modalClose).click();
    cy.contains(selectors.modalTitle).should('not.exist');
  });

  it('закрывает модальное окно ингредиента по клику на оверлей', () => {
    openApp();

    cy.contains('a', ingredientNames.sauce).click();
    cy.contains(selectors.modalTitle).should('exist');
    cy.get(selectors.modalOverlay).click({ force: true });
    cy.contains(selectors.modalTitle).should('not.exist');
  });

  it('создаёт заказ, показывает номер и очищает конструктор после закрытия модалки', () => {
    setupInterceptors();

    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.setItem('refreshToken', 'test-refresh-token');
      }
    });

    cy.setCookie('accessToken', 'Bearer test-access-token');

    cy.wait('@getIngredients');
    cy.wait('@getUser');

    addIngredientByName(ingredientNames.bun);
    addIngredientByName(ingredientNames.main);
    addIngredientByName(ingredientNames.sauce);

    cy.contains('button', selectors.orderButton).click();
    cy.wait('@createOrder');

    cy.contains('12345').should('exist');
    cy.contains('идентификатор заказа').should('exist');

    cy.get(selectors.modalClose).click();
    cy.contains('идентификатор заказа').should('not.exist');
    cy.contains(selectors.emptyBunText).should('exist');
    cy.contains(selectors.emptyFillingText).should('exist');
  });
});
