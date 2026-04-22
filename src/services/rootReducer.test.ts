import { rootReducer } from './rootReducer';
import ingredientsReducer from './slices/ingredientsSlice';
import constructorReducer from './slices/constructorSlice';
import feedReducer from './slices/feedSlice';
import orderReducer from './slices/orderSlice';
import userReducer from './slices/userSlice';

describe('rootReducer', () => {
  it('возвращает корректное начальное состояние при неизвестном экшене', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(state).toEqual({
      ingredients: ingredientsReducer(undefined, { type: 'UNKNOWN_ACTION' }),
      constructorBurger: constructorReducer(undefined, {
        type: 'UNKNOWN_ACTION'
      }),
      feed: feedReducer(undefined, { type: 'UNKNOWN_ACTION' }),
      order: orderReducer(undefined, { type: 'UNKNOWN_ACTION' }),
      user: userReducer(undefined, { type: 'UNKNOWN_ACTION' })
    });
  });
});
