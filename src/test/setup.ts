import '@testing-library/jest-dom';
import { config } from '@vue/test-utils';
import { createVuetify } from 'vuetify';

// Browser APIs used by Vuetify overlays (menus of selects) that jsdom does not provide
class ResizeObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
}
globalThis.ResizeObserver ??= ResizeObserverStub as unknown as typeof ResizeObserver;
if (!('visualViewport' in globalThis)) {
    Object.defineProperty(globalThis, 'visualViewport', {
        value: Object.assign(new EventTarget(), {
            width: 1024, height: 768, offsetLeft: 0, offsetTop: 0, pageLeft: 0, pageTop: 0, scale: 1,
        }),
    });
}

// Vuetify styles are NOT required for tests
const vuetify = createVuetify()

config.global.plugins = [vuetify];
