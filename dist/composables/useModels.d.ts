import { type ComputedRef, type InjectionKey } from "vue";
import { type ModelResolver, type ModelsOption } from "../schema";
/** Injection key of the models OBJECT fields can reference; app.provide(ModelsKey, models) makes them global. */
export declare const ModelsKey: InjectionKey<ModelsOption | ComputedRef<ModelResolver>>;
/**
 * Resolver of referenced models: from the given models when there are any, otherwise from the nearest
 * component that provided them. The resolver is provided in turn, so nested sub-forms find the models too.
 */
export declare function useModels(models: () => ModelsOption | undefined): ComputedRef<ModelResolver>;
