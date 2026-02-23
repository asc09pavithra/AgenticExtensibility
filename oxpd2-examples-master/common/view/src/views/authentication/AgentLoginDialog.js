import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import SDKButton from '../../common/SDKButton';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import { grey } from '@mui/material/colors';

export default function AgentLoginDialog(props) {
    const [result, setResult] = useState('Succeeded');
    const [isAction, setAction] = useState(false);
    const [fullyQualifiedUserName, setFullyQualifiedUserName] = useState('');
    const [userName, setUserName] = useState('');
    const [emailBCCAddresses, setEmailBCCAddresses] = useState('');
    const [emailCCAddresses, setEmailCCAddresses] = useState('');
    const [emailFromAddress, setEmailFromAddress] = useState('');
    const [emailMessage, setEmailMessage] = useState('');
    const [emailSubject, setEmailSubject] = useState('');
    const [emailToAddresses, setEmailToAddresses] = useState('');
    const [faxBillingCode, setFaxBillingCode] = useState('');
    const [faxCompanyName, setFaxCompanyName] = useState('');
    const [password, setPassword] = useState('');
    const [preferredLanguage, setPreferredLanguage] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [emailAddress, setEmailAddress] = useState('');
    const [exchangeMailboxUri, setExchangeMailboxUri] = useState('');
    const [homeFolderPath, setHomeFolderPath] = useState('');
    const [keyValuePairs, setkeyValuePairs] = useState('');
    const [ldapBindUser, setLdapBindUser] = useState('');
    const [sAMAccountName, setSAMAccountName] = useState('');
    const [sidString, setSidString] = useState('');
    const [userDomain, setUserDomain] = useState('');
    const [userPrincipalName, setUserPrincipalName] = useState('');
    const [applicationAccessPointId, setApplicationAccessPointId] = useState('');
    const [FailedMessage, setFailedMessage] = useState('');

    function getSucessPromptResults() {
        var prePromptResultValue = {};
        var details = {
            "fullyQualifiedUserName": fullyQualifiedUserName,
            "userName": userName,
            ...(emailBCCAddresses && { "emailBCCAddresses": commaSeparatedStringToArray(emailBCCAddresses) }),
            ...(emailCCAddresses && { "emailCCAddresses": commaSeparatedStringToArray(emailCCAddresses) }),
            ...(emailFromAddress && { "emailFromAddress": emailFromAddress }),
            ...(emailMessage && { "emailMessage": emailMessage }),
            ...(emailSubject && { "emailSubject": emailSubject }),
            ...(emailToAddresses && { "emailToAddresses": commaSeparatedStringToArray(emailToAddresses) }),
            ...(faxBillingCode && { "faxBillingCode": faxBillingCode }),
            ...(faxCompanyName && { "faxCompanyName": faxCompanyName }),
            ...(password && { "password": password }),
            ...(preferredLanguage && { "preferredLanguage": preferredLanguage }),
            ...(displayName && { "displayName": displayName }),
            ...(emailAddress && { "emailAddress": emailAddress }),
            ...(exchangeMailboxUri && { "exchangeMailboxUri": exchangeMailboxUri }),
            ...(homeFolderPath && { "homeFolderPath": homeFolderPath }),
            ...(keyValuePairs && { "keyValuePairs": stringToKeyValuePairs(keyValuePairs) }),
            ...(ldapBindUser && { "ldapBindUser": ldapBindUser }),
            ...(sAMAccountName && { "sAMAccountName": sAMAccountName }),
            ...(sidString && { "sidString": sidString }),
            ...(userDomain && { "userDomain": userDomain }),
            ...(userPrincipalName && { "userPrincipalName": userPrincipalName })
        };
        var action = {
            "initiateAppLaunch": {
                "applicationAccessPointId": applicationAccessPointId
            }
        };
        var succeeded = { "details": details };
        prePromptResultValue = { "result": { "succeeded": succeeded }, ...(isAction && { "action": action }) };
        return prePromptResultValue;
    }

    function getPrepromptResult() {
        let prePromptResult = {};
        if (result === "Succeeded") {
            prePromptResult = getSucessPromptResults();
        } else if (result === "Failed") {
            prePromptResult.result = { "failed": { "message": FailedMessage } };
        } else if (result === "Canceled") {
            prePromptResult.result = { "canceled": {} };
        } else if (result === "Continue") {
            prePromptResult.result = { "continue": {} };
        }
        return prePromptResult;
    }

    async function handleLoginClicked() {
        props.setState({ ...props.state, showLoginDialog: false });
        props.setIsLoading(true);

        let prePromptResult = getPrepromptResult();
        console.log("prePromptResult - " + JSON.stringify(prePromptResult));
        try {
            let response = await props.authenticationService.postLogin(props.agentId, prePromptResult);
            console.log("login response- " + JSON.stringify(response));

            if (response != null) {
                props.postAlert('success', 'Login requested');
            }
        } catch (error) {
            props.postAlert('error', 'Unable to login  - ' + error.cause.message);
        }
        props.setIsLoading(false);
    }

    function handleLoginDialogCancel() {
        props.setState({ ...props.state, showLoginDialog: false });
    }

    function commaSeparatedStringToArray(inputString) {
        return inputString.split(',').map(item => item.trim());
    }

    function stringToKeyValuePairs(inputString) {
        const pairs = inputString.split(',');
        const result = pairs.map(pair => {
            const [key, value] = pair.split(':').map(item => item.trim());
            return { [key]: value };
        });
        return result;
    }

    function isLoginButtonDisabled() {
        if (result === "Succeeded") {
            if (!fullyQualifiedUserName || !userName) return true;
            if (isAction) {
                if (!applicationAccessPointId) return true;
            }
        }
        return false;
    }

    return (
        <Dialog fullWidth={true} maxWidth="md" open={props.state.showLoginDialog} onClose={handleLoginDialogCancel}>
            <DialogTitle>PrePromptResult</DialogTitle>
            <DialogContent>
                <FormControl fullWidth style={{ marginTop: '5px' }}>
                    <InputLabel variant="outlined" required shrink id="result-label">result</InputLabel>
                    <Select
                        defaultValue={"Succeeded"}
                        Select variant="outlined"
                        labelId="result-label"
                        id="result-select"
                        value={result}
                        label="result"
                        onChange={(e) => setResult(e.target.value)}
                    >
                        <MenuItem value={"Succeeded"}>Succeeded</MenuItem>
                        <MenuItem value={"Continue"}>Continue</MenuItem>
                        <MenuItem value={"Canceled"}>Canceled</MenuItem>
                        <MenuItem value={"Failed"}>Failed</MenuItem>
                    </Select>
                </FormControl>
                {result === "Succeeded" && (
                    <>
                        <Typography variant="h6" style={{ marginTop: "20px" }}>Details</Typography>
                        <div style={{ maxHeight: '400px', overflowY: 'auto', width: '100%' }}>
                            <TextField style={{ marginTop: "10px" }} variant="outlined" size="small" fullWidth required label="fullyQualifiedUserName" value={fullyQualifiedUserName} onChange={(e) => setFullyQualifiedUserName(e.target.value)} />
                            <TextField style={{ marginTop: "10px" }} variant="outlined" size="small" fullWidth required label="userName" value={userName} onChange={(e) => setUserName(e.target.value)} />
                            <TextField style={{ marginTop: "10px" }} variant="outlined" size="small" fullWidth label="emailBCCAddresses" value={emailBCCAddresses} onChange={(e) => setEmailBCCAddresses(e.target.value)} />
                            <TextField style={{ marginTop: "10px" }} variant="outlined" size="small" fullWidth label="emailCCAddresses" value={emailCCAddresses} onChange={(e) => setEmailCCAddresses(e.target.value)} />
                            <TextField style={{ marginTop: "10px" }} variant="outlined" size="small" fullWidth label="emailFromAddress" value={emailFromAddress} onChange={(e) => setEmailFromAddress(e.target.value)} />
                            <TextField style={{ marginTop: "10px" }} variant="outlined" size="small" fullWidth label="emailMessage" value={emailMessage} onChange={(e) => setEmailMessage(e.target.value)} />
                            <TextField style={{ marginTop: "10px" }} variant="outlined" size="small" fullWidth label="emailSubject" value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} />
                            <TextField style={{ marginTop: "10px" }} variant="outlined" size="small" fullWidth label="emailToAddresses" value={emailToAddresses} onChange={(e) => setEmailToAddresses(e.target.value)} />
                            <TextField style={{ marginTop: "10px" }} variant="outlined" size="small" fullWidth label="faxBillingCode" value={faxBillingCode} onChange={(e) => setFaxBillingCode(e.target.value)} />
                            <TextField style={{ marginTop: "10px" }} variant="outlined" size="small" fullWidth label="faxCompanyName" value={faxCompanyName} onChange={(e) => setFaxCompanyName(e.target.value)} />
                            <TextField style={{ marginTop: "10px" }} variant="outlined" size="small" fullWidth label="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                            <TextField style={{ marginTop: "10px" }} variant="outlined" size="small" fullWidth label="preferredLanguage" value={preferredLanguage} onChange={(e) => setPreferredLanguage(e.target.value)} />
                            <TextField style={{ marginTop: "10px" }} variant="outlined" size="small" fullWidth label="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                            <TextField style={{ marginTop: "10px" }} variant="outlined" size="small" fullWidth label="emailAddress" value={emailAddress} onChange={(e) => setEmailAddress(e.target.value)} />
                            <TextField style={{ marginTop: "10px" }} variant="outlined" size="small" fullWidth label="exchangeMailboxUri" value={exchangeMailboxUri} onChange={(e) => setExchangeMailboxUri(e.target.value)} />
                            <TextField style={{ marginTop: "10px" }} variant="outlined" size="small" fullWidth label="homeFolderPath" value={homeFolderPath} onChange={(e) => setHomeFolderPath(e.target.value)} />
                            <TextField style={{ marginTop: "10px" }} variant="outlined" size="small" fullWidth label="keyValuePairs" value={keyValuePairs} onChange={(e) => setkeyValuePairs(e.target.value)} />
                            <TextField style={{ marginTop: "10px" }} variant="outlined" size="small" fullWidth label="ldapBindUser" value={ldapBindUser} onChange={(e) => setLdapBindUser(e.target.value)} />
                            <TextField style={{ marginTop: "10px" }} variant="outlined" size="small" fullWidth label="sAMAccountName" value={sAMAccountName} onChange={(e) => setSAMAccountName(e.target.value)} />
                            <TextField style={{ marginTop: "10px" }} variant="outlined" size="small" fullWidth label="sidString" value={sidString} onChange={(e) => setSidString(e.target.value)} />
                            <TextField style={{ marginTop: "10px" }} variant="outlined" size="small" fullWidth label="userDomain" value={userDomain} onChange={(e) => setUserDomain(e.target.value)} />
                            <TextField style={{ marginTop: "10px" }} variant="outlined" size="small" fullWidth label="userPrincipalName" value={userPrincipalName} onChange={(e) => setUserPrincipalName(e.target.value)} />
                        </div>
                        <Divider style={{ margin: '20px 0' }} />
                        <FormControlLabel control={<Checkbox checked={isAction} onChange={(e) => setAction(e.target.checked)} sx={{ color: grey[700], '&.Mui-checked': { color: '#F50057' } }} />} label="Include Optional Action" />
                        {isAction && (
                            <TextField style={{ marginTop: "10px" }} variant="outlined" size="small" fullWidth required label="applicationAccessPointId" value={applicationAccessPointId} onChange={(e) => setApplicationAccessPointId(e.target.value)} />
                        )}
                    </>
                )}
                {result === "Failed" && (
                    <TextField style={{ marginTop: "10px" }} label="message" variant="outlined" size="small" fullWidth value={FailedMessage} onChange={(e) => setFailedMessage(e.target.value)} />
                )}
            </DialogContent>
            <DialogActions>
                <SDKButton
                    disabled={false}
                    buttonlabel="Cancel"
                    primaryToolTip="Exit This Window"
                    secondaryToolTip="Exit Unavailable"
                    secondaryToolTipCondition={true}
                    onClick={handleLoginDialogCancel}
                />
                <SDKButton
                    disabled={isLoginButtonDisabled()}
                    buttonlabel="Login"
                    primaryToolTip="Send Login Request"
                    secondaryToolTip="Required Field Emtpy"
                    secondaryToolTipCondition={!isLoginButtonDisabled()}
                    onClick={handleLoginClicked}
                />
            </DialogActions>
        </Dialog>
    );
}
