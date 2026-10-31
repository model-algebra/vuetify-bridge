import type { FieldLike, FormMode, ModelLike, ValidationMessages } from "../../schema";

/** Props shared by the field controls; other attributes go to the Vuetify component. */
export interface FieldControlProps {
    /** The model field the control edits. */
    field: FieldLike;
    readonly?: boolean;
    /** Overrides of the default validation messages. */
    messages?: Partial<ValidationMessages>;
}

/** Props of the controls editing OBJECT values with sub-forms. */
export interface ObjectControlProps extends FieldControlProps {
    /** The model referenced by the field. */
    model: ModelLike;
    /** Mode of the enclosing form; new nested records are edited in create mode. */
    mode?: FormMode;
}
