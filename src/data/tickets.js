const express = require("express"),
    router = express.Router(),
    db = require("./index");

router.route("/tickets").get(async function (req, res) {
    const dbConnect = db.getDb();

    dbConnect
        .collection("tickets")
        .find({})
        .toArray(function (err, result) {
            if (err) {
                res.status(400).send("Error fetching listings!");
            } else {
                res.render("tickets", { tickets: result });
            }
        });
});

router.post("/tickets/createTicket", async function (req, res) {
    const dbConnect = db.getDb();
    const ticketDocument = {
        ticket_id: req.body.id,
        last_modified: new Date(),
        issue: req.body.issue,
    };

    dbConnect
        .collection("tickets")
        .insertOne(ticketDocument, function (err, result) {
            if (err) {
                res.status(400).send("Error inserting tickets!");
            } else {
                console.log(`Added a new ticket with id ${result.insertedId}`);
                res.status(204).send();
            }
        });
});

module.exports = router;
