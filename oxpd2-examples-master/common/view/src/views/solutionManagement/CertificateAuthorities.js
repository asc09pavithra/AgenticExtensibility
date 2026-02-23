import { Card, CardActions, CardContent, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { useStyles } from '../../common/commonStyles';
import Loading from '../../common/Loading';
import { PropertyItem } from '../../common/ResponseTypes';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { DownloadToDownloadsFolder } from '../../common/Utilities';
import TextField from '@mui/material/TextField';
import SDKButton from '../../common/SDKButton';

function CertificateAuthority(props) {
    const solutionManagerService = props.service;

    const [isLoading, setIsLoading] = useState(false);
    const [currentCA, setCurrentCA] = useState(null);

    useEffect(() => {
        loadCA(props.solutionId, props.certificateId);
    }, [props.certificateId]);

    async function handleLoadClicked() {
        loadCA(props.solutionId, props.certificateId);
    }

    async function loadCA(solutionId, certificateId) {
        let response;

        console.log(solutionId);

        if (!certificateId || certificateId.length === 0) {
            setCurrentCA(null);
            return;
        }

        setIsLoading(true);
        try {
            response = await solutionManagerService.getCertificateAuthority(solutionId, certificateId);
            console.log(JSON.stringify(response));

            if (null !== response) {
                setCurrentCA(response);
            }
        }
        catch (error) {
            props.postAlert('error', 'Unable to retrieve certificate authority - ' + error.cause.message);
        }
        setIsLoading(false);
    }

    async function handleExportClicked() {
        let response;
        try {
            response = await solutionManagerService.exportCertificateAuthority(props.solutionId, props.certificateId);
            console.log(JSON.stringify(response));
            let fileName = props.certificateId + "_CertificateAuthority.pem";
            DownloadToDownloadsFolder(response.item2, fileName);
            props.postAlert('success', 'Export request successful, Downloaded: ' + fileName);
        }
        catch (error) {
            props.postAlert('error', 'Failed to export certificate authority - ' + error.cause.message);
        }
    }

    async function handleDeleteClicked() {
        let response;

        setIsLoading(true);
        try {
            response = await solutionManagerService.deleteCertificateAuthority(props.solutionId, props.certificateId);
            console.log(JSON.stringify(response));
            setCurrentCA(null);
            props.postAlert('success', 'Delete request successful');
        }
        catch (error) {
            props.postAlert('error', 'Unable to delete certificate authority - ' + error.cause.message);
        }
        setIsLoading(false);
    }

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" component="h2">Certificate Authority</Typography>
                {
                    isLoading ? <Loading message="Loading resource..." /> :
                        (currentCA && <CACardContent certificateAuthority={currentCA} />)
                }
            </CardContent>
            <CardActions>
                <SDKButton
                    data-testid="solutionsCA-refresh-button"
                    disabled={currentCA === null}
                    buttonlabel="Refresh"
                    primaryToolTip="Refresh Certificate Authority"
                    secondaryToolTip="Certificate Authority not Selected"
                    secondaryToolTipCondition={currentCA !== null}
                    onClick={handleLoadClicked}
                />
                <SDKButton
                    data-testid="solutionsCA-export-button"
                    disabled={currentCA === null}
                    buttonlabel="Export"
                    primaryToolTip="Export Certificate Authority"
                    secondaryToolTip="Certificate Authority not Selected"
                    secondaryToolTipCondition={currentCA !== null}
                    onClick={handleExportClicked}
                />
                <SDKButton
                    data-testid="solutionsCA-delete-button"
                    disabled={currentCA === null}
                    buttonlabel="Delete"
                    primaryToolTip="Delete Certificate Authority"
                    secondaryToolTip="Certificate Authority not Selected"
                    secondaryToolTipCondition={currentCA !== null}
                    onClick={handleDeleteClicked}
                />
            </CardActions>
        </Card>
    );
}

function CACardContent({ certificateAuthority }) {
    const classes = useStyles();
    return (
        <List component="nav" className={classes.root}>
            <List component="div" disablePadding>
                <PropertyItem primary="certificateId" secondary={certificateAuthority.certificateId || ""} />
                <Divider style={{ marginLeft: "40px" }} />
                <PropertyItem primary="issuer" secondary={certificateAuthority.issuer || ""} />
                <Divider style={{ marginLeft: "40px" }} />
                <PropertyItem primary="serialNumber" secondary={certificateAuthority.serialNumber || ""} />
                <Divider style={{ marginLeft: "40px" }} />
                <PropertyItem primary="subject" secondary={certificateAuthority.subject || ""} />
                <Divider style={{ marginLeft: "40px" }} />
                <PropertyItem primary="thumbprint" secondary={certificateAuthority.thumbprint || ""} />
                <Divider style={{ marginLeft: "40px" }} />
                <PropertyItem primary="usage" secondary={certificateAuthority.usage || ""} />
                <Divider style={{ marginLeft: "40px" }} />
                <PropertyItem primary="validFrom" secondary={certificateAuthority.validFrom || ""} />
                <Divider style={{ marginLeft: "40px" }} />
                <PropertyItem primary="validTo" secondary={certificateAuthority.validTo || ""} />
                <Divider style={{ marginLeft: "40px" }} />
                <PropertyItem primary="version" secondary={certificateAuthority.version || ""} />
                <Divider style={{ marginLeft: "40px" }} />
            </List>
        </List>
    );
}

