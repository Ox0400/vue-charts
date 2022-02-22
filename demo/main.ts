import { createApp } from 'vue'

// Add global miter styles
import '@prefecthq/miter-design/dist/style.css'

import App from './App.vue'
import MiterDesign from '@prefecthq/miter-design'

const app = createApp(App)
app.use(MiterDesign)

app.config.performance = true

app.config.errorHandler = (err, vm, info) => {
  // err: error trace
  // vm: component in which error occured
  // info: Vue specific error information such as lifecycle hooks, events etc.
  // TODO: Perform any custom logic or log to server
  console.log(err, vm, info)
}


app.mount('#app')
