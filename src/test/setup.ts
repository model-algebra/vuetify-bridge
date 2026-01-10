import '@testing-library/jest-dom';
import { config } from '@vue/test-utils';
import { createVuetify } from 'vuetify';

// Vuetify styles are NOT required for tests
const vuetify = createVuetify()

config.global.plugins = [vuetify];

