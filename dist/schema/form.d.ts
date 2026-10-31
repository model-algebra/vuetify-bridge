import type { Component } from "vue";
import type { FieldLike, ModelLike } from "./field";
/** A component, or the name of a globally registered one, e.g. 'VSlider'. */
export type ComponentLike = Component | string;
/**
 * Props of a row component: it replaces the whole place of a field in the form and gets the default control of the
 * field (or its replacement) as its default slot.
 */
export interface FormRowProps {
    field: FieldLike;
    value: unknown;
    update: (value: unknown) => void;
    readonly: boolean;
    mode: string;
    record: Record<string, unknown>;
}
/** How one field is shown in a form. */
export interface FieldFormOptions {
    /** Label of the control instead of the one of the field. */
    label?: string;
    /** Hint under the control instead of the description of the field. */
    hint?: string;
    /** Not shown in the form. */
    hidden?: boolean;
    /** Width on the 12-column grid of wider screens; 6, or 12 for long text and structured values, by default. */
    cols?: number;
    /** Attributes of the control, e.g. { prefix: '$', variant: 'outlined' }. */
    props?: Record<string, unknown>;
    /**
     * Replaces the control. A component with a `field` prop gets the props of field controls (field, modelValue,
     * readonly, messages, mode); any other one, e.g. 'VSlider', is bound as a Vuetify input: modelValue, label, hint,
     * rules and readonly.
     */
    control?: ComponentLike;
    /** Replaces the whole place of the field; gets FormRowProps and the control as its default slot. */
    row?: ComponentLike;
}
/** How a model is shown in a form. */
export interface FormModel {
    /** Options of fields, by field name. */
    fields?: Record<string, FieldFormOptions>;
    /** Fields to show, in this order; all fields of the model by default. */
    order?: string[];
    submitText?: string;
    cancelText?: string;
    /** Replaces the Save and Cancel buttons; gets the props of the actions slot. */
    actions?: ComponentLike;
}
/** A field combined with its form options. */
export interface FormFieldLike extends FieldLike {
    form?: FieldFormOptions;
}
/** A model combined with a form model. */
export interface FormModelLike extends ModelLike {
    fields: FormFieldLike[];
    form?: FormModel;
}
/** The model with the form options of the form model: what ModelForm shows. */
export declare function withForm<M extends ModelLike>(model: M, form: FormModel): M & FormModelLike;
/** Form options of a field, if it has any. */
export declare const formOptions: (field: FieldLike) => FieldFormOptions;
/** Form model of a model, if it was combined with one. */
export declare const formOf: (model: ModelLike) => FormModel;
