import { allTypesJson, allTypesModel, eventJson, eventModel, field } from "../test/models";
import {
    emptyRecord, enumValues, fieldConstraints, referencedModel, fieldKind, fieldLabel, isEditable, isRequired, isVisible,
    primaryKeyField, selectFields,
} from "./field";

describe('fieldConstraints', () => {
    test('reads constraints given as a map or as Constraint objects', () => {
        const expected = { min: 1, max: 500, default: { value: 10 } };
        expect(fieldConstraints(field(eventJson, 'seats'))).toEqual(expected);
        expect(fieldConstraints(field(eventModel, 'seats'))).toEqual(expected);
        expect(fieldConstraints(field(eventJson, 'endDate'))).toEqual({});
    });
});

describe('fieldKind', () => {
    test.each([
        ['int32Field', 'integer'], ['int64Field', 'integer'], ['float32Field', 'number'], ['float64Field', 'number'],
        ['decimalField', 'number'], ['booleanField', 'boolean'], ['stringField', 'text'], ['textField', 'longText'],
        ['uuidField', 'text'], ['bytesField', 'unsupported'], ['dateField', 'date'], ['timeField', 'time'],
        ['datetimeField', 'datetime'], ['timestampField', 'datetime'], ['timestampTzField', 'datetime'],
        ['durationField', 'text'], ['objectField', 'object'], ['enumField', 'enum'], ['unionField', 'json'],
        ['jsonField', 'json'], ['tagsField', 'tags'], ['rolesField', 'multiEnum'], ['pointsField', 'objectList'],
    ])('%s is %s', (name, kind) => {
        expect(fieldKind(field(allTypesJson, name))).toBe(kind);
    });

    test('a string field with an enum constraint is an enum', () => {
        expect(fieldKind(field(eventJson, 'status'))).toBe('enum');
    });

    test.each([['integer', 'integer'], ['number', 'number'], ['string', 'text'], ['boolean', 'boolean'], ['date', 'date']])(
        'legacy type %s is %s', (type, kind) => {
            expect(fieldKind({ name: 'x', type })).toBe(kind);
        });
});

describe('enumValues', () => {
    test('come from the ENUM type, the enum constraint or the ARRAY items', () => {
        expect(enumValues(field(allTypesJson, 'enumField'))).toEqual(['ACTIVE', 'INACTIVE', 'PENDING']);
        expect(enumValues(field(eventModel, 'status'))).toEqual(['DRAFT', 'PUBLISHED']);
        expect(enumValues(field(allTypesJson, 'rolesField'))).toEqual(['ADMIN', 'USER']);
        expect(enumValues(field(allTypesJson, 'stringField'))).toBeUndefined();
    });
});

describe('referencedModel', () => {
    test('is the ref of an OBJECT field or of the items of an ARRAY', () => {
        expect(referencedModel(field(allTypesJson, 'objectField'))).toBe('User');
        expect(referencedModel(field(allTypesJson, 'pointsField'))).toBe('Point');
        expect(referencedModel(field(allTypesJson, 'tagsField'))).toBeUndefined();
    });
});

describe('fieldLabel', () => {
    test.each([['firstName', 'First name'], ['first_name', 'First name'], ['id', 'Id'], ['userID', 'User ID'], ['HTMLContent', 'HTML content']])(
        '%s is labeled %s', (name, label) => {
            expect(fieldLabel({ name, type: 'STRING' })).toBe(label);
        });
});

describe('field state in forms', () => {
    test('not nullable and required fields are required', () => {
        expect(isRequired(field(eventModel, 'title'))).toBe(true);
        expect(isRequired(field(eventModel, 'status'))).toBe(true);
        expect(isRequired(field(eventModel, 'endDate'))).toBe(false);
    });

    test('identity fields are not shown on create', () => {
        expect(isVisible(field(eventModel, 'id'), 'create')).toBe(false);
        expect(isVisible(field(eventModel, 'id'), 'edit')).toBe(true);
    });

    test('keys are read-only once the record exists, everything is read-only in view mode', () => {
        expect(isEditable({ name: 'code', type: 'STRING', constraints: { primaryKey: true } }, 'create')).toBe(true);
        expect(isEditable({ name: 'code', type: 'STRING', constraints: { primaryKey: true } }, 'edit')).toBe(false);
        expect(isEditable(field(eventModel, 'id'), 'edit')).toBe(false);
        expect(isEditable(field(eventModel, 'title'), 'edit')).toBe(true);
        expect(isEditable(field(eventModel, 'title'), 'view')).toBe(false);
        expect(isEditable(field(allTypesJson, 'bytesField'), 'edit')).toBe(false);
    });
});

describe('selectFields', () => {
    test('keeps model order by default and the given order when names are given', () => {
        expect(selectFields(eventModel, undefined, ['id', 'created']).map(f => f.name))
            .toEqual(['title', 'code', 'seats', 'status', 'startDate', 'endDate']);
        expect(selectFields(eventModel, ['status', 'title']).map(f => f.name)).toEqual(['status', 'title']);
    });

    test('rejects unknown field names', () => {
        expect(() => selectFields(eventModel, ['nope'])).toThrow('Model Event has no field nope');
    });
});

describe('primaryKeyField', () => {
    test('is the primaryKey field or the single field of the primaryKey constraint', () => {
        expect(primaryKeyField(eventModel)).toBe('id');
        expect(primaryKeyField(allTypesModel)).toBeUndefined();
        expect(primaryKeyField({
            metadata: { name: 'T' },
            fields: [{ name: 'code', type: 'STRING' }],
            constraints: [{ name: 'pk', type: 'primaryKey', fields: ['code'] }],
        })).toBe('code');
    });
});

describe('emptyRecord', () => {
    test('uses literal defaults and null for the rest', () => {
        expect(emptyRecord(eventModel)).toEqual({
            id: null, title: null, code: null, seats: 10, status: null, startDate: null, endDate: null, created: null,
        });
    });
});
