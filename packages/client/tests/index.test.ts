import flareClient from '../src/index';

it('properly lights', done => {
    const projectKey = 'aprojectkey';

    flareClient.light(projectKey);

    expect(flareClient.config.key).toBe(projectKey);

    done();
});

it('can create glows', done => {
    const projectKey = 'aprojectkey';

    flareClient.light(projectKey);

    expect(flareClient.config.key).toBe(projectKey);

    done();
});
