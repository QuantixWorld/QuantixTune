export interface NavItem {
  name: string
  link: string
  icon: string
}

export const navItems: NavItem[] = [
  { name: 'Home', link: '/', icon: 'fas fa-home' },
  { name: 'Duplicate', link: '/duplicate-detector', icon: 'fa-solid fa-copy' },
  { name: 'Comparison', link: '/playlist-comparison', icon: 'fa-solid fa-not-equal' },
  { name: 'Analyzer', link: '/playlist-analyzer', icon: 'fa-solid fa-chart-simple' },
]
