import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

import type {
  VoiceAgentConfig,
  VoiceAgentConfigUpdate,
  AvailabilityConfig,
  Booking,
  BookingListResponse,
  CallLog,
  CallLogListResponse,
} from "@/types/voiceAgent";
import { companyApi as api } from "@/utils/company/api";

interface VoiceAgentState {
  config: VoiceAgentConfig | null;
  availability: AvailabilityConfig | null;
  bookings: Booking[];
  calls: CallLog[];
  loading: boolean;
  saving: boolean;
  error: string | null;
}

const initialState: VoiceAgentState = {
  config: null,
  availability: null,
  bookings: [],
  calls: [],
  loading: false,
  saving: false,
  error: null,
};

const extractError = (error: any, fallback: string): string => {
  const detail = error?.response?.data?.detail;
  if (typeof detail === "string") return detail;
  if (typeof error?.message === "string") return error.message;
  return fallback;
};

export const fetchVoiceAgentConfig = createAsyncThunk(
  "voiceAgent/fetchConfig",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<VoiceAgentConfig>("/voice/config");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(extractError(error, "Failed to load voice agent config"));
    }
  },
);

export const updateVoiceAgentConfig = createAsyncThunk(
  "voiceAgent/updateConfig",
  async (data: VoiceAgentConfigUpdate, { rejectWithValue }) => {
    try {
      const response = await api.put<VoiceAgentConfig>("/voice/config", data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(extractError(error, "Failed to update voice agent config"));
    }
  },
);

export const fetchAvailability = createAsyncThunk(
  "voiceAgent/fetchAvailability",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<AvailabilityConfig>("/voice/availability");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(extractError(error, "Failed to load availability"));
    }
  },
);

export const updateAvailability = createAsyncThunk(
  "voiceAgent/updateAvailability",
  async (data: AvailabilityConfig, { rejectWithValue }) => {
    try {
      const response = await api.put<AvailabilityConfig>(
        "/voice/availability",
        data,
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(extractError(error, "Failed to update availability"));
    }
  },
);

export const fetchBookings = createAsyncThunk(
  "voiceAgent/fetchBookings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<BookingListResponse>("/voice/bookings");
      return response.data.bookings;
    } catch (error: any) {
      return rejectWithValue(extractError(error, "Failed to load bookings"));
    }
  },
);

export const cancelBooking = createAsyncThunk(
  "voiceAgent/cancelBooking",
  async (bookingId: string, { rejectWithValue }) => {
    try {
      await api.post(`/voice/bookings/${bookingId}/cancel`);
      return bookingId;
    } catch (error: any) {
      return rejectWithValue(extractError(error, "Failed to cancel booking"));
    }
  },
);

export const fetchCallLogs = createAsyncThunk(
  "voiceAgent/fetchCalls",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<CallLogListResponse>("/voice/calls");
      return response.data.calls;
    } catch (error: any) {
      return rejectWithValue(extractError(error, "Failed to load call history"));
    }
  },
);

const voiceAgentSlice = createSlice({
  name: "voiceAgent",
  initialState,
  reducers: {
    clearVoiceAgentError: (state) => {
      state.error = null;
    },
    resetVoiceAgent: () => initialState,
    setLocalAvailability: (
      state,
      action: PayloadAction<AvailabilityConfig>,
    ) => {
      state.availability = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVoiceAgentConfig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVoiceAgentConfig.fulfilled, (state, action) => {
        state.loading = false;
        state.config = action.payload;
      })
      .addCase(fetchVoiceAgentConfig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(updateVoiceAgentConfig.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateVoiceAgentConfig.fulfilled, (state, action) => {
        state.saving = false;
        state.config = action.payload;
      })
      .addCase(updateVoiceAgentConfig.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(fetchAvailability.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAvailability.fulfilled, (state, action) => {
        state.loading = false;
        state.availability = action.payload;
      })
      .addCase(fetchAvailability.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(updateAvailability.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateAvailability.fulfilled, (state, action) => {
        state.saving = false;
        state.availability = action.payload;
      })
      .addCase(updateAvailability.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(fetchBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder.addCase(cancelBooking.fulfilled, (state, action) => {
      const bookingId = action.payload;
      const booking = state.bookings.find((b) => b.booking_id === bookingId);
      if (booking) booking.status = "cancelled";
    });

    builder
      .addCase(fetchCallLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCallLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.calls = action.payload;
      })
      .addCase(fetchCallLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearVoiceAgentError, resetVoiceAgent, setLocalAvailability } =
  voiceAgentSlice.actions;

export default voiceAgentSlice.reducer;
