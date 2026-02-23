const path = require("path");
const fs = require("fs");
const Config = require("./config");
const TransmittingState = require("./transmittingState");

const Job = function(jobId) {
    this.jobId = jobId;
    this.state = TransmittingState.STARTED;
    this.storePath = path.join(Config.jobsDir, this.jobId);
    this.attachments = [];
    this.metadata = null;
    
    this.save = function() {
        let jobPath = path.join(this.storePath, "index.json");
        fs.writeFileSync(jobPath, JSON.stringify(this, null, 2), {});
    }

    this.addAttachment = function(name, ordinal, type, filename, content) {
        console.log("Creating attachment...");

        // Add it to the job instance
        let attachment = {
            name: name,
            ordinal: ordinal,
            type: type,
            filename: filename
        };
        this.attachments.push(attachment);

        // Write the data to the jobstore
        let attachmentPath = path.join(this.storePath, filename);
        fs.writeFileSync(attachmentPath, content);
    };

    this.addMetadata = function(filename, type, content) {
        console.log("Creating metadata");

        // Add it to the job instance
        this.metadata = {
            filename: filename,
            type: type,
        };

        // Write the data to the jobstore
        let metadataFilePath = path.join(this.storePath, filename);
        fs.writeFileSync(metadataFilePath, content);
    }
}

const JobService = (function() {

    let _jobs = [];

    return {
        createJob: (jobId) => {
            
            if (null === jobId || "" == jobId) {
                // ERROR
                throw "Invalid JobId"
            };

            let job = new Job(jobId);
            _jobs.push(job);

            let jobDir = path.join(Config.jobsDir, jobId);

            if (fs.existsSync(jobDir)) {
                // For now, let's just wipe out any dir with existing jobId..
                console.log("Warning - job already exists; overwritting contents...");
                fs.rmSync(jobDir, {force: true, recursive: true});
            }

            fs.mkdirSync(jobDir);
            
            return job;
        },
        getJob: (jobId) => {
            let job = _jobs.find((item) => {
                return item.jobId === jobId ? true : false;                
            });
            return job;
        }
    };
})();

module.exports = JobService;