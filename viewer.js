/* Copyright 2007 by Oliver Steele.  Available under the MIT License. */

var gDocs;

function DocViewer(options) {
    this.options = options;
    this.initialize.apply(this, arguments);
}

DocViewer.prototype.initialize = function(options) {
    var examples = options.examples,
        api = options.api;
    
    $('noscript').innerHTML = $('noscript').innerHTML.replace(
            /<span.*?<\/span>/,
        'If this message remains on the screen,');
    new OSDoc.ExampleViewer().load(examples, {
        onSuccess: this.noteCompletion.bind(this, 'examples'),
        target: 'examples'});
    gDocs = new OSDoc.APIViewer().load(api, {
        onSuccess: this.noteCompletion.bind(this, 'docs'),
        target: 'docs'});
    initializeHeaderToggle();
    initializeTestLinks();
}

function initializeHeaderToggle() {
    Event.observe('header-toggle', 'click', updateHeaderState);
    updateHeaderState();
    function updateHeaderState(e) {
        $$('#header').invoke($F('header-toggle') ? 'show' : 'hide');
    }
}

function initializeTestLinks() {
    Event.observe('run-tests', 'click', function(e) {
        Event.stop(e);
        var results = gDocs.runTests();
        alert(results.toHTML());
    });
    Event.observe('write-tests', 'click', function(e) {
        Event.stop(e);
        var text = gDocs.getTestText();
        document.write('<pre>'+text.escapeHTML()+'</pre>');
    });
}

DocViewer.prototype.noteCompletion = function(flag) {
    var flags = arguments.callee,
        onload = this.options.onLoad;
    flags[flag] = true;
    if (!flags.docs || !flags.examples)
        return;
    onload && onload();
    $('noscript').hide();
    var inputs = $$('kbd');
    if (window.location.search.match(/[\?&]test\b/)) {
        var results = gDocs.runTests();
        alert(results.toHTML());
    }
    scheduleGradientReset();
}



/*
 * Gradients
 */

var scheduleGradientReset = (function() {
    var resizer;
    return function() {
        resizer = resizer || window.setTimeout(function() {
            resizer = null;
            resetGradients();
        }, 60);
    }
})();

function resetGradients() {
    resetGradient('intro', 0xeeeeff);
}

function resetGradient(name, startColor, endColor) {
    if (arguments.length < 3) endColor = 0xffffff;
    var parent = $(name);
    var old = ($A(parent.childNodes).select('.className=="grad"'.lambda()));
    old.each(parent.removeChild.bind(parent));
    var children = $A(parent.childNodes).slice(0);
    OSGradient.applyGradient({'gradient-start-color': startColor,
                              'gradient-end-color': endColor,
                              'border-radius': 15},
                             parent);
    var newed = $A(parent.childNodes).reject(children.include.bind(children));
    newed.each('.className="grad"'.lambda());
}
