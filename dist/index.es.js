import { inject as Ze, computed as m, isRef as q, provide as He, ref as X, watch as Y, defineComponent as A, mergeModels as N, useModel as x, createBlock as $, openBlock as p, unref as u, resolveDynamicComponent as J, h as ee, useSlots as ge, createElementBlock as I, Fragment as B, renderSlot as z, createVNode as k, withCtx as b, renderList as P, createTextVNode as F, toDisplayString as j, createCommentVNode as D, createSlots as be, normalizeClass as pt, withModifiers as gt, normalizeProps as Z, guardReactiveProps as ie, mergeProps as te, toHandlers as bt } from "vue";
import { VCheckbox as We, VRow as ht, VCol as $t, VAlert as Vt, VInput as he, VCard as ue, VCardItem as de, VCardTitle as ce, VCardSubtitle as Xe, VBtn as L, VCardText as me, VCombobox as kt, VSelect as Qe, VTextField as _e, VTextarea as St, VForm as Mt, VSpacer as Tt, VDataTableServer as Ot, VDataTable as xt } from "vuetify/components";
import { sortOptions as wt, filterOptions as Nt } from "model-algebra-common";
const et = /* @__PURE__ */ new Map([
  ["integer", void 0],
  ["INT16", [-32768, 32767]],
  ["INT32", [-2147483648, 2147483647]],
  ["INT64", void 0]
]), Ft = /* @__PURE__ */ new Set(["number", "FLOAT32", "FLOAT64", "DECIMAL"]), At = /* @__PURE__ */ new Set(["string", "STRING", "UUID", "DURATION"]), Et = /* @__PURE__ */ new Set(["DATETIME", "TIMESTAMP", "TIMESTAMP_TZ"]), jt = /* @__PURE__ */ new Set(["JSON", "UNION", "object", "array"]);
function R(e) {
  const t = e.constraints;
  return t == null ? {} : Array.isArray(t) ? Object.fromEntries(t.map((n) => [n.name, n.value])) : t;
}
function $e(e) {
  const t = R(e).enum;
  if (Array.isArray(t)) return t;
  const n = e.type === "ARRAY" ? e.parameters?.items : e, l = n?.type === "ENUM" ? n.parameters?.values : void 0;
  return Array.isArray(l) ? l : void 0;
}
function se(e) {
  const t = e.type;
  return et.has(t) ? "integer" : Ft.has(t) ? "number" : At.has(t) ? "text" : t === "TEXT" ? "longText" : t === "boolean" || t === "BOOLEAN" ? "boolean" : t === "ENUM" ? "enum" : t === "date" || t === "DATE" ? "date" : t === "TIME" ? "time" : Et.has(t) ? "datetime" : t === "OBJECT" ? "object" : jt.has(t) ? "json" : "unsupported";
}
function U(e) {
  if (e.type === "ARRAY") {
    if ($e(e) !== void 0) return "multiEnum";
    const t = e.parameters?.items, n = t !== void 0 ? se(t) : "json";
    return n === "text" ? "tags" : n === "object" ? "objectList" : "json";
  }
  return R(e).enum !== void 0 && se(e) === "text" ? "enum" : se(e);
}
function It(e) {
  const t = e.type === "ARRAY" ? e.parameters?.items : e, n = t?.type === "OBJECT" ? t.parameters?.ref : void 0;
  return typeof n == "string" ? n : void 0;
}
function C(e) {
  return e.label ?? ae(e.name);
}
function ae(e) {
  return e.replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2").split(/[\s_\-]+/).filter((n) => n.length > 0).map((n, l) => {
    const s = n.length > 1 && n === n.toUpperCase() ? n : n.toLowerCase();
    return l === 0 ? s[0].toUpperCase() + s.slice(1) : s;
  }).join(" ");
}
function Ve(e) {
  const t = R(e);
  return t.nullable === !1 || t.required === !0;
}
function tt(e, t) {
  return !(t === "create" && R(e).identity !== void 0);
}
function Dt(e, t) {
  if (t === "view" || U(e) === "unsupported") return !1;
  const n = R(e);
  return n.identity === "always" ? !1 : !(t === "edit" && (n.primaryKey === !0 || n.identity !== void 0));
}
function nt(e, t, n = []) {
  const l = new Map(e.fields.map((a) => [a.name, a]));
  return (t === void 0 ? e.fields : t.map((a) => {
    const i = l.get(a);
    if (i === void 0)
      throw new Error(`Model ${e.metadata.name} has no field ${a}`);
    return i;
  })).filter((a) => !n.includes(a.name));
}
function Ct(e) {
  const t = e.fields.find((l) => R(l).primaryKey === !0);
  if (t !== void 0) return t.name;
  const n = e.constraints?.find((l) => l.type === "primaryKey");
  return n?.fields?.length === 1 ? n.fields[0] : void 0;
}
function ke(e) {
  return Object.fromEntries(e.fields.map((t) => {
    const n = R(t).default, l = n !== null && typeof n == "object" && "value" in n ? n.value : null;
    return [t.name, l];
  }));
}
const H = (e, t = 2) => String(e).padStart(t, "0"), je = (e) => `${e.getFullYear()}-${H(e.getMonth() + 1)}-${H(e.getDate())}`, Ie = (e) => `${H(e.getHours())}:${H(e.getMinutes())}:${H(e.getSeconds())}`;
function De(e) {
  if (e instanceof Date) return e;
  if (typeof e == "string" && /(Z|[+-]\d\d:?\d\d)$/.test(e)) return new Date(e);
}
function Q(e) {
  return e == null || e === "" || Array.isArray(e) && e.length === 0;
}
function Ce(e, t) {
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
      const l = De(t);
      return l !== void 0 ? je(l) : String(t).slice(0, 10);
    }
    case "time":
      return t instanceof Date ? Ie(t) : String(t);
    case "datetime": {
      const l = De(t);
      return l !== void 0 ? `${je(l)}T${Ie(l)}` : String(t).replace(" ", "T").slice(0, 19);
    }
    case "json":
    case "object":
    case "objectList":
      return JSON.stringify(t, null, 2);
    default:
      return String(t);
  }
}
function fe(e, t) {
  const n = U(e);
  if (n === "multiEnum" || n === "tags")
    return { ok: !0, value: Array.isArray(t) ? t : [] };
  if (Q(t)) return { ok: !0, value: null };
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
const Lt = {
  "=": "equal to",
  "!=": "different from",
  "<": "less than",
  "<=": "at most",
  ">": "greater than",
  ">=": "at least"
}, Le = {
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
  check: (e, t, n) => `${e} must be ${Lt[t]} ${n}`
};
function Se(e) {
  return e === void 0 ? Le : { ...Le, ...e };
}
const Ut = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, Pt = /^-?P(?!$)(\d+(\.\d+)?Y)?(\d+(\.\d+)?M)?(\d+(\.\d+)?W)?(\d+(\.\d+)?D)?(T(?=\d)(\d+(\.\d+)?H)?(\d+(\.\d+)?M)?(\d+(\.\d+)?S)?)?$/;
function Rt(e) {
  const [t, n] = String(e).split("e"), l = t.split(".")[1]?.length ?? 0;
  return Math.max(0, l - Number(n ?? 0));
}
const Bt = (e) => e instanceof Date ? !Number.isNaN(e.getTime()) : !Number.isNaN(new Date(String(e)).getTime());
function Me(e, t) {
  const n = Se(t), l = C(e), s = U(e), a = R(e), i = e.parameters ?? {}, c = [], o = (d, r) => c.push((v) => d(v) || r);
  if ((s === "integer" || s === "number") && o((d) => typeof d == "number" && Number.isFinite(d), n.number(l)), s === "integer") {
    o((r) => Number.isInteger(r), n.integer(l));
    const d = et.get(e.type);
    d !== void 0 && (o((r) => r >= d[0], n.min(l, d[0])), o((r) => r <= d[1], n.max(l, d[1])));
  }
  if (e.type === "DECIMAL" && typeof i.scale == "number" && o((d) => Rt(d) <= i.scale, n.decimals(l, i.scale)), typeof a.min == "number" && o((d) => d >= a.min, n.min(l, a.min)), typeof a.max == "number" && o((d) => d <= a.max, n.max(l, a.max)), e.type === "STRING" && typeof i.length == "number" && o((d) => String(d).length <= i.length, n.maxLength(l, i.length)), e.type === "UUID" && o((d) => Ut.test(String(d)), n.uuid(l)), e.type === "DURATION" && o((d) => Pt.test(String(d)), n.duration(l)), typeof a.regex == "string" && e.type !== "ARRAY") {
    const d = new RegExp(a.regex);
    o((r) => d.test(String(r)), n.pattern(l, a.regex));
  }
  const f = $e(e);
  f !== void 0 && o(
    (d) => Array.isArray(d) ? d.every((r) => f.includes(r)) : f.includes(d),
    n.oneOf(l, f)
  ), (s === "date" || s === "datetime") && o(Bt, n.date(l));
  const g = Ve(e);
  return [(d) => {
    if (Q(d)) return g ? n.required(l) : !0;
    for (const r of c) {
      const v = r(d);
      if (v !== !0) return v;
    }
    return !0;
  }];
}
function qt(e, t) {
  const n = Se(t), l = C(e), s = Me(e, t);
  return [(a) => {
    const i = fe(e, a);
    if (!i.ok) return n[i.error](l);
    for (const c of s) {
      const o = c(i.value);
      if (o !== !0) return o;
    }
    return !0;
  }];
}
const Ue = (e) => e instanceof Date ? e.getTime() : e;
function Kt(e, t, n) {
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
function zt(e, t, n) {
  const l = Se(n), s = new Map(e.fields.map((c) => [c.name, c])), a = (c) => {
    const o = s.get(c);
    return o !== void 0 ? C(o) : c;
  }, i = [];
  for (const c of e.constraints ?? []) {
    if (c.type !== "check" || c.rule === void 0) continue;
    const o = c.rule, f = t[o.field], g = o.otherField !== void 0 ? t[o.otherField] : o.value;
    if (!(Q(f) || Q(g)) && !Kt(o.op, Ue(f), Ue(g))) {
      const d = o.otherField !== void 0 ? a(o.otherField) : String(o.value);
      i.push(l.check(a(o.field), o.op, d));
    }
  }
  return i;
}
const Pe = 60;
function Re(e) {
  if (e instanceof Date) return e;
  const t = String(e), n = /^(\d{4})-(\d{2})-(\d{2})$/.exec(t);
  return n !== null ? new Date(Number(n[1]), Number(n[2]) - 1, Number(n[3])) : new Date(t);
}
function ve(e, t, n) {
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
      const l = Re(t);
      return Number.isNaN(l.getTime()) ? String(t) : l.toLocaleDateString(n);
    }
    case "datetime": {
      const l = Re(t);
      return Number.isNaN(l.getTime()) ? String(t) : l.toLocaleString(n);
    }
    case "multiEnum":
    case "tags":
      return Array.isArray(t) ? t.join(", ") : String(t);
    case "json":
    case "object":
    case "objectList": {
      const l = JSON.stringify(t);
      return l.length > Pe ? `${l.slice(0, Pe - 1)}…` : l;
    }
    case "unsupported":
      return t instanceof Uint8Array ? `${t.length} bytes` : String(t);
    default:
      return String(t);
  }
}
function Be(e) {
  if (typeof e == "function") return e;
  const t = new Map(Array.isArray(e) ? e.map((n) => [n.metadata.name, n]) : Object.entries(e));
  return (n) => t.get(n);
}
const Yt = { "=": "=", "!=": "≠", "<": "<", "<=": "≤", ">": ">", ">=": "≥" }, ye = (e) => {
  const t = ae(e);
  return t.charAt(0).toLowerCase() + t.slice(1);
};
function Jt(e) {
  return e.fields.some((t) => t.sortable !== void 0 || t.filterable !== void 0) || e.sortings !== void 0 || e.filters !== void 0;
}
const lt = (e) => wt(e), Te = (e) => Nt(e);
function ne(e, t) {
  return e.fields.find((n) => n.name === t);
}
function Gt(e, t) {
  if (t.field === void 0) return ae(t.key);
  const n = C(ne(e, t.field));
  return t.definitionName === "" ? n : `${n}: ${ye(t.definitionName)}`;
}
function at(e, t) {
  if (t.scope === "model") return ae(t.name);
  const n = C(ne(e, t.field)), l = t.definitionName !== "" ? `${n}: ${ye(t.definitionName)}` : n;
  if (t.predicate !== void 0) return t.definitionName !== "" ? l : `${n}: ${ye(t.predicate)}`;
  const s = t.op === "=" && t.input === "value" ? "" : ` ${Yt[t.op]}`;
  if (t.input === "value") return `${l}${s}`;
  if (t.definitionName !== "") return l;
  const a = t.otherField !== void 0 ? C(ne(e, t.otherField)) : String(t.value);
  return `${n}${s} ${a}`;
}
function Zt(e, t) {
  const n = t.valueType === "field" || t.valueType === void 0 ? ne(e, t.field) : t.valueType;
  return {
    name: t.name,
    label: at(e, t),
    type: n.type,
    ...n.parameters !== void 0 ? { parameters: n.parameters } : {}
  };
}
function Oe(e, t) {
  return e.input === "switch" ? t === !0 : !Q(t);
}
function W(e, t, n, l) {
  const s = e?.[t];
  if (s === void 0) throw new Error(`No ${n} ${t}: give it to the table in ${n === "function" ? "functions" : "predicates"}`);
  return s(...l);
}
const le = (e) => e instanceof Date ? e.getTime() : e;
function Ht(e, t, n) {
  if (e == null || n === null || n === void 0) return !1;
  const l = le(e), s = le(n);
  switch (t) {
    case "=":
      return l === s;
    case "!=":
      return l !== s;
    case "<":
      return l < s;
    case "<=":
      return l <= s;
    case ">":
      return l > s;
    case ">=":
      return l >= s;
  }
}
function Wt(e, t, n, l) {
  const s = e.input === "value" ? [n] : [];
  if (e.predicate !== void 0) {
    const o = e.scope === "field" ? [t[e.field], t, ...s] : [t, ...s];
    return W(l.predicates, e.predicate, "predicate", o) === !0;
  }
  const a = t[e.field], i = e.function !== void 0 ? W(l.functions, e.function, "function", [a, t]) : a, c = e.input === "value" ? n : e.otherField !== void 0 ? t[e.otherField] : e.value;
  return Ht(i, e.op, c);
}
function Xt(e, t, n, l = {}) {
  const s = Te(e).filter((a) => Oe(a, n[a.name]));
  return s.length === 0 ? t : t.filter((a) => s.every((i) => Wt(i, a, n[i.name], l)));
}
function qe(e, t, n, l = "last") {
  const s = e == null, a = t == null;
  if (s || a) return s === a ? 0 : s === (l === "first") ? -1 : 1;
  const i = le(e), c = le(t);
  return (typeof i == "string" && typeof c == "string" ? i.localeCompare(c) : i < c ? -1 : i > c ? 1 : 0) * n;
}
function xe(e, t) {
  const n = lt(e);
  return n.find((l) => l.key === t) ?? n.find((l) => l.field === t);
}
function Qt(e, t, n, l = {}) {
  const s = n.map((a) => {
    const i = xe(e, a.key);
    if (i === void 0) throw new Error(`Model ${e.metadata.name} can't be sorted by ${a.key}`);
    const c = a.order === "desc" ? -1 : 1;
    if (i.sortKeys !== void 0) {
      const d = i.sortKeys.map((r) => ({
        value: (v) => r.field === void 0 ? W(l.functions, r.function, "function", [v]) : r.function !== void 0 ? W(l.functions, r.function, "function", [v[r.field], v]) : v[r.field],
        sign: r.direction === "desc" ? -1 : 1,
        nulls: r.nulls
      }));
      return (r, v) => {
        for (const y of d) {
          const h = qe(y.value(r), y.value(v), y.sign * c, y.nulls);
          if (h !== 0) return h;
        }
        return 0;
      };
    }
    const { field: o, definition: f } = i, g = (d) => f.function !== void 0 ? W(l.functions, f.function, "function", [d[o], d]) : d[o];
    return (d, r) => qe(g(d), g(r), c, f.nulls);
  });
  return s.length === 0 ? t : [...t].sort((a, i) => {
    for (const c of s) {
      const o = c(a, i);
      if (o !== 0) return o;
    }
    return 0;
  });
}
function _t(e, t) {
  return t.map((n) => {
    const l = xe(e, n.key);
    if (l === void 0) throw new Error(`Model ${e.metadata.name} can't be sorted by ${n.key}`);
    return n.order === "desc" ? `-${l.key}` : l.key;
  });
}
function en(e, t) {
  const n = {};
  t.itemsPerPage > 0 && (n.limit = t.itemsPerPage, n.offset = (t.page - 1) * t.itemsPerPage);
  const l = _t(e, t.sort);
  l.length > 0 && (n.sort = l.join(","));
  for (const s of Te(e))
    Oe(s, t.filters[s.name]) && (n[s.name] = t.filters[s.name]);
  return n;
}
function Ke(e, t) {
  return Object.assign(Object.create(Object.getPrototypeOf(e)), e, t);
}
function Vn(e, t) {
  const n = new Set(e.fields.map((a) => a.name)), l = [...Object.keys(t.fields ?? {}), ...t.order ?? []].filter((a) => !n.has(a));
  if (l.length > 0)
    throw new Error(`The form of model ${e.metadata.name} names unknown fields: ${[...new Set(l)].join(", ")}`);
  const s = e.fields.map((a) => {
    const i = t.fields?.[a.name];
    return i === void 0 ? a : Ke(a, {
      form: i,
      ...i.label !== void 0 ? { label: i.label } : {},
      ...i.hint !== void 0 ? { description: i.hint } : {}
    });
  });
  return Ke(e, { fields: s, form: t });
}
const pe = (e) => e.form ?? {}, st = (e) => e.form ?? {}, ze = /* @__PURE__ */ Symbol("vuetify-bridge models"), tn = () => {
};
function ot(e) {
  const t = Ze(ze, void 0), n = m(() => {
    const l = e();
    return l !== void 0 ? Be(l) : t === void 0 ? tn : q(t) ? t.value : Be(t);
  });
  return He(ze, n), n;
}
const Ye = (e, t) => e === t || JSON.stringify(e) === JSON.stringify(t);
function _(e, t, n) {
  const l = X(Ce(e(), t.value));
  return Y(l, (s) => {
    const a = fe(e(), s);
    a.ok && !Ye(a.value, t.value) && (t.value = a.value);
  }), Y([t, e], ([s]) => {
    const a = fe(e(), l.value);
    (!a.ok || !Ye(a.value, s)) && (l.value = Ce(e(), s));
  }, { deep: !0 }), {
    input: l,
    kind: m(() => U(e())),
    label: m(() => C(e())),
    hint: m(() => e().description),
    required: m(() => Ve(e())),
    rules: m(() => qt(e(), n()))
  };
}
const nn = /* @__PURE__ */ A({
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
    const t = e, n = x(e, "modelValue"), { input: l, label: s, hint: a, rules: i } = _(() => t.field, n, () => t.messages);
    return (c, o) => (p(), $(u(We), {
      modelValue: u(l),
      "onUpdate:modelValue": o[0] || (o[0] = (f) => q(l) ? l.value = f : null),
      label: u(s),
      hint: u(a),
      "persistent-hint": u(a) !== void 0,
      rules: u(i),
      readonly: e.readonly
    }, null, 8, ["modelValue", "label", "hint", "persistent-hint", "rules", "readonly"]));
  }
}), ln = /* @__PURE__ */ A({
  __name: "ModelInputControl",
  props: /* @__PURE__ */ N({
    field: {},
    readonly: { type: Boolean },
    messages: {},
    control: {}
  }, {
    modelValue: {},
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e) {
    const t = e, n = x(e, "modelValue"), { input: l, label: s, hint: a, rules: i } = _(() => t.field, n, () => t.messages);
    return (c, o) => (p(), $(J(e.control), {
      modelValue: u(l),
      "onUpdate:modelValue": o[0] || (o[0] = (f) => q(l) ? l.value = f : null),
      label: u(s),
      hint: u(a),
      rules: u(i),
      readonly: e.readonly
    }, null, 8, ["modelValue", "label", "hint", "rules", "readonly"]));
  }
}), rt = /* @__PURE__ */ Symbol("FormFields");
function an(e) {
  He(rt, e);
}
function sn() {
  const e = Ze(rt, void 0);
  if (e === void 0) throw new Error("ModelFormField must be inside a ModelForm or ModelFields");
  return e;
}
const Je = (e) => typeof e == "string" ? J(e) : e;
function Ge(e, t) {
  if (typeof e == "string") return !1;
  const n = e.props;
  return Array.isArray(n) ? n.includes(t) : typeof n == "object" && n !== null && t in n;
}
const on = A({
  name: "ModelFormField",
  inheritAttrs: !1,
  props: {
    /** Name of the field. */
    name: { type: String, required: !0 },
    /** The field itself, instead of looking it up by name. */
    field: { type: Object, default: void 0 }
  },
  setup(e, { attrs: t }) {
    const n = sn(), l = m(() => {
      if (e.field !== void 0) return e.field;
      const s = n.model(), a = s.fields.find((i) => i.name === e.name);
      if (a === void 0) throw new Error(`Model ${s.metadata.name} has no field ${e.name}`);
      return a;
    });
    return () => {
      const s = l.value, a = pe(s), i = n.mode();
      if (a.hidden === !0 || !tt(s, i)) return null;
      const c = n.record.value[s.name], o = (v) => n.update(s.name, v), f = !Dt(s, i), g = n.messages(), d = n.slots[`field.${s.name}`], r = () => {
        if (d !== void 0) return d({ field: s, value: c, update: o, readonly: f });
        const v = { ...a.props, ...t, modelValue: c, "onUpdate:modelValue": o, field: s, readonly: f, messages: g };
        if (a.control === void 0) return ee(ut, { ...v, mode: i });
        const y = Je(a.control);
        return Ge(y, "field") ? ee(y, Ge(y, "mode") ? { ...v, mode: i } : v) : ee(ln, { ...v, control: y });
      };
      return a.row === void 0 ? r() : ee(
        Je(a.row),
        { field: s, value: c, update: o, readonly: f, mode: i, record: n.record.value },
        { default: r }
      );
    };
  }
}), we = /* @__PURE__ */ A({
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
    const t = e, n = x(e, "modelValue"), l = ge(), s = m(() => nt(t.model, t.fields ?? st(t.model).order, t.exclude).filter((g) => tt(g, t.mode) && pe(g).hidden !== !0)), a = m(() => zt(t.model, n.value, t.messages)), i = [() => a.value.length === 0 || a.value[0]], c = /* @__PURE__ */ new Set(["longText", "json", "tags", "multiEnum", "object", "objectList"]), o = (g) => pe(g).cols ?? (c.has(U(g)) ? 12 : 6);
    function f(g, d) {
      n.value = { ...n.value, [g]: d };
    }
    return an({
      model: () => t.model,
      record: n,
      update: f,
      mode: () => t.mode,
      messages: () => t.messages,
      slots: l
    }), (g, d) => (p(), I(B, null, [
      z(g.$slots, "default", {
        fields: s.value,
        record: n.value,
        update: f,
        mode: e.mode
      }, () => [
        k(u(ht), null, {
          default: b(() => [
            (p(!0), I(B, null, P(s.value, (r) => (p(), $(u($t), {
              key: r.name,
              cols: "12",
              md: o(r)
            }, {
              default: b(() => [
                k(u(on), {
                  name: r.name,
                  field: r
                }, null, 8, ["name", "field"])
              ]),
              _: 2
            }, 1032, ["md"]))), 128))
          ]),
          _: 1
        })
      ]),
      (p(!0), I(B, null, P(a.value, (r) => (p(), $(u(Vt), {
        key: r,
        type: "error",
        variant: "tonal",
        density: "compact",
        class: "mb-2"
      }, {
        default: b(() => [
          F(j(r), 1)
        ]),
        _: 2
      }, 1024))), 128)),
      k(u(he), {
        "model-value": n.value,
        rules: i,
        class: "d-none",
        "hide-details": ""
      }, null, 8, ["model-value"])
    ], 64));
  }
}), rn = /* @__PURE__ */ A({
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
    const t = e, n = x(e, "modelValue"), l = m(() => C(t.field)), s = m(() => Ve(t.field)), a = m(() => Me(t.field, t.messages)), i = X(!1), c = m(() => t.readonly ? "view" : i.value ? "create" : t.mode ?? "edit");
    function o() {
      i.value = !0, n.value = ke(t.model);
    }
    function f() {
      i.value = !1, n.value = null;
    }
    return (g, d) => (p(), $(u(he), {
      "model-value": n.value,
      rules: a.value,
      class: "model-object-field"
    }, {
      default: b(() => [
        k(u(ue), {
          variant: "outlined",
          class: "w-100"
        }, {
          default: b(() => [
            k(u(de), null, {
              append: b(() => [
                n.value == null && !e.readonly ? (p(), $(u(L), {
                  key: 0,
                  variant: "tonal",
                  size: "small",
                  "prepend-icon": "$plus",
                  onClick: o
                }, {
                  default: b(() => [...d[1] || (d[1] = [
                    F("Add", -1)
                  ])]),
                  _: 1
                })) : n.value != null && !e.readonly && !s.value ? (p(), $(u(L), {
                  key: 1,
                  variant: "text",
                  size: "small",
                  "prepend-icon": "$delete",
                  onClick: f
                }, {
                  default: b(() => [...d[2] || (d[2] = [
                    F("Remove", -1)
                  ])]),
                  _: 1
                })) : D("", !0)
              ]),
              default: b(() => [
                k(u(ce), { class: "text-body-1" }, {
                  default: b(() => [
                    F(j(l.value), 1)
                  ]),
                  _: 1
                }),
                e.field.description ? (p(), $(u(Xe), { key: 0 }, {
                  default: b(() => [
                    F(j(e.field.description), 1)
                  ]),
                  _: 1
                })) : D("", !0)
              ]),
              _: 1
            }),
            n.value != null ? (p(), $(u(me), { key: 0 }, {
              default: b(() => [
                k(we, {
                  modelValue: n.value,
                  "onUpdate:modelValue": d[0] || (d[0] = (r) => n.value = r),
                  model: e.model,
                  mode: c.value,
                  messages: e.messages
                }, null, 8, ["modelValue", "model", "mode", "messages"])
              ]),
              _: 1
            })) : D("", !0)
          ]),
          _: 1
        })
      ]),
      _: 1
    }, 8, ["model-value", "rules"]));
  }
}), un = {
  key: 0,
  class: "text-medium-emphasis"
}, dn = /* @__PURE__ */ A({
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
    const t = e, n = x(e, "modelValue"), l = m(() => n.value ?? []), s = m(() => C(t.field)), a = m(() => C({ name: t.model.metadata.name })), i = m(() => Me(t.field, t.messages));
    let c = 0;
    const o = X([]), f = X(/* @__PURE__ */ new Set());
    Y(() => l.value.length, (h) => {
      o.value.length !== h && (o.value = Array.from({ length: h }, () => c++));
    }, { immediate: !0 });
    const g = (h) => t.readonly ? "view" : f.value.has(o.value[h]) ? "create" : t.mode ?? "edit";
    function d(h, O) {
      n.value = l.value.map((w, M) => M === h ? O : w);
    }
    function r() {
      const h = c++;
      o.value = [...o.value, h], f.value = new Set(f.value).add(h), n.value = [...l.value, ke(t.model)];
    }
    function v(h) {
      o.value = o.value.filter((O, w) => w !== h), n.value = l.value.filter((O, w) => w !== h);
    }
    function y(h, O) {
      const w = (M) => {
        const E = [...M];
        return [E[h], E[h + O]] = [E[h + O], E[h]], E;
      };
      o.value = w(o.value), n.value = w(l.value);
    }
    return (h, O) => (p(), $(u(he), {
      "model-value": l.value,
      rules: i.value,
      class: "model-object-list-field"
    }, {
      default: b(() => [
        k(u(ue), {
          variant: "outlined",
          class: "w-100"
        }, {
          default: b(() => [
            k(u(de), null, {
              append: b(() => [
                e.readonly ? D("", !0) : (p(), $(u(L), {
                  key: 0,
                  variant: "tonal",
                  size: "small",
                  "prepend-icon": "$plus",
                  onClick: r
                }, {
                  default: b(() => [
                    F(" Add " + j(a.value.toLowerCase()), 1)
                  ]),
                  _: 1
                }))
              ]),
              default: b(() => [
                k(u(ce), { class: "text-body-1" }, {
                  default: b(() => [
                    F(j(s.value), 1)
                  ]),
                  _: 1
                }),
                e.field.description ? (p(), $(u(Xe), { key: 0 }, {
                  default: b(() => [
                    F(j(e.field.description), 1)
                  ]),
                  _: 1
                })) : D("", !0)
              ]),
              _: 1
            }),
            k(u(me), null, {
              default: b(() => [
                l.value.length === 0 ? (p(), I("p", un, "No " + j(a.value.toLowerCase()) + " items.", 1)) : D("", !0),
                (p(!0), I(B, null, P(l.value, (w, M) => (p(), $(u(ue), {
                  key: o.value[M],
                  variant: "tonal",
                  class: "mb-3",
                  "aria-label": `${a.value} ${M + 1}`
                }, {
                  default: b(() => [
                    k(u(de), null, be({
                      default: b(() => [
                        k(u(ce), { class: "text-body-2" }, {
                          default: b(() => [
                            F(j(a.value) + " " + j(M + 1), 1)
                          ]),
                          _: 2
                        }, 1024)
                      ]),
                      _: 2
                    }, [
                      e.readonly ? void 0 : {
                        name: "append",
                        fn: b(() => [
                          k(u(L), {
                            icon: "$expand",
                            variant: "text",
                            size: "small",
                            disabled: M === l.value.length - 1,
                            "aria-label": `Move ${a.value} ${M + 1} down`,
                            onClick: (E) => y(M, 1)
                          }, null, 8, ["disabled", "aria-label", "onClick"]),
                          k(u(L), {
                            icon: "$collapse",
                            variant: "text",
                            size: "small",
                            disabled: M === 0,
                            "aria-label": `Move ${a.value} ${M + 1} up`,
                            onClick: (E) => y(M, -1)
                          }, null, 8, ["disabled", "aria-label", "onClick"]),
                          k(u(L), {
                            icon: "$delete",
                            variant: "text",
                            size: "small",
                            "aria-label": `Remove ${a.value} ${M + 1}`,
                            onClick: (E) => v(M)
                          }, null, 8, ["aria-label", "onClick"])
                        ]),
                        key: "0"
                      }
                    ]), 1024),
                    k(u(me), null, {
                      default: b(() => [
                        k(we, {
                          "model-value": w,
                          model: e.model,
                          mode: g(M),
                          messages: e.messages,
                          "onUpdate:modelValue": (E) => d(M, E)
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
}), oe = /* @__PURE__ */ A({
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
    const t = e, n = x(e, "modelValue"), { input: l, kind: s, label: a, hint: i, required: c, rules: o } = _(() => t.field, n, () => t.messages), f = m(() => $e(t.field) ?? []);
    return (g, d) => u(s) === "tags" ? (p(), $(u(kt), {
      key: 0,
      modelValue: u(l),
      "onUpdate:modelValue": d[0] || (d[0] = (r) => q(l) ? l.value = r : null),
      label: u(a),
      hint: u(i),
      rules: u(o),
      readonly: e.readonly,
      multiple: "",
      chips: "",
      "closable-chips": "",
      "hide-no-data": ""
    }, null, 8, ["modelValue", "label", "hint", "rules", "readonly"])) : (p(), $(u(Qe), {
      key: 1,
      modelValue: u(l),
      "onUpdate:modelValue": d[1] || (d[1] = (r) => q(l) ? l.value = r : null),
      items: f.value,
      multiple: u(s) === "multiEnum",
      chips: u(s) === "multiEnum",
      clearable: !u(c) && !e.readonly,
      label: u(a),
      hint: u(i),
      rules: u(o),
      readonly: e.readonly
    }, null, 8, ["modelValue", "items", "multiple", "chips", "clearable", "label", "hint", "rules", "readonly"]));
  }
}), K = /* @__PURE__ */ A({
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
    const t = e, n = x(e, "modelValue"), { input: l, kind: s, label: a, hint: i, rules: c } = _(() => t.field, n, () => t.messages), o = {
      integer: "number",
      number: "number",
      date: "date",
      time: "time",
      datetime: "datetime-local"
    }, f = m(() => o[s.value] ?? "text"), g = m(() => {
      switch (s.value) {
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
    }), d = m(() => t.field.type === "STRING" && typeof t.field.parameters?.length == "number" ? t.field.parameters.length : void 0);
    return (r, v) => (p(), $(u(_e), {
      modelValue: u(l),
      "onUpdate:modelValue": v[0] || (v[0] = (y) => q(l) ? l.value = y : null),
      type: f.value,
      step: g.value,
      counter: d.value,
      label: u(a),
      hint: u(i),
      rules: u(c),
      readonly: e.readonly
    }, null, 8, ["modelValue", "type", "step", "counter", "label", "hint", "rules", "readonly"]));
  }
}), cn = /* @__PURE__ */ A({
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
    const t = e, n = x(e, "modelValue"), { input: l, kind: s, label: a, hint: i, rules: c } = _(() => t.field, n, () => t.messages);
    return (o, f) => (p(), $(u(St), {
      modelValue: u(l),
      "onUpdate:modelValue": f[0] || (f[0] = (g) => q(l) ? l.value = g : null),
      class: pt({ "model-json-field": u(s) !== "longText" }),
      label: u(a),
      hint: u(i),
      rules: u(c),
      readonly: e.readonly,
      "auto-grow": "",
      rows: "3"
    }, null, 8, ["modelValue", "class", "label", "hint", "rules", "readonly"]));
  }
}), it = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [l, s] of t)
    n[l] = s;
  return n;
}, re = /* @__PURE__ */ it(cn, [["__scopeId", "data-v-9ba3dee9"]]), ut = /* @__PURE__ */ A({
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
    const t = e, n = x(e, "modelValue"), l = {
      integer: K,
      number: K,
      text: K,
      date: K,
      time: K,
      datetime: K,
      longText: re,
      json: re,
      boolean: nn,
      enum: oe,
      multiEnum: oe,
      tags: oe,
      object: rn,
      objectList: dn
    }, s = ot(() => t.models), a = m(() => U(t.field)), i = m(() => {
      const o = It(t.field);
      return o !== void 0 ? s.value(o) : void 0;
    }), c = m(() => {
      if (a.value !== "unsupported")
        return (a.value === "object" || a.value === "objectList") && i.value === void 0 ? re : l[a.value];
    });
    return (o, f) => c.value === void 0 ? (p(), $(u(_e), {
      key: 0,
      "model-value": u(ve)(e.field, n.value),
      label: u(C)(e.field),
      hint: e.field.description,
      readonly: ""
    }, null, 8, ["model-value", "label", "hint"])) : i.value !== void 0 ? (p(), $(J(c.value), {
      key: 1,
      modelValue: n.value,
      "onUpdate:modelValue": f[0] || (f[0] = (g) => n.value = g),
      field: e.field,
      model: i.value,
      mode: e.mode,
      readonly: e.readonly,
      messages: e.messages
    }, null, 8, ["modelValue", "field", "model", "mode", "readonly", "messages"])) : (p(), $(J(c.value), {
      key: 2,
      modelValue: n.value,
      "onUpdate:modelValue": f[1] || (f[1] = (g) => n.value = g),
      field: e.field,
      readonly: e.readonly,
      messages: e.messages
    }, null, 8, ["modelValue", "field", "readonly", "messages"]));
  }
}), mn = {
  key: 1,
  class: "d-flex ga-2"
}, kn = /* @__PURE__ */ A({
  __name: "ModelForm",
  props: /* @__PURE__ */ N({
    model: {},
    mode: { default: "edit" },
    fields: {},
    exclude: {},
    messages: {},
    models: {},
    submitText: {},
    cancelText: {},
    hideActions: { type: Boolean }
  }, {
    modelValue: { required: !0 },
    modelModifiers: {}
  }),
  emits: /* @__PURE__ */ N(["submit", "cancel"], ["update:modelValue"]),
  setup(e, { expose: t, emit: n }) {
    const l = e, s = x(e, "modelValue"), a = n;
    ot(() => l.models);
    const i = ge(), c = m(() => Object.keys(i).filter((y) => y.startsWith("field."))), o = m(() => st(l.model)), f = m(() => ({
      submit: r,
      cancel: v,
      validate: d,
      mode: l.mode,
      record: s.value,
      submitText: l.submitText ?? o.value.submitText ?? "Save",
      cancelText: l.cancelText ?? o.value.cancelText ?? "Cancel"
    })), g = X();
    async function d() {
      return (await g.value?.validate())?.valid ?? !1;
    }
    async function r() {
      await d() && a("submit", s.value);
    }
    function v() {
      a("cancel");
    }
    return Y(() => l.mode, (y) => {
      y === "create" && (s.value = { ...ke(l.model), ...s.value });
    }, { immediate: !0 }), t({
      validate: d,
      resetValidation: () => g.value?.resetValidation()
    }), (y, h) => (p(), $(u(Mt), {
      ref_key: "form",
      ref: g,
      onSubmit: gt(r, ["prevent"])
    }, {
      default: b(() => [
        k(we, {
          modelValue: s.value,
          "onUpdate:modelValue": h[0] || (h[0] = (O) => s.value = O),
          model: e.model,
          mode: e.mode,
          fields: e.fields,
          exclude: e.exclude,
          messages: e.messages
        }, be({ _: 2 }, [
          u(i).default ? {
            name: "default",
            fn: b((O) => [
              z(y.$slots, "default", Z(ie(O)))
            ]),
            key: "0"
          } : void 0,
          P(c.value, (O) => ({
            name: O,
            fn: b((w) => [
              z(y.$slots, O, Z(ie(w)))
            ])
          }))
        ]), 1032, ["modelValue", "model", "mode", "fields", "exclude", "messages"]),
        e.mode !== "view" ? z(y.$slots, "actions", Z(te({ key: 0 }, f.value)), () => [
          e.hideActions ? D("", !0) : (p(), I(B, { key: 0 }, [
            o.value.actions !== void 0 ? (p(), $(J(o.value.actions), Z(te({ key: 0 }, f.value)), null, 16)) : (p(), I("div", mn, [
              k(u(Tt)),
              k(u(L), {
                variant: "text",
                onClick: v
              }, {
                default: b(() => [
                  F(j(f.value.cancelText), 1)
                ]),
                _: 1
              }),
              k(u(L), {
                type: "submit",
                color: "primary"
              }, {
                default: b(() => [
                  F(j(f.value.submitText), 1)
                ]),
                _: 1
              })
            ]))
          ], 64))
        ]) : D("", !0)
      ]),
      _: 3
    }, 512));
  }
}), fn = { class: "model-table-filters d-flex flex-wrap align-center ga-3" }, vn = {
  key: 0,
  class: "d-flex align-center"
}, yn = /* @__PURE__ */ A({
  __name: "ModelTableFilters",
  props: /* @__PURE__ */ N({
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
    const t = e, n = x(e, "filters"), l = x(e, "sort"), s = m(() => t.filterOptions.filter((r) => r.input === "value")), a = m(() => t.filterOptions.filter((r) => r.input === "switch")), i = m(() => t.filterOptions.some((r) => Oe(r, n.value[r.name])));
    function c(r, v) {
      const y = { ...n.value };
      v == null || v === "" || v === !1 ? delete y[r] : y[r] = v, n.value = y;
    }
    const o = m(() => t.sortOptions.find((r) => r.key === l.value[0]?.key)), f = m(() => t.sortOptions.map((r) => ({ title: Gt(t.model, r), value: r.key })));
    function g(r) {
      const v = t.sortOptions.find((y) => y.key === r);
      l.value = v !== void 0 ? [{ key: v.key, order: v.directions[0] }] : [];
    }
    function d() {
      const [r, ...v] = l.value;
      l.value = [{ key: r.key, order: r.order === "asc" ? "desc" : "asc" }, ...v];
    }
    return (r, v) => (p(), I("div", fn, [
      (p(!0), I(B, null, P(s.value, (y) => (p(), $(ut, {
        key: y.name,
        field: u(Zt)(e.model, y),
        "model-value": n.value[y.name] ?? null,
        class: "model-table-filter",
        density: "compact",
        variant: "outlined",
        "hide-details": "",
        clearable: "",
        "onUpdate:modelValue": (h) => c(y.name, h)
      }, null, 8, ["field", "model-value", "onUpdate:modelValue"]))), 128)),
      (p(!0), I(B, null, P(a.value, (y) => (p(), $(u(We), {
        key: y.name,
        label: u(at)(e.model, y),
        "model-value": n.value[y.name] === !0,
        class: "flex-grow-0",
        density: "compact",
        "hide-details": "",
        "onUpdate:modelValue": (h) => c(y.name, h === !0)
      }, null, 8, ["label", "model-value", "onUpdate:modelValue"]))), 128)),
      e.sortOptions.length > 0 ? (p(), I("div", vn, [
        k(u(Qe), {
          "model-value": o.value?.key ?? null,
          items: f.value,
          label: "Sort by",
          class: "model-table-filter",
          density: "compact",
          variant: "outlined",
          "hide-details": "",
          clearable: "",
          "onUpdate:modelValue": g
        }, null, 8, ["model-value", "items"]),
        o.value !== void 0 && o.value.directions.length > 1 ? (p(), $(u(L), {
          key: 0,
          icon: l.value[0].order === "asc" ? "$sortAsc" : "$sortDesc",
          "aria-label": l.value[0].order === "asc" ? "Ascending" : "Descending",
          variant: "text",
          size: "small",
          onClick: d
        }, null, 8, ["icon", "aria-label"])) : D("", !0)
      ])) : D("", !0),
      i.value ? (p(), $(u(L), {
        key: 1,
        variant: "text",
        size: "small",
        onClick: v[0] || (v[0] = (y) => n.value = {})
      }, {
        default: b(() => [...v[1] || (v[1] = [
          F("Clear filters", -1)
        ])]),
        _: 1
      })) : D("", !0)
    ]));
  }
}), pn = /* @__PURE__ */ it(yn, [["__scopeId", "data-v-fe979876"]]), gn = { class: "model-table" }, Sn = /* @__PURE__ */ A({
  inheritAttrs: !1,
  __name: "ModelTable",
  props: /* @__PURE__ */ N({
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
  emits: /* @__PURE__ */ N(["update:query"], ["update:filters", "update:sort", "update:page", "update:itemsPerPage"]),
  setup(e, { emit: t }) {
    const n = e, l = x(e, "filters"), s = x(e, "sort"), a = x(e, "page"), i = x(e, "itemsPerPage"), c = t, o = ge(), f = /* @__PURE__ */ new Set(["integer", "number"]), g = /* @__PURE__ */ new Set(["json", "object", "objectList", "tags", "multiEnum", "unsupported"]), d = m(() => nt(n.model, n.fields, n.exclude)), r = m(() => Jt(n.model)), v = m(() => n.itemsLength !== void 0), y = m(() => r.value ? lt(n.model) : []), h = m(() => r.value ? Te(n.model) : []), O = m(() => new Set(y.value.map((S) => S.field).filter(Boolean))), w = m(() => new Set(d.value.map((S) => S.name))), M = m(() => y.value.filter((S, T) => S.field === void 0 || !w.value.has(S.field) || y.value.findIndex((V) => V.field === S.field) !== T)), E = m(() => d.value.map((S) => {
      const T = U(S);
      return {
        title: C(S),
        key: S.name,
        align: f.has(T) ? "end" : "start",
        sortable: r.value ? O.value.has(S.name) : !g.has(T)
      };
    })), Ne = m({
      get: () => s.value,
      set: (S) => {
        s.value = S.map((T) => {
          const V = xe(n.model, T.key)?.directions ?? ["asc", "desc"];
          return V.includes(T.order) ? T : { key: T.key, order: V[0] };
        });
      }
    }), Fe = m(() => ({ functions: n.functions, predicates: n.predicates })), Ae = m(() => Xt(n.model, n.items, l.value, Fe.value)), Ee = m(() => Qt(n.model, Ae.value, s.value, Fe.value)), dt = m(() => i.value <= 0 ? Ee.value : Ee.value.slice((a.value - 1) * i.value, a.value * i.value)), ct = m(() => !r.value || v.value ? n.items : dt.value), mt = m(() => r.value && !v.value ? Ae.value.length : n.itemsLength);
    Y(l, () => {
      a.value = 1;
    }, { deep: !0 }), Y([r, v, s, l, a, i], () => {
      r.value && v.value && c("update:query", en(n.model, { sort: s.value, filters: l.value, page: a.value, itemsPerPage: i.value }));
    }, { immediate: !0, deep: !0 });
    const ft = m(() => n.itemKey ?? Ct(n.model) ?? "id"), vt = m(() => new Set(d.value.map((S) => `item.${S.name}`))), yt = m(() => Object.keys(o).filter((S) => !vt.value.has(S)));
    return (S, T) => (p(), I("div", gn, [
      r.value && e.filterBar && (h.value.length > 0 || M.value.length > 0) ? (p(), $(pn, {
        key: 0,
        filters: l.value,
        "onUpdate:filters": T[0] || (T[0] = (V) => l.value = V),
        sort: s.value,
        "onUpdate:sort": T[1] || (T[1] = (V) => s.value = V),
        model: e.model,
        "filter-options": h.value,
        "sort-options": M.value,
        class: "mb-2"
      }, null, 8, ["filters", "sort", "model", "filter-options", "sort-options"])) : D("", !0),
      (p(), $(J(r.value || e.itemsLength !== void 0 ? u(Ot) : u(xt)), te(S.$attrs, {
        page: a.value,
        "onUpdate:page": T[2] || (T[2] = (V) => a.value = V),
        "items-per-page": i.value,
        "onUpdate:itemsPerPage": T[3] || (T[3] = (V) => i.value = V),
        headers: E.value,
        items: ct.value,
        "item-value": ft.value,
        "items-length": mt.value
      }, bt(r.value ? { "update:sortBy": (V) => {
        Ne.value = V;
      } } : {}), {
        "sort-by": r.value ? Ne.value : void 0
      }), be({ _: 2 }, [
        P(d.value, (V) => ({
          name: `item.${V.name}`,
          fn: b((G) => [
            z(S.$slots, `item.${V.name}`, te(G, {
              field: V,
              formatted: u(ve)(V, G.value, e.locale)
            }), () => [
              F(j(u(ve)(V, G.value, e.locale)), 1)
            ])
          ])
        })),
        P(yt.value, (V) => ({
          name: V,
          fn: b((G) => [
            z(S.$slots, V, Z(ie(G ?? {})))
          ])
        }))
      ]), 1040, ["page", "items-per-page", "headers", "items", "item-value", "items-length", "sort-by"]))
    ]));
  }
});
export {
  et as INTEGER_RANGES,
  nn as ModelBooleanField,
  ut as ModelField,
  we as ModelFields,
  kn as ModelForm,
  on as ModelFormField,
  ln as ModelInputControl,
  rn as ModelObjectField,
  dn as ModelObjectListField,
  oe as ModelSelectField,
  Sn as ModelTable,
  pn as ModelTableFilters,
  K as ModelTextField,
  re as ModelTextareaField,
  ze as ModelsKey,
  Le as defaultMessages,
  ke as emptyRecord,
  $e as enumValues,
  R as fieldConstraints,
  U as fieldKind,
  C as fieldLabel,
  Me as fieldRules,
  Zt as filterField,
  at as filterLabel,
  Xt as filterRows,
  st as formOf,
  pe as formOptions,
  ve as formatValue,
  fe as fromInput,
  Jt as hasListOptions,
  ae as humanize,
  qt as inputRules,
  Dt as isEditable,
  Q as isEmpty,
  Oe as isFilterOn,
  Ve as isRequired,
  tt as isVisible,
  Te as listFilterOptions,
  en as listQuery,
  lt as listSortOptions,
  Ct as primaryKeyField,
  zt as recordErrors,
  It as referencedModel,
  Se as resolveMessages,
  nt as selectFields,
  Gt as sortLabel,
  xe as sortOptionOf,
  _t as sortParameter,
  Qt as sortRows,
  Ce as toInput,
  Be as toResolver,
  _ as useFieldInput,
  sn as useFormFields,
  ot as useModels,
  Vn as withForm
};
