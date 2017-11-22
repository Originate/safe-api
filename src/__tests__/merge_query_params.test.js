// @flow
import * as SafeAPI from "../";
import * as T from "../type_rep";
import * as Client from "../client";
import * as TestUtils from "../test_utils";
import * as fetch from "isomorphic-fetch";

const testEndpoint: SafeAPI.Endpoint<
  {
    x: string,
    y: string
  },
  string
> = SafeAPI.endpoint()
  .fragment("foo")
  .queryParams({
    x: T.string
  })
  .queryParams({
    y: T.string
  });

const testHandler = async input => {
  return `${input.x} ${input.y}`;
};

describe("for an endpoint with multiple queryString middleware", () => {
  it("merges the two queryString objects", async () => {
    const server = TestUtils.makeServer({
      endpoint: testEndpoint,
      handler: testHandler
    });
    const baseURL = `http://localhost:${server.address().port}`;
    const input = { x: "X", y: "Y" };
    await Client.safeGet(baseURL, testEndpoint, input);
    const expectedURL = `${baseURL}/foo?x=X&y=Y`;
    expect(fetch).toHaveBeenLastCalledWith(expectedURL);
  });
});
