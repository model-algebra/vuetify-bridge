import { computed, inject, provide, resolveDynamicComponent, unref, type Component, type ComputedRef, type InjectionKey } from "vue";
import type { ComponentLike } from "../schema";

/** Components that form models name in `control`, `row` and `actions`, by name. */
export type FormComponents = Record<string, Component>;

/** Provides components to every form of the app: app.provide(FormComponentsKey, { StatusChips, VSlider }). */
export const FormComponentsKey: InjectionKey<FormComponents | ComputedRef<FormComponents>> = Symbol('FormComponents');

const resolver = (components: () => FormComponents) => (component: ComponentLike): Component | string => {
    if (typeof component !== 'string') return component;
    return components()[component] ?? resolveDynamicComponent(component) as Component | string;
};

/**
 * Gives the components of the enclosing forms and of the app, with those given here, to the forms inside (sub-forms,
 * fields placed in a layout of one's own); returns the resolver of this form. Call in setup.
 */
export function provideFormComponents(own: () => FormComponents | undefined): (component: ComponentLike) => Component | string {
    const outer = inject(FormComponentsKey, {});
    const components = computed(() => ({ ...unref(outer), ...own() }));
    provide(FormComponentsKey, components);
    return resolver(() => components.value);
}

/** Resolves a component a form model names: given ones first, then globally registered ones. Call in setup. */
export function useFormComponents(): (component: ComponentLike) => Component | string {
    const injected = inject(FormComponentsKey, {});
    return resolver(() => unref(injected));
}
