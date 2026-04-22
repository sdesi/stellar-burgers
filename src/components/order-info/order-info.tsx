import { FC, useEffect, useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import { selectIngredients } from '@selectors/ingredients';
import { selectFeedOrders, selectProfileOrders } from '@selectors/feed';
import { selectOrderData } from '@selectors/order';
import {
  fetchOrderByNumber,
  setOrderData
} from '../../services/slices/orderSlice';

export const OrderInfo: FC = () => {
  const dispatch = useDispatch();
  const { number } = useParams();
  const location = useLocation();
  const ingredients = useSelector(selectIngredients);
  const orderData = useSelector(selectOrderData);
  const feedOrders = useSelector(selectFeedOrders);
  const profileOrders = useSelector(selectProfileOrders);

  useEffect(() => {
    const orderNumber = Number(number);
    if (!orderNumber) {
      return;
    }

    const sourceOrders = location.pathname.startsWith('/profile/orders')
      ? profileOrders
      : feedOrders;
    const foundOrder =
      sourceOrders.find((item) => item.number === orderNumber) || null;

    if (foundOrder) {
      dispatch(setOrderData(foundOrder as TOrder));
      return;
    }

    dispatch(fetchOrderByNumber(orderNumber));
  }, [dispatch, feedOrders, location.pathname, number, profileOrders]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) {
      return null;
    }

    const date = new Date(orderData.createdAt);
    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: Record<string, TIngredient & { count: number }>, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count += 1;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
