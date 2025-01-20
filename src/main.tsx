import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App.tsx'
import { RootStoreContext } from './store/root-store-context.ts'
import RootStore from './store/root-store.ts'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<RootStoreContext.Provider value={new RootStore()}>
			<App />
		</RootStoreContext.Provider>
	</React.StrictMode>
)
