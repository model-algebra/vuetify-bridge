import { computed, ref, watch, type Ref } from "vue";
import {
    fieldKind, fieldLabel, fromInput, inputRules, isRequired, toInput,
    type FieldLike, type ValidationMessages,
} from "../schema";

const sameValue = (a: unknown, b: unknown) => a === b || JSON.stringify(a) === JSON.stringify(b);

/**
 * Binds a Vuetify control to a record value of the field. The control holds its own value (text of a number,
 * of a date, of JSON) that is written to the record whenever it can be read; while it cannot, the record keeps
 * its last value and the rules show why.
 */
export function useFieldInput(
    field: () => FieldLike,
    value: Ref<unknown>,
    messages: () => Partial<ValidationMessages> | undefined,
) {
    const input = ref<any>(toInput(field(), value.value));

    watch(input, current => {
        const parsed = fromInput(field(), current);
        if (parsed.ok && !sameValue(parsed.value, value.value)) value.value = parsed.value;
    });

    // Don't reformat what the user is typing when it already reads as the new value, e.g. "1." as 1
    watch([value, field], ([current]) => {
        const parsed = fromInput(field(), input.value);
        if (!parsed.ok || !sameValue(parsed.value, current)) input.value = toInput(field(), current);
    }, { deep: true });

    return {
        input,
        kind: computed(() => fieldKind(field())),
        label: computed(() => fieldLabel(field())),
        hint: computed(() => field().description),
        required: computed(() => isRequired(field())),
        rules: computed(() => inputRules(field(), messages())),
    };
}
