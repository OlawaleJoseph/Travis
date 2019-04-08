import hashPassword from '../helperFunctions/hashPassword';
import chai from 'chai';
const assert = chai.assert

describe("hashPassword(password) should hash input", () => {
    it("should hash the password", () => {
        const password = "password";
        const hashedPasword = hashPassword(password);

        assert.notEqual(password, hashedPasword, "Password and hashedPasssword shouldnt be equal");

    })
});