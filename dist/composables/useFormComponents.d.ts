import { type Component, type ComputedRef, type InjectionKey } from "vue";
import type { ComponentLike } from "../schema";
/** Components that form models name in `control`, `row` and `actions`, by name. */
export type FormComponents = Record<string, Component>;
/** Provides components to every form of the app: app.provide(FormComponentsKey, { StatusChips, VSlider }). */
export declare const FormComponentsKey: InjectionKey<FormComponents | ComputedRef<FormComponents>>;
/**
 * Gives the components of the enclosing forms and of the app, with those given here, to the forms inside (sub-forms,
 * fields placed in a layout of one's own); returns the resolver of this form. Call in setup.
 */
export declare function provideFormComponents(own: () => FormComponents | undefined): (component: ComponentLike) => Component | string;
/** Resolves a component a form model names: given ones first, then globally registered ones. Call in setup. */
export declare function useFormComponents(): (component: ComponentLike) => Component | string;
