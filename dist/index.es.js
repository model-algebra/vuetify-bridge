import { inject as je, computed as y, isRef as R, provide as De, ref as P, watch as Y, defineComponent as x, mergeModels as N, useModel as w, createBlock as p, openBlock as g, unref as s, createElementBlock as L, Fragment as q, createVNode as b, withCtx as v, renderList as U, renderSlot as K, createTextVNode as T, toDisplayString as $, createCommentVNode as I, createSlots as ae, normalizeClass as Ie, resolveDynamicComponent as H, useSlots as Te, withModifiers as Oe, normalizeProps as ke, guardReactiveProps as Me, mergeProps as Fe } from "vue";
import { VCheckbox as Ce, VRow as Le, VCol as Re, VAlert as Ue, VInput as le, VCard as X, VCardItem as Q, VCardTitle as _, VCardSubtitle as Ne, VBtn as D, VCardText as ee, VCombobox as Be, VSelect as Pe, VTextField as xe, VTextarea as Ke, VForm as qe, VSpacer as Ye, VDataTable as Je, VDataTableServer as ze } from "vuetify/components";
const Ae = /* @__PURE__ */ new Map([
  ["integer", void 0],
  ["INT16", [-32768, 32767]],
  ["INT32", [-2147483648, 2147483647]],
  ["INT64", void 0]
]), Ge = /* @__PURE__ */ new Set(["number", "FLOAT32", "FLOAT64", "DECIMAL"]), Ze = /* @__PURE__ */ new Set(["string", "STRING", "UUID", "DURATION"]), We = /* @__PURE__ */ new Set(["DATETIME", "TIMESTAMP", "TIMESTAMP_TZ"]), He = /* @__PURE__ */ new Set(["JSON", "UNION", "object", "array"]);
function O(e) {
  const t = e.constraints;
  return t == null ? {} : Array.isArray(t) ? Object.fromEntries(t.map((n) => [n.name, n.value])) : t;
}
function se(e) {
  const t = O(e).enum;
  if (Array.isArray(t)) return t;
  const n = e.type === "ARRAY" ? e.parameters?.items : e, a = n?.type === "ENUM" ? n.parameters?.values : void 0;
  return Array.isArray(a) ? a : void 0;
}
function G(e) {
  const t = e.type;
  return Ae.has(t) ? "integer" : Ge.has(t) ? "number" : Ze.has(t) ? "text" : t === "TEXT" ? "longText" : t === "boolean" || t === "BOOLEAN" ? "boolean" : t === "ENUM" ? "enum" : t === "date" || t === "DATE" ? "date" : t === "TIME" ? "time" : We.has(t) ? "datetime" : t === "OBJECT" ? "object" : He.has(t) ? "json" : "unsupported";
}
function j(e) {
  if (e.type === "ARRAY") {
    if (se(e) !== void 0) return "multiEnum";
    const t = e.parameters?.items, n = t !== void 0 ? G(t) : "json";
    return n === "text" ? "tags" : n === "object" ? "objectList" : "json";
  }
  return O(e).enum !== void 0 && G(e) === "text" ? "enum" : G(e);
}
function Xe(e) {
  const t = e.type === "ARRAY" ? e.parameters?.items : e, n = t?.type === "OBJECT" ? t.parameters?.ref : void 0;
  return typeof n == "string" ? n : void 0;
}
function E(e) {
  return e.name.replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2").split(/[\s_\-]+/).filter((n) => n.length > 0).map((n, a) => {
    const u = n.length > 1 && n === n.toUpperCase() ? n : n.toLowerCase();
    return a === 0 ? u[0].toUpperCase() + u.slice(1) : u;
  }).join(" ");
}
function oe(e) {
  const t = O(e);
  return t.nullable === !1 || t.required === !0;
}
function Qe(e, t) {
  return !(t === "create" && O(e).identity !== void 0);
}
function me(e, t) {
  if (t === "view" || j(e) === "unsupported") return !1;
  const n = O(e);
  return n.identity === "always" ? !1 : !(t === "edit" && (n.primaryKey === !0 || n.identity !== void 0));
}
function Ee(e, t, n = []) {
  const a = new Map(e.fields.map((r) => [r.name, r]));
  return (t === void 0 ? e.fields : t.map((r) => {
    const d = a.get(r);
    if (d === void 0)
      throw new Error(`Model ${e.metadata.name} has no field ${r}`);
    return d;
  })).filter((r) => !n.includes(r.name));
}
function _e(e) {
  const t = e.fields.find((a) => O(a).primaryKey === !0);
  if (t !== void 0) return t.name;
  const n = e.constraints?.find((a) => a.type === "primaryKey");
  return n?.fields?.length === 1 ? n.fields[0] : void 0;
}
function re(e) {
  return Object.fromEntries(e.fields.map((t) => {
    const n = O(t).default, a = n !== null && typeof n == "object" && "value" in n ? n.value : null;
    return [t.name, a];
  }));
}
const B = (e, t = 2) => String(e).padStart(t, "0"), ce = (e) => `${e.getFullYear()}-${B(e.getMonth() + 1)}-${B(e.getDate())}`, fe = (e) => `${B(e.getHours())}:${B(e.getMinutes())}:${B(e.getSeconds())}`;
function ve(e) {
  if (e instanceof Date) return e;
  if (typeof e == "string" && /(Z|[+-]\d\d:?\d\d)$/.test(e)) return new Date(e);
}
function J(e) {
  return e == null || e === "" || Array.isArray(e) && e.length === 0;
}
function ye(e, t) {
  const n = j(e);
  switch (n) {
    case "multiEnum":
    case "tags":
      return Array.isArray(t) ? t : [];
    case "boolean":
    case "enum":
    case "unsupported":
      return t ?? null;
  }
  if (t == null) return "";
  switch (n) {
    case "date": {
      const a = ve(t);
      return a !== void 0 ? ce(a) : String(t).slice(0, 10);
    }
    case "time":
      return t instanceof Date ? fe(t) : String(t);
    case "datetime": {
      const a = ve(t);
      return a !== void 0 ? `${ce(a)}T${fe(a)}` : String(t).replace(" ", "T").slice(0, 19);
    }
    case "json":
    case "object":
    case "objectList":
      return JSON.stringify(t, null, 2);
    default:
      return String(t);
  }
}
function te(e, t) {
  const n = j(e);
  if (n === "multiEnum" || n === "tags")
    return { ok: !0, value: Array.isArray(t) ? t : [] };
  if (J(t)) return { ok: !0, value: null };
  switch (n) {
    case "integer":
    case "number": {
      const a = typeof t == "number" ? t : Number(String(t).trim());
      return Number.isFinite(a) ? { ok: !0, value: a } : { ok: !1, error: "number" };
    }
    case "datetime": {
      if (e.type !== "TIMESTAMP_TZ") return { ok: !0, value: t };
      const a = new Date(String(t));
      return Number.isNaN(a.getTime()) ? { ok: !1, error: "date" } : { ok: !0, value: a.toISOString() };
    }
    case "json":
    case "object":
    case "objectList":
      try {
        return { ok: !0, value: JSON.parse(String(t)) };
      } catch {
        return { ok: !1, error: "json" };
      }
    default:
      return { ok: !0, value: t };
  }
}
const et = {
  "=": "equal to",
  "!=": "different from",
  "<": "less than",
  "<=": "at most",
  ">": "greater than",
  ">=": "at least"
}, ge = {
  required: (e) => `${e} is required`,
  number: (e) => `${e} must be a number`,
  integer: (e) => `${e} must be a whole number`,
  min: (e, t) => `${e} must be at least ${t}`,
  max: (e, t) => `${e} must be at most ${t}`,
  decimals: (e, t) => `${e} must have at most ${t} decimal places`,
  maxLength: (e, t) => `${e} must be at most ${t} characters`,
  oneOf: (e, t) => `${e} must be one of ${t.join(", ")}`,
  pattern: (e, t) => `${e} must match ${t}`,
  uuid: (e) => `${e} must be a UUID`,
  duration: (e) => `${e} must be an ISO 8601 duration, e.g. P1DT2H`,
  date: (e) => `${e} must be a valid date`,
  json: (e) => `${e} must be valid JSON`,
  check: (e, t, n) => `${e} must be ${et[t]} ${n}`
};
function ue(e) {
  return e === void 0 ? ge : { ...ge, ...e };
}
const tt = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, nt = /^-?P(?!$)(\d+(\.\d+)?Y)?(\d+(\.\d+)?M)?(\d+(\.\d+)?W)?(\d+(\.\d+)?D)?(T(?=\d)(\d+(\.\d+)?H)?(\d+(\.\d+)?M)?(\d+(\.\d+)?S)?)?$/;
function at(e) {
  const [t, n] = String(e).split("e"), a = t.split(".")[1]?.length ?? 0;
  return Math.max(0, a - Number(n ?? 0));
}
const lt = (e) => e instanceof Date ? !Number.isNaN(e.getTime()) : !Number.isNaN(new Date(String(e)).getTime());
function ie(e, t) {
  const n = ue(t), a = E(e), u = j(e), r = O(e), d = e.parameters ?? {}, c = [], o = (l, i) => c.push((V) => l(V) || i);
  if ((u === "integer" || u === "number") && o((l) => typeof l == "number" && Number.isFinite(l), n.number(a)), u === "integer") {
    o((i) => Number.isInteger(i), n.integer(a));
    const l = Ae.get(e.type);
    l !== void 0 && (o((i) => i >= l[0], n.min(a, l[0])), o((i) => i <= l[1], n.max(a, l[1])));
  }
  if (e.type === "DECIMAL" && typeof d.scale == "number" && o((l) => at(l) <= d.scale, n.decimals(a, d.scale)), typeof r.min == "number" && o((l) => l >= r.min, n.min(a, r.min)), typeof r.max == "number" && o((l) => l <= r.max, n.max(a, r.max)), e.type === "STRING" && typeof d.length == "number" && o((l) => String(l).length <= d.length, n.maxLength(a, d.length)), e.type === "UUID" && o((l) => tt.test(String(l)), n.uuid(a)), e.type === "DURATION" && o((l) => nt.test(String(l)), n.duration(a)), typeof r.regex == "string" && e.type !== "ARRAY") {
    const l = new RegExp(r.regex);
    o((i) => l.test(String(i)), n.pattern(a, r.regex));
  }
  const m = se(e);
  m !== void 0 && o(
    (l) => Array.isArray(l) ? l.every((i) => m.includes(i)) : m.includes(l),
    n.oneOf(a, m)
  ), (u === "date" || u === "datetime") && o(lt, n.date(a));
  const f = oe(e);
  return [(l) => {
    if (J(l)) return f ? n.required(a) : !0;
    for (const i of c) {
      const V = i(l);
      if (V !== !0) return V;
    }
    return !0;
  }];
}
function st(e, t) {
  const n = ue(t), a = E(e), u = ie(e, t);
  return [(r) => {
    const d = te(e, r);
    if (!d.ok) return n[d.error](a);
    for (const c of u) {
      const o = c(d.value);
      if (o !== !0) return o;
    }
    return !0;
  }];
}
const be = (e) => e instanceof Date ? e.getTime() : e;
function ot(e, t, n) {
  switch (e) {
    case "=":
      return t === n;
    case "!=":
      return t !== n;
    case "<":
      return t < n;
    case "<=":
      return t <= n;
    case ">":
      return t > n;
    case ">=":
      return t >= n;
  }
}
function rt(e, t, n) {
  const a = ue(n), u = new Map(e.fields.map((c) => [c.name, c])), r = (c) => {
    const o = u.get(c);
    return o !== void 0 ? E(o) : c;
  }, d = [];
  for (const c of e.constraints ?? []) {
    if (c.type !== "check" || c.rule === void 0) continue;
    const o = c.rule, m = t[o.field], f = o.otherField !== void 0 ? t[o.otherField] : o.value;
    if (!(J(m) || J(f)) && !ot(o.op, be(m), be(f))) {
      const l = o.otherField !== void 0 ? r(o.otherField) : String(o.value);
      d.push(a.check(r(o.field), o.op, l));
    }
  }
  return d;
}
const pe = 60;
function he(e) {
  if (e instanceof Date) return e;
  const t = String(e), n = /^(\d{4})-(\d{2})-(\d{2})$/.exec(t);
  return n !== null ? new Date(Number(n[1]), Number(n[2]) - 1, Number(n[3])) : new Date(t);
}
function ne(e, t, n) {
  if (t == null) return "";
  switch (j(e)) {
    case "integer":
    case "number": {
      if (typeof t != "number") return String(t);
      const a = e.type === "DECIMAL" ? e.parameters?.scale : void 0;
      return new Intl.NumberFormat(n, typeof a == "number" ? { minimumFractionDigits: a, maximumFractionDigits: a } : { maximumFractionDigits: 20 }).format(t);
    }
    case "boolean":
      return t ? "Yes" : "No";
    case "date": {
      const a = he(t);
      return Number.isNaN(a.getTime()) ? String(t) : a.toLocaleDateString(n);
    }
    case "datetime": {
      const a = he(t);
      return Number.isNaN(a.getTime()) ? String(t) : a.toLocaleString(n);
    }
    case "multiEnum":
    case "tags":
      return Array.isArray(t) ? t.join(", ") : String(t);
    case "json":
    case "object":
    case "objectList": {
      const a = JSON.stringify(t);
      return a.length > pe ? `${a.slice(0, pe - 1)}…` : a;
    }
    case "unsupported":
      return t instanceof Uint8Array ? `${t.length} bytes` : String(t);
    default:
      return String(t);
  }
}
function Ve(e) {
  if (typeof e == "function") return e;
  const t = new Map(Array.isArray(e) ? e.map((n) => [n.metadata.name, n]) : Object.entries(e));
  return (n) => t.get(n);
}
const Se = /* @__PURE__ */ Symbol("vuetify-bridge models"), ut = () => {
};
function we(e) {
  const t = je(Se, void 0), n = y(() => {
    const a = e();
    return a !== void 0 ? Ve(a) : t === void 0 ? ut : R(t) ? t.value : Ve(t);
  });
  return De(Se, n), n;
}
const $e = (e, t) => e === t || JSON.stringify(e) === JSON.stringify(t);
function z(e, t, n) {
  const a = P(ye(e(), t.value));
  return Y(a, (u) => {
    const r = te(e(), u);
    r.ok && !$e(r.value, t.value) && (t.value = r.value);
  }), Y([t, e], ([u]) => {
    const r = te(e(), a.value);
    (!r.ok || !$e(r.value, u)) && (a.value = ye(e(), u));
  }, { deep: !0 }), {
    input: a,
    kind: y(() => j(e())),
    label: y(() => E(e())),
    hint: y(() => e().description),
    required: y(() => oe(e())),
    rules: y(() => st(e(), n()))
  };
}
const it = /* @__PURE__ */ x({
  __name: "ModelBooleanField",
  props: /* @__PURE__ */ N({
    field: {},
    readonly: { type: Boolean },
    messages: {}
  }, {
    modelValue: {},
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e) {
    const t = e, n = w(e, "modelValue"), { input: a, label: u, hint: r, rules: d } = z(() => t.field, n, () => t.messages);
    return (c, o) => (g(), p(s(Ce), {
      modelValue: s(a),
      "onUpdate:modelValue": o[0] || (o[0] = (m) => R(a) ? a.value = m : null),
      label: s(u),
      hint: s(r),
      "persistent-hint": s(r) !== void 0,
      rules: s(d),
      readonly: e.readonly
    }, null, 8, ["modelValue", "label", "hint", "persistent-hint", "rules", "readonly"]));
  }
}), de = /* @__PURE__ */ x({
  __name: "ModelFields",
  props: /* @__PURE__ */ N({
    model: {},
    mode: { default: "edit" },
    fields: {},
    exclude: {},
    messages: {},
    models: {}
  }, {
    modelValue: { required: !0 },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e) {
    const t = e, n = w(e, "modelValue"), a = y(() => Ee(t.model, t.fields, t.exclude).filter((m) => Qe(m, t.mode))), u = y(() => rt(t.model, n.value, t.messages)), r = [() => u.value.length === 0 || u.value[0]], d = /* @__PURE__ */ new Set(["longText", "json", "tags", "multiEnum", "object", "objectList"]), c = (m) => d.has(j(m)) ? 12 : 6;
    function o(m, f) {
      n.value = { ...n.value, [m]: f };
    }
    return (m, f) => (g(), L(q, null, [
      b(s(Le), null, {
        default: v(() => [
          (g(!0), L(q, null, U(a.value, (l) => (g(), p(s(Re), {
            key: l.name,
            cols: "12",
            md: c(l)
          }, {
            default: v(() => [
              K(m.$slots, `field.${l.name}`, {
                field: l,
                value: n.value[l.name],
                update: (i) => o(l.name, i),
                readonly: !s(me)(l, e.mode)
              }, () => [
                b(yt, {
                  "model-value": n.value[l.name],
                  field: l,
                  readonly: !s(me)(l, e.mode),
                  mode: e.mode,
                  messages: e.messages,
                  models: e.models,
                  "onUpdate:modelValue": (i) => o(l.name, i)
                }, null, 8, ["model-value", "field", "readonly", "mode", "messages", "models", "onUpdate:modelValue"])
              ])
            ]),
            _: 2
          }, 1032, ["md"]))), 128))
        ]),
        _: 3
      }),
      (g(!0), L(q, null, U(u.value, (l) => (g(), p(s(Ue), {
        key: l,
        type: "error",
        variant: "tonal",
        density: "compact",
        class: "mb-2"
      }, {
        default: v(() => [
          T($(l), 1)
        ]),
        _: 2
      }, 1024))), 128)),
      b(s(le), {
        "model-value": n.value,
        rules: r,
        class: "d-none",
        "hide-details": ""
      }, null, 8, ["model-value"])
    ], 64));
  }
}), dt = /* @__PURE__ */ x({
  __name: "ModelObjectField",
  props: /* @__PURE__ */ N({
    model: {},
    mode: {},
    field: {},
    readonly: { type: Boolean },
    messages: {}
  }, {
    modelValue: {},
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e) {
    const t = e, n = w(e, "modelValue"), a = y(() => E(t.field)), u = y(() => oe(t.field)), r = y(() => ie(t.field, t.messages)), d = P(!1), c = y(() => t.readonly ? "view" : d.value ? "create" : t.mode ?? "edit");
    function o() {
      d.value = !0, n.value = re(t.model);
    }
    function m() {
      d.value = !1, n.value = null;
    }
    return (f, l) => (g(), p(s(le), {
      "model-value": n.value,
      rules: r.value,
      class: "model-object-field"
    }, {
      default: v(() => [
        b(s(X), {
          variant: "outlined",
          class: "w-100"
        }, {
          default: v(() => [
            b(s(Q), null, {
              append: v(() => [
                n.value == null && !e.readonly ? (g(), p(s(D), {
                  key: 0,
                  variant: "tonal",
                  size: "small",
                  "prepend-icon": "$plus",
                  onClick: o
                }, {
                  default: v(() => [...l[1] || (l[1] = [
                    T("Add", -1)
                  ])]),
                  _: 1
                })) : n.value != null && !e.readonly && !u.value ? (g(), p(s(D), {
                  key: 1,
                  variant: "text",
                  size: "small",
                  "prepend-icon": "$delete",
                  onClick: m
                }, {
                  default: v(() => [...l[2] || (l[2] = [
                    T("Remove", -1)
                  ])]),
                  _: 1
                })) : I("", !0)
              ]),
              default: v(() => [
                b(s(_), { class: "text-body-1" }, {
                  default: v(() => [
                    T($(a.value), 1)
                  ]),
                  _: 1
                }),
                e.field.description ? (g(), p(s(Ne), { key: 0 }, {
                  default: v(() => [
                    T($(e.field.description), 1)
                  ]),
                  _: 1
                })) : I("", !0)
              ]),
              _: 1
            }),
            n.value != null ? (g(), p(s(ee), { key: 0 }, {
              default: v(() => [
                b(de, {
                  modelValue: n.value,
                  "onUpdate:modelValue": l[0] || (l[0] = (i) => n.value = i),
                  model: e.model,
                  mode: c.value,
                  messages: e.messages
                }, null, 8, ["modelValue", "model", "mode", "messages"])
              ]),
              _: 1
            })) : I("", !0)
          ]),
          _: 1
        })
      ]),
      _: 1
    }, 8, ["model-value", "rules"]));
  }
}), mt = {
  key: 0,
  class: "text-medium-emphasis"
}, ct = /* @__PURE__ */ x({
  __name: "ModelObjectListField",
  props: /* @__PURE__ */ N({
    model: {},
    mode: {},
    field: {},
    readonly: { type: Boolean },
    messages: {}
  }, {
    modelValue: {},
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e) {
    const t = e, n = w(e, "modelValue"), a = y(() => n.value ?? []), u = y(() => E(t.field)), r = y(() => E({ name: t.model.metadata.name })), d = y(() => ie(t.field, t.messages));
    let c = 0;
    const o = P([]), m = P(/* @__PURE__ */ new Set());
    Y(() => a.value.length, (h) => {
      o.value.length !== h && (o.value = Array.from({ length: h }, () => c++));
    }, { immediate: !0 });
    const f = (h) => t.readonly ? "view" : m.value.has(o.value[h]) ? "create" : t.mode ?? "edit";
    function l(h, F) {
      n.value = a.value.map((k, S) => S === h ? F : k);
    }
    function i() {
      const h = c++;
      o.value = [...o.value, h], m.value = new Set(m.value).add(h), n.value = [...a.value, re(t.model)];
    }
    function V(h) {
      o.value = o.value.filter((F, k) => k !== h), n.value = a.value.filter((F, k) => k !== h);
    }
    function A(h, F) {
      const k = (S) => {
        const M = [...S];
        return [M[h], M[h + F]] = [M[h + F], M[h]], M;
      };
      o.value = k(o.value), n.value = k(a.value);
    }
    return (h, F) => (g(), p(s(le), {
      "model-value": a.value,
      rules: d.value,
      class: "model-object-list-field"
    }, {
      default: v(() => [
        b(s(X), {
          variant: "outlined",
          class: "w-100"
        }, {
          default: v(() => [
            b(s(Q), null, {
              append: v(() => [
                e.readonly ? I("", !0) : (g(), p(s(D), {
                  key: 0,
                  variant: "tonal",
                  size: "small",
                  "prepend-icon": "$plus",
                  onClick: i
                }, {
                  default: v(() => [
                    T(" Add " + $(r.value.toLowerCase()), 1)
                  ]),
                  _: 1
                }))
              ]),
              default: v(() => [
                b(s(_), { class: "text-body-1" }, {
                  default: v(() => [
                    T($(u.value), 1)
                  ]),
                  _: 1
                }),
                e.field.description ? (g(), p(s(Ne), { key: 0 }, {
                  default: v(() => [
                    T($(e.field.description), 1)
                  ]),
                  _: 1
                })) : I("", !0)
              ]),
              _: 1
            }),
            b(s(ee), null, {
              default: v(() => [
                a.value.length === 0 ? (g(), L("p", mt, "No " + $(r.value.toLowerCase()) + " items.", 1)) : I("", !0),
                (g(!0), L(q, null, U(a.value, (k, S) => (g(), p(s(X), {
                  key: o.value[S],
                  variant: "tonal",
                  class: "mb-3",
                  "aria-label": `${r.value} ${S + 1}`
                }, {
                  default: v(() => [
                    b(s(Q), null, ae({
                      default: v(() => [
                        b(s(_), { class: "text-body-2" }, {
                          default: v(() => [
                            T($(r.value) + " " + $(S + 1), 1)
                          ]),
                          _: 2
                        }, 1024)
                      ]),
                      _: 2
                    }, [
                      e.readonly ? void 0 : {
                        name: "append",
                        fn: v(() => [
                          b(s(D), {
                            icon: "$expand",
                            variant: "text",
                            size: "small",
                            disabled: S === a.value.length - 1,
                            "aria-label": `Move ${r.value} ${S + 1} down`,
                            onClick: (M) => A(S, 1)
                          }, null, 8, ["disabled", "aria-label", "onClick"]),
                          b(s(D), {
                            icon: "$collapse",
                            variant: "text",
                            size: "small",
                            disabled: S === 0,
                            "aria-label": `Move ${r.value} ${S + 1} up`,
                            onClick: (M) => A(S, -1)
                          }, null, 8, ["disabled", "aria-label", "onClick"]),
                          b(s(D), {
                            icon: "$delete",
                            variant: "text",
                            size: "small",
                            "aria-label": `Remove ${r.value} ${S + 1}`,
                            onClick: (M) => V(S)
                          }, null, 8, ["aria-label", "onClick"])
                        ]),
                        key: "0"
                      }
                    ]), 1024),
                    b(s(ee), null, {
                      default: v(() => [
                        b(de, {
                          "model-value": k,
                          model: e.model,
                          mode: f(S),
                          messages: e.messages,
                          "onUpdate:modelValue": (M) => l(S, M)
                        }, null, 8, ["model-value", "model", "mode", "messages", "onUpdate:modelValue"])
                      ]),
                      _: 2
                    }, 1024)
                  ]),
                  _: 2
                }, 1032, ["aria-label"]))), 128))
              ]),
              _: 1
            })
          ]),
          _: 1
        })
      ]),
      _: 1
    }, 8, ["model-value", "rules"]));
  }
}), Z = /* @__PURE__ */ x({
  __name: "ModelSelectField",
  props: /* @__PURE__ */ N({
    field: {},
    readonly: { type: Boolean },
    messages: {}
  }, {
    modelValue: {},
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e) {
    const t = e, n = w(e, "modelValue"), { input: a, kind: u, label: r, hint: d, required: c, rules: o } = z(() => t.field, n, () => t.messages), m = y(() => se(t.field) ?? []);
    return (f, l) => s(u) === "tags" ? (g(), p(s(Be), {
      key: 0,
      modelValue: s(a),
      "onUpdate:modelValue": l[0] || (l[0] = (i) => R(a) ? a.value = i : null),
      label: s(r),
      hint: s(d),
      rules: s(o),
      readonly: e.readonly,
      multiple: "",
      chips: "",
      "closable-chips": "",
      "hide-no-data": ""
    }, null, 8, ["modelValue", "label", "hint", "rules", "readonly"])) : (g(), p(s(Pe), {
      key: 1,
      modelValue: s(a),
      "onUpdate:modelValue": l[1] || (l[1] = (i) => R(a) ? a.value = i : null),
      items: m.value,
      multiple: s(u) === "multiEnum",
      chips: s(u) === "multiEnum",
      clearable: !s(c) && !e.readonly,
      label: s(r),
      hint: s(d),
      rules: s(o),
      readonly: e.readonly
    }, null, 8, ["modelValue", "items", "multiple", "chips", "clearable", "label", "hint", "rules", "readonly"]));
  }
}), C = /* @__PURE__ */ x({
  __name: "ModelTextField",
  props: /* @__PURE__ */ N({
    field: {},
    readonly: { type: Boolean },
    messages: {}
  }, {
    modelValue: {},
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e) {
    const t = e, n = w(e, "modelValue"), { input: a, kind: u, label: r, hint: d, rules: c } = z(() => t.field, n, () => t.messages), o = {
      integer: "number",
      number: "number",
      date: "date",
      time: "time",
      datetime: "datetime-local"
    }, m = y(() => o[u.value] ?? "text"), f = y(() => {
      switch (u.value) {
        case "integer":
          return 1;
        case "number": {
          const i = t.field.type === "DECIMAL" ? t.field.parameters?.scale : void 0;
          return typeof i == "number" ? 10 ** -i : "any";
        }
        case "time":
        case "datetime":
          return 1;
        default:
          return;
      }
    }), l = y(() => t.field.type === "STRING" && typeof t.field.parameters?.length == "number" ? t.field.parameters.length : void 0);
    return (i, V) => (g(), p(s(xe), {
      modelValue: s(a),
      "onUpdate:modelValue": V[0] || (V[0] = (A) => R(a) ? a.value = A : null),
      type: m.value,
      step: f.value,
      counter: l.value,
      label: s(r),
      hint: s(d),
      rules: s(c),
      readonly: e.readonly
    }, null, 8, ["modelValue", "type", "step", "counter", "label", "hint", "rules", "readonly"]));
  }
}), ft = /* @__PURE__ */ x({
  __name: "ModelTextareaField",
  props: /* @__PURE__ */ N({
    field: {},
    readonly: { type: Boolean },
    messages: {}
  }, {
    modelValue: {},
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e) {
    const t = e, n = w(e, "modelValue"), { input: a, kind: u, label: r, hint: d, rules: c } = z(() => t.field, n, () => t.messages);
    return (o, m) => (g(), p(s(Ke), {
      modelValue: s(a),
      "onUpdate:modelValue": m[0] || (m[0] = (f) => R(a) ? a.value = f : null),
      class: Ie({ "model-json-field": s(u) !== "longText" }),
      label: s(r),
      hint: s(d),
      rules: s(c),
      readonly: e.readonly,
      "auto-grow": "",
      rows: "3"
    }, null, 8, ["modelValue", "class", "label", "hint", "rules", "readonly"]));
  }
}), vt = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [a, u] of t)
    n[a] = u;
  return n;
}, W = /* @__PURE__ */ vt(ft, [["__scopeId", "data-v-9ba3dee9"]]), yt = /* @__PURE__ */ x({
  __name: "ModelField",
  props: /* @__PURE__ */ N({
    field: {},
    readonly: { type: Boolean },
    messages: {},
    mode: {},
    models: { type: [Array, Object, Function] }
  }, {
    modelValue: {},
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e) {
    const t = e, n = w(e, "modelValue"), a = {
      integer: C,
      number: C,
      text: C,
      date: C,
      time: C,
      datetime: C,
      longText: W,
      json: W,
      boolean: it,
      enum: Z,
      multiEnum: Z,
      tags: Z,
      object: dt,
      objectList: ct
    }, u = we(() => t.models), r = y(() => j(t.field)), d = y(() => {
      const o = Xe(t.field);
      return o !== void 0 ? u.value(o) : void 0;
    }), c = y(() => {
      if (r.value !== "unsupported")
        return (r.value === "object" || r.value === "objectList") && d.value === void 0 ? W : a[r.value];
    });
    return (o, m) => c.value === void 0 ? (g(), p(s(xe), {
      key: 0,
      "model-value": s(ne)(e.field, n.value),
      label: s(E)(e.field),
      hint: e.field.description,
      readonly: ""
    }, null, 8, ["model-value", "label", "hint"])) : d.value !== void 0 ? (g(), p(H(c.value), {
      key: 1,
      modelValue: n.value,
      "onUpdate:modelValue": m[0] || (m[0] = (f) => n.value = f),
      field: e.field,
      model: d.value,
      mode: e.mode,
      readonly: e.readonly,
      messages: e.messages
    }, null, 8, ["modelValue", "field", "model", "mode", "readonly", "messages"])) : (g(), p(H(c.value), {
      key: 2,
      modelValue: n.value,
      "onUpdate:modelValue": m[1] || (m[1] = (f) => n.value = f),
      field: e.field,
      readonly: e.readonly,
      messages: e.messages
    }, null, 8, ["modelValue", "field", "readonly", "messages"]));
  }
}), gt = {
  key: 0,
  class: "d-flex ga-2"
}, ht = /* @__PURE__ */ x({
  __name: "ModelForm",
  props: /* @__PURE__ */ N({
    model: {},
    mode: { default: "edit" },
    fields: {},
    exclude: {},
    messages: {},
    models: {},
    submitText: { default: "Save" },
    cancelText: { default: "Cancel" },
    hideActions: { type: Boolean }
  }, {
    modelValue: { required: !0 },
    modelModifiers: {}
  }),
  emits: /* @__PURE__ */ N(["submit", "cancel"], ["update:modelValue"]),
  setup(e, { expose: t, emit: n }) {
    const a = e, u = w(e, "modelValue"), r = n;
    we(() => a.models);
    const d = Te(), c = y(() => Object.keys(d).filter((i) => i.startsWith("field."))), o = P();
    async function m() {
      return (await o.value?.validate())?.valid ?? !1;
    }
    async function f() {
      await m() && r("submit", u.value);
    }
    function l() {
      r("cancel");
    }
    return Y(() => a.mode, (i) => {
      i === "create" && (u.value = { ...re(a.model), ...u.value });
    }, { immediate: !0 }), t({
      validate: m,
      resetValidation: () => o.value?.resetValidation()
    }), (i, V) => (g(), p(s(qe), {
      ref_key: "form",
      ref: o,
      onSubmit: Oe(f, ["prevent"])
    }, {
      default: v(() => [
        b(de, {
          modelValue: u.value,
          "onUpdate:modelValue": V[0] || (V[0] = (A) => u.value = A),
          model: e.model,
          mode: e.mode,
          fields: e.fields,
          exclude: e.exclude,
          messages: e.messages
        }, ae({ _: 2 }, [
          U(c.value, (A) => ({
            name: A,
            fn: v((h) => [
              K(i.$slots, A, ke(Me(h)))
            ])
          }))
        ]), 1032, ["modelValue", "model", "mode", "fields", "exclude", "messages"]),
        e.mode !== "view" ? K(i.$slots, "actions", {
          key: 0,
          submit: f,
          cancel: l
        }, () => [
          e.hideActions ? I("", !0) : (g(), L("div", gt, [
            b(s(Ye)),
            b(s(D), {
              variant: "text",
              onClick: l
            }, {
              default: v(() => [
                T($(e.cancelText), 1)
              ]),
              _: 1
            }),
            b(s(D), {
              type: "submit",
              color: "primary"
            }, {
              default: v(() => [
                T($(e.submitText), 1)
              ]),
              _: 1
            })
          ]))
        ]) : I("", !0)
      ]),
      _: 3
    }, 512));
  }
}), Vt = /* @__PURE__ */ x({
  __name: "ModelTable",
  props: {
    model: {},
    items: {},
    fields: {},
    exclude: {},
    itemKey: {},
    locale: {},
    itemsLength: {}
  },
  setup(e) {
    const t = e, n = Te(), a = /* @__PURE__ */ new Set(["integer", "number"]), u = /* @__PURE__ */ new Set(["json", "object", "objectList", "tags", "multiEnum", "unsupported"]), r = y(() => Ee(t.model, t.fields, t.exclude)), d = y(() => r.value.map((f) => {
      const l = j(f);
      return {
        title: E(f),
        key: f.name,
        align: a.has(l) ? "end" : "start",
        sortable: !u.has(l)
      };
    })), c = y(() => t.itemKey ?? _e(t.model) ?? "id"), o = y(() => new Set(r.value.map((f) => `item.${f.name}`))), m = y(() => Object.keys(n).filter((f) => !o.value.has(f)));
    return (f, l) => (g(), p(H(e.itemsLength === void 0 ? s(Je) : s(ze)), {
      headers: d.value,
      items: e.items,
      "item-value": c.value,
      "items-length": e.itemsLength
    }, ae({ _: 2 }, [
      U(r.value, (i) => ({
        name: `item.${i.name}`,
        fn: v((V) => [
          K(f.$slots, `item.${i.name}`, Fe(V, {
            field: i,
            formatted: s(ne)(i, V.value, e.locale)
          }), () => [
            T($(s(ne)(i, V.value, e.locale)), 1)
          ])
        ])
      })),
      U(m.value, (i) => ({
        name: i,
        fn: v((V) => [
          K(f.$slots, i, ke(Me(V ?? {})))
        ])
      }))
    ]), 1032, ["headers", "items", "item-value", "items-length"]));
  }
});
export {
  Ae as INTEGER_RANGES,
  it as ModelBooleanField,
  yt as ModelField,
  de as ModelFields,
  ht as ModelForm,
  dt as ModelObjectField,
  ct as ModelObjectListField,
  Z as ModelSelectField,
  Vt as ModelTable,
  C as ModelTextField,
  W as ModelTextareaField,
  Se as ModelsKey,
  ge as defaultMessages,
  re as emptyRecord,
  se as enumValues,
  O as fieldConstraints,
  j as fieldKind,
  E as fieldLabel,
  ie as fieldRules,
  ne as formatValue,
  te as fromInput,
  st as inputRules,
  me as isEditable,
  J as isEmpty,
  oe as isRequired,
  Qe as isVisible,
  _e as primaryKeyField,
  rt as recordErrors,
  Xe as referencedModel,
  ue as resolveMessages,
  Ee as selectFields,
  ye as toInput,
  Ve as toResolver,
  z as useFieldInput,
  we as useModels
};
