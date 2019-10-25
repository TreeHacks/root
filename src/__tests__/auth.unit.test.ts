import { parseJwt } from "../store/auth/actions";

describe("auth helper functions", () => {
  describe("parseJwt", () => {
    test("parses regular jwt", () => {
      expect(
        parseJwt(
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
        )
      ).toMatchInlineSnapshot(`
        Object {
          "iat": 1516239022,
          "name": "John Doe",
          "sub": "1234567890",
        }
      `);
    });
    test("parses malformed jwt", () => {
      expect(parseJwt("ABC")).toMatchInlineSnapshot(`null`);
    });
  });
});
