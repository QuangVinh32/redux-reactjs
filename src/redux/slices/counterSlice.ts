import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface CounterState {
  value: number;
  textColor: string;
  fontFamily: string;
}

const initialState: CounterState = {
  value: 0,
  textColor: "white",
  fontFamily: "Arial",
};

const counterSlice = createSlice({
  name: "counter",

  initialState,

  reducers: {
    increment: (state) => {
      if (state.value >= 10) {
        state.value = 0;
      } else {
        state.value += 1;
      }
    },

    decrement: (state) => {
      if (state.value <= -10) {
        state.value = 100;
      } else {
        state.value -= 1;
      }
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
  },
});

export const {
  increment,
  decrement,
  changeColor,
  changeFont,
} = counterSlice.actions;

export default counterSlice.reducer;