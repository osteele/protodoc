/* Copyright 2007 by Oliver Steele.  Released under the MIT License. */

/**
 * Options:
 *   all: include undocumented elements
 *   headingLevel: hn for topmost headings; default 3
 *   staged: render incrementally if true
 *   target: an HTML Element that is set to the docs on completion
 *   onSuccess: called when load completes
 */
OSDoc.APIViewer = function(options) {
    this.options = OSUtils.merge({headingLevel: 3,
                                  staged: true}, options||{});
};

/// Load +url+ and parse its contents.
OSDoc.APIViewer.prototype.load = function(url, _options) {
    var self = this,
        options = this.options,
        urls = Array.prototype.slice.call(arguments, 0);
    if (typeof urls[urls.length-1] == 'object')
        options = OSUtils.merge(OSUtils.merge({}, options), urls.pop());
    var count = urls.length,
        results = new Array(count),
        target = options.target && $(options.target);
    target && (target.innerHTML = OSDoc.loadingHeader);
    urls.each(function(url, ix) {
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
        --count || self.parse(results.join(''), options);
    }
}

/// Parse +text+.  If +options.target+ is specified, update it.
OSDoc.APIViewer.prototype.parse = function(text, options) {
    this.text = OSDoc.stripHeader(text);
    this.updateTarget(this.options.staged && 0, options);
    return this;
}

OSDoc.APIViewer.prototype.updateTarget = function(stage, options) {
    var target = options.target && $(options.target);
    if (!target) return options.onSuccess && options.onSuccess();

    var text = this.text,
        formatOptions = {headingLevel:options.headingLevel};
    switch (stage) {
    case 0:
        target.innerHTML = OSDoc.previewText(text);
        break;
    case 1:
        formatOptions.quicker = true;
    case 2:
        formatOptions.quick = true;
    default:
        var model = this.model = this.model || new OSDoc.Parser(options).parse(text),
            formatter = new HTMLFormatter(formatOptions),
            html = formatter.render(model);
        target.innerHTML = html;
        if (stage <= 2) break;
        options.onSuccess && options.onSuccess();
        return this;
        break;
    }
    this.updateTarget.bind(this).saturate(stage+1, options).delayed(10);
    return this;
}

OSDoc.APIViewer.prototype.getTestText = function() {
    return this.model.getTestText();
}

OSDoc.APIViewer.prototype.runTests = function() {
    return this.testResults = this.model.runTests();
}
