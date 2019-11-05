import { flare } from '../src/index';

beforeAll(() => {});

it('properly lights', done => {
    const projectKey = 'aprojectkey';

    flare.light(projectKey);

    expect(flare.config.key).toBe(projectKey);

    done();
});

it('can create glows', done => {
    flare.glow('glowName', undefined, undefined);

    expect(flare.glows.length).toBe(1);

    expect(flare.glows[0]).toMatchObject({
        name: 'glowName',
        message_level: 'info',
        meta_data: [],
    });

    expect(typeof flare.glows[0].microtime).toBe('number');
    expect(typeof flare.glows[0].time).toBe('number');

    done();
});
