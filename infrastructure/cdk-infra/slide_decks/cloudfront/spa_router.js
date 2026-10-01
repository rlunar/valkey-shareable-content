// CloudFront Function (viewer-request) for the slide decks site.
//
// Each Slidev deck is a single-page app deployed under /<deck>/ and built with
// `--base /<deck>/`. Slidev uses history-mode routing, so deep links such as
// /<deck>/12 or /<deck>/presenter/3 have no matching S3 object. This function
// rewrites those requests to the deck's index.html and normalises /<deck> to
// /<deck>/ so relative URLs resolve against the right base path.
//
// Keep this file CloudFront Functions JavaScript runtime 2.0 compatible
// (ES5 syntax, no imports, under 10 KB).

function handler(event) {
    var request = event.request;
    var uri = request.uri;
    var segments = uri.split('/').filter(isNotEmpty);

    // "/" is served by the distribution's default root object.
    if (segments.length === 0) {
        return request;
    }

    var last = segments[segments.length - 1];
    var endsWithSlash = uri.charAt(uri.length - 1) === '/';

    // Anything with a file extension is a real object: /index.html,
    // /404.html, /<deck>/assets/app.abc123.js, /<deck>/logos/valkey.svg ...
    if (!endsWithSlash && last.indexOf('.') !== -1) {
        return request;
    }

    // "/<deck>" -> "/<deck>/" so the browser resolves the deck's base path.
    if (!endsWithSlash && segments.length === 1) {
        return {
            statusCode: 301,
            statusDescription: 'Moved Permanently',
            headers: {
                location: { value: '/' + segments[0] + '/' + queryString(request.querystring) }
            }
        };
    }

    // "/<deck>/", "/<deck>/12", "/<deck>/presenter/3", "/<deck>/overview" ...
    // all load the deck's single-page entry point.
    request.uri = '/' + segments[0] + '/index.html';
    return request;
}

function isNotEmpty(segment) {
    return segment.length > 0;
}

// Re-serialise the parsed query string so redirects keep e.g. ?clicks=2.
function queryString(parsed) {
    var parts = [];
    for (var key in parsed) {
        var entry = parsed[key];
        if (entry.multiValue) {
            for (var i = 0; i < entry.multiValue.length; i++) {
                parts.push(pair(key, entry.multiValue[i].value));
            }
        } else {
            parts.push(pair(key, entry.value));
        }
    }
    return parts.length > 0 ? '?' + parts.join('&') : '';
}

function pair(key, value) {
    return value === '' ? key : key + '=' + value;
}
