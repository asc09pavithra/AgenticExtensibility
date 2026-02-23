function parseHeader(header) {
    /**
    * This function will parse an http header into a structured object. For example,
    * it will take:
    * 
    *    Content-Type: image/jpeg
    * 
    * and return an object like:
    * 
    *    {
    *       name: "content-type"
    *       value: "image/jpeg"
    *       directives: {
    *       }
    *    }
    ***/

    // First, let's normalize and split into parts
    let headerParts = header.split(";");
    
    /*
    * Now we have something like:
    *    ['content-type: image/jpeg']
    * or
    *    ['content-disposition: attachment', ' name="scanFile"', ' oridinal="1"', ' filename="foo.jpg"']
    **/

    let headerObj = {
        name: "",
        value: "",
        directives: {}
    };

    // First the primary part
    let primaryParts = headerParts[0].split(": ");
    if (2 === primaryParts.length) {
        headerObj.name = primaryParts[0].toLowerCase();
        headerObj.value = primaryParts[1];
    }

    // Next any directives
    headerParts.shift();
    if (headerParts.length) {
        headerParts.forEach((part) => {
            let directive = part.trim();
            let directiveParts = directive.split("=");

            headerObj["directives"][directiveParts[0]] = "";

            if (directiveParts[1].startsWith('"') || directiveParts[1].startsWith("'")) {
                headerObj["directives"][directiveParts[0]] = directiveParts[1].substring(1, directiveParts[1].length-1);
            }
            else {
                headerObj["directives"][directiveParts[0]] = directiveParts[1];
            }           
        });
    }
    
    return headerObj;
}

const MultipartParser = {

    getContentBoundary: (headerContent) => {
        let boundaryKey = "boundary=";
        let boundary = null;
        let fields = headerContent.split(';');
    
        if (fields) {
            fields.forEach((field) => {
                let i = field.indexOf(boundaryKey);
                if (i >= 0) {
                    j = i + boundaryKey.length;
                    boundary=field.substring(j).trim();
                    return;
                }
            });
        }
    
        return boundary;
    },
    parseContent: (boundary, body) => {
        var lastline = '';
        var contentDisposition = '';
        var contentType = ''; 
        var state = 0; 
        var buffer = [];
        var contentParts = [];
    
        for (i = 0; i < body.length; i++) {
            var oneByte = body[i];
            var prevByte = i > 0 ? body[i - 1] : null;
            var newLineDetected = ((oneByte == 0x0a) && (prevByte == 0x0d)) ? true : false;
            var newLineChar = ((oneByte == 0x0a) || (oneByte == 0x0d)) ? true : false;
    
            if (!newLineChar) {
                lastline += String.fromCharCode(oneByte);
            }
                
            if ((0 == state) && newLineDetected) {
                if (("--" + boundary) == lastline) {
                    state = 1;
                }
                lastline = '';
            } 
            else if ((1 == state) && newLineDetected) {
                    contentDisposition = lastline;
                    state = 2;
                    lastline = '';
            }
            else if ((2 == state) && newLineDetected) {
                        contentType = lastline;
                        state = 3;
                        lastline = '';
            }
            else if ((3 == state) && newLineDetected) {
                            state = 4;
                            buffer = [];
                            lastline = '';
            }
            else if (4 == state) {
                if (lastline.length > (boundary.length + 4)) {
                    lastline = ''; // mem save
                }
                
                if (((("--" + boundary) == lastline))) {
                    var j = buffer.length - lastline.length;
                    var part = buffer.slice(0, j - 1);
                    var contentPart = {
                        headers: [],
                        data: null                        
                    };
                    contentPart.headers.push(parseHeader(contentDisposition));
                    contentPart.headers.push(parseHeader(contentType));
                    contentPart.data = Buffer.from(part);
                    contentParts.push(contentPart);
                    buffer = []; lastline = ''; state = 5; contentDisposition = ''; contentType = '';
                }
                else {
                    buffer.push(oneByte);
                }
                
                if (newLineDetected) {
                    lastline = '';
                }
            }
            else if (5 == state) {
                if (newLineDetected) {
                    state = 1;
                }
            }
        }

        return contentParts;
    }
}

Object.freeze(MultipartParser);

module.exports = MultipartParser;
