import { type Ref, type Slots } from "vue";
import type { FormMode, ModelLike, ValidationMessages } from "../schema";
/** What the fields of a record share: given by ModelFields (the body of ModelForm and of sub-forms) to ModelFormField. */
export interface FormFields {
    model: () => ModelLike;
    record: Ref<Record<string, unknown>>;
    update: (name: string, value: unknown) => void;
    mode: () => FormMode;
    messages: () => Partial<ValidationMessages> | undefined;
    /** Slots of the form, for #field.<name> slots. */
    slots: Slots;
}
export declare function provideFormFields(fields: FormFields): void;
/** The fields of the enclosing form; nested sub-forms have their own. */
export declare function useFormFields(): FormFields;
