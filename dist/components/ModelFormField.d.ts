import { type PropType } from 'vue';
import { type FieldLike } from '../schema';
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    /** Name of the field. */
    name: {
        type: StringConstructor;
        required: true;
    };
    /** The field itself, instead of looking it up by name. */
    field: {
        type: PropType<FieldLike>;
        default: undefined;
    };
}>, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
}> | import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
}>[] | null, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    /** Name of the field. */
    name: {
        type: StringConstructor;
        required: true;
    };
    /** The field itself, instead of looking it up by name. */
    field: {
        type: PropType<FieldLike>;
        default: undefined;
    };
}>> & Readonly<{}>, {
    field: FieldLike;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
