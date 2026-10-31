import { computed, inject, isRef, provide, type ComputedRef, type InjectionKey } from "vue";
import { toResolver, type ModelResolver, type ModelsOption } from "../schema";

/** Injection key of the models OBJECT fields can reference; app.provide(ModelsKey, models) makes them global. */
export const ModelsKey: InjectionKey<ModelsOption | ComputedRef<ModelResolver>> = Symbol('vuetify-bridge models');

const noModels: ModelResolver = () => undefined;

/**
 * Resolver of referenced models: from the given models when there are any, otherwise from the nearest
 * component that provided them. The resolver is provided in turn, so nested sub-forms find the models too.
 */
export function useModels(models: () => ModelsOption | undefined): ComputedRef<ModelResolver> {
    const inherited = inject(ModelsKey, undefined);
    const resolver = computed<ModelResolver>(() => {
        const own = models();
        if (own !== undefined) return toResolver(own);
        if (inherited === undefined) return noModels;
        return isRef(inherited) ? inherited.value : toResolver(inherited);
    });
    provide(ModelsKey, resolver);
    return resolver;
}
