import type {
  Device,
  Context,
  Track,
  SimplifiedPlaylist,
  ExternalUrl,
  PlaylistTrack
} from './spotify'

export interface PlayerState {
  device: Device
  shuffle_state: boolean
  smart_shuffle: boolean
  repeat_state: string
  timestamp: number
  context: Context
  progress_ms: number
  item: Track
  currently_playing_type: string
  actions: { disallows: { resuming: boolean } }
  is_playing: boolean
}

export interface PlayHistoryObject {
  track: Track
  played_at: string
  context: {
    type: string
    href: string
    external_urls: ExternalUrl
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
  currently_playing: Track
  queue: Array<Track>
}

export interface Playlists {
  href: string
  limit: number
  next: string
  offset: number
  previous: string
  total: number
  items: Array<SimplifiedPlaylist>
}

export interface PlaylistItems {
  href: string
  limit: number
  next: string
  offset: number
  previous: string
  total: number
  items: Array<PlaylistTrack>
}
