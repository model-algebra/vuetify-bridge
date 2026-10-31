# vuetify-bridge

Vue 3 components that wrap Vuetify components and are driven by
[model-algebra](https://github.com/model-algebra) models (see `Model.ts` in
[common-typescript](https://github.com/model-algebra/common-typescript)):

- **`ModelField`**: an input control for one field of a model, bound to a value with `v-model`
- **`ModelForm`**: a form for a record of a model
- **`ModelTable`**: a data table of records of a model, sorted and filtered as the model declares

Labels, input types, validation rules and value formatting all come from the field types and constraints of the model.

## Installation

```sh
pnpm add github:model-algebra/vuetify-bridge github:model-algebra/common-typescript
```

The built packages are in their repositories, so nothing is built when they are installed.

`vue` (3.4+) and `vuetify` (3.5+) are peer dependencies. Import the library styles once:

```ts
import 'vuetify-bridge/style.css'
```

## Usage

A model can be passed as a `Model` built with `Model.fromJSON()` or as its plain JSON object.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { Model } from 'model-algebra-common'
import { ModelField, ModelForm, ModelTable } from 'vuetify-bridge'
import userJson from './user_core_model.json'

const userModel = Model.fromJSON(userJson)
const users = ref<Record<string, unknown>[]>([])
const user = ref<Record<string, unknown>>({})
</script>

<template>
  <!-- One field -->
  <ModelField :field="userModel.fields[1]" v-model="user.userName" variant="outlined" />

  <!-- A whole record -->
  <ModelForm :model="userModel" v-model="user" mode="create" @submit="save" @cancel="close" />

  <!-- A list of records -->
  <ModelTable :model="userModel" :items="users" :exclude="['id']" @click:row="open" />
</template>
```

Attributes not listed below are passed on to the wrapped Vuetify component (`variant`, `density`, `hover`, `loading`, events…).

### ModelField

| Prop | Type | |
|---|---|---|
| `field` | `Field` | The model field. |
| `v-model` | `unknown` | The value of the field in the record. |
| `readonly` | `boolean` | |
| `messages` | `Partial<ValidationMessages>` | Overrides of validation messages. |
| `models` | `ModelsOption` | Models referenced by `OBJECT` fields; inherited when not given. |
| `mode` | `FormMode` | Mode passed on to sub-forms. |

The control is chosen by field type:

| Types | Control |
|---|---|
| `INT16`, `INT32`, `INT64`, `integer` | number input, whole numbers within the range of the type |
| `FLOAT32`, `FLOAT64`, `DECIMAL`, `number` | number input; `DECIMAL` limits decimal places to its `scale` |
| `STRING`, `UUID`, `DURATION`, `string` | text input; `STRING` shows a counter for its `length` |
| `TEXT` | textarea |
| `BOOLEAN`, `boolean` | checkbox |
| `ENUM`, or a text field with an `enum` constraint | select |
| `ARRAY` of `ENUM` | multiple select |
| `ARRAY` of text | combobox of free-form chips |
| `DATE`, `TIME`, `DATETIME`, `TIMESTAMP`, `TIMESTAMP_TZ` | native `date`, `time` and `datetime-local` inputs |
| `OBJECT` | nested sub-form, see [Nested records](#nested-records) |
| `ARRAY` of `OBJECT` | list of sub-forms |
| `JSON`, `UNION`, other `ARRAY`s | JSON textarea |
| `BYTES` | read-only |

The controls for each kind are also exported: `ModelTextField`, `ModelTextareaField`, `ModelBooleanField`,
`ModelSelectField`, `ModelObjectField`, `ModelObjectListField`.

#### Values

Record values are JSON-friendly. Empty input becomes `null`, and an empty multiple selection becomes `[]`. Numbers are
numbers. Dates are ISO 8601 strings:

| Type | Value |
|---|---|
| `DATE` | `"2026-10-31"` |
| `TIME` | `"13:45:00"` |
| `DATETIME`, `TIMESTAMP` | `"2026-10-31T13:45:00"` (no time zone) |
| `TIMESTAMP_TZ` | `"2026-10-31T11:45:00.000Z"` (entered in local time, stored in UTC) |

`Date` objects are accepted as input values as well.

#### Validation

| Constraint | Check |
|---|---|
| `nullable: false`, `required: true` | a value is required |
| `min`, `max` | numeric range |
| `regex` | text pattern |
| `enum` | one of the values |

`primaryKey`, `unique` and `foreignKey` need the database and are not checked. Fields without `nullable: false`
are optional.

Messages are in English. Override any of them with the `messages` prop:

```vue
<ModelForm :model="userModel" v-model="user" :messages="{ required: label => `${label} cannot be empty` }" />
```

### ModelForm

| Prop | Type | Default | |
|---|---|---|---|
| `model` | `Model` | | |
| `v-model` | `Record<string, unknown>` | | The record; replaced with a new object on every change. |
| `mode` | `'create' \| 'edit' \| 'view'` | `'edit'` | See below. |
| `fields` | `string[]` | all | Fields to show, in this order. |
| `exclude` | `string[]` | | Fields not to show. |
| `messages` | `Partial<ValidationMessages>` | | |
| `models` | `ModelsOption` | | Models referenced by `OBJECT` fields. |
| `submitText`, `cancelText` | `string` | `Save`, `Cancel` | |
| `hideActions` | `boolean` | `false` | |

Modes:

- **`create`**: hides `identity` fields and fills in missing values from literal `default` constraints.
- **`edit`**: makes `primaryKey` and `identity` fields read-only.
- **`view`**: makes every field read-only and shows no buttons.

Events:

- **`submit(record)`**: emitted only when every field is valid and the record passes the `check` constraints of the
  model. Violated checks are listed below the fields.
- **`cancel`**

Slots:

- **`#field.<name>="{ field, value, update, readonly }"`**: replaces the control of one field.
- **`#actions="{ submit, cancel }"`**: replaces the buttons.

Exposed: `validate(): Promise<boolean>`, `resetValidation()`.

### Nested records

An `OBJECT` field references another model by name in `parameters.ref`. Give the form the models it may reference,
and such fields become sub-forms; without them, they are edited as JSON.

```vue
<ModelForm :model="personModel" :models="[addressModel, contactModel, personModel]" v-model="person" />
```

`models` can be:

- a list, looked up by `metadata.name`
- a map by name
- a function `(name) => model | undefined`

Nested sub-forms inherit the models. To make them available everywhere, provide them once:

```ts
import { ModelsKey } from 'vuetify-bridge'
app.provide(ModelsKey, [addressModel, contactModel, personModel])
```

How sub-forms behave:

- **`OBJECT` field:** shows a card with the fields of the referenced model. An empty optional field has an **Add**
  button and can be removed again. An empty required field fails validation.
- **`ARRAY` of `OBJECT`:** shows a list of cards; items can be added, removed and moved up or down.
- **Validation:** nested fields and the `check` constraints of nested models are validated with the form, so
  `submit` is emitted only when every level is valid.
- **Modes:** sub-forms follow the mode of the form. Records added in a sub-form are new, so they are edited in create
  mode: identity fields are hidden and defaults are filled in.
- **Self-references:** a model can reference itself, e.g. `Person.manager`; a sub-form appears only when a value is
  added.

`ModelFields` is the body of a form without the `VForm` and the buttons: the fields of a record and its checks. Use
it to put the fields of a model into a form of your own.

### ModelTable

| Prop | Type | |
|---|---|---|
| `model` | `Model` | |
| `items` | `Record<string, unknown>[]` | |
| `fields`, `exclude` | `string[]` | Columns to show. |
| `itemKey` | `string` | Row identity; the primary key of the model by default. |
| `locale` | `string` | Locale for numbers and dates; the browser locale by default. |
| `itemsLength` | `number` | Total number of records for server-side paging; switches to `VDataTableServer`. |
| `functions` | `Record<string, Function>` | Functions sort and filter definitions name. |
| `predicates` | `Record<string, Function>` | Predicates filter definitions name. |
| `filterBar` | `boolean` | Show the filters and extra sort orders above the table (default `true`). |
| `v-model:filters` | `Record<string, unknown>` | Values of the filters that are on, by filter name. |
| `v-model:sort` | `{ key, order }[]` | Sort order: sort keys, or names of sorted columns. |
| `v-model:page`, `v-model:items-per-page` | `number` | Paging. |

Emits `update:query` with the query parameters of the API request (see below) when `itemsLength` is given.

Columns get the field label as title. Numbers are right-aligned. JSON, nested record and array columns are not sortable.

#### Sorting and filtering

A model that declares `sortable` or `filterable` fields, `sortings` or `filters` is sorted and filtered as it declares:

- Only columns of sortable fields are sortable; a column sorts by the first definition of its field, in the
  directions it allows.
- A filter bar above the table has a control for each filter: a field of the field's type (or of the argument's type)
  for filters that take a value, a checkbox for filters that are only switched on. Its "Sort by" choice offers the
  sort orders of the model, the other named definitions of fields, and sortable fields without columns.
- Functions and predicates are looked up by name in the `functions` and `predicates` props:
  `function(value, row)` and `predicate(value, row[, argument])` for fields, `function(row)` and
  `predicate(row[, argument])` for the model. Comparisons with missing values are false, as in SQL.

Without `itemsLength` the table filters, sorts and pages `items` itself. With it, `items` is the page the server
returned, and the table emits `update:query` whenever the page, sort order or filters change, with parameters named
as [openapi-bridge-typescript](https://github.com/model-algebra/openapi-bridge-typescript) describes them:

```vue
<ModelTable :model="personModel" :items="page.items" :items-length="page.total" @update:query="load" />
<!-- load({ limit: 10, offset: 20, sort: '-age,lastName.caseless', 'age.gte': 18, adults: true }) -->
```

Models without declarations keep the plain `VDataTable` behaviour. `ModelTableFilters` is the filter bar on its own.

Cells are formatted by type: numbers and dates by locale, `DECIMAL` with its scale, booleans as Yes/No, and JSON and
nested records shortened. Override a cell with `#item.<name>="{ item, value, field, formatted }"`. All other `VDataTable` slots
(`no-data`, `top`, headers…) are passed through.

### Helpers

The logic behind the components is exported for use in your own controls:

- **`useFieldInput()`**: binds any Vuetify control to a field.
- **`fieldKind`, `fieldLabel`, `fieldConstraints`, `enumValues`**: describe a field.
- **`isRequired`, `isEditable`, `isVisible`**: field state in a form.
- **`fieldRules`, `inputRules`**: field validation.
- **`recordErrors`**: table-level `check` constraints.
- **`formatValue`**: display text of a value.
- **`toInput`, `fromInput`**: conversion between record values and control values.
- **`emptyRecord`, `primaryKeyField`, `selectFields`**: model-level helpers.
- **`referencedModel`, `toResolver`, `useModels`, `ModelsKey`**: references between models.
- **`filterRows`, `sortRows`, `listQuery`, `listSortOptions`, `listFilterOptions`, `sortLabel`, `filterLabel`**: sorting
  and filtering of lists.

## Development

```sh
pnpm install
pnpm test          # vitest
pnpm type-check
pnpm build         # dist/: ES and UMD bundles, type declarations, style.css
```

`dist/` is committed, because other projects install the package from GitHub without building it. Enable the
pre-commit hook once per clone; it rebuilds `dist/` and adds it to every commit that changes the sources:

```sh
git config core.hooksPath .githooks
```

CI fails when the committed `dist/` differs from a build of the sources.

[example-site](https://github.com/model-algebra/example-site) shows every component on example models; with a
checkout of vuetify-bridge next to it, `pnpm dev:local` runs it on the sources of the checkout.
