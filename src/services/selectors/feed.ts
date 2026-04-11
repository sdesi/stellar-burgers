import { RootState } from '../store';

export const selectFeedOrders = (state: RootState) => state.feed.orders;
export const selectFeedInfo = (state: RootState) => ({
  total: state.feed.total,
  totalToday: state.feed.totalToday
});
export const selectFeedLoading = (state: RootState) => state.feed.isLoading;
export const selectProfileOrders = (state: RootState) =>
  state.feed.profileOrders;
export const selectProfileOrdersLoading = (state: RootState) =>
  state.feed.profileOrdersLoading;
