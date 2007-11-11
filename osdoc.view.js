/* Copyright 2007 by Oliver Steele.  Released under the MIT License. */

/**
 * Options:
 *   all: include undocumented elements
 *   headingLevel: hn for topmost headings; default 3
 *   staged: render incrementally if true
 *   target: an HTML Element that is set to the docs on completion
 *   onSuccess: called when load completes
 */
OSDoc.APIDoc = function(options) {
    this.options = {headingLevel: 3,
                    staged: true,
                    onSuccess: Functional.I};
    for (var name in options||{})
        this.options[name] = options[name];
};

/// Load +url+ and parse its contents.
OSDoc.APIDoc.prototype.load = function(url) {
    var self = this,
        options = this.options,
        count = arguments.length,
        results = new Array(count);
    options.target && (options.target.innerHTML = OSDoc.loadingHeader);
    Array.prototype.slice.call(arguments, 0).each(function(url, ix) {
        if (options.bustCache)
            url += (/\?/(url) ? '&' : '?') + 'ts=' + new Date().getTime();
        new Ajax.Request(
            url,
            {method: 'GET',
             onSuccess: receive.reporting().bind(this, ix)});
    });
    return this;
    function receive(ix, response) {
        results[ix] = response.responseText;
        if (!--count)
            self.parse(results.join(''));
    }
}

/// Parse +text+.  If +options.target+ is specified, update it.
OSDoc.APIDoc.prototype.parse = function(text) {
    this.text = OSDoc.stripHeader(text);
    this.updateTarget(this.options.staged && 0);
    return this;
}

OSDoc.APIDoc.prototype.updateTarget = function(stage) {
    if (!this.options.target) return;

    var text = this.text,
        options = this.options,
        formatOptions = {headingLevel:options.headingLevel};
    switch (stage) {
    case 0:
        this.options.target.innerHTML = OSDoc.previewText(text);
        break;
    case 1:
        formatOptions.quicker = true;
    case 2:
        formatOptions.quick = true;
    default:
        var model = this.model = this.model || new OSDoc.Parser(options).parse(text),
            formatter = new HTMLFormatter(formatOptions),
            html = formatter.render(model);
        this.options.target.innerHTML = html;
        if (stage <= 2) break;
        this.options.onSuccess();
        return this;
        break;
    }
    this.updateTarget.bind(this).saturate(stage+1).delayed(10);
    return this;
}

OSDoc.APIDoc.prototype.getTestText = function() {
    return this.model.getTestText();
}

OSDoc.APIDoc.prototype.runTests = function() {
    return this.testResults = this.model.runTests();
}