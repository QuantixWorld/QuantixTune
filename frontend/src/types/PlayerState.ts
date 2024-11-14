export interface SpotifyContext {
  external_urls: { spotify: string }
  href: string
  type: string
  uri: string
}

export interface SpotifyDevice {
  id: string
  is_active: boolean
  is_private_session: boolean
  is_restricted: boolean
  name: string
  supports_volume: boolean
  type: string
  volume_percent: number
}

export interface SpotifyAlbum {
  album_type: string
  artists: Array<{
    external_urls: { spotify: string }
    href: string
    id: string
    name: string
    type: string
    uri: string
  }>
  available_markets: string[]
  external_urls: { spotify: string }
  href: string
  id: string
  images: Array<{ height: number; url: string; width: number }>
  name: string
  release_date: string
  release_date_precision: string
  total_tracks: number
  type: string
  uri: string
}

export interface SpotifyTrack {
  album: SpotifyAlbum
  artists: Array<{
    external_urls: { spotify: string }
    href: string
    id: string
    name: string
    type: string
    uri: string
  }>
  available_markets: string[]
  disc_number: number
  duration_ms: number
  explicit: boolean
  external_ids: { isrc: string }
  external_urls: { spotify: string }
  href: string
  id: string
  is_local: boolean
  name: string
  popularity: number
  preview_url: string
  track_number: number
  type: string
  uri: string
}

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
