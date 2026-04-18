// Company-specific Redux store configuration
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import companyAuthSlice from "./slices/companyAuthSlice";
import knowledgeBaseSlice from "./slices/knowledgeBaseSlice";
import companySlice from "./slices/companySlice";
import analyticsSlice from "./slices/analyticsSlice";
import uiSlice from "./slices/uiSlice";
import billingSlice from "./slices/billingSlice";
import voiceAgentSlice from "./slices/voiceAgentSlice";

// Create a noop storage for server-side rendering
const createNoopStorage = () => {
  return {
    getItem() {
      return Promise.resolve(null);
    },
    setItem() {
      return Promise.resolve();
    },
    removeItem() {
      return Promise.resolve();
    },
  };
};

// Use proper storage based on environment
const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();

const persistConfig = {
  key: "company",
  storage,
  whitelist: ["companyAuth", "company"], // Only persist auth and company data
  blacklist: ["ui"], // Don't persist UI state
};

const rootReducer = combineReducers({
  companyAuth: companyAuthSlice,
  knowledgeBase: knowledgeBaseSlice,
  company: companySlice,
  analytics: analyticsSlice,
  ui: uiSlice,
  billing: billingSlice,
  voiceAgent: voiceAgentSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const companyStore = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
        ignoredActionsPaths: ["meta.arg", "payload.timestamp"],
        ignoredPaths: ["_persist"],
      },
    }),
});

export const companyPersistor = persistStore(companyStore);

export type CompanyRootState = ReturnType<typeof companyStore.getState>;
export type CompanyAppDispatch = typeof companyStore.dispatch;
