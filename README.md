# highlighter.js - a javascript highlighter

a quick and dirty JS highlighter i wrote for displaying code on my site.
all it is, is a simple lexer which iterates through the tokens after
tokenization, buffers the text and adds spans in the appropriate places.
It doesn't assume any environment, so it can be used client or server side.

## Example Usage

    return '<code>' + highlight(func.toString()) + '</code>';