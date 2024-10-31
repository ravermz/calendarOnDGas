import { AppProps } from 'next/app'

import { AppContextProvider } from '@/context/store'

import '@/app/globals.css'

const App = ({ Component, pageProps }: AppProps) => (
  <AppContextProvider>
    <Component {...pageProps} />
  </AppContextProvider>
)

export default App