function CertificateAuthorities(props) {

    const classes = useStyles();
    const [isLoading, setIsLoading] = useState(false);
    const [certificateAuthorities, setCertificateAuthorities] = useState([]);
    const solutionManagerService = props.service;
    const solutionId = props.solutionId;
    const [state, setState] = useState({
        showImportDialog: false,
        dialogImportButtonEnabled: false
    });

    const [certificateAuthorityFile, setCertificateAuthorityFile] = useState(null);
    const [certificateId, setCertificateId] = useState(null);

    useEffect(() => {
        loadCertificateAuthorities();
    }, [props.loadEnabled]);

    async function handleLoadClicked() {
        loadCertificateAuthorities();
    }

    async function loadCertificateAuthorities() {
        let response;
        setIsLoading(true);
        try {
            response = await solutionManagerService.enumerateCertificateAuthorities(solutionId, 'includeMembers=true');
            console.log(JSON.stringify(response));

            if (null !== response && 'members' in response && null !== response.members) {
                setCertificateAuthorities(response.members);
            }
            else {
                setCertificateAuthorities([]);
            }

        }
        catch (error) {
            props.postAlert('error', 'Unable to enumerate CertificateAuthorities - ' + error.cause.message);
        }
        setIsLoading(false);
    }

    function handleRowClicked(e, certificateId) {
        console.log("handleRowClicked: " + certificateId);
        props.setSelectedCA(certificateId);
    }

    async function handleImportClicked() {
        setState({ ...state, showImportDialog: true });
    }

    async function handleImportDialogCancel() {
        setState({ ...state, showImportDialog: false, dialogImportButtonEnabled: false });
    }

    async function handleImportDialogExecute() {
        let response;
        try {
            response = await solutionManagerService.importCertificateAuthority(solutionId, { certificateId: certificateId }, certificateAuthorityFile);
            console.log(JSON.stringify(response));
            props.postAlert('success', 'Import request successful!')
        }
        catch (error) {
            props.postAlert('error', 'Failed to import certificate authority - ' + error.cause.message);
        }

        setState({ ...state, showImportDialog: false });
    }

    function handleCertificateAuthorityFileChanged(file) {
        if (null !== file) {
            console.log('selected certificate authority: ' + file.name);
            setState({ ...state, dialogImportButtonEnabled: true });
            setCertificateAuthorityFile(file);
        }
    }

    function handleCertificateIdChanged(certificateId) {
        if (null !== certificateId) {
            setCertificateId(certificateId);
        }
    }

    async function handleExportClicked() {
        let response;
        try {
            response = await solutionManagerService.exportCertificateAuthorities(solutionId);
            console.log(JSON.stringify(response));
            let fileName = solutionId + "_Certificate_Authorities.pem";
            DownloadToDownloadsFolder(response.item2, fileName);
            props.postAlert('success', 'Export request successful, Downloaded: ' + fileName);
        }
        catch (error) {
            props.postAlert('error', 'Failed to export certificate authority - ' + error.cause);
        }
    }

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" component="h2">Certificate Authorities</Typography>
                {
                    isLoading ? <Loading message="Loading resource..." /> :
                        <TableContainer style={{ maxHeight: 300 }} component={Paper}>
                            <Table className={classes.table} size='small' stickyHeader aria-label="CertificateAuthorities Table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell className={classes.tableIdCell}>Certificate Id</TableCell>
                                        <TableCell align="left">Issuer</TableCell>
                                        <TableCell align="left">Serial Number</TableCell>
                                        <TableCell align="left">Subject</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody deselectOnClickaway={false}>
                                    {certificateAuthorities.map((ca) => (
                                        <TableRow classes={{ root: classes.row, hover: classes.hover, selected: classes.selected }} key={ca.certificateId} hover selected={ca.certificateId === props.selectedCA}>
                                            <TableCell className={classes.tableIdCell} component="th" scope="solution" onClick={(event) => handleRowClicked(event, ca.certificateId)} >
                                                {ca.certificateId}
                                            </TableCell>
                                            <TableCell align="left" onClick={(event) => handleRowClicked(event, ca.certificateId)} >{ca.issuer ? ca.issuer : ''}</TableCell>
                                            <TableCell align="left" onClick={(event) => handleRowClicked(event, ca.certificateId)} >{ca.serialNumber ? ca.serialNumber : ''}</TableCell>
                                            <TableCell align="left" onClick={(event) => handleRowClicked(event, ca.certificateId)} >{ca.subject ? ca.subject : ''}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                }
                <Dialog fullWidth={true} maxWidth="sm" open={state.showImportDialog} onClose={handleImportDialogCancel}>
                    <DialogTitle>Import Certificate Authority</DialogTitle>
                    <DialogContent style={{ height: '150px' }}>
                        <DialogContentText style={{ marginBottom: '10px' }}>
                            Select a certificate authority to import:
                        </DialogContentText>
                        <ImportUploadInput onCertificateAuthorityFileChanged={handleCertificateAuthorityFileChanged} onCertificateIdChanged={handleCertificateIdChanged} />
                    </DialogContent>
                    <DialogActions>
                        <SDKButton
                            disabled={false}
                            buttonlabel="Cancel"
                            primaryToolTip="Exit This Tab"
                            secondaryToolTip="Unable To Exit"
                            secondaryToolTipCondition={true}
                            onClick={handleImportDialogCancel}
                        />
                        <SDKButton
                            disabled={!state.dialogImportButtonEnabled}
                            buttonlabel="Import"
                            primaryToolTip="Import Certificate Authorities"
                            secondaryToolTip="Must Select A Certificate Authorities File"
                            secondaryToolTipCondition={state.dialogImportButtonEnabled}
                            onClick={handleImportDialogExecute}
                        />
                    </DialogActions>
                </Dialog>
            </CardContent>
            <CardActions>
                <SDKButton
                    data-testid="solutions-refresh-button"
                    disabled={!props.loadEnabled}
                    buttonlabel="Refresh"
                    primaryToolTip="Refresh Certificate Authorities"
                    secondaryToolTip="Certificate Authorities Loading"
                    secondaryToolTipCondition={props.loadEnabled}
                    onClick={handleLoadClicked}
                />
                <SDKButton
                    data-testid="solutions-import-button"
                    disabled={!props.loadEnabled}
                    buttonlabel="Import"
                    primaryToolTip="Import Certificate Authorities"
                    secondaryToolTip="Certificate Authorities Loading"
                    secondaryToolTipCondition={props.loadEnabled}
                    onClick={handleImportClicked}
                />
                <SDKButton
                    data-testid="solutionsCAs-export-button"
                    disabled={!props.loadEnabled}
                    buttonlabel="Export"
                    primaryToolTip="Export Certificate Authorities"
                    secondaryToolTip="Certificate Authorities Loading"
                    secondaryToolTipCondition={props.loadEnabled}
                    onClick={handleExportClicked}
                />
            </CardActions>
        </Card>
    );
}

function ImportUploadInput(props) {
    const classes = useStyles();
    const [certificateAuthorityFile, setCertificateAuthorityFile] = useState({ name: '' });

    function handleCAInputChanged(e) {
        if (e.target.files.length > 0) {
            setCertificateAuthorityFile(e.target.files[0]);
            if (null !== props.onCertificateAuthorityFileChanged) {
                props.onCertificateAuthorityFileChanged(e.target.files[0]);
            }
        }
    };

    function handleCertificateIdInputChanged(e) {
        if (null !== props.onCertificateIdChanged) {
            props.onCertificateIdChanged(e.target.value);
        }
    };

    return (
        <Grid container spacing={1} alignContent="flex-start" alignItems="center">
            <Grid container item xs={12} spacing={3}>
                <>
                    <input
                        accept="*/*"
                        className={classes.root}
                        style={{ display: 'none' }}
                        id="certificate-file-select"
                        type="file"
                        onChange={handleCAInputChanged}
                    />
                    <Grid item style={{ minWidth: '375px' }}>
                        <TextField label="Certificate Id" variant="outlined" size="small" fullWidth onChange={handleCertificateIdInputChanged} />
                    </Grid>
                    <Grid item style={{ minWidth: '300px' }}>
                        <TextField label="Certificate Authority" variant="outlined" size="small" readOnly fullWidth value={certificateAuthorityFile.name} />
                    </Grid>
                    <Grid item>
                        <label htmlFor="certificate-file-select">
                            <SDKButton
                                color="inherit"
                                component="span"
                                disabled={false}
                                buttonlabel="Select..."
                                primaryToolTip="Select Certificate Authorities File"
                                secondaryToolTip="Unable To Select"
                                secondaryToolTipCondition={true}
                                className={classes.root}
                                style={{ borderColor: 'rgba(0, 0, 0, 0.23)' }}
                            />
                        </label>
                    </Grid>
                </>
            </Grid>
        </Grid>
    );
}

function CATabContent(props) {
    const solutionId = props.solutionId;
    const [selectedCA, setSelectedCA] = useState('');

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <CertificateAuthorities solutionId={solutionId} service={props.service} loadEnabled={true} postAlert={props.postAlert} selectedCA={selectedCA} setSelectedCA={setSelectedCA} />
            </Grid>
            <Grid item xs={12}>
                <CertificateAuthority service={props.service} loadEnabled={true} postAlert={props.postAlert} certificateId={selectedCA} solutionId={solutionId} />
            </Grid>
        </Grid>
    )
}

export {
    CATabContent
};

