import { inject as re, computed as m, isRef as K, provide as $e, ref as X, watch as J, defineComponent as A, mergeModels as N, useModel as x, createBlock as V, openBlock as b, unref as s, resolveDynamicComponent as G, h as ee, useSlots as Ve, createElementBlock as C, Fragment as q, renderSlot as Y, createVNode as M, withCtx as $, renderList as P, createTextVNode as w, toDisplayString as j, createCommentVNode as I, createSlots as ke, normalizeClass as $t, withModifiers as Vt, normalizeProps as Z, guardReactiveProps as ce, mergeProps as te, toHandlers as kt } from "vue";
import { VCheckbox as We, VRow as St, VCol as Mt, VAlert as Tt, VInput as Se, VCard as me, VCardItem as fe, VCardTitle as ve, VCardSubtitle as Xe, VBtn as L, VCardText as ye, VCombobox as Ot, VSelect as Qe, VTextField as _e, VTextarea as xt, VForm as Nt, VSpacer as Ft, VDataTableServer as wt, VDataTable as At } from "vuetify/components";
import { sortOptions as Et, filterOptions as jt } from "model-algebra-common";
const et = /* @__PURE__ */ new Map([
  ["integer", void 0],
  ["INT16", [-32768, 32767]],
  ["INT32", [-2147483648, 2147483647]],
  ["INT64", void 0]
]), Ct = /* @__PURE__ */ new Set(["number", "FLOAT32", "FLOAT64", "DECIMAL"]), It = /* @__PURE__ */ new Set(["string", "STRING", "UUID", "DURATION"]), Dt = /* @__PURE__ */ new Set(["DATETIME", "TIMESTAMP", "TIMESTAMP_TZ"]), Lt = /* @__PURE__ */ new Set(["JSON", "UNION", "object", "array"]);
function R(e) {
  const t = e.constraints;
  return t == null ? {} : Array.isArray(t) ? Object.fromEntries(t.map((n) => [n.name, n.value])) : t;
}
function Me(e) {
  const t = R(e).enum;
  if (Array.isArray(t)) return t;
  const n = e.type === "ARRAY" ? e.parameters?.items : e, l = n?.type === "ENUM" ? n.parameters?.values : void 0;
  return Array.isArray(l) ? l : void 0;
}
function ie(e) {
  const t = e.type;
  return et.has(t) ? "integer" : Ct.has(t) ? "number" : It.has(t) ? "text" : t === "TEXT" ? "longText" : t === "boolean" || t === "BOOLEAN" ? "boolean" : t === "ENUM" ? "enum" : t === "date" || t === "DATE" ? "date" : t === "TIME" ? "time" : Dt.has(t) ? "datetime" : t === "OBJECT" ? "object" : Lt.has(t) ? "json" : "unsupported";
}
function U(e) {
  if (e.type === "ARRAY") {
    if (Me(e) !== void 0) return "multiEnum";
    const t = e.parameters?.items, n = t !== void 0 ? ie(t) : "json";
    return n === "text" ? "tags" : n === "object" ? "objectList" : "json";
  }
  return R(e).enum !== void 0 && ie(e) === "text" ? "enum" : ie(e);
}
function Ut(e) {
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
function Te(e) {
  const t = R(e);
  return t.nullable === !1 || t.required === !0;
}
function tt(e, t) {
  return !(t === "create" && R(e).identity !== void 0);
}
function Pt(e, t) {
  if (t === "view" || U(e) === "unsupported") return !1;
  const n = R(e);
  return n.identity === "always" ? !1 : !(t === "edit" && (n.primaryKey === !0 || n.identity !== void 0));
}
function nt(e, t, n = []) {
  const l = new Map(e.fields.map((a) => [a.name, a]));
  return (t === void 0 ? e.fields : t.map((a) => {
    const u = l.get(a);
    if (u === void 0)
      throw new Error(`Model ${e.metadata.name} has no field ${a}`);
    return u;
  })).filter((a) => !n.includes(a.name));
}
function Rt(e) {
  const t = e.fields.find((l) => R(l).primaryKey === !0);
  if (t !== void 0) return t.name;
  const n = e.constraints?.find((l) => l.type === "primaryKey");
  return n?.fields?.length === 1 ? n.fields[0] : void 0;
}
function Oe(e) {
  return Object.fromEntries(e.fields.map((t) => {
    const n = R(t).default, l = n !== null && typeof n == "object" && "value" in n ? n.value : null;
    return [t.name, l];
  }));
}
const H = (e, t = 2) => String(e).padStart(t, "0"), Le = (e) => `${e.getFullYear()}-${H(e.getMonth() + 1)}-${H(e.getDate())}`, Ue = (e) => `${H(e.getHours())}:${H(e.getMinutes())}:${H(e.getSeconds())}`;
function Pe(e) {
  if (e instanceof Date) return e;
  if (typeof e == "string" && /(Z|[+-]\d\d:?\d\d)$/.test(e)) return new Date(e);
}
function Q(e) {
  return e == null || e === "" || Array.isArray(e) && e.length === 0;
}
function Re(e, t) {
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
      const l = Pe(t);
      return l !== void 0 ? Le(l) : String(t).slice(0, 10);
    }
    case "time":
      return t instanceof Date ? Ue(t) : String(t);
    case "datetime": {
      const l = Pe(t);
      return l !== void 0 ? `${Le(l)}T${Ue(l)}` : String(t).replace(" ", "T").slice(0, 19);
    }
    case "json":
    case "object":
    case "objectList":
      return JSON.stringify(t, null, 2);
    default:
      return String(t);
  }
}
function pe(e, t) {
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
const Bt = {
  "=": "equal to",
  "!=": "different from",
  "<": "less than",
  "<=": "at most",
  ">": "greater than",
  ">=": "at least"
}, Be = {
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
  check: (e, t, n) => `${e} must be ${Bt[t]} ${n}`
};
function xe(e) {
  return e === void 0 ? Be : { ...Be, ...e };
}
const qt = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, Kt = /^-?P(?!$)(\d+(\.\d+)?Y)?(\d+(\.\d+)?M)?(\d+(\.\d+)?W)?(\d+(\.\d+)?D)?(T(?=\d)(\d+(\.\d+)?H)?(\d+(\.\d+)?M)?(\d+(\.\d+)?S)?)?$/;
function zt(e) {
  const [t, n] = String(e).split("e"), l = t.split(".")[1]?.length ?? 0;
  return Math.max(0, l - Number(n ?? 0));
}
const Yt = (e) => e instanceof Date ? !Number.isNaN(e.getTime()) : !Number.isNaN(new Date(String(e)).getTime());
function Ne(e, t) {
  const n = xe(t), l = D(e), o = U(e), a = R(e), u = e.parameters ?? {}, c = [], i = (d, r) => c.push((v) => d(v) || r);
  if ((o === "integer" || o === "number") && i((d) => typeof d == "number" && Number.isFinite(d), n.number(l)), o === "integer") {
    i((r) => Number.isInteger(r), n.integer(l));
    const d = et.get(e.type);
    d !== void 0 && (i((r) => r >= d[0], n.min(l, d[0])), i((r) => r <= d[1], n.max(l, d[1])));
  }
  if (e.type === "DECIMAL" && typeof u.scale == "number" && i((d) => zt(d) <= u.scale, n.decimals(l, u.scale)), typeof a.min == "number" && i((d) => d >= a.min, n.min(l, a.min)), typeof a.max == "number" && i((d) => d <= a.max, n.max(l, a.max)), e.type === "STRING" && typeof u.length == "number" && i((d) => String(d).length <= u.length, n.maxLength(l, u.length)), e.type === "UUID" && i((d) => qt.test(String(d)), n.uuid(l)), e.type === "DURATION" && i((d) => Kt.test(String(d)), n.duration(l)), typeof a.regex == "string" && e.type !== "ARRAY") {
    const d = new RegExp(a.regex);
    i((r) => d.test(String(r)), n.pattern(l, a.regex));
  }
  const f = Me(e);
  f !== void 0 && i(
    (d) => Array.isArray(d) ? d.every((r) => f.includes(r)) : f.includes(d),
    n.oneOf(l, f)
  ), (o === "date" || o === "datetime") && i(Yt, n.date(l));
  const y = Te(e);
  return [(d) => {
    if (Q(d)) return y ? n.required(l) : !0;
    for (const r of c) {
      const v = r(d);
      if (v !== !0) return v;
    }
    return !0;
  }];
}
function Jt(e, t) {
  const n = xe(t), l = D(e), o = Ne(e, t);
  return [(a) => {
    const u = pe(e, a);
    if (!u.ok) return n[u.error](l);
    for (const c of o) {
      const i = c(u.value);
      if (i !== !0) return i;
    }
    return !0;
  }];
}
const qe = (e) => e instanceof Date ? e.getTime() : e;
function Gt(e, t, n) {
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
function Zt(e, t, n) {
  const l = xe(n), o = new Map(e.fields.map((c) => [c.name, c])), a = (c) => {
    const i = o.get(c);
    return i !== void 0 ? D(i) : c;
  }, u = [];
  for (const c of e.constraints ?? []) {
    if (c.type !== "check" || c.rule === void 0) continue;
    const i = c.rule, f = t[i.field], y = i.otherField !== void 0 ? t[i.otherField] : i.value;
    if (!(Q(f) || Q(y)) && !Gt(i.op, qe(f), qe(y))) {
      const d = i.otherField !== void 0 ? a(i.otherField) : String(i.value);
      u.push(l.check(a(i.field), i.op, d));
    }
  }
  return u;
}
const Ke = 60;
function ze(e) {
  if (e instanceof Date) return e;
  const t = String(e), n = /^(\d{4})-(\d{2})-(\d{2})$/.exec(t);
  return n !== null ? new Date(Number(n[1]), Number(n[2]) - 1, Number(n[3])) : new Date(t);
}
function ge(e, t, n) {
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
      const l = ze(t);
      return Number.isNaN(l.getTime()) ? String(t) : l.toLocaleDateString(n);
    }
    case "datetime": {
      const l = ze(t);
      return Number.isNaN(l.getTime()) ? String(t) : l.toLocaleString(n);
    }
    case "multiEnum":
    case "tags":
      return Array.isArray(t) ? t.join(", ") : String(t);
    case "json":
    case "object":
    case "objectList": {
      const l = JSON.stringify(t);
      return l.length > Ke ? `${l.slice(0, Ke - 1)}…` : l;
    }
    case "unsupported":
      return t instanceof Uint8Array ? `${t.length} bytes` : String(t);
    default:
      return String(t);
  }
}
function Ye(e) {
  if (typeof e == "function") return e;
  const t = new Map(Array.isArray(e) ? e.map((n) => [n.metadata.name, n]) : Object.entries(e));
  return (n) => t.get(n);
}
const Ht = { "=": "=", "!=": "≠", "<": "<", "<=": "≤", ">": ">", ">=": "≥" }, be = (e) => {
  const t = se(e);
  return t.charAt(0).toLowerCase() + t.slice(1);
};
function Wt(e) {
  return e.fields.some((t) => t.sortable !== void 0 || t.filterable !== void 0) || e.sortings !== void 0 || e.filters !== void 0;
}
const lt = (e) => Et(e), Fe = (e) => jt(e);
function ne(e, t) {
  return e.fields.find((n) => n.name === t);
}
function Xt(e, t) {
  if (t.field === void 0) return se(t.key);
  const n = D(ne(e, t.field));
  return t.definitionName === "" ? n : `${n}: ${be(t.definitionName)}`;
}
function at(e, t) {
  if (t.scope === "model") return se(t.name);
  const n = D(ne(e, t.field)), l = t.definitionName !== "" ? `${n}: ${be(t.definitionName)}` : n;
  if (t.predicate !== void 0) return t.definitionName !== "" ? l : `${n}: ${be(t.predicate)}`;
  const o = t.op === "=" && t.input === "value" ? "" : ` ${Ht[t.op]}`;
  if (t.input === "value") return `${l}${o}`;
  if (t.definitionName !== "") return l;
  const a = t.otherField !== void 0 ? D(ne(e, t.otherField)) : String(t.value);
  return `${n}${o} ${a}`;
}
function Qt(e, t) {
  const n = t.valueType === "field" || t.valueType === void 0 ? ne(e, t.field) : t.valueType;
  return {
    name: t.name,
    label: at(e, t),
    type: n.type,
    ...n.parameters !== void 0 ? { parameters: n.parameters } : {}
  };
}
function we(e, t) {
  return e.input === "switch" ? t === !0 : !Q(t);
}
function W(e, t, n, l) {
  const o = e?.[t];
  if (o === void 0) throw new Error(`No ${n} ${t}: give it to the table in ${n === "function" ? "functions" : "predicates"}`);
  return o(...l);
}
const le = (e) => e instanceof Date ? e.getTime() : e;
function _t(e, t, n) {
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
function en(e, t, n, l) {
  const o = e.input === "value" ? [n] : [];
  if (e.predicate !== void 0) {
    const i = e.scope === "field" ? [t[e.field], t, ...o] : [t, ...o];
    return W(l.predicates, e.predicate, "predicate", i) === !0;
  }
  const a = t[e.field], u = e.function !== void 0 ? W(l.functions, e.function, "function", [a, t]) : a, c = e.input === "value" ? n : e.otherField !== void 0 ? t[e.otherField] : e.value;
  return _t(u, e.op, c);
}
function tn(e, t, n, l = {}) {
  const o = Fe(e).filter((a) => we(a, n[a.name]));
  return o.length === 0 ? t : t.filter((a) => o.every((u) => en(u, a, n[u.name], l)));
}
function Je(e, t, n, l = "last") {
  const o = e == null, a = t == null;
  if (o || a) return o === a ? 0 : o === (l === "first") ? -1 : 1;
  const u = le(e), c = le(t);
  return (typeof u == "string" && typeof c == "string" ? u.localeCompare(c) : u < c ? -1 : u > c ? 1 : 0) * n;
}
function ae(e, t) {
  const n = lt(e);
  return n.find((l) => l.key === t) ?? n.find((l) => l.field === t);
}
function nn(e, t, n, l = {}) {
  const o = n.map((a) => {
    const u = ae(e, a.key);
    if (u === void 0) throw new Error(`Model ${e.metadata.name} can't be sorted by ${a.key}`);
    const c = a.order === "desc" ? -1 : 1;
    if (u.sortKeys !== void 0) {
      const d = u.sortKeys.map((r) => ({
        value: (v) => r.field === void 0 ? W(l.functions, r.function, "function", [v]) : r.function !== void 0 ? W(l.functions, r.function, "function", [v[r.field], v]) : v[r.field],
        sign: r.direction === "desc" ? -1 : 1,
        nulls: r.nulls
      }));
      return (r, v) => {
        for (const g of d) {
          const p = Je(g.value(r), g.value(v), g.sign * c, g.nulls);
          if (p !== 0) return p;
        }
        return 0;
      };
    }
    const { field: i, definition: f } = u, y = (d) => f.function !== void 0 ? W(l.functions, f.function, "function", [d[i], d]) : d[i];
    return (d, r) => Je(y(d), y(r), c, f.nulls);
  });
  return o.length === 0 ? t : [...t].sort((a, u) => {
    for (const c of o) {
      const i = c(a, u);
      if (i !== 0) return i;
    }
    return 0;
  });
}
function ln(e, t) {
  return t.map((n) => {
    const l = ae(e, n.key);
    if (l === void 0) throw new Error(`Model ${e.metadata.name} can't be sorted by ${n.key}`);
    return n.order === "desc" ? `-${l.key}` : l.key;
  });
}
function an(e, t) {
  const n = {};
  t.itemsPerPage > 0 && (n.limit = t.itemsPerPage, n.offset = (t.page - 1) * t.itemsPerPage);
  const l = ln(e, t.sort);
  l.length > 0 && (n.sort = l.join(","));
  for (const o of Fe(e))
    we(o, t.filters[o.name]) && (n[o.name] = t.filters[o.name]);
  return n;
}
const oe = (e) => e.form ?? {}, ot = (e) => e.form ?? {};
function on(e) {
  const { label: t, hint: n } = oe(e);
  return t === void 0 && n === void 0 ? e : Object.assign(Object.create(Object.getPrototypeOf(e)), e, {
    ...t !== void 0 ? { label: t } : {},
    ...n !== void 0 ? { description: n } : {}
  });
}
const Ge = /* @__PURE__ */ Symbol("vuetify-bridge models"), rn = () => {
};
function rt(e) {
  const t = re(Ge, void 0), n = m(() => {
    const l = e();
    return l !== void 0 ? Ye(l) : t === void 0 ? rn : K(t) ? t.value : Ye(t);
  });
  return $e(Ge, n), n;
}
const Ze = (e, t) => e === t || JSON.stringify(e) === JSON.stringify(t);
function _(e, t, n) {
  const l = X(Re(e(), t.value));
  return J(l, (o) => {
    const a = pe(e(), o);
    a.ok && !Ze(a.value, t.value) && (t.value = a.value);
  }), J([t, e], ([o]) => {
    const a = pe(e(), l.value);
    (!a.ok || !Ze(a.value, o)) && (l.value = Re(e(), o));
  }, { deep: !0 }), {
    input: l,
    kind: m(() => U(e())),
    label: m(() => D(e())),
    hint: m(() => e().description),
    required: m(() => Te(e())),
    rules: m(() => Jt(e(), n()))
  };
}
const sn = /* @__PURE__ */ A({
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
    const t = e, n = x(e, "modelValue"), { input: l, label: o, hint: a, rules: u } = _(() => t.field, n, () => t.messages);
    return (c, i) => (b(), V(s(We), {
      modelValue: s(l),
      "onUpdate:modelValue": i[0] || (i[0] = (f) => K(l) ? l.value = f : null),
      label: s(o),
      hint: s(a),
      "persistent-hint": s(a) !== void 0,
      rules: s(u),
      readonly: e.readonly
    }, null, 8, ["modelValue", "label", "hint", "persistent-hint", "rules", "readonly"]));
  }
}), un = /* @__PURE__ */ A({
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
    const t = e, n = x(e, "modelValue"), { input: l, label: o, hint: a, rules: u } = _(() => t.field, n, () => t.messages);
    return (c, i) => (b(), V(G(e.control), {
      modelValue: s(l),
      "onUpdate:modelValue": i[0] || (i[0] = (f) => K(l) ? l.value = f : null),
      label: s(o),
      hint: s(a),
      rules: s(u),
      readonly: e.readonly
    }, null, 8, ["modelValue", "label", "hint", "rules", "readonly"]));
  }
}), he = /* @__PURE__ */ Symbol("FormComponents"), st = (e) => (t) => typeof t != "string" ? t : e()[t] ?? G(t);
function dn(e) {
  const t = re(he, {}), n = m(() => ({ ...s(t), ...e() }));
  return $e(he, n), st(() => n.value);
}
function cn() {
  const e = re(he, {});
  return st(() => s(e));
}
const it = /* @__PURE__ */ Symbol("FormFields");
function mn(e) {
  $e(it, e);
}
function fn() {
  const e = re(it, void 0);
  if (e === void 0) throw new Error("ModelFormField must be inside a ModelForm or ModelFields");
  return e;
}
function He(e, t) {
  if (typeof e == "string") return !1;
  const n = e.props;
  return Array.isArray(n) ? n.includes(t) : typeof n == "object" && n !== null && t in n;
}
const vn = A({
  name: "ModelFormField",
  inheritAttrs: !1,
  props: {
    /** Name of the field. */
    name: { type: String, required: !0 },
    /** The field itself, instead of looking it up by name. */
    field: { type: Object, default: void 0 }
  },
  setup(e, { attrs: t }) {
    const n = fn(), l = cn(), o = m(() => {
      if (e.field !== void 0) return e.field;
      const a = n.model(), u = a.fields.find((c) => c.name === e.name);
      if (u === void 0) throw new Error(`Model ${a.metadata.name} has no field ${e.name}`);
      return u;
    });
    return () => {
      const a = oe(o.value), u = on(o.value), c = n.mode();
      if (a.hidden === !0 || !tt(u, c)) return null;
      const i = n.record.value[u.name], f = (g) => n.update(u.name, g), y = !Pt(u, c), d = n.messages(), r = n.slots[`field.${u.name}`], v = () => {
        if (r !== void 0) return r({ field: u, value: i, update: f, readonly: y });
        const g = { ...a.props, ...t, modelValue: i, "onUpdate:modelValue": f, field: u, readonly: y, messages: d };
        if (a.control === void 0) return ee(dt, { ...g, mode: c });
        const p = l(a.control);
        return He(p, "field") ? ee(p, He(p, "mode") ? { ...g, mode: c } : g) : ee(un, { ...g, control: p });
      };
      return a.row === void 0 ? v() : ee(
        l(a.row),
        { field: u, value: i, update: f, readonly: y, mode: c, record: n.record.value },
        { default: v }
      );
    };
  }
}), Ae = /* @__PURE__ */ A({
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
    const t = e, n = x(e, "modelValue"), l = Ve(), o = m(() => nt(t.model, t.fields ?? ot(t.model).order, t.exclude).filter((y) => tt(y, t.mode) && oe(y).hidden !== !0)), a = m(() => Zt(t.model, n.value, t.messages)), u = [() => a.value.length === 0 || a.value[0]], c = /* @__PURE__ */ new Set(["longText", "json", "tags", "multiEnum", "object", "objectList"]), i = (y) => oe(y).cols ?? (c.has(U(y)) ? 12 : 6);
    function f(y, d) {
      n.value = { ...n.value, [y]: d };
    }
    return mn({
      model: () => t.model,
      record: n,
      update: f,
      mode: () => t.mode,
      messages: () => t.messages,
      slots: l
    }), (y, d) => (b(), C(q, null, [
      Y(y.$slots, "default", {
        fields: o.value,
        record: n.value,
        update: f,
        mode: e.mode
      }, () => [
        M(s(St), null, {
          default: $(() => [
            (b(!0), C(q, null, P(o.value, (r) => (b(), V(s(Mt), {
              key: r.name,
              cols: "12",
              md: i(r)
            }, {
              default: $(() => [
                M(s(vn), {
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
      (b(!0), C(q, null, P(a.value, (r) => (b(), V(s(Tt), {
        key: r,
        type: "error",
        variant: "tonal",
        density: "compact",
        class: "mb-2"
      }, {
        default: $(() => [
          w(j(r), 1)
        ]),
        _: 2
      }, 1024))), 128)),
      M(s(Se), {
        "model-value": n.value,
        rules: u,
        class: "d-none",
        "hide-details": ""
      }, null, 8, ["model-value"])
    ], 64));
  }
}), yn = /* @__PURE__ */ A({
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
    const t = e, n = x(e, "modelValue"), l = m(() => D(t.field)), o = m(() => Te(t.field)), a = m(() => Ne(t.field, t.messages)), u = X(!1), c = m(() => t.readonly ? "view" : u.value ? "create" : t.mode ?? "edit");
    function i() {
      u.value = !0, n.value = Oe(t.model);
    }
    function f() {
      u.value = !1, n.value = null;
    }
    return (y, d) => (b(), V(s(Se), {
      "model-value": n.value,
      rules: a.value,
      class: "model-object-field"
    }, {
      default: $(() => [
        M(s(me), {
          variant: "outlined",
          class: "w-100"
        }, {
          default: $(() => [
            M(s(fe), null, {
              append: $(() => [
                n.value == null && !e.readonly ? (b(), V(s(L), {
                  key: 0,
                  variant: "tonal",
                  size: "small",
                  "prepend-icon": "$plus",
                  onClick: i
                }, {
                  default: $(() => [...d[1] || (d[1] = [
                    w("Add", -1)
                  ])]),
                  _: 1
                })) : n.value != null && !e.readonly && !o.value ? (b(), V(s(L), {
                  key: 1,
                  variant: "text",
                  size: "small",
                  "prepend-icon": "$delete",
                  onClick: f
                }, {
                  default: $(() => [...d[2] || (d[2] = [
                    w("Remove", -1)
                  ])]),
                  _: 1
                })) : I("", !0)
              ]),
              default: $(() => [
                M(s(ve), { class: "text-body-1" }, {
                  default: $(() => [
                    w(j(l.value), 1)
                  ]),
                  _: 1
                }),
                e.field.description ? (b(), V(s(Xe), { key: 0 }, {
                  default: $(() => [
                    w(j(e.field.description), 1)
                  ]),
                  _: 1
                })) : I("", !0)
              ]),
              _: 1
            }),
            n.value != null ? (b(), V(s(ye), { key: 0 }, {
              default: $(() => [
                M(Ae, {
                  modelValue: n.value,
                  "onUpdate:modelValue": d[0] || (d[0] = (r) => n.value = r),
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
}), pn = {
  key: 0,
  class: "text-medium-emphasis"
}, gn = /* @__PURE__ */ A({
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
    const t = e, n = x(e, "modelValue"), l = m(() => n.value ?? []), o = m(() => D(t.field)), a = m(() => D({ name: t.model.metadata.name })), u = m(() => Ne(t.field, t.messages));
    let c = 0;
    const i = X([]), f = X(/* @__PURE__ */ new Set());
    J(() => l.value.length, (p) => {
      i.value.length !== p && (i.value = Array.from({ length: p }, () => c++));
    }, { immediate: !0 });
    const y = (p) => t.readonly ? "view" : f.value.has(i.value[p]) ? "create" : t.mode ?? "edit";
    function d(p, E) {
      n.value = l.value.map((O, T) => T === p ? E : O);
    }
    function r() {
      const p = c++;
      i.value = [...i.value, p], f.value = new Set(f.value).add(p), n.value = [...l.value, Oe(t.model)];
    }
    function v(p) {
      i.value = i.value.filter((E, O) => O !== p), n.value = l.value.filter((E, O) => O !== p);
    }
    function g(p, E) {
      const O = (T) => {
        const F = [...T];
        return [F[p], F[p + E]] = [F[p + E], F[p]], F;
      };
      i.value = O(i.value), n.value = O(l.value);
    }
    return (p, E) => (b(), V(s(Se), {
      "model-value": l.value,
      rules: u.value,
      class: "model-object-list-field"
    }, {
      default: $(() => [
        M(s(me), {
          variant: "outlined",
          class: "w-100"
        }, {
          default: $(() => [
            M(s(fe), null, {
              append: $(() => [
                e.readonly ? I("", !0) : (b(), V(s(L), {
                  key: 0,
                  variant: "tonal",
                  size: "small",
                  "prepend-icon": "$plus",
                  onClick: r
                }, {
                  default: $(() => [
                    w(" Add " + j(a.value.toLowerCase()), 1)
                  ]),
                  _: 1
                }))
              ]),
              default: $(() => [
                M(s(ve), { class: "text-body-1" }, {
                  default: $(() => [
                    w(j(o.value), 1)
                  ]),
                  _: 1
                }),
                e.field.description ? (b(), V(s(Xe), { key: 0 }, {
                  default: $(() => [
                    w(j(e.field.description), 1)
                  ]),
                  _: 1
                })) : I("", !0)
              ]),
              _: 1
            }),
            M(s(ye), null, {
              default: $(() => [
                l.value.length === 0 ? (b(), C("p", pn, "No " + j(a.value.toLowerCase()) + " items.", 1)) : I("", !0),
                (b(!0), C(q, null, P(l.value, (O, T) => (b(), V(s(me), {
                  key: i.value[T],
                  variant: "tonal",
                  class: "mb-3",
                  "aria-label": `${a.value} ${T + 1}`
                }, {
                  default: $(() => [
                    M(s(fe), null, ke({
                      default: $(() => [
                        M(s(ve), { class: "text-body-2" }, {
                          default: $(() => [
                            w(j(a.value) + " " + j(T + 1), 1)
                          ]),
                          _: 2
                        }, 1024)
                      ]),
                      _: 2
                    }, [
                      e.readonly ? void 0 : {
                        name: "append",
                        fn: $(() => [
                          M(s(L), {
                            icon: "$expand",
                            variant: "text",
                            size: "small",
                            disabled: T === l.value.length - 1,
                            "aria-label": `Move ${a.value} ${T + 1} down`,
                            onClick: (F) => g(T, 1)
                          }, null, 8, ["disabled", "aria-label", "onClick"]),
                          M(s(L), {
                            icon: "$collapse",
                            variant: "text",
                            size: "small",
                            disabled: T === 0,
                            "aria-label": `Move ${a.value} ${T + 1} up`,
                            onClick: (F) => g(T, -1)
                          }, null, 8, ["disabled", "aria-label", "onClick"]),
                          M(s(L), {
                            icon: "$delete",
                            variant: "text",
                            size: "small",
                            "aria-label": `Remove ${a.value} ${T + 1}`,
                            onClick: (F) => v(T)
                          }, null, 8, ["aria-label", "onClick"])
                        ]),
                        key: "0"
                      }
                    ]), 1024),
                    M(s(ye), null, {
                      default: $(() => [
                        M(Ae, {
                          "model-value": O,
                          model: e.model,
                          mode: y(T),
                          messages: e.messages,
                          "onUpdate:modelValue": (F) => d(T, F)
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
}), ue = /* @__PURE__ */ A({
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
    const t = e, n = x(e, "modelValue"), { input: l, kind: o, label: a, hint: u, required: c, rules: i } = _(() => t.field, n, () => t.messages), f = m(() => Me(t.field) ?? []);
    return (y, d) => s(o) === "tags" ? (b(), V(s(Ot), {
      key: 0,
      modelValue: s(l),
      "onUpdate:modelValue": d[0] || (d[0] = (r) => K(l) ? l.value = r : null),
      label: s(a),
      hint: s(u),
      rules: s(i),
      readonly: e.readonly,
      multiple: "",
      chips: "",
      "closable-chips": "",
      "hide-no-data": ""
    }, null, 8, ["modelValue", "label", "hint", "rules", "readonly"])) : (b(), V(s(Qe), {
      key: 1,
      modelValue: s(l),
      "onUpdate:modelValue": d[1] || (d[1] = (r) => K(l) ? l.value = r : null),
      items: f.value,
      multiple: s(o) === "multiEnum",
      chips: s(o) === "multiEnum",
      clearable: !s(c) && !e.readonly,
      label: s(a),
      hint: s(u),
      rules: s(i),
      readonly: e.readonly
    }, null, 8, ["modelValue", "items", "multiple", "chips", "clearable", "label", "hint", "rules", "readonly"]));
  }
}), z = /* @__PURE__ */ A({
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
    const t = e, n = x(e, "modelValue"), { input: l, kind: o, label: a, hint: u, rules: c } = _(() => t.field, n, () => t.messages), i = {
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
    return (r, v) => (b(), V(s(_e), {
      modelValue: s(l),
      "onUpdate:modelValue": v[0] || (v[0] = (g) => K(l) ? l.value = g : null),
      type: f.value,
      step: y.value,
      counter: d.value,
      label: s(a),
      hint: s(u),
      rules: s(c),
      readonly: e.readonly
    }, null, 8, ["modelValue", "type", "step", "counter", "label", "hint", "rules", "readonly"]));
  }
}), bn = /* @__PURE__ */ A({
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
    const t = e, n = x(e, "modelValue"), { input: l, kind: o, label: a, hint: u, rules: c } = _(() => t.field, n, () => t.messages);
    return (i, f) => (b(), V(s(xt), {
      modelValue: s(l),
      "onUpdate:modelValue": f[0] || (f[0] = (y) => K(l) ? l.value = y : null),
      class: $t({ "model-json-field": s(o) !== "longText" }),
      label: s(a),
      hint: s(u),
      rules: s(c),
      readonly: e.readonly,
      "auto-grow": "",
      rows: "3"
    }, null, 8, ["modelValue", "class", "label", "hint", "rules", "readonly"]));
  }
}), ut = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [l, o] of t)
    n[l] = o;
  return n;
}, de = /* @__PURE__ */ ut(bn, [["__scopeId", "data-v-9ba3dee9"]]), dt = /* @__PURE__ */ A({
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
      integer: z,
      number: z,
      text: z,
      date: z,
      time: z,
      datetime: z,
      longText: de,
      json: de,
      boolean: sn,
      enum: ue,
      multiEnum: ue,
      tags: ue,
      object: yn,
      objectList: gn
    }, o = rt(() => t.models), a = m(() => U(t.field)), u = m(() => {
      const i = Ut(t.field);
      return i !== void 0 ? o.value(i) : void 0;
    }), c = m(() => {
      if (a.value !== "unsupported")
        return (a.value === "object" || a.value === "objectList") && u.value === void 0 ? de : l[a.value];
    });
    return (i, f) => c.value === void 0 ? (b(), V(s(_e), {
      key: 0,
      "model-value": s(ge)(e.field, n.value),
      label: s(D)(e.field),
      hint: e.field.description,
      readonly: ""
    }, null, 8, ["model-value", "label", "hint"])) : u.value !== void 0 ? (b(), V(G(c.value), {
      key: 1,
      modelValue: n.value,
      "onUpdate:modelValue": f[0] || (f[0] = (y) => n.value = y),
      field: e.field,
      model: u.value,
      mode: e.mode,
      readonly: e.readonly,
      messages: e.messages
    }, null, 8, ["modelValue", "field", "model", "mode", "readonly", "messages"])) : (b(), V(G(c.value), {
      key: 2,
      modelValue: n.value,
      "onUpdate:modelValue": f[1] || (f[1] = (y) => n.value = y),
      field: e.field,
      readonly: e.readonly,
      messages: e.messages
    }, null, 8, ["modelValue", "field", "readonly", "messages"]));
  }
}), hn = {
  key: 1,
  class: "d-flex ga-2"
}, Nn = /* @__PURE__ */ A({
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
    const l = e, o = x(e, "modelValue"), a = n;
    rt(() => l.models);
    const u = dn(() => l.components), c = Ve(), i = m(() => Object.keys(c).filter((p) => p.startsWith("field."))), f = m(() => ot(l.model)), y = m(() => ({
      submit: v,
      cancel: g,
      validate: r,
      mode: l.mode,
      record: o.value,
      submitText: l.submitText ?? f.value.submitText ?? "Save",
      cancelText: l.cancelText ?? f.value.cancelText ?? "Cancel"
    })), d = X();
    async function r() {
      return (await d.value?.validate())?.valid ?? !1;
    }
    async function v() {
      await r() && a("submit", o.value);
    }
    function g() {
      a("cancel");
    }
    return J(() => l.mode, (p) => {
      p === "create" && (o.value = { ...Oe(l.model), ...o.value });
    }, { immediate: !0 }), t({
      validate: r,
      resetValidation: () => d.value?.resetValidation()
    }), (p, E) => (b(), V(s(Nt), {
      ref_key: "form",
      ref: d,
      onSubmit: Vt(v, ["prevent"])
    }, {
      default: $(() => [
        M(Ae, {
          modelValue: o.value,
          "onUpdate:modelValue": E[0] || (E[0] = (O) => o.value = O),
          model: e.model,
          mode: e.mode,
          fields: e.fields,
          exclude: e.exclude,
          messages: e.messages
        }, ke({ _: 2 }, [
          s(c).default ? {
            name: "default",
            fn: $((O) => [
              Y(p.$slots, "default", Z(ce(O)))
            ]),
            key: "0"
          } : void 0,
          P(i.value, (O) => ({
            name: O,
            fn: $((T) => [
              Y(p.$slots, O, Z(ce(T)))
            ])
          }))
        ]), 1032, ["modelValue", "model", "mode", "fields", "exclude", "messages"]),
        e.mode !== "view" ? Y(p.$slots, "actions", Z(te({ key: 0 }, y.value)), () => [
          e.hideActions ? I("", !0) : (b(), C(q, { key: 0 }, [
            f.value.actions !== void 0 ? (b(), V(G(s(u)(f.value.actions)), Z(te({ key: 0 }, y.value)), null, 16)) : (b(), C("div", hn, [
              M(s(Ft)),
              M(s(L), {
                variant: "text",
                onClick: g
              }, {
                default: $(() => [
                  w(j(y.value.cancelText), 1)
                ]),
                _: 1
              }),
              M(s(L), {
                type: "submit",
                color: "primary"
              }, {
                default: $(() => [
                  w(j(y.value.submitText), 1)
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
}), $n = { class: "model-table-filters d-flex flex-wrap align-center ga-3" }, Vn = {
  key: 0,
  class: "d-flex align-center"
}, kn = /* @__PURE__ */ A({
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
    const t = e, n = x(e, "filters"), l = x(e, "sort"), o = m(() => t.filterOptions.filter((r) => r.input === "value")), a = m(() => t.filterOptions.filter((r) => r.input === "switch")), u = m(() => t.filterOptions.some((r) => we(r, n.value[r.name])));
    function c(r, v) {
      const g = { ...n.value };
      v == null || v === "" || v === !1 ? delete g[r] : g[r] = v, n.value = g;
    }
    const i = m(() => t.sortOptions.find((r) => r.key === l.value[0]?.key)), f = m(() => t.sortOptions.map((r) => ({ title: Xt(t.model, r), value: r.key })));
    function y(r) {
      const v = t.sortOptions.find((g) => g.key === r);
      l.value = v !== void 0 ? [{ key: v.key, order: v.directions[0] }] : [];
    }
    function d() {
      const [r, ...v] = l.value;
      l.value = [{ key: r.key, order: r.order === "asc" ? "desc" : "asc" }, ...v];
    }
    return (r, v) => (b(), C("div", $n, [
      (b(!0), C(q, null, P(o.value, (g) => (b(), V(dt, {
        key: g.name,
        field: s(Qt)(e.model, g),
        "model-value": n.value[g.name] ?? null,
        class: "model-table-filter",
        density: "compact",
        variant: "outlined",
        "hide-details": "",
        clearable: "",
        "onUpdate:modelValue": (p) => c(g.name, p)
      }, null, 8, ["field", "model-value", "onUpdate:modelValue"]))), 128)),
      (b(!0), C(q, null, P(a.value, (g) => (b(), V(s(We), {
        key: g.name,
        label: s(at)(e.model, g),
        "model-value": n.value[g.name] === !0,
        class: "flex-grow-0",
        density: "compact",
        "hide-details": "",
        "onUpdate:modelValue": (p) => c(g.name, p === !0)
      }, null, 8, ["label", "model-value", "onUpdate:modelValue"]))), 128)),
      e.sortOptions.length > 0 ? (b(), C("div", Vn, [
        M(s(Qe), {
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
        i.value !== void 0 && i.value.directions.length > 1 ? (b(), V(s(L), {
          key: 0,
          icon: l.value[0].order === "asc" ? "$sortAsc" : "$sortDesc",
          "aria-label": l.value[0].order === "asc" ? "Ascending" : "Descending",
          variant: "text",
          size: "small",
          onClick: d
        }, null, 8, ["icon", "aria-label"])) : I("", !0)
      ])) : I("", !0),
      u.value ? (b(), V(s(L), {
        key: 1,
        variant: "text",
        size: "small",
        onClick: v[0] || (v[0] = (g) => n.value = {})
      }, {
        default: $(() => [...v[1] || (v[1] = [
          w("Clear filters", -1)
        ])]),
        _: 1
      })) : I("", !0)
    ]));
  }
}), Sn = /* @__PURE__ */ ut(kn, [["__scopeId", "data-v-fe979876"]]), Mn = { class: "model-table" }, Fn = /* @__PURE__ */ A({
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
    const n = e, l = x(e, "filters"), o = x(e, "sort"), a = x(e, "page"), u = x(e, "itemsPerPage"), c = t, i = Ve(), f = /* @__PURE__ */ new Set(["integer", "number"]), y = /* @__PURE__ */ new Set(["json", "object", "objectList", "tags", "multiEnum", "unsupported"]), d = m(() => nt(n.model, n.fields, n.exclude)), r = m(() => Wt(n.model)), v = m(() => n.itemsLength !== void 0), g = m(() => r.value ? lt(n.model) : []), p = m(() => r.value ? Fe(n.model) : []), E = m(() => new Set(g.value.map((h) => h.field).filter(Boolean))), O = m(() => new Set(d.value.map((h) => h.name))), T = (h) => g.value.find((k) => k.key === h) ?? g.value.find((k) => k.field === h), F = m(() => g.value.filter((h) => h.field === void 0 || !O.value.has(h.field) ? !0 : h.key !== T(h.field)?.key)), ct = m(() => d.value.map((h) => {
      const k = U(h);
      return {
        title: D(h),
        key: h.name,
        align: f.has(k) ? "end" : "start",
        sortable: r.value ? E.value.has(h.name) : !y.has(k)
      };
    }));
    function mt(h, k) {
      if (k === void 0) return h.directions[0];
      const S = k === "asc" ? "desc" : "asc";
      return h.directions.includes(S) ? S : void 0;
    }
    const Ee = m({
      get: () => o.value.map((h) => {
        const k = ae(n.model, h.key)?.field;
        return k !== void 0 && O.value.has(k) ? { key: k, order: h.order } : h;
      }),
      set: (h) => {
        o.value = h.flatMap((k) => {
          const S = T(k.key);
          if (S === void 0) return [k];
          const B = o.value.find((ht) => ae(n.model, ht.key)?.field === k.key), De = mt(S, B?.order);
          return De === void 0 ? [] : [{ key: k.key, order: De }];
        });
      }
    }), je = m(() => ({ functions: n.functions, predicates: n.predicates })), Ce = m(() => tn(n.model, n.items, l.value, je.value)), Ie = m(() => nn(n.model, Ce.value, o.value, je.value)), ft = m(() => u.value <= 0 ? Ie.value : Ie.value.slice((a.value - 1) * u.value, a.value * u.value)), vt = m(() => !r.value || v.value ? n.items : ft.value), yt = m(() => r.value && !v.value ? Ce.value.length : n.itemsLength);
    J(l, () => {
      a.value = 1;
    }, { deep: !0 }), J([r, v, o, l, a, u], () => {
      r.value && v.value && c("update:query", an(n.model, { sort: o.value, filters: l.value, page: a.value, itemsPerPage: u.value }));
    }, { immediate: !0, deep: !0 });
    const pt = m(() => n.itemKey ?? Rt(n.model) ?? "id"), gt = m(() => new Set(d.value.map((h) => `item.${h.name}`))), bt = m(() => Object.keys(i).filter((h) => !gt.value.has(h)));
    return (h, k) => (b(), C("div", Mn, [
      r.value && e.filterBar && (p.value.length > 0 || F.value.length > 0) ? (b(), V(Sn, {
        key: 0,
        filters: l.value,
        "onUpdate:filters": k[0] || (k[0] = (S) => l.value = S),
        sort: o.value,
        "onUpdate:sort": k[1] || (k[1] = (S) => o.value = S),
        model: e.model,
        "filter-options": p.value,
        "sort-options": F.value,
        class: "mb-2"
      }, null, 8, ["filters", "sort", "model", "filter-options", "sort-options"])) : I("", !0),
      (b(), V(G(r.value || e.itemsLength !== void 0 ? s(wt) : s(At)), te(h.$attrs, {
        page: a.value,
        "onUpdate:page": k[2] || (k[2] = (S) => a.value = S),
        "items-per-page": u.value,
        "onUpdate:itemsPerPage": k[3] || (k[3] = (S) => u.value = S),
        headers: ct.value,
        items: vt.value,
        "item-value": pt.value,
        "items-length": yt.value
      }, kt(r.value ? { "update:sortBy": (S) => {
        Ee.value = S;
      } } : {}), {
        "sort-by": r.value ? Ee.value : void 0
      }), ke({ _: 2 }, [
        P(d.value, (S) => ({
          name: `item.${S.name}`,
          fn: $((B) => [
            Y(h.$slots, `item.${S.name}`, te(B, {
              field: S,
              formatted: s(ge)(S, B.value, e.locale)
            }), () => [
              w(j(s(ge)(S, B.value, e.locale)), 1)
            ])
          ])
        })),
        P(bt.value, (S) => ({
          name: S,
          fn: $((B) => [
            Y(h.$slots, S, Z(ce(B ?? {})))
          ])
        }))
      ]), 1040, ["page", "items-per-page", "headers", "items", "item-value", "items-length", "sort-by"]))
    ]));
  }
});
export {
  he as FormComponentsKey,
  et as INTEGER_RANGES,
  sn as ModelBooleanField,
  dt as ModelField,
  Ae as ModelFields,
  Nn as ModelForm,
  vn as ModelFormField,
  un as ModelInputControl,
  yn as ModelObjectField,
  gn as ModelObjectListField,
  ue as ModelSelectField,
  Fn as ModelTable,
  Sn as ModelTableFilters,
  z as ModelTextField,
  de as ModelTextareaField,
  Ge as ModelsKey,
  Be as defaultMessages,
  Oe as emptyRecord,
  Me as enumValues,
  R as fieldConstraints,
  U as fieldKind,
  D as fieldLabel,
  Ne as fieldRules,
  Qt as filterField,
  at as filterLabel,
  tn as filterRows,
  on as formField,
  ot as formOf,
  oe as formOptions,
  ge as formatValue,
  pe as fromInput,
  Wt as hasListOptions,
  se as humanize,
  Jt as inputRules,
  Pt as isEditable,
  Q as isEmpty,
  we as isFilterOn,
  Te as isRequired,
  tt as isVisible,
  Fe as listFilterOptions,
  an as listQuery,
  lt as listSortOptions,
  Rt as primaryKeyField,
  Zt as recordErrors,
  Ut as referencedModel,
  xe as resolveMessages,
  nt as selectFields,
  Xt as sortLabel,
  ae as sortOptionOf,
  ln as sortParameter,
  nn as sortRows,
  Re as toInput,
  Ye as toResolver,
  _ as useFieldInput,
  cn as useFormComponents,
  fn as useFormFields,
  rt as useModels
};
