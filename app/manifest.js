export default function manifest() {
    return {
      name: 'AfriqLoan App',
      short_name: 'AfriqLoan',
      description: 'Everything Financial',
      start_url: '/',
      display: 'standalone',
      background_color: 'rgb(12, 75, 84)',
      theme_color: '#fff',
      icons: [
        {
          src: '/favicon.ico',
          sizes: 'any',
          type: 'image/x-icon',
        },
      ],
    }
  }