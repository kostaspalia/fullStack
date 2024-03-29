import { createSlice } from '@reduxjs/toolkit'
import NewAnecdote from '../components/NewAnecdote'
import anecdoteService from '../services/anecdotes'

const anecdotesAtStart = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}

const initialState = anecdotesAtStart.map(asObject)

const reducer = (state = initialState, action) => {
  console.log('state now: ', state)
  console.log('action', action)
  switch (action.type) {
    case 'VOTE':
      const id = action.data.id
      const anecdoteToVote = state.find(n => n.id === id)
      const anecdoteVoted = {
        ...anecdoteToVote,
        votes: anecdoteToVote.votes + 1
      }
      return state.map(anecdote => anecdote.id !== id ? anecdote : anecdoteVoted)
      .sort((a, b) => (a.votes > b.votes ? -1 : 1))
    case 'NEW':
      return state.concat(action.data)
    default:
      return state
  }
}

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    // addAnecdote(state, action) {
    //   const content = action.payload
    //   // state.push({
    //   //   content,
    //   //   id: getId(),
    //   //   votes: 0
    //   // })
    //   state.push(action.payload)
    // },
    voteAnecdote(state, action) {
      const anecdoteVoted = action.payload
      const { id } = anecdoteVoted
      //const anecdoteToVote = state.find(n => n.id === id)
      // const anecdoteVoted = {
      //   ...anecdoteToVote,
      //   votes: anecdoteToVote.votes + 1
      // }
      return state.map(anecdote => anecdote.id !== id ? anecdote : anecdoteVoted)
      .sort((a, b) => (a.votes > b.votes ? -1 : 1))
    },
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  }
})

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const addAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const addVote = anecdote => {
  return async dispatch => {
    const updatedAnecdote = await anecdoteService.update(anecdote)
    dispatch(voteAnecdote(updatedAnecdote))
  }
}

// export const addAnecdote = (content) => {
//   return{
//     type: 'NEW',
//     data: {
//       content,
//       id: getId(),
//       votes: 0
//     }
//   }
// }

// export const voteAnecdote = (id) => {
//   return {
//     type: 'VOTE',
//     data: { id }
//   }
// }

export const { voteAnecdote, appendAnecdote, setAnecdotes } = anecdoteSlice.actions
export default anecdoteSlice.reducer