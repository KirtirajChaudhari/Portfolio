import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import './styles/tokens.css';
import './styles/reset.css';
import './styles/typography.css';
import './styles/components.css';
import './styles/animations.css';

const app = createApp(App);
app.use(router);
app.mount('#app');
