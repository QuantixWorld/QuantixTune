import { getSpotifyAuthUrl } from '../../services/authService'

export const login = () => {
  window.location.href = getSpotifyAuthUrl()
}
