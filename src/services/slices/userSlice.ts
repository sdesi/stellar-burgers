import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  TLoginData,
  TRegisterData,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  updateUserApi
} from '@api';
import { deleteCookie, setCookie } from '../../utils/cookie';
import { TUser } from '@utils-types';

type UserState = {
  user: TUser | null;
  isAuthenticated: boolean;
  isAuthChecked: boolean;
  loginError: string | null;
  registerError: string | null;
  updateUserError: string | null;
  logoutError: string | null;
};

const initialState: UserState = {
  user: null,
  isAuthenticated: false,
  isAuthChecked: false,
  loginError: null,
  registerError: null,
  updateUserError: null,
  logoutError: null
};

const saveTokens = (accessToken: string, refreshToken: string) => {
  setCookie('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

const clearTokens = () => {
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
};

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (data: TRegisterData, { rejectWithValue }) => {
    try {
      return await registerUserApi(data);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Не удалось зарегистрироваться'
      );
    }
  }
);

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (data: TLoginData, { rejectWithValue }) => {
    try {
      return await loginUserApi(data);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Не удалось войти'
      );
    }
  }
);

export const fetchUser = createAsyncThunk<TUser | null>(
  'user/fetchUser',
  async (_, { rejectWithValue }) => {
    try {
      if (!localStorage.getItem('refreshToken')) {
        return null;
      }
      const data = await getUserApi();
      return data.user;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : 'Не удалось получить пользователя'
      );
    }
  }
);

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (data: Partial<TRegisterData>, { rejectWithValue }) => {
    try {
      return await updateUserApi(data);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Не удалось обновить профиль'
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  'user/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
      return true;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Не удалось выйти'
      );
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.registerError = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        saveTokens(action.payload.accessToken, action.payload.refreshToken);
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registerError =
          (action.payload as string) || 'Не удалось зарегистрироваться';
        state.isAuthChecked = true;
      })
      .addCase(loginUser.pending, (state) => {
        state.loginError = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        saveTokens(action.payload.accessToken, action.payload.refreshToken);
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginError = (action.payload as string) || 'Не удалось войти';
        state.isAuthChecked = true;
      })
      .addCase(fetchUser.pending, (state) => {
        state.isAuthChecked = false;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = Boolean(action.payload);
        state.isAuthChecked = true;
      })
      .addCase(fetchUser.rejected, (state) => {
        clearTokens();
        state.user = null;
        state.isAuthenticated = false;
        state.isAuthChecked = true;
      })
      .addCase(updateUser.pending, (state) => {
        state.updateUserError = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.updateUserError =
          (action.payload as string) || 'Не удалось обновить профиль';
      })
      .addCase(logoutUser.pending, (state) => {
        state.logoutError = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        clearTokens();
        state.user = null;
        state.isAuthenticated = false;
        state.isAuthChecked = true;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.logoutError = (action.payload as string) || 'Не удалось выйти';
      });
  }
});

export default userSlice.reducer;
