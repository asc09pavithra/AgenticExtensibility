var TransmittingState = require('./transmittingState');

const HttpDestinationContent = function({scanJobId, transmittingState, includedScanFiles, deliveredScanFiles, metadataFile}) {    
    this.scanJobId = scanJobId || null;    
    this.transmittingState = transmittingState || TransmittingState.STARTED;
    this.includedScanFiles = includedScanFiles || 0;
    this.deliveredScanFiles = deliveredScanFiles || 0;
    this.metadataFile = metadataFile || false;    
};

const HttpDestinationContentFactory = (function() {

    return {
        create: () => {
            return new HttpDestinationContent({});
        },
        deserialize: (json) => {
            let raw = JSON.parse(json);
            return new HttpDestinationContent(raw);
        }
    };
})();

module.exports = HttpDestinationContentFactory