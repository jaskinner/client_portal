exports.send_success = (res, data) => {
    res.writeHead(200, { "Content-Type": "application/json" });
    var output = { error: null, data: data };
    res.end(JSON.stringify(output) + "\n");
};

exports.send_failure = (res, server_code, err) => {
    var code = err.code ? err.code : err.name;
    res.writeHead(server_code, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: code, message: err.message }) + "\n");
};

exports.render_page = (res, data) => {
    console.log(res);
    res.render("invoices", { invoices: data });
};
