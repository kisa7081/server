const hbs = require('hbs');

//Module for customizing Handlebars.
hbs.registerHelper('ifflashMsg', function (v1, options) {
    if (v1 == options.data.root.errorIndex && options.data.root.flashMsg
            && options.data.root.flashMsg.length > 0) {
        return new hbs.SafeString(
            '<div class="col alert alert-danger border border-dark">'
            + options.data.root.flashMsg
            + '</div>');
    }
});
