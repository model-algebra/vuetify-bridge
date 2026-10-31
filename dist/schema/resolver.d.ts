import type { ModelLike } from "./field";
/** Finds a model by the name OBJECT fields reference it with (metadata.name). */
export type ModelResolver = (name: string) => ModelLike | undefined;
/** Models given as a list, as a map by name, or as a resolver function. */
export type ModelsOption = ModelLike[] | Record<string, ModelLike> | ModelResolver;
export declare function toResolver(models: ModelsOption): ModelResolver;
