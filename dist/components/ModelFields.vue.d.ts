import { type FieldLike, type FormMode, type ModelLike, type ModelsOption, type ValidationMessages } from '../schema';
type __VLS_Props = {
    model: ModelLike;
    mode?: FormMode;
    /** Names of the fields to show, in this order; all fields of the model by default. */
    fields?: string[];
    exclude?: string[];
    messages?: Partial<ValidationMessages>;
    /** Models referenced by OBJECT fields; inherited from the enclosing form when not given. */
    models?: ModelsOption;
};
type __VLS_Slots = {
    /** Replaces the control of one field, e.g. #field.title */
    [name: `field.${string}`]: (props: {
        field: FieldLike;
        value: unknown;
        update: (value: unknown) => void;
        readonly: boolean;
    }) => any;
};
type __VLS_ModelProps = {
    modelValue: Record<string, unknown>;
};
type __VLS_PublicProps = __VLS_Props & __VLS_ModelProps;
declare const __VLS_base: import("vue").DefineComponent<__VLS_PublicProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:modelValue": (value: Record<string, unknown>) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_PublicProps> & Readonly<{
    "onUpdate:modelValue"?: ((value: Record<string, unknown>) => any) | undefined;
}>, {
    mode: FormMode;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
