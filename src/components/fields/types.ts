import type { FieldLike, ValidationMessages } from "../../schema";

/** Props shared by the field controls; other attributes go to the Vuetify component. */
export interface FieldControlProps {
    /** The model field the control edits. */
    field: FieldLike;
    readonly?: boolean;
    /** Overrides of the default validation messages. */
    messages?: Partial<ValidationMessages>;
}
