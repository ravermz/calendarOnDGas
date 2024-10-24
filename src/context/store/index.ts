import { combineComponents } from '../utils'

import EventProvider from './eventStore'

const providers = [EventProvider]

const AppContextProvider = combineComponents(...providers)

export { AppContextProvider }