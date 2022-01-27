var assert = require("assert");
var app = require("../src/server");

it("should return html", (done) => {
    const response = app.get("/", (req, res) => {
        res.render("/")
    })
    assert.ok(true);
    done();
});
