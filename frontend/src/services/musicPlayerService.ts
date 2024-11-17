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

export const pausePlayback = async () => {
  try {
    await axios.put('http://localhost:3000/pause', {}, {
      withCredentials: true,
    });
  } catch (error) {
    console.error('Failed to pause the player: ', error)
    throw error
  }
}

export const playPlayback = async () => {
  try {
    await axios.put('http://localhost:3000/play', {},
      {
        withCredentials: true,
      });
  } catch (error) {
    console.error('Failed to play the player: ', error)
    throw error
  }
}

export const skipNext = async () => {
  try {
    await axios.post('http://localhost:3000/next', {},
      {
        withCredentials: true,
      });
  } catch (error) {
    console.error('Failed to skip to next: ', error)
    throw error
  }
}

export const skipPrevious = async () => {
  try {
    await axios.post('http://localhost:3000/previous', {},
      {
        withCredentials: true,
      });
  } catch (error) {
    console.error('Failed to skip to previous: ', error)
    throw error
  }
}

export async function isLiked(trackIds: Array<string>): Promise<Array<boolean>> {
  if (!Array.isArray(trackIds) || trackIds.length === 0) {
    console.error('Error: trackIds must be a non-empty array')
    return [false]
  }

  const ids = trackIds.join(',')

  try {
    const isLiked = await axios.get('http://localhost:3000/is-liked',
      {
        params: { ids },
        withCredentials: true,
      });

    return isLiked.data
  } catch (error) {
    console.error('Failed to check if saved: ', error)
    throw error
  }
}

export async function saveTracks(trackIds: Array<string>) {
  if (!Array.isArray(trackIds) || trackIds.length === 0) {
    console.error('Error: trackIds must be a non-empty array')
    return
  }

  try {
    await axios.put('http://localhost:3000/tracks', { ids: trackIds }, {
      withCredentials: true
    })
  } catch (error) {
    console.error('Failed to save the tracks: ', error)
    throw error
  }
}

export async function unsaveTracks(trackIds: Array<string>) {
  if (!Array.isArray(trackIds) || trackIds.length === 0) {
    console.error('Error: trackIds must be a non-empty array')
    return
  }

  try {
    await axios.delete('http://localhost:3000/tracks', {
      data: { ids: trackIds },
      withCredentials: true
    })
  } catch (error) {
    console.error('Failed to unsave the tracks: ', error)
    throw error
  }
}

export async function toggleShuffleState(state: boolean) {
  try {
    await axios.put('http://localhost:3000/shuffle', {}, {
      params: { state },
      withCredentials: true
    })
  } catch (error) {
    console.error('Failed to toggle shuffle: ', error)
    throw error
  }
}

export async function setRepeatState(state: string) {
  try {
    await axios.put('http://localhost:3000/repeat', {}, {
      params: { state },
      withCredentials: true
    })
  } catch (error) {
    console.error('Failed to set repeat mode: ', error)
    throw error
  }
}

export async function seekToPosition(position_ms: number) {
  try {
    await axios.put('http://localhost:3000/seek', {}, {
      params: { position_ms },
      withCredentials: true
    })
  } catch (error) {
    console.error('Failed to seek to position: ', error)
    throw error
  }
}

export async function setPlaybackVolume(volume_percent: number) {
  try {
    await axios.put('http://localhost:3000/volume', {}, {
      params: { volume_percent },
      withCredentials: true
    })
  } catch (error) {
    console.error('Failed to seek to position: ', error)
    throw error
  }
}
