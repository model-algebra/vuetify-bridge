import { type FormComponents } from '../composables/useFormComponents';
import { type FieldLike, type FormMode, type ModelLike, type ModelsOption, type ValidationMessages } from '../schema';
type __VLS_Props = {
    model: ModelLike;
    /** create hides generated fields and fills in defaults, edit fixes keys, view makes everything read-only. */
    mode?: FormMode;
    /** Names of the fields to show, in this order; all fields of the model by default. */
    fields?: string[];
    exclude?: string[];
    messages?: Partial<ValidationMessages>;
    /** Models referenced by OBJECT fields, edited with nested sub-forms; without them such fields are edited as JSON. */
    models?: ModelsOption;
    /** Text of the Save button; from the form model, or Save, by default. */
    submitText?: string;
    /** Text of the Cancel button; from the form model, or Cancel, by default. */
    cancelText?: string;
    /** Don't show the Save and Cancel buttons; use the actions slot or the exposed validate() instead. */
    hideActions?: boolean;
    /** Components the form options of the model name, for this form and the ones inside. */
    components?: FormComponents;
};
/** Props of the actions slot and of the actions component of the form model. */
interface ActionProps {
    /** Validates the record and emits submit when it passes. */
    submit: () => Promise<void>;
    cancel: () => void;
    validate: () => Promise<boolean>;
    mode: FormMode;
    record: Record<string, unknown>;
    submitText: string;
    cancelText: string;
}
type __VLS_Slots = {
    /** A layout of your own instead of the grid: place fields with <ModelFormField name="…" />. */
    default?: (props: {
        fields: FieldLike[];
        record: Record<string, unknown>;
        update: (name: string, value: unknown) => void;
        mode: FormMode;
    }) => any;
    /** Replaces the control of one field, e.g. #field.title */
    [name: `field.${string}`]: (props: {
        field: FieldLike;
        value: unknown;
        update: (value: unknown) => void;
        readonly: boolean;
    }) => any;
    /** Replaces the Save and Cancel buttons. */
    actions?: (props: ActionProps) => any;
};
/** Validates every field, nested ones included, and the table-level checks; true when the record can be saved. */
declare function validate(): Promise<boolean>;
type __VLS_ModelProps = {
    modelValue: Record<string, unknown>;
};
type __VLS_PublicProps = __VLS_Props & __VLS_ModelProps;
declare const __VLS_base: import("vue").DefineComponent<__VLS_PublicProps, {
    validate: typeof validate;
    resetValidation: () => void | undefined;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:modelValue": (value: Record<string, unknown>) => any;
    submit: (record: Record<string, unknown>) => any;
    cancel: () => any;
}, string, import("vue").PublicProps, Readonly<__VLS_PublicProps> & Readonly<{
    "onUpdate:modelValue"?: ((value: Record<string, unknown>) => any) | undefined;
    onSubmit?: ((record: Record<string, unknown>) => any) | undefined;
    onCancel?: (() => any) | undefined;
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
