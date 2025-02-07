import type { Playlists } from '@/types'
import axiosInstance from './axiosInstance'

export const fetchUserPlaylists = async () => {
  try {
    const response = await axiosInstance.get<Playlists>('http://localhost:3000/playlists', {
      withCredentials: true,
    })

    console.log(response)
    return response.data
  } catch (error) {
    console.error('Failed to fetch user playlists: ', error)
    throw error
  }
}
