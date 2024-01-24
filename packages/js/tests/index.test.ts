// @ts-nocheck
import { flare } from '../src/index';
import { expect, test } from 'vitest';

test('properly lights', (done) => {
    const projectKey = 'aprojectkey';

    flare.light(projectKey);

    expect(flare.config.key).toBe(projectKey);
});

test('can create glows', (done) => {
    flare.glow('glowName', undefined, undefined);

    expect(flare.glows.length).toBe(1);

    expect(flare.glows[0]).toMatchObject({
        name: 'glowName',
        message_level: 'info',
        meta_data: [],
    });

    expect(typeof flare.glows[0].microtime).toBe('number');
    expect(typeof flare.glows[0].time).toBe('number');
});

test.todo('can register solution providers');

test.todo('can use solution providers properly');

test.todo('can use async solution providers properly');

test.todo('can build an error report from an error');

test.todo('can create custom context and context groups');

test.todo('can throttle when too many reports are being sent');

test.todo('can stop a report from being submitted by using beforeSubmit');

test.todo('can use an async beforeSubmit');

test.todo('can edit a report using beforeSubmit and still send it');

test.todo('can stop an error from being evaluated by using beforeEvaluate');

test.todo('can use an async beforeEvaluate');

test.todo('can check out an error using beforeEvaluate and still send it');
