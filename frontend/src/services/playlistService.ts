import type { PlaylistTrack, SimplifiedPlaylist } from '@/types'
import axiosInstance from './axiosInstance'

export const fetchUserPlaylists = async () => {
  try {
    const response = await axiosInstance.get<Array<SimplifiedPlaylist>>('http://localhost:3000/playlists', {
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
    const response = await axiosInstance.get<Array<PlaylistTrack>>('http://localhost:3000/playlists/tracks', {
      params: { playlistId },
      withCredentials: true
    });

    return response.data;
  } catch (error) {
    console.error('Error while fetching tracks in playlist (' + playlistId + '): ', error);
    throw error
  }
}

export const fetchSavedTracks = async () => {
  try {
    const response = await axiosInstance.get<Array<PlaylistTrack>>("http://localhost:3000/tracks", {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error('Error while fetching saved tracks: ', error);
    throw error;
  }
}

export const createLIkedSongsPLaylist = (): SimplifiedPlaylist => {
  return {
    collaborative: false,
    description: "Your liked songs",
    external_urls: {
      spotify: "https://open.spotify.com/collection/tracks",
    },
    href: "https://api.spotify.com/v1/me/tracks",
    id: "liked-songs",
    images: [
      {
        height: 0,
        width: 0,
        url: "src/assets/images/liked-songs-64.jpg",
      },
    ],
    name: "Liked Songs",
    owner: {
      external_urls: { spotify: ""},
      followers: { href: "", total: 0 },
      href: '',
      id: '',
      type: '',
      uri: '',
      display_name: ''
    },
    public: false,
    snapshot_id: "",
    tracks: {
      href: "https://api.spotify.com/v1/me/tracks",
      total: 0,
    },
    type: "playlist",
    uri: "spotify:playlist:liked-songs",
  };
}
