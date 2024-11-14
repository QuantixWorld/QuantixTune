import axios from 'axios'
import type { PlayerState } from '@/types/PlayerState'

export const fetchPlayerState = async (): Promise<PlayerState> => {
  try {
    const response = await axios.get<PlayerState>('http://localhost:3000/player', {
      withCredentials: true,
    })
    return response.data
  } catch (error) {
    console.error('Failed to fetch player state: ', error)
    throw error
  }
}

export const pausePlayer = async () => {
  try {
    await axios.put('http://localhost:3000/pause', {}, {
      withCredentials: true,
    });
  } catch (error) {
    console.error('Failed to pause the player: ', error)
    throw error
  }
}
