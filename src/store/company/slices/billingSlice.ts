import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { companyApi as api } from "@/utils/company/api";
import type { SubscriptionStatus, CheckoutResponse } from "@/types/billing";

interface BillingState {
  subscription: SubscriptionStatus | null;
  checkoutLoading: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: BillingState = {
  subscription: null,
  checkoutLoading: false,
  loading: false,
  error: null,
};

export const fetchSubscription = createAsyncThunk(
  "billing/fetchSubscription",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<SubscriptionStatus>(
        "/billing/subscription",
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail ||
          error.message ||
          "Failed to fetch subscription",
      );
    }
  },
);

export const createCheckout = createAsyncThunk(
  "billing/createCheckout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post<CheckoutResponse>("/billing/checkout");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail ||
          error.message ||
          "Failed to create checkout",
      );
    }
  },
);

export const cancelSubscription = createAsyncThunk(
  "billing/cancelSubscription",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post("/billing/cancel");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail ||
          error.message ||
          "Failed to cancel subscription",
      );
    }
  },
);

export const resumeSubscription = createAsyncThunk(
  "billing/resumeSubscription",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post("/billing/resume");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail ||
          error.message ||
          "Failed to resume subscription",
      );
    }
  },
);

const billingSlice = createSlice({
  name: "billing",
  initialState,
  reducers: {
    clearBillingError: (state) => {
      state.error = null;
    },
    resetBilling: (state) => {
      state.subscription = null;
      state.checkoutLoading = false;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.subscription = action.payload;
      })
      .addCase(fetchSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(createCheckout.pending, (state) => {
        state.checkoutLoading = true;
        state.error = null;
      })
      .addCase(createCheckout.fulfilled, (state) => {
        state.checkoutLoading = false;
      })
      .addCase(createCheckout.rejected, (state, action) => {
        state.checkoutLoading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(cancelSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelSubscription.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(cancelSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(resumeSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resumeSubscription.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resumeSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearBillingError, resetBilling } = billingSlice.actions;

export default billingSlice.reducer;
