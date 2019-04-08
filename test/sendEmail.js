import sendMail from '../helperFunctions/sendEmail';
import chai from 'chai';
const assert = chai.assert;

describe("sendEmails()", function () {
    this.timeout(5000);
    it("Should return a mail object",  async () => {
        const mail = await sendMail("walesadeks@gmail.com", "Greetings", "Hello")

        console.log(mail)
        assert.isObject(mail)
    
    })

    it("Returns null for no email", async () => {
        const mail = await sendMail("", "Greetings", "Hello")

        assert.isNull(mail)
    })
})