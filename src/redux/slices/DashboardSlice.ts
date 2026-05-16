import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { initialBMs, initialUtilities, type BM, type Utility } from "../../constants/DashboardData";

export interface DashboardState {
  bms: BM[];
  selectedBmIds: string[];
  searchQuery: string;
  utilities: Utility[];
  activeMenu: string;
  activeRowId: string | null;
  sidebarOpen: boolean;
  utilsOpen: boolean;
}

const initialState: DashboardState = {
  bms: initialBMs,
  selectedBmIds: [],
  searchQuery: "",
  utilities: initialUtilities,
  activeMenu: "tk-bm",
  activeRowId: "bm-4",
  sidebarOpen: false,
  utilsOpen: false,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    toggleSelectBm: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (state.selectedBmIds.includes(id)) {
        state.selectedBmIds = state.selectedBmIds.filter((x) => x !== id);
      } else {
        state.selectedBmIds.push(id);
      }
    },
    toggleSelectAll: (state) => {
      if (state.selectedBmIds.length === state.bms.length) {
        state.selectedBmIds = [];
      } else {
        state.selectedBmIds = state.bms.map((b) => b.id);
      }
    },
    setActiveRow: (state, action: PayloadAction<string>) => {
      state.activeRowId = action.payload;
    },
    setActiveMenu: (state, action: PayloadAction<string>) => {
      state.activeMenu = action.payload;
    },
    toggleUtility: (state, action: PayloadAction<string>) => {
      const u = state.utilities.find((x) => x.id === action.payload);
      if (u) u.enabled = !u.enabled;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    closeSidebar: (state) => {
      state.sidebarOpen = false;
    },
    toggleUtils: (state) => {
      state.utilsOpen = !state.utilsOpen;
    },
    closeUtils: (state) => {
      state.utilsOpen = false;
    },
  },
});

export const {
  setSearchQuery,
  toggleSelectBm,
  toggleSelectAll,
  setActiveRow,
  setActiveMenu,
  toggleUtility,
  toggleSidebar,
  closeSidebar,
  toggleUtils,
  closeUtils,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
