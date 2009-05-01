/*
 * Author: Oliver Steele
 * Copyright: Copyright 2007 by Oliver Steele.  All rights reserved.
 * License: MIT License
 * Homepage: http://osteele.com/javascripts/functional
 * Created: 2007-07-11
 * Modified: 2007-07-16
 */

$(initialize);

function initialize() {
    new DocViewer({api: 'test.js',
                   examples: 'examples.js'});
    initializeTestLinks()
}

function initializeTestLinks() {
    $('#run-tests').click(function(e) {
        var results = gDocs.runTests();
        alert(results.toHTML());
        return false;
    });
    $('#write-tests').click(function(e) {
        var text = gDocs.createTestText();
        document.write('<pre>'+text.escapeHTML()+'</pre>');
        return false;
    });
}
