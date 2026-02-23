import path from "path"
import oxpd2 from "oxpd2";
import deviceManagementService from '../services/deviceManagementService.js';

const __dirname = path.resolve()

let filePath = path.join(__dirname, '/src/webcontent/solutionApplicationExample.html');

const applicationAgentController = {};

applicationAgentController.get_application = async (req, res, next) => {

    let accessToken = req.headers['x-oxpd2-uicontext'];
    if(accessToken != null) {
        let uiContextToken = new oxpd2.Oauth2Client.Token();
        uiContextToken.accessToken = accessToken;
        uiContextToken.tokenType = "Bearer"
        deviceManagementService.setUiContextAccessToken(uiContextToken);
    }

    res.sendFile(filePath);
};


export default applicationAgentController;
