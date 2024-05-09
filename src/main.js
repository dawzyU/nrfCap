import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config';

//TailwindCSS
import './tailwind.css'

//PrimeVue
import "primevue/resources/themes/tailwind-light/theme.css";     //theme
import "primevue/resources/primevue.min.css";                     //core css

// PrimeVue Components
import Button from "primevue/button"
import InputSwitch from 'primevue/inputswitch';

const app = createApp(App)

app.component('Button', Button);
app.component('InputSwitch', InputSwitch);

app.use(PrimeVue)
app.mount('#app')
