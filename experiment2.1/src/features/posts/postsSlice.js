import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  byId: {
    1: {
      id: 1,
      title: 'State Management in React',
      content: 'A centralized store helps keep the UI consistent across components.',
      author: 'Aisha',
      platformId: 'react',
      likes: 12,
    },
    2: {
      id: 2,
      title: 'Redux Toolkit basics',
      content: 'Slices reduce boilerplate and make state updates easier to manage.',
      author: 'Rahul',
      platformId: 'redux',
      likes: 8,
    },
  },
  allIds: [1, 2],
}

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    addPost: (state, action) => {
      const newPost = {
        id: Date.now(),
        likes: 0,
        ...action.payload,
      }

      state.byId[newPost.id] = newPost
      state.allIds.unshift(newPost.id)
    },

    deletePost: (state, action) => {
      const postId = action.payload
      delete state.byId[postId]
      state.allIds = state.allIds.filter((id) => id !== postId)
    },

    toggleLike: (state, action) => {
      const post = state.byId[action.payload]
      if (post) {
        post.likes += 1
      }
    },
  },
})

export const { addPost, deletePost, toggleLike } = postsSlice.actions
export const selectAllPosts = (state) =>
  state.posts.allIds.map((postId) => state.posts.byId[postId])

export default postsSlice.reducer
