import { inject as oe, computed as m, isRef as q, provide as he, ref as X, watch as Y, defineComponent as w, mergeModels as N, useModel as O, createBlock as $, openBlock as b, unref as r, resolveDynamicComponent as J, h as ee, useSlots as $e, createElementBlock as C, Fragment as B, renderSlot as z, createVNode as k, withCtx as h, renderList as P, createTextVNode as F, toDisplayString as j, createCommentVNode as I, createSlots as Ve, normalizeClass as pt, withModifiers as gt, normalizeProps as Z, guardReactiveProps as de, mergeProps as te, toHandlers as bt } from "vue";
import { VCheckbox as He, VRow as ht, VCol as $t, VAlert as Vt, VInput as ke, VCard as ce, VCardItem as me, VCardTitle as fe, VCardSubtitle as We, VBtn as L, VCardText as ve, VCombobox as kt, VSelect as Xe, VTextField as Qe, VTextarea as St, VForm as Mt, VSpacer as Tt, VDataTableServer as xt, VDataTable as Ot } from "vuetify/components";
import { sortOptions as Nt, filterOptions as Ft } from "model-algebra-common";
const _e = /* @__PURE__ */ new Map([
  ["integer", void 0],
  ["INT16", [-32768, 32767]],
  ["INT32", [-2147483648, 2147483647]],
  ["INT64", void 0]
]), wt = /* @__PURE__ */ new Set(["number", "FLOAT32", "FLOAT64", "DECIMAL"]), At = /* @__PURE__ */ new Set(["string", "STRING", "UUID", "DURATION"]), Et = /* @__PURE__ */ new Set(["DATETIME", "TIMESTAMP", "TIMESTAMP_TZ"]), jt = /* @__PURE__ */ new Set(["JSON", "UNION", "object", "array"]);
function R(e) {
  const t = e.constraints;
  return t == null ? {} : Array.isArray(t) ? Object.fromEntries(t.map((n) => [n.name, n.value])) : t;
}
function Se(e) {
  const t = R(e).enum;
  if (Array.isArray(t)) return t;
  const n = e.type === "ARRAY" ? e.parameters?.items : e, l = n?.type === "ENUM" ? n.parameters?.values : void 0;
  return Array.isArray(l) ? l : void 0;
}
function re(e) {
  const t = e.type;
  return _e.has(t) ? "integer" : wt.has(t) ? "number" : At.has(t) ? "text" : t === "TEXT" ? "longText" : t === "boolean" || t === "BOOLEAN" ? "boolean" : t === "ENUM" ? "enum" : t === "date" || t === "DATE" ? "date" : t === "TIME" ? "time" : Et.has(t) ? "datetime" : t === "OBJECT" ? "object" : jt.has(t) ? "json" : "unsupported";
}
function U(e) {
  if (e.type === "ARRAY") {
    if (Se(e) !== void 0) return "multiEnum";
    const t = e.parameters?.items, n = t !== void 0 ? re(t) : "json";
    return n === "text" ? "tags" : n === "object" ? "objectList" : "json";
  }
  return R(e).enum !== void 0 && re(e) === "text" ? "enum" : re(e);
}
function Ct(e) {
  const t = e.type === "ARRAY" ? e.parameters?.items : e, n = t?.type === "OBJECT" ? t.parameters?.ref : void 0;
  return typeof n == "string" ? n : void 0;
}
function D(e) {
  return e.label ?? se(e.name);
}
function se(e) {
  return e.replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2").split(/[\s_\-]+/).filter((n) => n.length > 0).map((n, l) => {
    const o = n.length > 1 && n === n.toUpperCase() ? n : n.toLowerCase();
    return l === 0 ? o[0].toUpperCase() + o.slice(1) : o;
  }).join(" ");
}
function Me(e) {
  const t = R(e);
  return t.nullable === !1 || t.required === !0;
}
function et(e, t) {
  return !(t === "create" && R(e).identity !== void 0);
}
function It(e, t) {
  if (t === "view" || U(e) === "unsupported") return !1;
  const n = R(e);
  return n.identity === "always" ? !1 : !(t === "edit" && (n.primaryKey === !0 || n.identity !== void 0));
}
function tt(e, t, n = []) {
  const l = new Map(e.fields.map((a) => [a.name, a]));
  return (t === void 0 ? e.fields : t.map((a) => {
    const u = l.get(a);
    if (u === void 0)
      throw new Error(`Model ${e.metadata.name} has no field ${a}`);
    return u;
  })).filter((a) => !n.includes(a.name));
}
function Dt(e) {
  const t = e.fields.find((l) => R(l).primaryKey === !0);
  if (t !== void 0) return t.name;
  const n = e.constraints?.find((l) => l.type === "primaryKey");
  return n?.fields?.length === 1 ? n.fields[0] : void 0;
}
function Te(e) {
  return Object.fromEntries(e.fields.map((t) => {
    const n = R(t).default, l = n !== null && typeof n == "object" && "value" in n ? n.value : null;
    return [t.name, l];
  }));
}
const H = (e, t = 2) => String(e).padStart(t, "0"), De = (e) => `${e.getFullYear()}-${H(e.getMonth() + 1)}-${H(e.getDate())}`, Le = (e) => `${H(e.getHours())}:${H(e.getMinutes())}:${H(e.getSeconds())}`;
function Ue(e) {
  if (e instanceof Date) return e;
  if (typeof e == "string" && /(Z|[+-]\d\d:?\d\d)$/.test(e)) return new Date(e);
}
function Q(e) {
  return e == null || e === "" || Array.isArray(e) && e.length === 0;
}
function Pe(e, t) {
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
      const l = Ue(t);
      return l !== void 0 ? De(l) : String(t).slice(0, 10);
    }
    case "time":
      return t instanceof Date ? Le(t) : String(t);
    case "datetime": {
      const l = Ue(t);
      return l !== void 0 ? `${De(l)}T${Le(l)}` : String(t).replace(" ", "T").slice(0, 19);
    }
    case "json":
    case "object":
    case "objectList":
      return JSON.stringify(t, null, 2);
    default:
      return String(t);
  }
}
function ye(e, t) {
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
}, Re = {
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
function xe(e) {
  return e === void 0 ? Re : { ...Re, ...e };
}
const Ut = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, Pt = /^-?P(?!$)(\d+(\.\d+)?Y)?(\d+(\.\d+)?M)?(\d+(\.\d+)?W)?(\d+(\.\d+)?D)?(T(?=\d)(\d+(\.\d+)?H)?(\d+(\.\d+)?M)?(\d+(\.\d+)?S)?)?$/;
function Rt(e) {
  const [t, n] = String(e).split("e"), l = t.split(".")[1]?.length ?? 0;
  return Math.max(0, l - Number(n ?? 0));
}
const Bt = (e) => e instanceof Date ? !Number.isNaN(e.getTime()) : !Number.isNaN(new Date(String(e)).getTime());
function Oe(e, t) {
  const n = xe(t), l = D(e), o = U(e), a = R(e), u = e.parameters ?? {}, c = [], i = (d, s) => c.push((v) => d(v) || s);
  if ((o === "integer" || o === "number") && i((d) => typeof d == "number" && Number.isFinite(d), n.number(l)), o === "integer") {
    i((s) => Number.isInteger(s), n.integer(l));
    const d = _e.get(e.type);
    d !== void 0 && (i((s) => s >= d[0], n.min(l, d[0])), i((s) => s <= d[1], n.max(l, d[1])));
  }
  if (e.type === "DECIMAL" && typeof u.scale == "number" && i((d) => Rt(d) <= u.scale, n.decimals(l, u.scale)), typeof a.min == "number" && i((d) => d >= a.min, n.min(l, a.min)), typeof a.max == "number" && i((d) => d <= a.max, n.max(l, a.max)), e.type === "STRING" && typeof u.length == "number" && i((d) => String(d).length <= u.length, n.maxLength(l, u.length)), e.type === "UUID" && i((d) => Ut.test(String(d)), n.uuid(l)), e.type === "DURATION" && i((d) => Pt.test(String(d)), n.duration(l)), typeof a.regex == "string" && e.type !== "ARRAY") {
    const d = new RegExp(a.regex);
    i((s) => d.test(String(s)), n.pattern(l, a.regex));
  }
  const f = Se(e);
  f !== void 0 && i(
    (d) => Array.isArray(d) ? d.every((s) => f.includes(s)) : f.includes(d),
    n.oneOf(l, f)
  ), (o === "date" || o === "datetime") && i(Bt, n.date(l));
  const y = Me(e);
  return [(d) => {
    if (Q(d)) return y ? n.required(l) : !0;
    for (const s of c) {
      const v = s(d);
      if (v !== !0) return v;
    }
    return !0;
  }];
}
function qt(e, t) {
  const n = xe(t), l = D(e), o = Oe(e, t);
  return [(a) => {
    const u = ye(e, a);
    if (!u.ok) return n[u.error](l);
    for (const c of o) {
      const i = c(u.value);
      if (i !== !0) return i;
    }
    return !0;
  }];
}
const Be = (e) => e instanceof Date ? e.getTime() : e;
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
  const l = xe(n), o = new Map(e.fields.map((c) => [c.name, c])), a = (c) => {
    const i = o.get(c);
    return i !== void 0 ? D(i) : c;
  }, u = [];
  for (const c of e.constraints ?? []) {
    if (c.type !== "check" || c.rule === void 0) continue;
    const i = c.rule, f = t[i.field], y = i.otherField !== void 0 ? t[i.otherField] : i.value;
    if (!(Q(f) || Q(y)) && !Kt(i.op, Be(f), Be(y))) {
      const d = i.otherField !== void 0 ? a(i.otherField) : String(i.value);
      u.push(l.check(a(i.field), i.op, d));
    }
  }
  return u;
}
const qe = 60;
function Ke(e) {
  if (e instanceof Date) return e;
  const t = String(e), n = /^(\d{4})-(\d{2})-(\d{2})$/.exec(t);
  return n !== null ? new Date(Number(n[1]), Number(n[2]) - 1, Number(n[3])) : new Date(t);
}
function pe(e, t, n) {
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
      const l = Ke(t);
      return Number.isNaN(l.getTime()) ? String(t) : l.toLocaleDateString(n);
    }
    case "datetime": {
      const l = Ke(t);
      return Number.isNaN(l.getTime()) ? String(t) : l.toLocaleString(n);
    }
    case "multiEnum":
    case "tags":
      return Array.isArray(t) ? t.join(", ") : String(t);
    case "json":
    case "object":
    case "objectList": {
      const l = JSON.stringify(t);
      return l.length > qe ? `${l.slice(0, qe - 1)}…` : l;
    }
    case "unsupported":
      return t instanceof Uint8Array ? `${t.length} bytes` : String(t);
    default:
      return String(t);
  }
}
function ze(e) {
  if (typeof e == "function") return e;
  const t = new Map(Array.isArray(e) ? e.map((n) => [n.metadata.name, n]) : Object.entries(e));
  return (n) => t.get(n);
}
const Yt = { "=": "=", "!=": "≠", "<": "<", "<=": "≤", ">": ">", ">=": "≥" }, ge = (e) => {
  const t = se(e);
  return t.charAt(0).toLowerCase() + t.slice(1);
};
function Jt(e) {
  return e.fields.some((t) => t.sortable !== void 0 || t.filterable !== void 0) || e.sortings !== void 0 || e.filters !== void 0;
}
const nt = (e) => Nt(e), Ne = (e) => Ft(e);
function ne(e, t) {
  return e.fields.find((n) => n.name === t);
}
function Gt(e, t) {
  if (t.field === void 0) return se(t.key);
  const n = D(ne(e, t.field));
  return t.definitionName === "" ? n : `${n}: ${ge(t.definitionName)}`;
}
function lt(e, t) {
  if (t.scope === "model") return se(t.name);
  const n = D(ne(e, t.field)), l = t.definitionName !== "" ? `${n}: ${ge(t.definitionName)}` : n;
  if (t.predicate !== void 0) return t.definitionName !== "" ? l : `${n}: ${ge(t.predicate)}`;
  const o = t.op === "=" && t.input === "value" ? "" : ` ${Yt[t.op]}`;
  if (t.input === "value") return `${l}${o}`;
  if (t.definitionName !== "") return l;
  const a = t.otherField !== void 0 ? D(ne(e, t.otherField)) : String(t.value);
  return `${n}${o} ${a}`;
}
function Zt(e, t) {
  const n = t.valueType === "field" || t.valueType === void 0 ? ne(e, t.field) : t.valueType;
  return {
    name: t.name,
    label: lt(e, t),
    type: n.type,
    ...n.parameters !== void 0 ? { parameters: n.parameters } : {}
  };
}
function Fe(e, t) {
  return e.input === "switch" ? t === !0 : !Q(t);
}
function W(e, t, n, l) {
  const o = e?.[t];
  if (o === void 0) throw new Error(`No ${n} ${t}: give it to the table in ${n === "function" ? "functions" : "predicates"}`);
  return o(...l);
}
const le = (e) => e instanceof Date ? e.getTime() : e;
function Ht(e, t, n) {
  if (e == null || n === null || n === void 0) return !1;
  const l = le(e), o = le(n);
  switch (t) {
    case "=":
      return l === o;
    case "!=":
      return l !== o;
    case "<":
      return l < o;
    case "<=":
      return l <= o;
    case ">":
      return l > o;
    case ">=":
      return l >= o;
  }
}
function Wt(e, t, n, l) {
  const o = e.input === "value" ? [n] : [];
  if (e.predicate !== void 0) {
    const i = e.scope === "field" ? [t[e.field], t, ...o] : [t, ...o];
    return W(l.predicates, e.predicate, "predicate", i) === !0;
  }
  const a = t[e.field], u = e.function !== void 0 ? W(l.functions, e.function, "function", [a, t]) : a, c = e.input === "value" ? n : e.otherField !== void 0 ? t[e.otherField] : e.value;
  return Ht(u, e.op, c);
}
function Xt(e, t, n, l = {}) {
  const o = Ne(e).filter((a) => Fe(a, n[a.name]));
  return o.length === 0 ? t : t.filter((a) => o.every((u) => Wt(u, a, n[u.name], l)));
}
function Ye(e, t, n, l = "last") {
  const o = e == null, a = t == null;
  if (o || a) return o === a ? 0 : o === (l === "first") ? -1 : 1;
  const u = le(e), c = le(t);
  return (typeof u == "string" && typeof c == "string" ? u.localeCompare(c) : u < c ? -1 : u > c ? 1 : 0) * n;
}
function we(e, t) {
  const n = nt(e);
  return n.find((l) => l.key === t) ?? n.find((l) => l.field === t);
}
function Qt(e, t, n, l = {}) {
  const o = n.map((a) => {
    const u = we(e, a.key);
    if (u === void 0) throw new Error(`Model ${e.metadata.name} can't be sorted by ${a.key}`);
    const c = a.order === "desc" ? -1 : 1;
    if (u.sortKeys !== void 0) {
      const d = u.sortKeys.map((s) => ({
        value: (v) => s.field === void 0 ? W(l.functions, s.function, "function", [v]) : s.function !== void 0 ? W(l.functions, s.function, "function", [v[s.field], v]) : v[s.field],
        sign: s.direction === "desc" ? -1 : 1,
        nulls: s.nulls
      }));
      return (s, v) => {
        for (const g of d) {
          const p = Ye(g.value(s), g.value(v), g.sign * c, g.nulls);
          if (p !== 0) return p;
        }
        return 0;
      };
    }
    const { field: i, definition: f } = u, y = (d) => f.function !== void 0 ? W(l.functions, f.function, "function", [d[i], d]) : d[i];
    return (d, s) => Ye(y(d), y(s), c, f.nulls);
  });
  return o.length === 0 ? t : [...t].sort((a, u) => {
    for (const c of o) {
      const i = c(a, u);
      if (i !== 0) return i;
    }
    return 0;
  });
}
function _t(e, t) {
  return t.map((n) => {
    const l = we(e, n.key);
    if (l === void 0) throw new Error(`Model ${e.metadata.name} can't be sorted by ${n.key}`);
    return n.order === "desc" ? `-${l.key}` : l.key;
  });
}
function en(e, t) {
  const n = {};
  t.itemsPerPage > 0 && (n.limit = t.itemsPerPage, n.offset = (t.page - 1) * t.itemsPerPage);
  const l = _t(e, t.sort);
  l.length > 0 && (n.sort = l.join(","));
  for (const o of Ne(e))
    Fe(o, t.filters[o.name]) && (n[o.name] = t.filters[o.name]);
  return n;
}
const ae = (e) => e.form ?? {}, at = (e) => e.form ?? {};
function tn(e) {
  const { label: t, hint: n } = ae(e);
  return t === void 0 && n === void 0 ? e : Object.assign(Object.create(Object.getPrototypeOf(e)), e, {
    ...t !== void 0 ? { label: t } : {},
    ...n !== void 0 ? { description: n } : {}
  });
}
const Je = /* @__PURE__ */ Symbol("vuetify-bridge models"), nn = () => {
};
function ot(e) {
  const t = oe(Je, void 0), n = m(() => {
    const l = e();
    return l !== void 0 ? ze(l) : t === void 0 ? nn : q(t) ? t.value : ze(t);
  });
  return he(Je, n), n;
}
const Ge = (e, t) => e === t || JSON.stringify(e) === JSON.stringify(t);
function _(e, t, n) {
  const l = X(Pe(e(), t.value));
  return Y(l, (o) => {
    const a = ye(e(), o);
    a.ok && !Ge(a.value, t.value) && (t.value = a.value);
  }), Y([t, e], ([o]) => {
    const a = ye(e(), l.value);
    (!a.ok || !Ge(a.value, o)) && (l.value = Pe(e(), o));
  }, { deep: !0 }), {
    input: l,
    kind: m(() => U(e())),
    label: m(() => D(e())),
    hint: m(() => e().description),
    required: m(() => Me(e())),
    rules: m(() => qt(e(), n()))
  };
}
const ln = /* @__PURE__ */ w({
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
    const t = e, n = O(e, "modelValue"), { input: l, label: o, hint: a, rules: u } = _(() => t.field, n, () => t.messages);
    return (c, i) => (b(), $(r(He), {
      modelValue: r(l),
      "onUpdate:modelValue": i[0] || (i[0] = (f) => q(l) ? l.value = f : null),
      label: r(o),
      hint: r(a),
      "persistent-hint": r(a) !== void 0,
      rules: r(u),
      readonly: e.readonly
    }, null, 8, ["modelValue", "label", "hint", "persistent-hint", "rules", "readonly"]));
  }
}), an = /* @__PURE__ */ w({
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
    const t = e, n = O(e, "modelValue"), { input: l, label: o, hint: a, rules: u } = _(() => t.field, n, () => t.messages);
    return (c, i) => (b(), $(J(e.control), {
      modelValue: r(l),
      "onUpdate:modelValue": i[0] || (i[0] = (f) => q(l) ? l.value = f : null),
      label: r(o),
      hint: r(a),
      rules: r(u),
      readonly: e.readonly
    }, null, 8, ["modelValue", "label", "hint", "rules", "readonly"]));
  }
}), be = /* @__PURE__ */ Symbol("FormComponents"), st = (e) => (t) => typeof t != "string" ? t : e()[t] ?? J(t);
function on(e) {
  const t = oe(be, {}), n = m(() => ({ ...r(t), ...e() }));
  return he(be, n), st(() => n.value);
}
function sn() {
  const e = oe(be, {});
  return st(() => r(e));
}
const rt = /* @__PURE__ */ Symbol("FormFields");
function rn(e) {
  he(rt, e);
}
function un() {
  const e = oe(rt, void 0);
  if (e === void 0) throw new Error("ModelFormField must be inside a ModelForm or ModelFields");
  return e;
}
function Ze(e, t) {
  if (typeof e == "string") return !1;
  const n = e.props;
  return Array.isArray(n) ? n.includes(t) : typeof n == "object" && n !== null && t in n;
}
const dn = w({
  name: "ModelFormField",
  inheritAttrs: !1,
  props: {
    /** Name of the field. */
    name: { type: String, required: !0 },
    /** The field itself, instead of looking it up by name. */
    field: { type: Object, default: void 0 }
  },
  setup(e, { attrs: t }) {
    const n = un(), l = sn(), o = m(() => {
      if (e.field !== void 0) return e.field;
      const a = n.model(), u = a.fields.find((c) => c.name === e.name);
      if (u === void 0) throw new Error(`Model ${a.metadata.name} has no field ${e.name}`);
      return u;
    });
    return () => {
      const a = ae(o.value), u = tn(o.value), c = n.mode();
      if (a.hidden === !0 || !et(u, c)) return null;
      const i = n.record.value[u.name], f = (g) => n.update(u.name, g), y = !It(u, c), d = n.messages(), s = n.slots[`field.${u.name}`], v = () => {
        if (s !== void 0) return s({ field: u, value: i, update: f, readonly: y });
        const g = { ...a.props, ...t, modelValue: i, "onUpdate:modelValue": f, field: u, readonly: y, messages: d };
        if (a.control === void 0) return ee(ut, { ...g, mode: c });
        const p = l(a.control);
        return Ze(p, "field") ? ee(p, Ze(p, "mode") ? { ...g, mode: c } : g) : ee(an, { ...g, control: p });
      };
      return a.row === void 0 ? v() : ee(
        l(a.row),
        { field: u, value: i, update: f, readonly: y, mode: c, record: n.record.value },
        { default: v }
      );
    };
  }
}), Ae = /* @__PURE__ */ w({
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
    const t = e, n = O(e, "modelValue"), l = $e(), o = m(() => tt(t.model, t.fields ?? at(t.model).order, t.exclude).filter((y) => et(y, t.mode) && ae(y).hidden !== !0)), a = m(() => zt(t.model, n.value, t.messages)), u = [() => a.value.length === 0 || a.value[0]], c = /* @__PURE__ */ new Set(["longText", "json", "tags", "multiEnum", "object", "objectList"]), i = (y) => ae(y).cols ?? (c.has(U(y)) ? 12 : 6);
    function f(y, d) {
      n.value = { ...n.value, [y]: d };
    }
    return rn({
      model: () => t.model,
      record: n,
      update: f,
      mode: () => t.mode,
      messages: () => t.messages,
      slots: l
    }), (y, d) => (b(), C(B, null, [
      z(y.$slots, "default", {
        fields: o.value,
        record: n.value,
        update: f,
        mode: e.mode
      }, () => [
        k(r(ht), null, {
          default: h(() => [
            (b(!0), C(B, null, P(o.value, (s) => (b(), $(r($t), {
              key: s.name,
              cols: "12",
              md: i(s)
            }, {
              default: h(() => [
                k(r(dn), {
                  name: s.name,
                  field: s
                }, null, 8, ["name", "field"])
              ]),
              _: 2
            }, 1032, ["md"]))), 128))
          ]),
          _: 1
        })
      ]),
      (b(!0), C(B, null, P(a.value, (s) => (b(), $(r(Vt), {
        key: s,
        type: "error",
        variant: "tonal",
        density: "compact",
        class: "mb-2"
      }, {
        default: h(() => [
          F(j(s), 1)
        ]),
        _: 2
      }, 1024))), 128)),
      k(r(ke), {
        "model-value": n.value,
        rules: u,
        class: "d-none",
        "hide-details": ""
      }, null, 8, ["model-value"])
    ], 64));
  }
}), cn = /* @__PURE__ */ w({
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
    const t = e, n = O(e, "modelValue"), l = m(() => D(t.field)), o = m(() => Me(t.field)), a = m(() => Oe(t.field, t.messages)), u = X(!1), c = m(() => t.readonly ? "view" : u.value ? "create" : t.mode ?? "edit");
    function i() {
      u.value = !0, n.value = Te(t.model);
    }
    function f() {
      u.value = !1, n.value = null;
    }
    return (y, d) => (b(), $(r(ke), {
      "model-value": n.value,
      rules: a.value,
      class: "model-object-field"
    }, {
      default: h(() => [
        k(r(ce), {
          variant: "outlined",
          class: "w-100"
        }, {
          default: h(() => [
            k(r(me), null, {
              append: h(() => [
                n.value == null && !e.readonly ? (b(), $(r(L), {
                  key: 0,
                  variant: "tonal",
                  size: "small",
                  "prepend-icon": "$plus",
                  onClick: i
                }, {
                  default: h(() => [...d[1] || (d[1] = [
                    F("Add", -1)
                  ])]),
                  _: 1
                })) : n.value != null && !e.readonly && !o.value ? (b(), $(r(L), {
                  key: 1,
                  variant: "text",
                  size: "small",
                  "prepend-icon": "$delete",
                  onClick: f
                }, {
                  default: h(() => [...d[2] || (d[2] = [
                    F("Remove", -1)
                  ])]),
                  _: 1
                })) : I("", !0)
              ]),
              default: h(() => [
                k(r(fe), { class: "text-body-1" }, {
                  default: h(() => [
                    F(j(l.value), 1)
                  ]),
                  _: 1
                }),
                e.field.description ? (b(), $(r(We), { key: 0 }, {
                  default: h(() => [
                    F(j(e.field.description), 1)
                  ]),
                  _: 1
                })) : I("", !0)
              ]),
              _: 1
            }),
            n.value != null ? (b(), $(r(ve), { key: 0 }, {
              default: h(() => [
                k(Ae, {
                  modelValue: n.value,
                  "onUpdate:modelValue": d[0] || (d[0] = (s) => n.value = s),
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
}), mn = {
  key: 0,
  class: "text-medium-emphasis"
}, fn = /* @__PURE__ */ w({
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
    const t = e, n = O(e, "modelValue"), l = m(() => n.value ?? []), o = m(() => D(t.field)), a = m(() => D({ name: t.model.metadata.name })), u = m(() => Oe(t.field, t.messages));
    let c = 0;
    const i = X([]), f = X(/* @__PURE__ */ new Set());
    Y(() => l.value.length, (p) => {
      i.value.length !== p && (i.value = Array.from({ length: p }, () => c++));
    }, { immediate: !0 });
    const y = (p) => t.readonly ? "view" : f.value.has(i.value[p]) ? "create" : t.mode ?? "edit";
    function d(p, A) {
      n.value = l.value.map((T, S) => S === p ? A : T);
    }
    function s() {
      const p = c++;
      i.value = [...i.value, p], f.value = new Set(f.value).add(p), n.value = [...l.value, Te(t.model)];
    }
    function v(p) {
      i.value = i.value.filter((A, T) => T !== p), n.value = l.value.filter((A, T) => T !== p);
    }
    function g(p, A) {
      const T = (S) => {
        const E = [...S];
        return [E[p], E[p + A]] = [E[p + A], E[p]], E;
      };
      i.value = T(i.value), n.value = T(l.value);
    }
    return (p, A) => (b(), $(r(ke), {
      "model-value": l.value,
      rules: u.value,
      class: "model-object-list-field"
    }, {
      default: h(() => [
        k(r(ce), {
          variant: "outlined",
          class: "w-100"
        }, {
          default: h(() => [
            k(r(me), null, {
              append: h(() => [
                e.readonly ? I("", !0) : (b(), $(r(L), {
                  key: 0,
                  variant: "tonal",
                  size: "small",
                  "prepend-icon": "$plus",
                  onClick: s
                }, {
                  default: h(() => [
                    F(" Add " + j(a.value.toLowerCase()), 1)
                  ]),
                  _: 1
                }))
              ]),
              default: h(() => [
                k(r(fe), { class: "text-body-1" }, {
                  default: h(() => [
                    F(j(o.value), 1)
                  ]),
                  _: 1
                }),
                e.field.description ? (b(), $(r(We), { key: 0 }, {
                  default: h(() => [
                    F(j(e.field.description), 1)
                  ]),
                  _: 1
                })) : I("", !0)
              ]),
              _: 1
            }),
            k(r(ve), null, {
              default: h(() => [
                l.value.length === 0 ? (b(), C("p", mn, "No " + j(a.value.toLowerCase()) + " items.", 1)) : I("", !0),
                (b(!0), C(B, null, P(l.value, (T, S) => (b(), $(r(ce), {
                  key: i.value[S],
                  variant: "tonal",
                  class: "mb-3",
                  "aria-label": `${a.value} ${S + 1}`
                }, {
                  default: h(() => [
                    k(r(me), null, Ve({
                      default: h(() => [
                        k(r(fe), { class: "text-body-2" }, {
                          default: h(() => [
                            F(j(a.value) + " " + j(S + 1), 1)
                          ]),
                          _: 2
                        }, 1024)
                      ]),
                      _: 2
                    }, [
                      e.readonly ? void 0 : {
                        name: "append",
                        fn: h(() => [
                          k(r(L), {
                            icon: "$expand",
                            variant: "text",
                            size: "small",
                            disabled: S === l.value.length - 1,
                            "aria-label": `Move ${a.value} ${S + 1} down`,
                            onClick: (E) => g(S, 1)
                          }, null, 8, ["disabled", "aria-label", "onClick"]),
                          k(r(L), {
                            icon: "$collapse",
                            variant: "text",
                            size: "small",
                            disabled: S === 0,
                            "aria-label": `Move ${a.value} ${S + 1} up`,
                            onClick: (E) => g(S, -1)
                          }, null, 8, ["disabled", "aria-label", "onClick"]),
                          k(r(L), {
                            icon: "$delete",
                            variant: "text",
                            size: "small",
                            "aria-label": `Remove ${a.value} ${S + 1}`,
                            onClick: (E) => v(S)
                          }, null, 8, ["aria-label", "onClick"])
                        ]),
                        key: "0"
                      }
                    ]), 1024),
                    k(r(ve), null, {
                      default: h(() => [
                        k(Ae, {
                          "model-value": T,
                          model: e.model,
                          mode: y(S),
                          messages: e.messages,
                          "onUpdate:modelValue": (E) => d(S, E)
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
}), ie = /* @__PURE__ */ w({
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
    const t = e, n = O(e, "modelValue"), { input: l, kind: o, label: a, hint: u, required: c, rules: i } = _(() => t.field, n, () => t.messages), f = m(() => Se(t.field) ?? []);
    return (y, d) => r(o) === "tags" ? (b(), $(r(kt), {
      key: 0,
      modelValue: r(l),
      "onUpdate:modelValue": d[0] || (d[0] = (s) => q(l) ? l.value = s : null),
      label: r(a),
      hint: r(u),
      rules: r(i),
      readonly: e.readonly,
      multiple: "",
      chips: "",
      "closable-chips": "",
      "hide-no-data": ""
    }, null, 8, ["modelValue", "label", "hint", "rules", "readonly"])) : (b(), $(r(Xe), {
      key: 1,
      modelValue: r(l),
      "onUpdate:modelValue": d[1] || (d[1] = (s) => q(l) ? l.value = s : null),
      items: f.value,
      multiple: r(o) === "multiEnum",
      chips: r(o) === "multiEnum",
      clearable: !r(c) && !e.readonly,
      label: r(a),
      hint: r(u),
      rules: r(i),
      readonly: e.readonly
    }, null, 8, ["modelValue", "items", "multiple", "chips", "clearable", "label", "hint", "rules", "readonly"]));
  }
}), K = /* @__PURE__ */ w({
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
    const t = e, n = O(e, "modelValue"), { input: l, kind: o, label: a, hint: u, rules: c } = _(() => t.field, n, () => t.messages), i = {
      integer: "number",
      number: "number",
      date: "date",
      time: "time",
      datetime: "datetime-local"
    }, f = m(() => i[o.value] ?? "text"), y = m(() => {
      switch (o.value) {
        case "integer":
          return 1;
        case "number": {
          const s = t.field.type === "DECIMAL" ? t.field.parameters?.scale : void 0;
          return typeof s == "number" ? 10 ** -s : "any";
        }
        case "time":
        case "datetime":
          return 1;
        default:
          return;
      }
    }), d = m(() => t.field.type === "STRING" && typeof t.field.parameters?.length == "number" ? t.field.parameters.length : void 0);
    return (s, v) => (b(), $(r(Qe), {
      modelValue: r(l),
      "onUpdate:modelValue": v[0] || (v[0] = (g) => q(l) ? l.value = g : null),
      type: f.value,
      step: y.value,
      counter: d.value,
      label: r(a),
      hint: r(u),
      rules: r(c),
      readonly: e.readonly
    }, null, 8, ["modelValue", "type", "step", "counter", "label", "hint", "rules", "readonly"]));
  }
}), vn = /* @__PURE__ */ w({
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
    const t = e, n = O(e, "modelValue"), { input: l, kind: o, label: a, hint: u, rules: c } = _(() => t.field, n, () => t.messages);
    return (i, f) => (b(), $(r(St), {
      modelValue: r(l),
      "onUpdate:modelValue": f[0] || (f[0] = (y) => q(l) ? l.value = y : null),
      class: pt({ "model-json-field": r(o) !== "longText" }),
      label: r(a),
      hint: r(u),
      rules: r(c),
      readonly: e.readonly,
      "auto-grow": "",
      rows: "3"
    }, null, 8, ["modelValue", "class", "label", "hint", "rules", "readonly"]));
  }
}), it = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [l, o] of t)
    n[l] = o;
  return n;
}, ue = /* @__PURE__ */ it(vn, [["__scopeId", "data-v-9ba3dee9"]]), ut = /* @__PURE__ */ w({
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
    const t = e, n = O(e, "modelValue"), l = {
      integer: K,
      number: K,
      text: K,
      date: K,
      time: K,
      datetime: K,
      longText: ue,
      json: ue,
      boolean: ln,
      enum: ie,
      multiEnum: ie,
      tags: ie,
      object: cn,
      objectList: fn
    }, o = ot(() => t.models), a = m(() => U(t.field)), u = m(() => {
      const i = Ct(t.field);
      return i !== void 0 ? o.value(i) : void 0;
    }), c = m(() => {
      if (a.value !== "unsupported")
        return (a.value === "object" || a.value === "objectList") && u.value === void 0 ? ue : l[a.value];
    });
    return (i, f) => c.value === void 0 ? (b(), $(r(Qe), {
      key: 0,
      "model-value": r(pe)(e.field, n.value),
      label: r(D)(e.field),
      hint: e.field.description,
      readonly: ""
    }, null, 8, ["model-value", "label", "hint"])) : u.value !== void 0 ? (b(), $(J(c.value), {
      key: 1,
      modelValue: n.value,
      "onUpdate:modelValue": f[0] || (f[0] = (y) => n.value = y),
      field: e.field,
      model: u.value,
      mode: e.mode,
      readonly: e.readonly,
      messages: e.messages
    }, null, 8, ["modelValue", "field", "model", "mode", "readonly", "messages"])) : (b(), $(J(c.value), {
      key: 2,
      modelValue: n.value,
      "onUpdate:modelValue": f[1] || (f[1] = (y) => n.value = y),
      field: e.field,
      readonly: e.readonly,
      messages: e.messages
    }, null, 8, ["modelValue", "field", "readonly", "messages"]));
  }
}), yn = {
  key: 1,
  class: "d-flex ga-2"
}, Mn = /* @__PURE__ */ w({
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
    hideActions: { type: Boolean },
    components: {}
  }, {
    modelValue: { required: !0 },
    modelModifiers: {}
  }),
  emits: /* @__PURE__ */ N(["submit", "cancel"], ["update:modelValue"]),
  setup(e, { expose: t, emit: n }) {
    const l = e, o = O(e, "modelValue"), a = n;
    ot(() => l.models);
    const u = on(() => l.components), c = $e(), i = m(() => Object.keys(c).filter((p) => p.startsWith("field."))), f = m(() => at(l.model)), y = m(() => ({
      submit: v,
      cancel: g,
      validate: s,
      mode: l.mode,
      record: o.value,
      submitText: l.submitText ?? f.value.submitText ?? "Save",
      cancelText: l.cancelText ?? f.value.cancelText ?? "Cancel"
    })), d = X();
    async function s() {
      return (await d.value?.validate())?.valid ?? !1;
    }
    async function v() {
      await s() && a("submit", o.value);
    }
    function g() {
      a("cancel");
    }
    return Y(() => l.mode, (p) => {
      p === "create" && (o.value = { ...Te(l.model), ...o.value });
    }, { immediate: !0 }), t({
      validate: s,
      resetValidation: () => d.value?.resetValidation()
    }), (p, A) => (b(), $(r(Mt), {
      ref_key: "form",
      ref: d,
      onSubmit: gt(v, ["prevent"])
    }, {
      default: h(() => [
        k(Ae, {
          modelValue: o.value,
          "onUpdate:modelValue": A[0] || (A[0] = (T) => o.value = T),
          model: e.model,
          mode: e.mode,
          fields: e.fields,
          exclude: e.exclude,
          messages: e.messages
        }, Ve({ _: 2 }, [
          r(c).default ? {
            name: "default",
            fn: h((T) => [
              z(p.$slots, "default", Z(de(T)))
            ]),
            key: "0"
          } : void 0,
          P(i.value, (T) => ({
            name: T,
            fn: h((S) => [
              z(p.$slots, T, Z(de(S)))
            ])
          }))
        ]), 1032, ["modelValue", "model", "mode", "fields", "exclude", "messages"]),
        e.mode !== "view" ? z(p.$slots, "actions", Z(te({ key: 0 }, y.value)), () => [
          e.hideActions ? I("", !0) : (b(), C(B, { key: 0 }, [
            f.value.actions !== void 0 ? (b(), $(J(r(u)(f.value.actions)), Z(te({ key: 0 }, y.value)), null, 16)) : (b(), C("div", yn, [
              k(r(Tt)),
              k(r(L), {
                variant: "text",
                onClick: g
              }, {
                default: h(() => [
                  F(j(y.value.cancelText), 1)
                ]),
                _: 1
              }),
              k(r(L), {
                type: "submit",
                color: "primary"
              }, {
                default: h(() => [
                  F(j(y.value.submitText), 1)
                ]),
                _: 1
              })
            ]))
          ], 64))
        ]) : I("", !0)
      ]),
      _: 3
    }, 512));
  }
}), pn = { class: "model-table-filters d-flex flex-wrap align-center ga-3" }, gn = {
  key: 0,
  class: "d-flex align-center"
}, bn = /* @__PURE__ */ w({
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
    const t = e, n = O(e, "filters"), l = O(e, "sort"), o = m(() => t.filterOptions.filter((s) => s.input === "value")), a = m(() => t.filterOptions.filter((s) => s.input === "switch")), u = m(() => t.filterOptions.some((s) => Fe(s, n.value[s.name])));
    function c(s, v) {
      const g = { ...n.value };
      v == null || v === "" || v === !1 ? delete g[s] : g[s] = v, n.value = g;
    }
    const i = m(() => t.sortOptions.find((s) => s.key === l.value[0]?.key)), f = m(() => t.sortOptions.map((s) => ({ title: Gt(t.model, s), value: s.key })));
    function y(s) {
      const v = t.sortOptions.find((g) => g.key === s);
      l.value = v !== void 0 ? [{ key: v.key, order: v.directions[0] }] : [];
    }
    function d() {
      const [s, ...v] = l.value;
      l.value = [{ key: s.key, order: s.order === "asc" ? "desc" : "asc" }, ...v];
    }
    return (s, v) => (b(), C("div", pn, [
      (b(!0), C(B, null, P(o.value, (g) => (b(), $(ut, {
        key: g.name,
        field: r(Zt)(e.model, g),
        "model-value": n.value[g.name] ?? null,
        class: "model-table-filter",
        density: "compact",
        variant: "outlined",
        "hide-details": "",
        clearable: "",
        "onUpdate:modelValue": (p) => c(g.name, p)
      }, null, 8, ["field", "model-value", "onUpdate:modelValue"]))), 128)),
      (b(!0), C(B, null, P(a.value, (g) => (b(), $(r(He), {
        key: g.name,
        label: r(lt)(e.model, g),
        "model-value": n.value[g.name] === !0,
        class: "flex-grow-0",
        density: "compact",
        "hide-details": "",
        "onUpdate:modelValue": (p) => c(g.name, p === !0)
      }, null, 8, ["label", "model-value", "onUpdate:modelValue"]))), 128)),
      e.sortOptions.length > 0 ? (b(), C("div", gn, [
        k(r(Xe), {
          "model-value": i.value?.key ?? null,
          items: f.value,
          label: "Sort by",
          class: "model-table-filter",
          density: "compact",
          variant: "outlined",
          "hide-details": "",
          clearable: "",
          "onUpdate:modelValue": y
        }, null, 8, ["model-value", "items"]),
        i.value !== void 0 && i.value.directions.length > 1 ? (b(), $(r(L), {
          key: 0,
          icon: l.value[0].order === "asc" ? "$sortAsc" : "$sortDesc",
          "aria-label": l.value[0].order === "asc" ? "Ascending" : "Descending",
          variant: "text",
          size: "small",
          onClick: d
        }, null, 8, ["icon", "aria-label"])) : I("", !0)
      ])) : I("", !0),
      u.value ? (b(), $(r(L), {
        key: 1,
        variant: "text",
        size: "small",
        onClick: v[0] || (v[0] = (g) => n.value = {})
      }, {
        default: h(() => [...v[1] || (v[1] = [
          F("Clear filters", -1)
        ])]),
        _: 1
      })) : I("", !0)
    ]));
  }
}), hn = /* @__PURE__ */ it(bn, [["__scopeId", "data-v-fe979876"]]), $n = { class: "model-table" }, Tn = /* @__PURE__ */ w({
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
    const n = e, l = O(e, "filters"), o = O(e, "sort"), a = O(e, "page"), u = O(e, "itemsPerPage"), c = t, i = $e(), f = /* @__PURE__ */ new Set(["integer", "number"]), y = /* @__PURE__ */ new Set(["json", "object", "objectList", "tags", "multiEnum", "unsupported"]), d = m(() => tt(n.model, n.fields, n.exclude)), s = m(() => Jt(n.model)), v = m(() => n.itemsLength !== void 0), g = m(() => s.value ? nt(n.model) : []), p = m(() => s.value ? Ne(n.model) : []), A = m(() => new Set(g.value.map((M) => M.field).filter(Boolean))), T = m(() => new Set(d.value.map((M) => M.name))), S = m(() => g.value.filter((M, x) => M.field === void 0 || !T.value.has(M.field) || g.value.findIndex((V) => V.field === M.field) !== x)), E = m(() => d.value.map((M) => {
      const x = U(M);
      return {
        title: D(M),
        key: M.name,
        align: f.has(x) ? "end" : "start",
        sortable: s.value ? A.value.has(M.name) : !y.has(x)
      };
    })), Ee = m({
      get: () => o.value,
      set: (M) => {
        o.value = M.map((x) => {
          const V = we(n.model, x.key)?.directions ?? ["asc", "desc"];
          return V.includes(x.order) ? x : { key: x.key, order: V[0] };
        });
      }
    }), je = m(() => ({ functions: n.functions, predicates: n.predicates })), Ce = m(() => Xt(n.model, n.items, l.value, je.value)), Ie = m(() => Qt(n.model, Ce.value, o.value, je.value)), dt = m(() => u.value <= 0 ? Ie.value : Ie.value.slice((a.value - 1) * u.value, a.value * u.value)), ct = m(() => !s.value || v.value ? n.items : dt.value), mt = m(() => s.value && !v.value ? Ce.value.length : n.itemsLength);
    Y(l, () => {
      a.value = 1;
    }, { deep: !0 }), Y([s, v, o, l, a, u], () => {
      s.value && v.value && c("update:query", en(n.model, { sort: o.value, filters: l.value, page: a.value, itemsPerPage: u.value }));
    }, { immediate: !0, deep: !0 });
    const ft = m(() => n.itemKey ?? Dt(n.model) ?? "id"), vt = m(() => new Set(d.value.map((M) => `item.${M.name}`))), yt = m(() => Object.keys(i).filter((M) => !vt.value.has(M)));
    return (M, x) => (b(), C("div", $n, [
      s.value && e.filterBar && (p.value.length > 0 || S.value.length > 0) ? (b(), $(hn, {
        key: 0,
        filters: l.value,
        "onUpdate:filters": x[0] || (x[0] = (V) => l.value = V),
        sort: o.value,
        "onUpdate:sort": x[1] || (x[1] = (V) => o.value = V),
        model: e.model,
        "filter-options": p.value,
        "sort-options": S.value,
        class: "mb-2"
      }, null, 8, ["filters", "sort", "model", "filter-options", "sort-options"])) : I("", !0),
      (b(), $(J(s.value || e.itemsLength !== void 0 ? r(xt) : r(Ot)), te(M.$attrs, {
        page: a.value,
        "onUpdate:page": x[2] || (x[2] = (V) => a.value = V),
        "items-per-page": u.value,
        "onUpdate:itemsPerPage": x[3] || (x[3] = (V) => u.value = V),
        headers: E.value,
        items: ct.value,
        "item-value": ft.value,
        "items-length": mt.value
      }, bt(s.value ? { "update:sortBy": (V) => {
        Ee.value = V;
      } } : {}), {
        "sort-by": s.value ? Ee.value : void 0
      }), Ve({ _: 2 }, [
        P(d.value, (V) => ({
          name: `item.${V.name}`,
          fn: h((G) => [
            z(M.$slots, `item.${V.name}`, te(G, {
              field: V,
              formatted: r(pe)(V, G.value, e.locale)
            }), () => [
              F(j(r(pe)(V, G.value, e.locale)), 1)
            ])
          ])
        })),
        P(yt.value, (V) => ({
          name: V,
          fn: h((G) => [
            z(M.$slots, V, Z(de(G ?? {})))
          ])
        }))
      ]), 1040, ["page", "items-per-page", "headers", "items", "item-value", "items-length", "sort-by"]))
    ]));
  }
});
export {
  be as FormComponentsKey,
  _e as INTEGER_RANGES,
  ln as ModelBooleanField,
  ut as ModelField,
  Ae as ModelFields,
  Mn as ModelForm,
  dn as ModelFormField,
  an as ModelInputControl,
  cn as ModelObjectField,
  fn as ModelObjectListField,
  ie as ModelSelectField,
  Tn as ModelTable,
  hn as ModelTableFilters,
  K as ModelTextField,
  ue as ModelTextareaField,
  Je as ModelsKey,
  Re as defaultMessages,
  Te as emptyRecord,
  Se as enumValues,
  R as fieldConstraints,
  U as fieldKind,
  D as fieldLabel,
  Oe as fieldRules,
  Zt as filterField,
  lt as filterLabel,
  Xt as filterRows,
  tn as formField,
  at as formOf,
  ae as formOptions,
  pe as formatValue,
  ye as fromInput,
  Jt as hasListOptions,
  se as humanize,
  qt as inputRules,
  It as isEditable,
  Q as isEmpty,
  Fe as isFilterOn,
  Me as isRequired,
  et as isVisible,
  Ne as listFilterOptions,
  en as listQuery,
  nt as listSortOptions,
  Dt as primaryKeyField,
  zt as recordErrors,
  Ct as referencedModel,
  xe as resolveMessages,
  tt as selectFields,
  Gt as sortLabel,
  we as sortOptionOf,
  _t as sortParameter,
  Qt as sortRows,
  Pe as toInput,
  ze as toResolver,
  _ as useFieldInput,
  sn as useFormComponents,
  un as useFormFields,
  ot as useModels
};
