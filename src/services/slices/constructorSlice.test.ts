import reducer, {
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown
} from './constructorSlice';
import { TConstructorIngredient, TIngredient } from '@utils-types';

const bun: TIngredient = {
  _id: 'bun-id',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'bun.png',
  image_large: 'bun-large.png',
  image_mobile: 'bun-mobile.png'
};

const mainIngredient: TIngredient = {
  _id: 'main-id',
  name: 'Биокотлета из марсианской Магнолии',
  type: 'main',
  proteins: 420,
  fat: 142,
  carbohydrates: 242,
  calories: 4242,
  price: 424,
  image: 'main.png',
  image_large: 'main-large.png',
  image_mobile: 'main-mobile.png'
};

const sauceIngredient: TIngredient = {
  _id: 'sauce-id',
  name: 'Соус Spicy-X',
  type: 'sauce',
  proteins: 30,
  fat: 20,
  carbohydrates: 40,
  calories: 30,
  price: 90,
  image: 'sauce.png',
  image_large: 'sauce-large.png',
  image_mobile: 'sauce-mobile.png'
};

describe('constructorSlice', () => {
  it('обрабатывает добавление булки и начинки в конструктор', () => {
    const stateWithBun = reducer(undefined, addIngredient(bun));
    const stateWithIngredients = reducer(
      stateWithBun,
      addIngredient(mainIngredient)
    );

    expect(stateWithIngredients.bun).toEqual(bun);
    expect(stateWithIngredients.ingredients).toHaveLength(1);
    expect(stateWithIngredients.ingredients[0]).toMatchObject({
      _id: mainIngredient._id,
      name: mainIngredient.name,
      type: mainIngredient.type
    });
    expect(stateWithIngredients.ingredients[0].id).toEqual(expect.any(String));
  });

  it('обрабатывает удаление ингредиента из конструктора', () => {
    const ingredientToRemove: TConstructorIngredient = {
      ...mainIngredient,
      id: 'ingredient-1'
    };
    const ingredientToKeep: TConstructorIngredient = {
      ...sauceIngredient,
      id: 'ingredient-2'
    };

    const initialState = {
      bun,
      ingredients: [ingredientToRemove, ingredientToKeep]
    };

    const nextState = reducer(initialState, removeIngredient('ingredient-1'));

    expect(nextState.ingredients).toEqual([ingredientToKeep]);
  });

  it('обрабатывает изменение порядка ингредиентов в начинке', () => {
    const ingredientOne: TConstructorIngredient = {
      ...mainIngredient,
      id: 'ingredient-1'
    };
    const ingredientTwo: TConstructorIngredient = {
      ...sauceIngredient,
      id: 'ingredient-2'
    };
    const ingredientThree: TConstructorIngredient = {
      ...mainIngredient,
      _id: 'main-id-2',
      name: 'Мини-салат Экзо-Плантаго',
      id: 'ingredient-3'
    };

    const initialState = {
      bun,
      ingredients: [ingredientOne, ingredientTwo, ingredientThree]
    };

    const movedUpState = reducer(initialState, moveIngredientUp(2));
    expect(movedUpState.ingredients.map((item) => item.id)).toEqual([
      'ingredient-1',
      'ingredient-3',
      'ingredient-2'
    ]);

    const movedDownState = reducer(movedUpState, moveIngredientDown(0));
    expect(movedDownState.ingredients.map((item) => item.id)).toEqual([
      'ingredient-3',
      'ingredient-1',
      'ingredient-2'
    ]);
  });
});
