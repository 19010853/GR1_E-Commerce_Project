import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    reviews: [],
    totalReview: 0,
    rating_review: []
}

const homeReducer = createSlice({
    name: "home",
    initialState,
    reducers: {
        get_reviews: (state, { payload }) => {
            state.reviews = payload?.reviews || []
            state.totalReview = payload?.totalReview || 0
            state.rating_review = payload?.rating_review || []
        }
    }
})

export const { get_reviews } = homeReducer.actions
export default homeReducer.reducer 