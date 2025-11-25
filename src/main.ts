import { createApp } from 'vue'
import { DefaultApolloClient } from '@vue/apollo-composable'
import './index.css'
import App from './App.vue'
import router from './router'
import { apolloClient } from './graphql/client'

const app = createApp(App)

// Provide Apollo Client
app.provide(DefaultApolloClient, apolloClient)

// Use router
app.use(router)

app.mount('#root')

