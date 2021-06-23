const express = require("express");
const morgan = require("morgan");
const { PORT } = require("./config");

const app = express();

//Application Middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Route
app.use("/", require("./routes/register.router"));
app.use("/", require("./routes/scholarship.router"));
app.use("/", require("./routes/search.router"));
app.use("/", require("./routes/bookmark.router"));

// Error Handling
app.use((err, req, res, next) => {
    res.status(500).json({ success: false, error: err.toString() });
});

app.listen(PORT, (err) => {
    if (err) {
        console.error(err);
        process.exit();
    } else console.log("server start");
});
