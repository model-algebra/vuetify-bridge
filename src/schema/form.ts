import type { Component } from "vue";
import type { FieldLike, ModelLike } from "./field";

/*
 * How a model is shown in a form, kept apart from the model: a form model is a model of its own, with the same
 * name and the fields it says something about, carrying form options under the `form` key of fields and of the model.
 * The union of both models (union() of model-algebra-typescript) is what ModelForm is given, so forms need few
 * templates and the main model stays free of anything about forms:
 *
 *   { "metadata": { "name": "Event" },
 *     "fields": [{ "name": "title", "form": { "label": "Name", "cols": 12 } },
 *                { "name": "status", "form": { "control": "StatusChips" } }],
 *     "form": { "order": ["title", "status"], "submitText": "Publish" } }
 *
 * Components are named, so form models are JSON like any model; ModelForm finds them in its components prop, in
 * components provided with FormComponentsKey, or among globally registered components.
 */

/** The name of a component (see above), or, in code, the component itself. */
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

/** How one field is shown in a form: the `form` key of a field. */
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

/** How a model is shown in a form: the `form` key of the model. */
export interface ModelFormOptions {
    /** Fields to show, in this order; all fields of the model by default. */
    order?: string[];
    submitText?: string;
    cancelText?: string;
    /** Replaces the Save and Cancel buttons; gets the props of the actions slot. */
    actions?: ComponentLike;
}

/** Form options of a field, if it has any. */
export const formOptions = (field: FieldLike): FieldFormOptions => field.form ?? {};

/** Form options of a model, if it has any. */
export const formOf = (model: ModelLike): ModelFormOptions => model.form ?? {};

/** The field as the form shows it: with the label and the hint of its form options. */
export function formField(field: FieldLike): FieldLike {
    const { label, hint } = formOptions(field);
    if (label === undefined && hint === undefined) return field;
    return Object.assign(Object.create(Object.getPrototypeOf(field)), field, {
        ...(label !== undefined ? { label } : {}),
        ...(hint !== undefined ? { description: hint } : {}),
    });
}
