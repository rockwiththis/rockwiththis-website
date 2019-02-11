import assert from 'assert';

export const expectPayloadValue = (payload, key, resolverName) =>
  assert(
    !!payload[key],
    `resolver ${resolverName} expected value at ${key} in payload`
  );

