import type {
  SpotifyDevice,
  SpotifyContext,
  SpotifyTrack
} from './Spotify'

export interface PlayerState {
  device: SpotifyDevice
  shuffle_state: boolean
  smart_shuffle: boolean
  repeat_state: string
  timestamp: number
  context: SpotifyContext
  progress_ms: number
  item: SpotifyTrack
  currently_playing_type: string
  actions: { disallows: { resuming: boolean } }
  is_playing: boolean
}

export interface PlayHistoryObject {
  track: SpotifyTrack
  played_at: string
  context: {
    type: string
    href: string
    external_urls: {
      spotify: string
    }
    uri: string
  }
}

export interface RecentlyPlayed {
  href: string
  limit: number
  next: string
  cursor: {
    after: string
    before: string
  }
  total: number
  items: Array<PlayHistoryObject>
}

export interface Queue {
  currently_playing: SpotifyTrack
  queue: Array<SpotifyTrack>
}
