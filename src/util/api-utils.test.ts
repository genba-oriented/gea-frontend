import { expect, test } from 'vitest';
import { lastSegment } from './api-utils';


test("lastsegment", () => {
  const id = lastSegment("http://localhost/foo/id01");
  expect(id).toBe("id01");
});