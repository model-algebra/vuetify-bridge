import { Model } from "model-algebra-common";

/** Every canonical type, as in model-examples/all_types_model.json. */
export const allTypesJson = {
    metadata: { name: "AllTypes", version: "1.0.0" },
    fields: [
        { name: "int32Field", type: "INT32", description: "32-bit integer" },
        { name: "int64Field", type: "INT64", description: "64-bit integer" },
        { name: "float32Field", type: "FLOAT32", description: "32-bit floating point" },
        { name: "float64Field", type: "FLOAT64", description: "64-bit floating point" },
        { name: "decimalField", type: "DECIMAL", description: "Decimal with precision and scale", parameters: { precision: 10, scale: 2 } },
        { name: "booleanField", type: "BOOLEAN", description: "Boolean value" },
        { name: "stringField", type: "STRING", description: "Variable-length string", parameters: { length: 255 } },
        { name: "textField", type: "TEXT", description: "Unlimited text" },
        { name: "uuidField", type: "UUID", description: "Universally unique identifier" },
        { name: "bytesField", type: "BYTES", description: "Binary data" },
        { name: "dateField", type: "DATE", description: "Date without time" },
        { name: "timeField", type: "TIME", description: "Time without date" },
        { name: "datetimeField", type: "DATETIME", description: "Date and time without timezone" },
        { name: "timestampField", type: "TIMESTAMP", description: "Unix timestamp" },
        { name: "timestampTzField", type: "TIMESTAMP_TZ", description: "Timestamp with timezone" },
        { name: "durationField", type: "DURATION", description: "Time duration" },
        { name: "objectField", type: "OBJECT", description: "Reference to another model", parameters: { ref: "User" } },
        { name: "enumField", type: "ENUM", description: "Enumeration of string values", parameters: { values: ["ACTIVE", "INACTIVE", "PENDING"] } },
        { name: "unionField", type: "UNION", description: "Union of multiple types", parameters: { oneOf: [{ type: "STRING" }, { type: "INT32" }] } },
        { name: "jsonField", type: "JSON", description: "Arbitrary JSON value" },
        { name: "tagsField", type: "ARRAY", description: "Tags", parameters: { items: { type: "STRING" } } },
        { name: "rolesField", type: "ARRAY", description: "Roles", parameters: { items: { type: "ENUM", parameters: { values: ["ADMIN", "USER"] } } } },
        { name: "pointsField", type: "ARRAY", description: "Points", parameters: { items: { type: "OBJECT", parameters: { ref: "Point" } } } },
    ],
};

/** A model with field and table constraints, in plain JSON form. */
export const eventJson = {
    metadata: { name: "Event", version: "1.0.0" },
    fields: [
        { name: "id", type: "INT64", constraints: { primaryKey: true, identity: "always", nullable: false } },
        { name: "title", type: "STRING", description: "Shown in the calendar", parameters: { length: 20 }, constraints: { nullable: false } },
        { name: "code", type: "STRING", constraints: { regex: "^[A-Z]{3}$" } },
        { name: "seats", type: "INT32", constraints: { min: 1, max: 500, default: { value: 10 } } },
        { name: "status", type: "STRING", constraints: { enum: ["DRAFT", "PUBLISHED"], required: true } },
        { name: "startDate", type: "DATE", constraints: { nullable: false } },
        { name: "endDate", type: "DATE" },
        { name: "created", type: "TIMESTAMP_TZ", constraints: { default: { function: "now" } } },
    ],
    constraints: [
        { name: "event_dates", type: "check", rule: { field: "endDate", op: ">=", otherField: "startDate" } },
        { name: "event_seats", type: "check", rule: { field: "seats", op: "!=", value: 13 } },
    ],
};

export const eventModel = Model.fromJSON(eventJson);
export const allTypesModel = Model.fromJSON(allTypesJson);

export const field = (model: { fields: any[] }, name: string) => model.fields.find(field => field.name === name)!;
