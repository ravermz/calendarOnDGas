import { AppProps } from 'next/app'

import { AppContextProvider } from '@/context/store'

const App = ({ Component, pageProps }: AppProps) => (
  <AppContextProvider>
    <Component {...pageProps} />
  </AppContextProvider>
)

export default App
