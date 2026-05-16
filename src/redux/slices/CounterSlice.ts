import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface CounterState {
  value: number;
  textColor: string;
  fontFamily: string;
  fontSize: string;
}

const initialState: CounterState = {
  value: 0,
  textColor: "#ec4899",
  fontFamily: "Arial",
  fontSize: "120px",
};

const counterSlice = createSlice({
  name: "counter",

  initialState,

  reducers: {

    increment: (state) => {
      if (state.value >= 20) {
        state.value = 0;
      } else {
        state.value += 1;
      }
    },

    decrement: (state) => {
      if (state.value <= -20) {
        state.value = 0;
      } else {
        state.value -= 1;
      }
    },

    reset: (state) => {
      state.value = 0;
    },

    changeColor: (
      state,
      action: PayloadAction<string>
    ) => {
      state.textColor = action.payload;
    },

    changeFont: (
      state,
      action: PayloadAction<string>
    ) => {
      state.fontFamily = action.payload;
    },

    changeSize: (
      state,
      action: PayloadAction<string>
    ) => {
      state.fontSize = action.payload;
    },

  },
});

export const {
  increment,
  decrement,
  reset,
  changeColor,
  changeFont,
  changeSize,
} = counterSlice.actions;

export default counterSlice.reducer;