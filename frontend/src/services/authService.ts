import { generateRandomString } from '../utils/helpers'

const client_id = 'CLIENT_ID'
const redirect_uri = 'http:localhost:8080/callback'
const scopes = 'user-read-private user-read-email'

export function getSpotifyAuthUrl() {
  const state = generateRandomString(16)
  localStorage.setItem('spotify_auth_state', state)

  const authUrl =
    `https://accounts.spotify.com/authorize?` +
    `client_id=${client_id}` +
    `&response_type=code` +
    `&redirect_uri=${encodeURIComponent(redirect_uri)}` +
    `&scope=${encodeURIComponent(scopes)}` +
    `&state=${state}`

  return authUrl
}
