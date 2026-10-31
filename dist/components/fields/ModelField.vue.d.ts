import { type FormMode, type ModelsOption } from '../../schema';
import type { FieldControlProps } from './types';
type __VLS_Props = FieldControlProps & {
    /** Mode of the enclosing form, passed on to sub-forms of OBJECT fields. */
    mode?: FormMode;
    /** Models referenced by OBJECT fields; inherited from the enclosing form when not given. */
    models?: ModelsOption;
};
type __VLS_ModelProps = {
    modelValue?: unknown;
};
type __VLS_PublicProps = __VLS_Props & __VLS_ModelProps;
declare const __VLS_export: import("vue").DefineComponent<__VLS_PublicProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:modelValue": (value: unknown) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_PublicProps> & Readonly<{
    "onUpdate:modelValue"?: ((value: unknown) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
