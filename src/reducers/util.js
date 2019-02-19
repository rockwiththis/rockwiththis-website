import assert from 'assert';

export const expectPayloadValue = (payload, key, resolverName, expectedValues) => {
  assert(
    !!payload[key],
    `resolver ${resolverName} expected value at ${key} in payload to exist`
  );
  if (!!expectedValues)
    assert(
      expectedValues.includes(payload[key]),
      `resolver ${resolverName} expected value ${payload[key]} to be one of ${expectedValues}`
    );
}

