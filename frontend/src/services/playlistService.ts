import type { PlaylistItems, Playlists } from '@/types'
import axiosInstance from './axiosInstance'

export const fetchUserPlaylists = async () => {
  try {
    const response = await axiosInstance.get<Playlists>('http://localhost:3000/playlists', {
      withCredentials: true,
    })

    return response.data
  } catch (error) {
    console.error('Failed to fetch user playlists: ', error)
    throw error
  }
}

export const fetchTracksFromPlaylist = async (playlistId: string) => {
  try {
    const response = await axiosInstance.get<PlaylistItems>('http://localhost:3000/playlists/tracks', {
      params: { playlistId },
      withCredentials: true
    });

    return response.data;
  } catch (error) {
    console.error('Error while fetching tracks in playlist (' + playlistId + '): ', error);
    throw error
  }
}
