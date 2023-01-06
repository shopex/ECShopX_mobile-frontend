import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'

const initialState = {
  tabbar: null
}

const purchaseSlice = createSlice({
  name: 'purchase',
  initialState,
  reducers: {
    setPurchaseTabbar: (state, { payload }) => {
      state.tabbar = payload.tabbar
    }
  }
})

export const { setPurchaseTabbar } = purchaseSlice.actions

export default purchaseSlice.reducer
