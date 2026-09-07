import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  byId: {
    react: { id: 'react', name: 'React', description: 'UI and component-based apps' },
    redux: { id: 'redux', name: 'Redux', description: 'State management and global data' },
    javascript: { id: 'javascript', name: 'JavaScript', description: 'Logic and frontend behavior' },
  },
  allIds: ['react', 'redux', 'javascript'],
}

const platformsSlice = createSlice({
  name: 'platforms',
  initialState,
  reducers: {
    addPlatform: (state, action) => {
      const platform = {
        id: action.payload.id,
        name: action.payload.name,
        description: action.payload.description,
      }

      state.byId[platform.id] = platform
      state.allIds.push(platform.id)
    },
  },
})

export const { addPlatform } = platformsSlice.actions
export const selectAllPlatforms = (state) =>
  state.platforms.allIds.map((platformId) => state.platforms.byId[platformId])

export default platformsSlice.reducer
