import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ Register User
export const userRegister = createAsyncThunk(
  "user/register",
  async (user, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "https://wejha.vercel.app:5000/user/register",
        user
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

// ✅ Login User
export const userLogin = createAsyncThunk(
  "user/login",
  async (user, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "https://wejha.vercel.app:5000/user/login",
        user
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

// ✅ Forgot Password (Fixed to use axios)
export const forgotPassword = createAsyncThunk(
  "user/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "https://wejha.vercel.app:5000/api/auth/forgot-password",
        { email }
      );
      return response.data.message; // Returning only success message
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Erreur lors de l'envoi de l'email"
      );
    }
  }
);

// ✅ Get Current User
export const userCurrent = createAsyncThunk(
  "user/current",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("https://wejha.vercel.app:5000/user/current", {
        headers: { Authorization: localStorage.getItem("token") },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

// ✅ Edit User Profile (Fixed error handling)
export const editUser = createAsyncThunk(
  "user/edit",
  async ({ id, editprofil }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `https://wejha.vercel.app:5000/user/${id}`,
        editprofil
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update user");
    }
  }
);

// ✅ get all users
export const getuser = createAsyncThunk("user/get", async () => {
  try {
    const response = await axios.get("https://wejha.vercel.app:5000/user/");
    return response;
  } catch (error) {
    console.log(error);
  }
});

export const deleteuser = createAsyncThunk("user/delete", async (id) => {
  try {
    let result = axios.delete(`https://wejha.vercel.app:5000/user/${id}`);
    return result;
  } catch (error) {
    console.log(error);
  }
});

// Initial state
const initialState = {
  user: null,
  status: null,
  error: null,
  message: null,
  userList: [],
};

// ✅ Redux Slice
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("token");
    },
    clearMessage: (state) => {
      state.message = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // User Registration
      .addCase(userRegister.pending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      .addCase(userRegister.fulfilled, (state, action) => {
        state.status = "success";
        state.user = action.payload.user;
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(userRegister.rejected, (state, action) => {
        state.status = "fail";
        state.error = action.payload;
      })

      // User Login
      .addCase(userLogin.pending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      .addCase(userLogin.fulfilled, (state, action) => {
        state.status = "success";
        state.user = action.payload.user;
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(userLogin.rejected, (state, action) => {
        state.status = "fail";
        state.error = action.payload;
      })

      // Get Current User
      .addCase(userCurrent.pending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      .addCase(userCurrent.fulfilled, (state, action) => {
        state.status = "success";
        state.user = action.payload.user;
      })
      .addCase(userCurrent.rejected, (state, action) => {
        state.status = "fail";
        state.error = action.payload;
      })

      // Forgot Password (NEW)
      .addCase(forgotPassword.pending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.status = "success";
        state.message = action.payload;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.status = "fail";
        state.error = action.payload;
      })

      // Edit User (NEW)
      .addCase(editUser.pending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      .addCase(editUser.fulfilled, (state, action) => {
        state.status = "success";
        state.user = action.payload;
      })
      .addCase(editUser.rejected, (state, action) => {
        state.status = "fail";
        state.error = action.payload;
      })

      // get all users
      .addCase(getuser.pending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      .addCase(getuser.fulfilled, (state, action) => {
        state.status = "success";
        state.userList = action.payload.data?.users || [];
      })
      .addCase(getuser.rejected, (state, action) => {
        state.status = "fail";
        state.userList = [];
        state.error = action.payload;
      })

      // delete user
      .addCase(deleteuser.pending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      .addCase(deleteuser.fulfilled, (state, action) => {
        state.status = "success";
        state.userList = action.payload.data;
      })
      .addCase(deleteuser.rejected, (state, action) => {
        state.status = "fail";
        state.error = action.payload;
      });
  },
});

export const { logout, clearMessage } = userSlice.actions;
export default userSlice.reducer;
