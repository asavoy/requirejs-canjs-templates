require.config({
    // For the shorter plugin prefix (e.g. `mustache!file.mustache`).
    paths: {
        can: "../../bower_components/canjs/amd/can",
        jquery: "../../bower_components/jquery/dist/jquery",
        ejs: "../../ejs",
        mustache: "../../mustache",
        stache: "../../stache",
        text: "../../bower_components/text/text"
    },
    // So that the template library is included in the build. You don't need
    // this if you explicitly load the template library elsewhere in your app.
    shim: {
        "../../ejs": ["can/view/ejs"],
        "../../mustache": ["can/view/mustache"],
        "../../stache": ["can/view/stache"]
    }
});
