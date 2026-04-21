import reducer, { fetchIngredients } from './ingredientsSlice';
import { TIngredient } from '@utils-types';

const ingredients: TIngredient[] = [
  {
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
  },
  {
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
  }
];

describe('ingredientsSlice', () => {
  it('устанавливает isLoading в true при начале запроса', () => {
    const state = reducer(undefined, fetchIngredients.pending('', undefined));

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('сохраняет ингредиенты и сбрасывает isLoading при успешном запросе', () => {
    const previousState = {
      items: [],
      isLoading: true,
      error: null
    };

    const state = reducer(
      previousState,
      fetchIngredients.fulfilled(ingredients, '', undefined)
    );

    expect(state.items).toEqual(ingredients);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('сохраняет ошибку и сбрасывает isLoading при ошибке запроса', () => {
    const previousState = {
      items: [],
      isLoading: true,
      error: null
    };

    const state = reducer(
      previousState,
      fetchIngredients.rejected(new Error('Ошибка запроса'), '', undefined, 'Ошибка запроса')
    );

    expect(state.error).toBe('Ошибка запроса');
    expect(state.isLoading).toBe(false);
  });
});
