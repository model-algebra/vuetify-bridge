import { inject as ot, computed as m, isRef as K, provide as it, ref as Z, watch as z, defineComponent as D, mergeModels as O, useModel as N, createBlock as $, openBlock as y, unref as u, createElementBlock as I, Fragment as q, createVNode as k, withCtx as p, renderList as P, renderSlot as H, createTextVNode as x, toDisplayString as E, createCommentVNode as F, createSlots as me, normalizeClass as ut, resolveDynamicComponent as ae, useSlots as Be, withModifiers as dt, normalizeProps as qe, guardReactiveProps as Ke, mergeProps as xe, toHandlers as ct } from "vue";
import { VCheckbox as ze, VRow as mt, VCol as ft, VAlert as vt, VInput as fe, VCard as se, VCardItem as re, VCardTitle as oe, VCardSubtitle as Ye, VBtn as C, VCardText as ie, VCombobox as yt, VSelect as Je, VTextField as Ge, VTextarea as gt, VForm as pt, VSpacer as bt, VDataTableServer as ht, VDataTable as $t } from "vuetify/components";
import { sortOptions as Vt, filterOptions as kt } from "model-algebra-common";
const Ze = /* @__PURE__ */ new Map([
  ["integer", void 0],
  ["INT16", [-32768, 32767]],
  ["INT32", [-2147483648, 2147483647]],
  ["INT64", void 0]
]), St = /* @__PURE__ */ new Set(["number", "FLOAT32", "FLOAT64", "DECIMAL"]), Mt = /* @__PURE__ */ new Set(["string", "STRING", "UUID", "DURATION"]), Tt = /* @__PURE__ */ new Set(["DATETIME", "TIMESTAMP", "TIMESTAMP_TZ"]), Nt = /* @__PURE__ */ new Set(["JSON", "UNION", "object", "array"]);
function R(e) {
  const t = e.constraints;
  return t == null ? {} : Array.isArray(t) ? Object.fromEntries(t.map((n) => [n.name, n.value])) : t;
}
function ve(e) {
  const t = R(e).enum;
  if (Array.isArray(t)) return t;
  const n = e.type === "ARRAY" ? e.parameters?.items : e, l = n?.type === "ENUM" ? n.parameters?.values : void 0;
  return Array.isArray(l) ? l : void 0;
}
function te(e) {
  const t = e.type;
  return Ze.has(t) ? "integer" : St.has(t) ? "number" : Mt.has(t) ? "text" : t === "TEXT" ? "longText" : t === "boolean" || t === "BOOLEAN" ? "boolean" : t === "ENUM" ? "enum" : t === "date" || t === "DATE" ? "date" : t === "TIME" ? "time" : Tt.has(t) ? "datetime" : t === "OBJECT" ? "object" : Nt.has(t) ? "json" : "unsupported";
}
function U(e) {
  if (e.type === "ARRAY") {
    if (ve(e) !== void 0) return "multiEnum";
    const t = e.parameters?.items, n = t !== void 0 ? te(t) : "json";
    return n === "text" ? "tags" : n === "object" ? "objectList" : "json";
  }
  return R(e).enum !== void 0 && te(e) === "text" ? "enum" : te(e);
}
function xt(e) {
  const t = e.type === "ARRAY" ? e.parameters?.items : e, n = t?.type === "OBJECT" ? t.parameters?.ref : void 0;
  return typeof n == "string" ? n : void 0;
}
function j(e) {
  return e.label ?? _(e.name);
}
function _(e) {
  return e.replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2").split(/[\s_\-]+/).filter((n) => n.length > 0).map((n, l) => {
    const a = n.length > 1 && n === n.toUpperCase() ? n : n.toLowerCase();
    return l === 0 ? a[0].toUpperCase() + a.slice(1) : a;
  }).join(" ");
}
function ye(e) {
  const t = R(e);
  return t.nullable === !1 || t.required === !0;
}
function Ot(e, t) {
  return !(t === "create" && R(e).identity !== void 0);
}
function Oe(e, t) {
  if (t === "view" || U(e) === "unsupported") return !1;
  const n = R(e);
  return n.identity === "always" ? !1 : !(t === "edit" && (n.primaryKey === !0 || n.identity !== void 0));
}
function He(e, t, n = []) {
  const l = new Map(e.fields.map((s) => [s.name, s]));
  return (t === void 0 ? e.fields : t.map((s) => {
    const d = l.get(s);
    if (d === void 0)
      throw new Error(`Model ${e.metadata.name} has no field ${s}`);
    return d;
  })).filter((s) => !n.includes(s.name));
}
function At(e) {
  const t = e.fields.find((l) => R(l).primaryKey === !0);
  if (t !== void 0) return t.name;
  const n = e.constraints?.find((l) => l.type === "primaryKey");
  return n?.fields?.length === 1 ? n.fields[0] : void 0;
}
function ge(e) {
  return Object.fromEntries(e.fields.map((t) => {
    const n = R(t).default, l = n !== null && typeof n == "object" && "value" in n ? n.value : null;
    return [t.name, l];
  }));
}
const J = (e, t = 2) => String(e).padStart(t, "0"), Ae = (e) => `${e.getFullYear()}-${J(e.getMonth() + 1)}-${J(e.getDate())}`, we = (e) => `${J(e.getHours())}:${J(e.getMinutes())}:${J(e.getSeconds())}`;
function Ee(e) {
  if (e instanceof Date) return e;
  if (typeof e == "string" && /(Z|[+-]\d\d:?\d\d)$/.test(e)) return new Date(e);
}
function W(e) {
  return e == null || e === "" || Array.isArray(e) && e.length === 0;
}
function Fe(e, t) {
  const n = U(e);
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
      const l = Ee(t);
      return l !== void 0 ? Ae(l) : String(t).slice(0, 10);
    }
    case "time":
      return t instanceof Date ? we(t) : String(t);
    case "datetime": {
      const l = Ee(t);
      return l !== void 0 ? `${Ae(l)}T${we(l)}` : String(t).replace(" ", "T").slice(0, 19);
    }
    case "json":
    case "object":
    case "objectList":
      return JSON.stringify(t, null, 2);
    default:
      return String(t);
  }
}
function ue(e, t) {
  const n = U(e);
  if (n === "multiEnum" || n === "tags")
    return { ok: !0, value: Array.isArray(t) ? t : [] };
  if (W(t)) return { ok: !0, value: null };
  switch (n) {
    case "integer":
    case "number": {
      const l = typeof t == "number" ? t : Number(String(t).trim());
      return Number.isFinite(l) ? { ok: !0, value: l } : { ok: !1, error: "number" };
    }
    case "datetime": {
      if (e.type !== "TIMESTAMP_TZ") return { ok: !0, value: t };
      const l = new Date(String(t));
      return Number.isNaN(l.getTime()) ? { ok: !1, error: "date" } : { ok: !0, value: l.toISOString() };
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
const wt = {
  "=": "equal to",
  "!=": "different from",
  "<": "less than",
  "<=": "at most",
  ">": "greater than",
  ">=": "at least"
}, je = {
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
  check: (e, t, n) => `${e} must be ${wt[t]} ${n}`
};
function pe(e) {
  return e === void 0 ? je : { ...je, ...e };
}
const Et = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, Ft = /^-?P(?!$)(\d+(\.\d+)?Y)?(\d+(\.\d+)?M)?(\d+(\.\d+)?W)?(\d+(\.\d+)?D)?(T(?=\d)(\d+(\.\d+)?H)?(\d+(\.\d+)?M)?(\d+(\.\d+)?S)?)?$/;
function jt(e) {
  const [t, n] = String(e).split("e"), l = t.split(".")[1]?.length ?? 0;
  return Math.max(0, l - Number(n ?? 0));
}
const It = (e) => e instanceof Date ? !Number.isNaN(e.getTime()) : !Number.isNaN(new Date(String(e)).getTime());
function be(e, t) {
  const n = pe(t), l = j(e), a = U(e), s = R(e), d = e.parameters ?? {}, c = [], i = (o, r) => c.push((v) => o(v) || r);
  if ((a === "integer" || a === "number") && i((o) => typeof o == "number" && Number.isFinite(o), n.number(l)), a === "integer") {
    i((r) => Number.isInteger(r), n.integer(l));
    const o = Ze.get(e.type);
    o !== void 0 && (i((r) => r >= o[0], n.min(l, o[0])), i((r) => r <= o[1], n.max(l, o[1])));
  }
  if (e.type === "DECIMAL" && typeof d.scale == "number" && i((o) => jt(o) <= d.scale, n.decimals(l, d.scale)), typeof s.min == "number" && i((o) => o >= s.min, n.min(l, s.min)), typeof s.max == "number" && i((o) => o <= s.max, n.max(l, s.max)), e.type === "STRING" && typeof d.length == "number" && i((o) => String(o).length <= d.length, n.maxLength(l, d.length)), e.type === "UUID" && i((o) => Et.test(String(o)), n.uuid(l)), e.type === "DURATION" && i((o) => Ft.test(String(o)), n.duration(l)), typeof s.regex == "string" && e.type !== "ARRAY") {
    const o = new RegExp(s.regex);
    i((r) => o.test(String(r)), n.pattern(l, s.regex));
  }
  const f = ve(e);
  f !== void 0 && i(
    (o) => Array.isArray(o) ? o.every((r) => f.includes(r)) : f.includes(o),
    n.oneOf(l, f)
  ), (a === "date" || a === "datetime") && i(It, n.date(l));
  const h = ye(e);
  return [(o) => {
    if (W(o)) return h ? n.required(l) : !0;
    for (const r of c) {
      const v = r(o);
      if (v !== !0) return v;
    }
    return !0;
  }];
}
function Dt(e, t) {
  const n = pe(t), l = j(e), a = be(e, t);
  return [(s) => {
    const d = ue(e, s);
    if (!d.ok) return n[d.error](l);
    for (const c of a) {
      const i = c(d.value);
      if (i !== !0) return i;
    }
    return !0;
  }];
}
const Ie = (e) => e instanceof Date ? e.getTime() : e;
function Ct(e, t, n) {
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
function Lt(e, t, n) {
  const l = pe(n), a = new Map(e.fields.map((c) => [c.name, c])), s = (c) => {
    const i = a.get(c);
    return i !== void 0 ? j(i) : c;
  }, d = [];
  for (const c of e.constraints ?? []) {
    if (c.type !== "check" || c.rule === void 0) continue;
    const i = c.rule, f = t[i.field], h = i.otherField !== void 0 ? t[i.otherField] : i.value;
    if (!(W(f) || W(h)) && !Ct(i.op, Ie(f), Ie(h))) {
      const o = i.otherField !== void 0 ? s(i.otherField) : String(i.value);
      d.push(l.check(s(i.field), i.op, o));
    }
  }
  return d;
}
const De = 60;
function Ce(e) {
  if (e instanceof Date) return e;
  const t = String(e), n = /^(\d{4})-(\d{2})-(\d{2})$/.exec(t);
  return n !== null ? new Date(Number(n[1]), Number(n[2]) - 1, Number(n[3])) : new Date(t);
}
function de(e, t, n) {
  if (t == null) return "";
  switch (U(e)) {
    case "integer":
    case "number": {
      if (typeof t != "number") return String(t);
      const l = e.type === "DECIMAL" ? e.parameters?.scale : void 0;
      return new Intl.NumberFormat(n, typeof l == "number" ? { minimumFractionDigits: l, maximumFractionDigits: l } : { maximumFractionDigits: 20 }).format(t);
    }
    case "boolean":
      return t ? "Yes" : "No";
    case "date": {
      const l = Ce(t);
      return Number.isNaN(l.getTime()) ? String(t) : l.toLocaleDateString(n);
    }
    case "datetime": {
      const l = Ce(t);
      return Number.isNaN(l.getTime()) ? String(t) : l.toLocaleString(n);
    }
    case "multiEnum":
    case "tags":
      return Array.isArray(t) ? t.join(", ") : String(t);
    case "json":
    case "object":
    case "objectList": {
      const l = JSON.stringify(t);
      return l.length > De ? `${l.slice(0, De - 1)}…` : l;
    }
    case "unsupported":
      return t instanceof Uint8Array ? `${t.length} bytes` : String(t);
    default:
      return String(t);
  }
}
function Le(e) {
  if (typeof e == "function") return e;
  const t = new Map(Array.isArray(e) ? e.map((n) => [n.metadata.name, n]) : Object.entries(e));
  return (n) => t.get(n);
}
const Ut = { "=": "=", "!=": "≠", "<": "<", "<=": "≤", ">": ">", ">=": "≥" }, ce = (e) => {
  const t = _(e);
  return t.charAt(0).toLowerCase() + t.slice(1);
};
function Pt(e) {
  return e.fields.some((t) => t.sortable !== void 0 || t.filterable !== void 0) || e.sortings !== void 0 || e.filters !== void 0;
}
const We = (e) => Vt(e), he = (e) => kt(e);
function X(e, t) {
  return e.fields.find((n) => n.name === t);
}
function Rt(e, t) {
  if (t.field === void 0) return _(t.key);
  const n = j(X(e, t.field));
  return t.definitionName === "" ? n : `${n}: ${ce(t.definitionName)}`;
}
function Xe(e, t) {
  if (t.scope === "model") return _(t.name);
  const n = j(X(e, t.field)), l = t.definitionName !== "" ? `${n}: ${ce(t.definitionName)}` : n;
  if (t.predicate !== void 0) return t.definitionName !== "" ? l : `${n}: ${ce(t.predicate)}`;
  const a = t.op === "=" && t.input === "value" ? "" : ` ${Ut[t.op]}`;
  if (t.input === "value") return `${l}${a}`;
  if (t.definitionName !== "") return l;
  const s = t.otherField !== void 0 ? j(X(e, t.otherField)) : String(t.value);
  return `${n}${a} ${s}`;
}
function Bt(e, t) {
  const n = t.valueType === "field" || t.valueType === void 0 ? X(e, t.field) : t.valueType;
  return {
    name: t.name,
    label: Xe(e, t),
    type: n.type,
    ...n.parameters !== void 0 ? { parameters: n.parameters } : {}
  };
}
function $e(e, t) {
  return e.input === "switch" ? t === !0 : !W(t);
}
function G(e, t, n, l) {
  const a = e?.[t];
  if (a === void 0) throw new Error(`No ${n} ${t}: give it to the table in ${n === "function" ? "functions" : "predicates"}`);
  return a(...l);
}
const Q = (e) => e instanceof Date ? e.getTime() : e;
function qt(e, t, n) {
  if (e == null || n === null || n === void 0) return !1;
  const l = Q(e), a = Q(n);
  switch (t) {
    case "=":
      return l === a;
    case "!=":
      return l !== a;
    case "<":
      return l < a;
    case "<=":
      return l <= a;
    case ">":
      return l > a;
    case ">=":
      return l >= a;
  }
}
function Kt(e, t, n, l) {
  const a = e.input === "value" ? [n] : [];
  if (e.predicate !== void 0) {
    const i = e.scope === "field" ? [t[e.field], t, ...a] : [t, ...a];
    return G(l.predicates, e.predicate, "predicate", i) === !0;
  }
  const s = t[e.field], d = e.function !== void 0 ? G(l.functions, e.function, "function", [s, t]) : s, c = e.input === "value" ? n : e.otherField !== void 0 ? t[e.otherField] : e.value;
  return qt(d, e.op, c);
}
function zt(e, t, n, l = {}) {
  const a = he(e).filter((s) => $e(s, n[s.name]));
  return a.length === 0 ? t : t.filter((s) => a.every((d) => Kt(d, s, n[d.name], l)));
}
function Ue(e, t, n, l = "last") {
  const a = e == null, s = t == null;
  if (a || s) return a === s ? 0 : a === (l === "first") ? -1 : 1;
  const d = Q(e), c = Q(t);
  return (typeof d == "string" && typeof c == "string" ? d.localeCompare(c) : d < c ? -1 : d > c ? 1 : 0) * n;
}
function Ve(e, t) {
  const n = We(e);
  return n.find((l) => l.key === t) ?? n.find((l) => l.field === t);
}
function Yt(e, t, n, l = {}) {
  const a = n.map((s) => {
    const d = Ve(e, s.key);
    if (d === void 0) throw new Error(`Model ${e.metadata.name} can't be sorted by ${s.key}`);
    const c = s.order === "desc" ? -1 : 1;
    if (d.sortKeys !== void 0) {
      const o = d.sortKeys.map((r) => ({
        value: (v) => r.field === void 0 ? G(l.functions, r.function, "function", [v]) : r.function !== void 0 ? G(l.functions, r.function, "function", [v[r.field], v]) : v[r.field],
        sign: r.direction === "desc" ? -1 : 1,
        nulls: r.nulls
      }));
      return (r, v) => {
        for (const g of o) {
          const b = Ue(g.value(r), g.value(v), g.sign * c, g.nulls);
          if (b !== 0) return b;
        }
        return 0;
      };
    }
    const { field: i, definition: f } = d, h = (o) => f.function !== void 0 ? G(l.functions, f.function, "function", [o[i], o]) : o[i];
    return (o, r) => Ue(h(o), h(r), c, f.nulls);
  });
  return a.length === 0 ? t : [...t].sort((s, d) => {
    for (const c of a) {
      const i = c(s, d);
      if (i !== 0) return i;
    }
    return 0;
  });
}
function Jt(e, t) {
  return t.map((n) => {
    const l = Ve(e, n.key);
    if (l === void 0) throw new Error(`Model ${e.metadata.name} can't be sorted by ${n.key}`);
    return n.order === "desc" ? `-${l.key}` : l.key;
  });
}
function Gt(e, t) {
  const n = {};
  t.itemsPerPage > 0 && (n.limit = t.itemsPerPage, n.offset = (t.page - 1) * t.itemsPerPage);
  const l = Jt(e, t.sort);
  l.length > 0 && (n.sort = l.join(","));
  for (const a of he(e))
    $e(a, t.filters[a.name]) && (n[a.name] = t.filters[a.name]);
  return n;
}
const Pe = /* @__PURE__ */ Symbol("vuetify-bridge models"), Zt = () => {
};
function Qe(e) {
  const t = ot(Pe, void 0), n = m(() => {
    const l = e();
    return l !== void 0 ? Le(l) : t === void 0 ? Zt : K(t) ? t.value : Le(t);
  });
  return it(Pe, n), n;
}
const Re = (e, t) => e === t || JSON.stringify(e) === JSON.stringify(t);
function ee(e, t, n) {
  const l = Z(Fe(e(), t.value));
  return z(l, (a) => {
    const s = ue(e(), a);
    s.ok && !Re(s.value, t.value) && (t.value = s.value);
  }), z([t, e], ([a]) => {
    const s = ue(e(), l.value);
    (!s.ok || !Re(s.value, a)) && (l.value = Fe(e(), a));
  }, { deep: !0 }), {
    input: l,
    kind: m(() => U(e())),
    label: m(() => j(e())),
    hint: m(() => e().description),
    required: m(() => ye(e())),
    rules: m(() => Dt(e(), n()))
  };
}
const Ht = /* @__PURE__ */ D({
  __name: "ModelBooleanField",
  props: /* @__PURE__ */ O({
    field: {},
    readonly: { type: Boolean },
    messages: {}
  }, {
    modelValue: {},
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e) {
    const t = e, n = N(e, "modelValue"), { input: l, label: a, hint: s, rules: d } = ee(() => t.field, n, () => t.messages);
    return (c, i) => (y(), $(u(ze), {
      modelValue: u(l),
      "onUpdate:modelValue": i[0] || (i[0] = (f) => K(l) ? l.value = f : null),
      label: u(a),
      hint: u(s),
      "persistent-hint": u(s) !== void 0,
      rules: u(d),
      readonly: e.readonly
    }, null, 8, ["modelValue", "label", "hint", "persistent-hint", "rules", "readonly"]));
  }
}), ke = /* @__PURE__ */ D({
  __name: "ModelFields",
  props: /* @__PURE__ */ O({
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
    const t = e, n = N(e, "modelValue"), l = m(() => He(t.model, t.fields, t.exclude).filter((f) => Ot(f, t.mode))), a = m(() => Lt(t.model, n.value, t.messages)), s = [() => a.value.length === 0 || a.value[0]], d = /* @__PURE__ */ new Set(["longText", "json", "tags", "multiEnum", "object", "objectList"]), c = (f) => d.has(U(f)) ? 12 : 6;
    function i(f, h) {
      n.value = { ...n.value, [f]: h };
    }
    return (f, h) => (y(), I(q, null, [
      k(u(mt), null, {
        default: p(() => [
          (y(!0), I(q, null, P(l.value, (o) => (y(), $(u(ft), {
            key: o.name,
            cols: "12",
            md: c(o)
          }, {
            default: p(() => [
              H(f.$slots, `field.${o.name}`, {
                field: o,
                value: n.value[o.name],
                update: (r) => i(o.name, r),
                readonly: !u(Oe)(o, e.mode)
              }, () => [
                k(et, {
                  "model-value": n.value[o.name],
                  field: o,
                  readonly: !u(Oe)(o, e.mode),
                  mode: e.mode,
                  messages: e.messages,
                  models: e.models,
                  "onUpdate:modelValue": (r) => i(o.name, r)
                }, null, 8, ["model-value", "field", "readonly", "mode", "messages", "models", "onUpdate:modelValue"])
              ])
            ]),
            _: 2
          }, 1032, ["md"]))), 128))
        ]),
        _: 3
      }),
      (y(!0), I(q, null, P(a.value, (o) => (y(), $(u(vt), {
        key: o,
        type: "error",
        variant: "tonal",
        density: "compact",
        class: "mb-2"
      }, {
        default: p(() => [
          x(E(o), 1)
        ]),
        _: 2
      }, 1024))), 128)),
      k(u(fe), {
        "model-value": n.value,
        rules: s,
        class: "d-none",
        "hide-details": ""
      }, null, 8, ["model-value"])
    ], 64));
  }
}), Wt = /* @__PURE__ */ D({
  __name: "ModelObjectField",
  props: /* @__PURE__ */ O({
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
    const t = e, n = N(e, "modelValue"), l = m(() => j(t.field)), a = m(() => ye(t.field)), s = m(() => be(t.field, t.messages)), d = Z(!1), c = m(() => t.readonly ? "view" : d.value ? "create" : t.mode ?? "edit");
    function i() {
      d.value = !0, n.value = ge(t.model);
    }
    function f() {
      d.value = !1, n.value = null;
    }
    return (h, o) => (y(), $(u(fe), {
      "model-value": n.value,
      rules: s.value,
      class: "model-object-field"
    }, {
      default: p(() => [
        k(u(se), {
          variant: "outlined",
          class: "w-100"
        }, {
          default: p(() => [
            k(u(re), null, {
              append: p(() => [
                n.value == null && !e.readonly ? (y(), $(u(C), {
                  key: 0,
                  variant: "tonal",
                  size: "small",
                  "prepend-icon": "$plus",
                  onClick: i
                }, {
                  default: p(() => [...o[1] || (o[1] = [
                    x("Add", -1)
                  ])]),
                  _: 1
                })) : n.value != null && !e.readonly && !a.value ? (y(), $(u(C), {
                  key: 1,
                  variant: "text",
                  size: "small",
                  "prepend-icon": "$delete",
                  onClick: f
                }, {
                  default: p(() => [...o[2] || (o[2] = [
                    x("Remove", -1)
                  ])]),
                  _: 1
                })) : F("", !0)
              ]),
              default: p(() => [
                k(u(oe), { class: "text-body-1" }, {
                  default: p(() => [
                    x(E(l.value), 1)
                  ]),
                  _: 1
                }),
                e.field.description ? (y(), $(u(Ye), { key: 0 }, {
                  default: p(() => [
                    x(E(e.field.description), 1)
                  ]),
                  _: 1
                })) : F("", !0)
              ]),
              _: 1
            }),
            n.value != null ? (y(), $(u(ie), { key: 0 }, {
              default: p(() => [
                k(ke, {
                  modelValue: n.value,
                  "onUpdate:modelValue": o[0] || (o[0] = (r) => n.value = r),
                  model: e.model,
                  mode: c.value,
                  messages: e.messages
                }, null, 8, ["modelValue", "model", "mode", "messages"])
              ]),
              _: 1
            })) : F("", !0)
          ]),
          _: 1
        })
      ]),
      _: 1
    }, 8, ["model-value", "rules"]));
  }
}), Xt = {
  key: 0,
  class: "text-medium-emphasis"
}, Qt = /* @__PURE__ */ D({
  __name: "ModelObjectListField",
  props: /* @__PURE__ */ O({
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
    const t = e, n = N(e, "modelValue"), l = m(() => n.value ?? []), a = m(() => j(t.field)), s = m(() => j({ name: t.model.metadata.name })), d = m(() => be(t.field, t.messages));
    let c = 0;
    const i = Z([]), f = Z(/* @__PURE__ */ new Set());
    z(() => l.value.length, (b) => {
      i.value.length !== b && (i.value = Array.from({ length: b }, () => c++));
    }, { immediate: !0 });
    const h = (b) => t.readonly ? "view" : f.value.has(i.value[b]) ? "create" : t.mode ?? "edit";
    function o(b, L) {
      n.value = l.value.map((A, M) => M === b ? L : A);
    }
    function r() {
      const b = c++;
      i.value = [...i.value, b], f.value = new Set(f.value).add(b), n.value = [...l.value, ge(t.model)];
    }
    function v(b) {
      i.value = i.value.filter((L, A) => A !== b), n.value = l.value.filter((L, A) => A !== b);
    }
    function g(b, L) {
      const A = (M) => {
        const w = [...M];
        return [w[b], w[b + L]] = [w[b + L], w[b]], w;
      };
      i.value = A(i.value), n.value = A(l.value);
    }
    return (b, L) => (y(), $(u(fe), {
      "model-value": l.value,
      rules: d.value,
      class: "model-object-list-field"
    }, {
      default: p(() => [
        k(u(se), {
          variant: "outlined",
          class: "w-100"
        }, {
          default: p(() => [
            k(u(re), null, {
              append: p(() => [
                e.readonly ? F("", !0) : (y(), $(u(C), {
                  key: 0,
                  variant: "tonal",
                  size: "small",
                  "prepend-icon": "$plus",
                  onClick: r
                }, {
                  default: p(() => [
                    x(" Add " + E(s.value.toLowerCase()), 1)
                  ]),
                  _: 1
                }))
              ]),
              default: p(() => [
                k(u(oe), { class: "text-body-1" }, {
                  default: p(() => [
                    x(E(a.value), 1)
                  ]),
                  _: 1
                }),
                e.field.description ? (y(), $(u(Ye), { key: 0 }, {
                  default: p(() => [
                    x(E(e.field.description), 1)
                  ]),
                  _: 1
                })) : F("", !0)
              ]),
              _: 1
            }),
            k(u(ie), null, {
              default: p(() => [
                l.value.length === 0 ? (y(), I("p", Xt, "No " + E(s.value.toLowerCase()) + " items.", 1)) : F("", !0),
                (y(!0), I(q, null, P(l.value, (A, M) => (y(), $(u(se), {
                  key: i.value[M],
                  variant: "tonal",
                  class: "mb-3",
                  "aria-label": `${s.value} ${M + 1}`
                }, {
                  default: p(() => [
                    k(u(re), null, me({
                      default: p(() => [
                        k(u(oe), { class: "text-body-2" }, {
                          default: p(() => [
                            x(E(s.value) + " " + E(M + 1), 1)
                          ]),
                          _: 2
                        }, 1024)
                      ]),
                      _: 2
                    }, [
                      e.readonly ? void 0 : {
                        name: "append",
                        fn: p(() => [
                          k(u(C), {
                            icon: "$expand",
                            variant: "text",
                            size: "small",
                            disabled: M === l.value.length - 1,
                            "aria-label": `Move ${s.value} ${M + 1} down`,
                            onClick: (w) => g(M, 1)
                          }, null, 8, ["disabled", "aria-label", "onClick"]),
                          k(u(C), {
                            icon: "$collapse",
                            variant: "text",
                            size: "small",
                            disabled: M === 0,
                            "aria-label": `Move ${s.value} ${M + 1} up`,
                            onClick: (w) => g(M, -1)
                          }, null, 8, ["disabled", "aria-label", "onClick"]),
                          k(u(C), {
                            icon: "$delete",
                            variant: "text",
                            size: "small",
                            "aria-label": `Remove ${s.value} ${M + 1}`,
                            onClick: (w) => v(M)
                          }, null, 8, ["aria-label", "onClick"])
                        ]),
                        key: "0"
                      }
                    ]), 1024),
                    k(u(ie), null, {
                      default: p(() => [
                        k(ke, {
                          "model-value": A,
                          model: e.model,
                          mode: h(M),
                          messages: e.messages,
                          "onUpdate:modelValue": (w) => o(M, w)
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
}), ne = /* @__PURE__ */ D({
  __name: "ModelSelectField",
  props: /* @__PURE__ */ O({
    field: {},
    readonly: { type: Boolean },
    messages: {}
  }, {
    modelValue: {},
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e) {
    const t = e, n = N(e, "modelValue"), { input: l, kind: a, label: s, hint: d, required: c, rules: i } = ee(() => t.field, n, () => t.messages), f = m(() => ve(t.field) ?? []);
    return (h, o) => u(a) === "tags" ? (y(), $(u(yt), {
      key: 0,
      modelValue: u(l),
      "onUpdate:modelValue": o[0] || (o[0] = (r) => K(l) ? l.value = r : null),
      label: u(s),
      hint: u(d),
      rules: u(i),
      readonly: e.readonly,
      multiple: "",
      chips: "",
      "closable-chips": "",
      "hide-no-data": ""
    }, null, 8, ["modelValue", "label", "hint", "rules", "readonly"])) : (y(), $(u(Je), {
      key: 1,
      modelValue: u(l),
      "onUpdate:modelValue": o[1] || (o[1] = (r) => K(l) ? l.value = r : null),
      items: f.value,
      multiple: u(a) === "multiEnum",
      chips: u(a) === "multiEnum",
      clearable: !u(c) && !e.readonly,
      label: u(s),
      hint: u(d),
      rules: u(i),
      readonly: e.readonly
    }, null, 8, ["modelValue", "items", "multiple", "chips", "clearable", "label", "hint", "rules", "readonly"]));
  }
}), B = /* @__PURE__ */ D({
  __name: "ModelTextField",
  props: /* @__PURE__ */ O({
    field: {},
    readonly: { type: Boolean },
    messages: {}
  }, {
    modelValue: {},
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e) {
    const t = e, n = N(e, "modelValue"), { input: l, kind: a, label: s, hint: d, rules: c } = ee(() => t.field, n, () => t.messages), i = {
      integer: "number",
      number: "number",
      date: "date",
      time: "time",
      datetime: "datetime-local"
    }, f = m(() => i[a.value] ?? "text"), h = m(() => {
      switch (a.value) {
        case "integer":
          return 1;
        case "number": {
          const r = t.field.type === "DECIMAL" ? t.field.parameters?.scale : void 0;
          return typeof r == "number" ? 10 ** -r : "any";
        }
        case "time":
        case "datetime":
          return 1;
        default:
          return;
      }
    }), o = m(() => t.field.type === "STRING" && typeof t.field.parameters?.length == "number" ? t.field.parameters.length : void 0);
    return (r, v) => (y(), $(u(Ge), {
      modelValue: u(l),
      "onUpdate:modelValue": v[0] || (v[0] = (g) => K(l) ? l.value = g : null),
      type: f.value,
      step: h.value,
      counter: o.value,
      label: u(s),
      hint: u(d),
      rules: u(c),
      readonly: e.readonly
    }, null, 8, ["modelValue", "type", "step", "counter", "label", "hint", "rules", "readonly"]));
  }
}), _t = /* @__PURE__ */ D({
  __name: "ModelTextareaField",
  props: /* @__PURE__ */ O({
    field: {},
    readonly: { type: Boolean },
    messages: {}
  }, {
    modelValue: {},
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e) {
    const t = e, n = N(e, "modelValue"), { input: l, kind: a, label: s, hint: d, rules: c } = ee(() => t.field, n, () => t.messages);
    return (i, f) => (y(), $(u(gt), {
      modelValue: u(l),
      "onUpdate:modelValue": f[0] || (f[0] = (h) => K(l) ? l.value = h : null),
      class: ut({ "model-json-field": u(a) !== "longText" }),
      label: u(s),
      hint: u(d),
      rules: u(c),
      readonly: e.readonly,
      "auto-grow": "",
      rows: "3"
    }, null, 8, ["modelValue", "class", "label", "hint", "rules", "readonly"]));
  }
}), _e = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [l, a] of t)
    n[l] = a;
  return n;
}, le = /* @__PURE__ */ _e(_t, [["__scopeId", "data-v-9ba3dee9"]]), et = /* @__PURE__ */ D({
  __name: "ModelField",
  props: /* @__PURE__ */ O({
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
    const t = e, n = N(e, "modelValue"), l = {
      integer: B,
      number: B,
      text: B,
      date: B,
      time: B,
      datetime: B,
      longText: le,
      json: le,
      boolean: Ht,
      enum: ne,
      multiEnum: ne,
      tags: ne,
      object: Wt,
      objectList: Qt
    }, a = Qe(() => t.models), s = m(() => U(t.field)), d = m(() => {
      const i = xt(t.field);
      return i !== void 0 ? a.value(i) : void 0;
    }), c = m(() => {
      if (s.value !== "unsupported")
        return (s.value === "object" || s.value === "objectList") && d.value === void 0 ? le : l[s.value];
    });
    return (i, f) => c.value === void 0 ? (y(), $(u(Ge), {
      key: 0,
      "model-value": u(de)(e.field, n.value),
      label: u(j)(e.field),
      hint: e.field.description,
      readonly: ""
    }, null, 8, ["model-value", "label", "hint"])) : d.value !== void 0 ? (y(), $(ae(c.value), {
      key: 1,
      modelValue: n.value,
      "onUpdate:modelValue": f[0] || (f[0] = (h) => n.value = h),
      field: e.field,
      model: d.value,
      mode: e.mode,
      readonly: e.readonly,
      messages: e.messages
    }, null, 8, ["modelValue", "field", "model", "mode", "readonly", "messages"])) : (y(), $(ae(c.value), {
      key: 2,
      modelValue: n.value,
      "onUpdate:modelValue": f[1] || (f[1] = (h) => n.value = h),
      field: e.field,
      readonly: e.readonly,
      messages: e.messages
    }, null, 8, ["modelValue", "field", "readonly", "messages"]));
  }
}), en = {
  key: 0,
  class: "d-flex ga-2"
}, dn = /* @__PURE__ */ D({
  __name: "ModelForm",
  props: /* @__PURE__ */ O({
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
  emits: /* @__PURE__ */ O(["submit", "cancel"], ["update:modelValue"]),
  setup(e, { expose: t, emit: n }) {
    const l = e, a = N(e, "modelValue"), s = n;
    Qe(() => l.models);
    const d = Be(), c = m(() => Object.keys(d).filter((r) => r.startsWith("field."))), i = Z();
    async function f() {
      return (await i.value?.validate())?.valid ?? !1;
    }
    async function h() {
      await f() && s("submit", a.value);
    }
    function o() {
      s("cancel");
    }
    return z(() => l.mode, (r) => {
      r === "create" && (a.value = { ...ge(l.model), ...a.value });
    }, { immediate: !0 }), t({
      validate: f,
      resetValidation: () => i.value?.resetValidation()
    }), (r, v) => (y(), $(u(pt), {
      ref_key: "form",
      ref: i,
      onSubmit: dt(h, ["prevent"])
    }, {
      default: p(() => [
        k(ke, {
          modelValue: a.value,
          "onUpdate:modelValue": v[0] || (v[0] = (g) => a.value = g),
          model: e.model,
          mode: e.mode,
          fields: e.fields,
          exclude: e.exclude,
          messages: e.messages
        }, me({ _: 2 }, [
          P(c.value, (g) => ({
            name: g,
            fn: p((b) => [
              H(r.$slots, g, qe(Ke(b)))
            ])
          }))
        ]), 1032, ["modelValue", "model", "mode", "fields", "exclude", "messages"]),
        e.mode !== "view" ? H(r.$slots, "actions", {
          key: 0,
          submit: h,
          cancel: o
        }, () => [
          e.hideActions ? F("", !0) : (y(), I("div", en, [
            k(u(bt)),
            k(u(C), {
              variant: "text",
              onClick: o
            }, {
              default: p(() => [
                x(E(e.cancelText), 1)
              ]),
              _: 1
            }),
            k(u(C), {
              type: "submit",
              color: "primary"
            }, {
              default: p(() => [
                x(E(e.submitText), 1)
              ]),
              _: 1
            })
          ]))
        ]) : F("", !0)
      ]),
      _: 3
    }, 512));
  }
}), tn = { class: "model-table-filters d-flex flex-wrap align-center ga-3" }, nn = {
  key: 0,
  class: "d-flex align-center"
}, ln = /* @__PURE__ */ D({
  __name: "ModelTableFilters",
  props: /* @__PURE__ */ O({
    model: {},
    filterOptions: {},
    sortOptions: {}
  }, {
    filters: { required: !0 },
    filtersModifiers: {},
    sort: { required: !0 },
    sortModifiers: {}
  }),
  emits: ["update:filters", "update:sort"],
  setup(e) {
    const t = e, n = N(e, "filters"), l = N(e, "sort"), a = m(() => t.filterOptions.filter((r) => r.input === "value")), s = m(() => t.filterOptions.filter((r) => r.input === "switch")), d = m(() => t.filterOptions.some((r) => $e(r, n.value[r.name])));
    function c(r, v) {
      const g = { ...n.value };
      v == null || v === "" || v === !1 ? delete g[r] : g[r] = v, n.value = g;
    }
    const i = m(() => t.sortOptions.find((r) => r.key === l.value[0]?.key)), f = m(() => t.sortOptions.map((r) => ({ title: Rt(t.model, r), value: r.key })));
    function h(r) {
      const v = t.sortOptions.find((g) => g.key === r);
      l.value = v !== void 0 ? [{ key: v.key, order: v.directions[0] }] : [];
    }
    function o() {
      const [r, ...v] = l.value;
      l.value = [{ key: r.key, order: r.order === "asc" ? "desc" : "asc" }, ...v];
    }
    return (r, v) => (y(), I("div", tn, [
      (y(!0), I(q, null, P(a.value, (g) => (y(), $(et, {
        key: g.name,
        field: u(Bt)(e.model, g),
        "model-value": n.value[g.name] ?? null,
        class: "model-table-filter",
        density: "compact",
        variant: "outlined",
        "hide-details": "",
        clearable: "",
        "onUpdate:modelValue": (b) => c(g.name, b)
      }, null, 8, ["field", "model-value", "onUpdate:modelValue"]))), 128)),
      (y(!0), I(q, null, P(s.value, (g) => (y(), $(u(ze), {
        key: g.name,
        label: u(Xe)(e.model, g),
        "model-value": n.value[g.name] === !0,
        class: "flex-grow-0",
        density: "compact",
        "hide-details": "",
        "onUpdate:modelValue": (b) => c(g.name, b === !0)
      }, null, 8, ["label", "model-value", "onUpdate:modelValue"]))), 128)),
      e.sortOptions.length > 0 ? (y(), I("div", nn, [
        k(u(Je), {
          "model-value": i.value?.key ?? null,
          items: f.value,
          label: "Sort by",
          class: "model-table-filter",
          density: "compact",
          variant: "outlined",
          "hide-details": "",
          clearable: "",
          "onUpdate:modelValue": h
        }, null, 8, ["model-value", "items"]),
        i.value !== void 0 && i.value.directions.length > 1 ? (y(), $(u(C), {
          key: 0,
          icon: l.value[0].order === "asc" ? "$sortAsc" : "$sortDesc",
          "aria-label": l.value[0].order === "asc" ? "Ascending" : "Descending",
          variant: "text",
          size: "small",
          onClick: o
        }, null, 8, ["icon", "aria-label"])) : F("", !0)
      ])) : F("", !0),
      d.value ? (y(), $(u(C), {
        key: 1,
        variant: "text",
        size: "small",
        onClick: v[0] || (v[0] = (g) => n.value = {})
      }, {
        default: p(() => [...v[1] || (v[1] = [
          x("Clear filters", -1)
        ])]),
        _: 1
      })) : F("", !0)
    ]));
  }
}), an = /* @__PURE__ */ _e(ln, [["__scopeId", "data-v-fe979876"]]), sn = { class: "model-table" }, cn = /* @__PURE__ */ D({
  inheritAttrs: !1,
  __name: "ModelTable",
  props: /* @__PURE__ */ O({
    model: {},
    items: {},
    fields: {},
    exclude: {},
    itemKey: {},
    locale: {},
    itemsLength: {},
    functions: {},
    predicates: {},
    filterBar: { type: Boolean, default: !0 }
  }, {
    filters: { default: () => ({}) },
    filtersModifiers: {},
    sort: { default: () => [] },
    sortModifiers: {},
    page: { default: 1 },
    pageModifiers: {},
    itemsPerPage: { default: 10 },
    itemsPerPageModifiers: {}
  }),
  emits: /* @__PURE__ */ O(["update:query"], ["update:filters", "update:sort", "update:page", "update:itemsPerPage"]),
  setup(e, { emit: t }) {
    const n = e, l = N(e, "filters"), a = N(e, "sort"), s = N(e, "page"), d = N(e, "itemsPerPage"), c = t, i = Be(), f = /* @__PURE__ */ new Set(["integer", "number"]), h = /* @__PURE__ */ new Set(["json", "object", "objectList", "tags", "multiEnum", "unsupported"]), o = m(() => He(n.model, n.fields, n.exclude)), r = m(() => Pt(n.model)), v = m(() => n.itemsLength !== void 0), g = m(() => r.value ? We(n.model) : []), b = m(() => r.value ? he(n.model) : []), L = m(() => new Set(g.value.map((S) => S.field).filter(Boolean))), A = m(() => new Set(o.value.map((S) => S.name))), M = m(() => g.value.filter((S, T) => S.field === void 0 || !A.value.has(S.field) || g.value.findIndex((V) => V.field === S.field) !== T)), w = m(() => o.value.map((S) => {
      const T = U(S);
      return {
        title: j(S),
        key: S.name,
        align: f.has(T) ? "end" : "start",
        sortable: r.value ? L.value.has(S.name) : !h.has(T)
      };
    })), Se = m({
      get: () => a.value,
      set: (S) => {
        a.value = S.map((T) => {
          const V = Ve(n.model, T.key)?.directions ?? ["asc", "desc"];
          return V.includes(T.order) ? T : { key: T.key, order: V[0] };
        });
      }
    }), Me = m(() => ({ functions: n.functions, predicates: n.predicates })), Te = m(() => zt(n.model, n.items, l.value, Me.value)), Ne = m(() => Yt(n.model, Te.value, a.value, Me.value)), tt = m(() => d.value <= 0 ? Ne.value : Ne.value.slice((s.value - 1) * d.value, s.value * d.value)), nt = m(() => !r.value || v.value ? n.items : tt.value), lt = m(() => r.value && !v.value ? Te.value.length : n.itemsLength);
    z(l, () => {
      s.value = 1;
    }, { deep: !0 }), z([r, v, a, l, s, d], () => {
      r.value && v.value && c("update:query", Gt(n.model, { sort: a.value, filters: l.value, page: s.value, itemsPerPage: d.value }));
    }, { immediate: !0, deep: !0 });
    const at = m(() => n.itemKey ?? At(n.model) ?? "id"), st = m(() => new Set(o.value.map((S) => `item.${S.name}`))), rt = m(() => Object.keys(i).filter((S) => !st.value.has(S)));
    return (S, T) => (y(), I("div", sn, [
      r.value && e.filterBar && (b.value.length > 0 || M.value.length > 0) ? (y(), $(an, {
        key: 0,
        filters: l.value,
        "onUpdate:filters": T[0] || (T[0] = (V) => l.value = V),
        sort: a.value,
        "onUpdate:sort": T[1] || (T[1] = (V) => a.value = V),
        model: e.model,
        "filter-options": b.value,
        "sort-options": M.value,
        class: "mb-2"
      }, null, 8, ["filters", "sort", "model", "filter-options", "sort-options"])) : F("", !0),
      (y(), $(ae(r.value || e.itemsLength !== void 0 ? u(ht) : u($t)), xe(S.$attrs, {
        page: s.value,
        "onUpdate:page": T[2] || (T[2] = (V) => s.value = V),
        "items-per-page": d.value,
        "onUpdate:itemsPerPage": T[3] || (T[3] = (V) => d.value = V),
        headers: w.value,
        items: nt.value,
        "item-value": at.value,
        "items-length": lt.value
      }, ct(r.value ? { "update:sortBy": (V) => {
        Se.value = V;
      } } : {}), {
        "sort-by": r.value ? Se.value : void 0
      }), me({ _: 2 }, [
        P(o.value, (V) => ({
          name: `item.${V.name}`,
          fn: p((Y) => [
            H(S.$slots, `item.${V.name}`, xe(Y, {
              field: V,
              formatted: u(de)(V, Y.value, e.locale)
            }), () => [
              x(E(u(de)(V, Y.value, e.locale)), 1)
            ])
          ])
        })),
        P(rt.value, (V) => ({
          name: V,
          fn: p((Y) => [
            H(S.$slots, V, qe(Ke(Y ?? {})))
          ])
        }))
      ]), 1040, ["page", "items-per-page", "headers", "items", "item-value", "items-length", "sort-by"]))
    ]));
  }
});
export {
  Ze as INTEGER_RANGES,
  Ht as ModelBooleanField,
  et as ModelField,
  ke as ModelFields,
  dn as ModelForm,
  Wt as ModelObjectField,
  Qt as ModelObjectListField,
  ne as ModelSelectField,
  cn as ModelTable,
  an as ModelTableFilters,
  B as ModelTextField,
  le as ModelTextareaField,
  Pe as ModelsKey,
  je as defaultMessages,
  ge as emptyRecord,
  ve as enumValues,
  R as fieldConstraints,
  U as fieldKind,
  j as fieldLabel,
  be as fieldRules,
  Bt as filterField,
  Xe as filterLabel,
  zt as filterRows,
  de as formatValue,
  ue as fromInput,
  Pt as hasListOptions,
  _ as humanize,
  Dt as inputRules,
  Oe as isEditable,
  W as isEmpty,
  $e as isFilterOn,
  ye as isRequired,
  Ot as isVisible,
  he as listFilterOptions,
  Gt as listQuery,
  We as listSortOptions,
  At as primaryKeyField,
  Lt as recordErrors,
  xt as referencedModel,
  pe as resolveMessages,
  He as selectFields,
  Rt as sortLabel,
  Ve as sortOptionOf,
  Jt as sortParameter,
  Yt as sortRows,
  Fe as toInput,
  Le as toResolver,
  ee as useFieldInput,
  Qe as useModels
};
