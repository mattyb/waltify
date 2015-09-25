function walk(rootNode)
{
    // Find all the text nodes in rootNode
    var walker = document.createTreeWalker(
        rootNode,
        NodeFilter.SHOW_TEXT,
        null,
        false
    ),
    node;

    // Modify each text node's value
    while (node = walker.nextNode()) {
        handleText(node);
    }
}

function handleText(textNode) {
  textNode.nodeValue = replaceText(textNode.nodeValue);
}

function replaceText(v)
{

    // Snakes = Sweet
    v = v.replace(/\bgood\b/gi, "Snakes");
    v = v.replace(/\bgreat\b/gi, "Snakes");
    v = v.replace(/\bawesome\b/gi, "Snakes");
    v = v.replace(/\bfun\b/gi, "Snakes");
    v = v.replace(/\bhappy\b/gi, "Snakes");

    // regular old thing
    v = v.replace(/\bthing\b/gi, "regular old thing");

    // sooooo
    v = v.replace(/\b(S|s)o\b/gi, "$1ooooo");

    // yay
    v = v.replace(/\byay\b/gi, "yayayay");

    // GUI
    v = v.replace(/\bGUI\b/gi, "eye candy because you are a baby");

    // emacs
    v = v.replace(/\bemacs\b/gi, "garbage");

    // loud noises
    i_statements = v.match(/(?:[^\.\?!,])*\bI\b(?:[^\.\?!,])*/g)
    if (i_statements !== null) {
        for (i = 0; i < i_statements.length; i++) {
            v = v.replace(i_statements[i], i_statements[i].toUpperCase())
        }
    }

    return v;
}

// The callback used for the document body and title observers
function observerCallback(mutations) {
    var i;

    mutations.forEach(function(mutation) {
        for (i = 0; i < mutation.addedNodes.length; i++) {
            if (mutation.addedNodes[i].nodeType === 3) {
                // Replace the text for text nodes
                handleText(mutation.addedNodes[i]);
            } else {
                // Otherwise, find text nodes within the given node and replace text
                walk(mutation.addedNodes[i]);
            }
        }
    });
}

// Walk the doc (document) body, replace the title, and observe the body and title
function walkAndObserve(doc) {
    var docTitle = doc.getElementsByTagName('title')[0],
    observerConfig = {
        characterData: true,
        childList: true,
        subtree: true
    },
    bodyObserver, titleObserver;

    // Do the initial text replacements in the document body and title
    walk(doc.body);
    doc.title = replaceText(doc.title);

    // Observe the body so that we replace text in any added/modified nodes
    bodyObserver = new MutationObserver(observerCallback);
    bodyObserver.observe(doc.body, observerConfig);

    // Observe the title so we can handle any modifications there
    if (docTitle) {
        titleObserver = new MutationObserver(observerCallback);
        titleObserver.observe(docTitle, observerConfig);
    }
}
walkAndObserve(document);
