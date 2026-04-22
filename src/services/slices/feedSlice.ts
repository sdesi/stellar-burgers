import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getFeedsApi, getOrdersApi } from '@api';
import { TOrder } from '@utils-types';

type FeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: string | null;
  profileOrders: TOrder[];
  profileOrdersLoading: boolean;
  profileOrdersError: string | null;
};

const initialState: FeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null,
  profileOrders: [],
  profileOrdersLoading: false,
  profileOrdersError: null
};

export const fetchFeed = createAsyncThunk(
  'feed/fetchFeed',
  async (_, { rejectWithValue }) => {
    try {
      return await getFeedsApi();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : 'Не удалось загрузить ленту заказов'
      );
    }
  }
);

export const fetchProfileOrders = createAsyncThunk<TOrder[]>(
  'feed/fetchProfileOrders',
  async (_, { rejectWithValue }) => {
    try {
      return await getOrdersApi();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : 'Не удалось загрузить историю заказов'
      );
    }
  }
);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) || 'Не удалось загрузить ленту заказов';
      })
      .addCase(fetchProfileOrders.pending, (state) => {
        state.profileOrdersLoading = true;
        state.profileOrdersError = null;
      })
      .addCase(fetchProfileOrders.fulfilled, (state, action) => {
        state.profileOrdersLoading = false;
        state.profileOrders = action.payload;
      })
      .addCase(fetchProfileOrders.rejected, (state, action) => {
        state.profileOrdersLoading = false;
        state.profileOrdersError =
          (action.payload as string) || 'Не удалось загрузить историю заказов';
      });
  }
});

export default feedSlice.reducer;
