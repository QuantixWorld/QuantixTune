export interface ExternalUrl {
  spotify: string
}

export interface ExternalIds {
  isrc: string
  ean: string
  upc: string
}

export interface Followers {
  href: string
  total: number
}

export interface Image {
  url: string
  height: number
  width: number
}

export interface Context {
  external_urls: ExternalUrl
  href: string
  type: string
  uri: string
}

export interface Device {
  id: string
  is_active: boolean
  is_private_session: boolean
  is_restricted: boolean
  name: string
  supports_volume: boolean
  type: string
  volume_percent: number
}

export interface Album {
  album_type: string
  artists: Array<SimplifiedArtist>
  available_markets: string[]
  external_urls: ExternalUrl
  href: string
  id: string
  images: Array<Image>
  name: string
  release_date: string
  release_date_precision: string
  total_tracks: number
  type: string
  uri: string
}

export interface Track {
  album: Album
  artists: Array<SimplifiedArtist>
  available_markets: string[]
  disc_number: number
  duration_ms: number
  explicit: boolean
  external_ids: ExternalIds
  external_urls: ExternalUrl
  href: string
  id: string
  is_playable: boolean
  linked_from: object
  restrictions: {
    reason: string
  }
  name: string
  popularity: number
  preview_url: string
  track_number: number
  type: string
  uri: string
  is_local: boolean
}

export interface SimplifiedArtist {
  external_urls: ExternalUrl
  href: string
  id: string
  name: string
  type: string
  uri: string
}

export interface SimplifiedPlaylist {
  collaborative: boolean
  description: string
  external_urls: ExternalUrl
  href: string
  id: string
  images: Array<Image>
  name: string
  owner: {
    external_urls: ExternalUrl
    followers: Followers
    href: string
    id: string
    type: string
    uri: string
    display_name: string
  }
  public: boolean
  snapshot_id: string
  tracks: {
    href: string
    total: number
  }
  type: string
  uri: string
}

export interface PlaylistTrack {
  added_at: string
  added_by: {
    external_urls: ExternalUrl
    followers: Followers
  }
  href: string
  id: string
  type: string
  uri: string
  track: Track
}
