import { eventModel } from "../test/models";
import { toResolver } from "./resolver";

describe('toResolver', () => {
    test('finds models in a list by metadata name', () => {
        const resolve = toResolver([eventModel]);
        expect(resolve('Event')).toBe(eventModel);
        expect(resolve('Other')).toBeUndefined();
    });

    test('finds models in a map by key', () => {
        expect(toResolver({ Party: eventModel })('Party')).toBe(eventModel);
    });

    test('uses a function as it is', () => {
        const resolve = (name: string) => name === 'Event' ? eventModel : undefined;
        expect(toResolver(resolve)).toBe(resolve);
    });
});
