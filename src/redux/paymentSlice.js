import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import useAxiosPublic from "../hooks/useAxiosPublic";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

export const addPayment = createAsyncThunk('payment/addPayment', async (paymentInfo, { rejectWithValue }) => {
    const axiosPrivate = useAxiosPrivate();
    try {
        const res = await axiosPrivate.post('/payment', paymentInfo);
        return res.data;
    }
    catch (error) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data.message);
        } else {
            return rejectWithValue(error.message);
        }
    }
});

// Payment slice
const paymentSlice = createSlice({
    name: 'payment',
    initialState: {
        payment: [],
        paymentStatus: 'idle',
        paymentError: null,
    },
    extraReducers: (builder) => {
        builder
            .addCase(addPayment.pending, (state) => {
                state.paymentStatus = 'loading';
            })
            .addCase(addPayment.fulfilled, (state, action) => {
                state.paymentStatus = 'succeeded';
                state.payment.push(action.payload);
            })
            .addCase(addPayment.rejected, (state, action) => {
                state.paymentStatus = 'failed';
                state.paymentError = action.payload || action.error.message;
            })
    }
})

export default paymentSlice.reducer;