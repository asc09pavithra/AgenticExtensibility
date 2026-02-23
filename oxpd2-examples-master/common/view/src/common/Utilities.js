async function ReadFileText(file) {
    // Always return a Promise
    return new Promise((resolve, reject) => {
        let content = '';

        const reader = new FileReader();
        // Wait till complete
        reader.onloadend = function (e) {
            content = e.target.result;
            resolve(content);
        };

        // Make sure to handle error states
        reader.onerror = function (e) {
            reject(e);
        };

        reader.readAsText(file);
    });
}

function DownloadToDownloadsFolder(base64String, filename) {
    const binaryString = atob(base64String);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    const blob = new Blob([bytes]);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

export {
    ReadFileText,
    DownloadToDownloadsFolder
}
