import type { Component } from "vue";
import type { FieldLike, ModelLike } from "./field";

/*
 * How a model is shown in a form, kept apart from the model: a form model names fields of the model and says how to
 * show them. withForm() combines both into the model given to ModelForm, so forms need few templates and the model
 * itself stays free of anything about forms.
 */

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

/** A copy of the object with other properties, of the same class, so Model and Field instances stay what they are. */
function copy<T extends object>(source: T, changes: Record<string, unknown>): T {
    return Object.assign(Object.create(Object.getPrototypeOf(source)), source, changes);
}

/** The model with the form options of the form model: what ModelForm shows. */
export function withForm<M extends ModelLike>(model: M, form: FormModel): M & FormModelLike {
    const names = new Set(model.fields.map(field => field.name));
    const unknown = [...Object.keys(form.fields ?? {}), ...(form.order ?? [])].filter(name => !names.has(name));
    if (unknown.length > 0)
        throw new Error(`The form of model ${model.metadata.name} names unknown fields: ${[...new Set(unknown)].join(', ')}`);
    const fields = model.fields.map(field => {
        const options = form.fields?.[field.name];
        if (options === undefined) return field;
        return copy(field, {
            form: options,
            ...(options.label !== undefined ? { label: options.label } : {}),
            ...(options.hint !== undefined ? { description: options.hint } : {}),
        });
    });
    return copy(model, { fields, form }) as M & FormModelLike;
}

/** Form options of a field, if it has any. */
export const formOptions = (field: FieldLike): FieldFormOptions => (field as FormFieldLike).form ?? {};

/** Form model of a model, if it was combined with one. */
export const formOf = (model: ModelLike): FormModel => (model as FormModelLike).form ?? {};
