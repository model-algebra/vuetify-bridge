import { type Ref } from "vue";
import { type FieldLike, type ValidationMessages } from "../schema";
/**
 * Binds a Vuetify control to a record value of the field. The control holds its own value (text of a number,
 * of a date, of JSON) that is written to the record whenever it can be read; while it cannot, the record keeps
 * its last value and the rules show why.
 */
export declare function useFieldInput(field: () => FieldLike, value: Ref<unknown>, messages: () => Partial<ValidationMessages> | undefined): {
    input: Ref<any, any>;
    kind: import("vue").ComputedRef<import("..").FieldKind>;
    label: import("vue").ComputedRef<string>;
    hint: import("vue").ComputedRef<string | undefined>;
    required: import("vue").ComputedRef<boolean>;
    rules: import("vue").ComputedRef<import("..").FieldRule[]>;
};
