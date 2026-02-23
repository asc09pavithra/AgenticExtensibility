import { Card, CardActions, CardContent, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogTitle, TextField, InputLabel, DialogActions, FormControl, Select, MenuItem } from '@mui/material';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useEffect, useState, useContext } from 'react';
import { useStyles } from '../../common/commonStyles';
import Loading from '../../common/Loading';
import SDKButton from '../../common/SDKButton';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import { PropertyItem, PropertyHeader } from '../../common/ResponseTypes';
import LoadRefreshButton from '../../common/LoadRefreshButton';
import Box from '@mui/material/Box';
import { DeviceContext } from '../../common/DeviceContext';
import ApiResponseButton from '../../common/ApiResponseButton';
import ApiResponseDialog from '../../common/ApiResponseDialog';
import { ReadFileText } from '../../common/Utilities';
import { v4 as uuidv4 } from 'uuid';

function RuntimeRegistrations(props) {
    const classes = useStyles();
    const [isLoading, setIsLoading] = useState(false);
    const [runtimeRegistrationIds, setRuntimeRegistrationIds] = useState([]);
    const solutionManagerService = props.service;
    const solutionId = props.solutionId;
    const [showCreateRuntimeRegistration, setShowCreateRuntimeRegistration] = useState(false);

    useEffect(() => {
        loadRuntimeRegistrations();
    }, [props.loadEnabled]);

    async function handleRefreshClicked() {
        loadRuntimeRegistrations();
    }

    function handleRowClicked(runtimeRegistrationId) {
        props.setSelectedRuntimeRegistration(runtimeRegistrationId);
    }

    async function loadRuntimeRegistrations() {
        let response;
        setIsLoading(true);
        try {
            response = await solutionManagerService.enumerateRuntimeRegistrations(solutionId, 'includeMembers=true');
            console.log(JSON.stringify(response));

            if (null !== response && 'memberIds' in response && null !== response.memberIds) {
                setRuntimeRegistrationIds(response.memberIds);
                console.log('RuntimeRegistrations: ' + JSON.stringify(response.memberIds));
            }
            else {
                setRuntimeRegistrationIds([]);
            }
        }
        catch (error) {
            props.postAlert('error', 'Unable to enumerate RuntimeRegistrations - ' + error.cause.message);
        }
        setIsLoading(false);
    }

    async function deleteRuntimeRegistration() {
        let response;
        try {
            response = await solutionManagerService.deleteRuntimeRegistration(solutionId, props.selectedRuntimeRegistration);
            console.log('DeleteRuntimeRegistration response: ' + JSON.stringify(response));

            if (null !== response) {
                props.postAlert('success', 'Deleted runtime registration ' + props.selectedRuntimeRegistration);
            }
        }
        catch (error) {
            props.postAlert('error', 'Unable delete runtime registration ' + props.selectedRuntimeRegistration + ' - ' + error.cause.message);
        }
        props.setSelectedRuntimeRegistration('');
        loadRuntimeRegistrations();
    }

    async function handleCreateRuntimeRegistrationDialogOpen() {
        setShowCreateRuntimeRegistration(true);
    }

    async function handleCreateRuntimeRegistrationDialogClose() {
        setShowCreateRuntimeRegistration(false);
        loadRuntimeRegistrations();
    }

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" component="h2">Runtime Registrations</Typography>
                {
                    isLoading ? <Loading message="Loading resource..." /> :
                        <TableContainer style={{ maxHeight: 300 }} component={Paper}>
                            <Table className={classes.table} size='small' stickyHeader aria-label="RuntimeRegistrations Table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell className={classes.tableIdCell}>Registration Id</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody deselectOnClickaway={false}>
                                    {runtimeRegistrationIds.map((id) => (
                                        <TableRow classes={{ root: classes.row, hover: classes.hover, selected: classes.selected }} key={id} hover selected={id === props.selectedRuntimeRegistration}>
                                            <TableCell className={classes.tableIdCell} component="th" scope="solution" onClick={(event) => handleRowClicked(id)} >
                                                {id}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                }
                <CreateRuntimeRegistrationsPopup
                    open={showCreateRuntimeRegistration}
                    onClose={handleCreateRuntimeRegistrationDialogClose}
                    postAlert={props.postAlert}
                    setIsLoading={setIsLoading}
                    solutionManagerService={solutionManagerService}
                    solutionId={solutionId}
                />
            </CardContent>
            <CardActions>
                <SDKButton
                    data-testid="runtimeRegistrations-refresh-button"
                    disabled={!props.loadEnabled}
                    buttonlabel="Refresh"
                    primaryToolTip="Refresh Runtime Registrations"
                    secondaryToolTip="Runtime Registrations is Loading"
                    secondaryToolTipCondition={props.loadEnabled}
                    onClick={handleRefreshClicked}
                />
                <SDKButton
                    data-testid="runtimeRegistration-create-button"
                    disabled={!props.loadEnabled}
                    buttonlabel="Create runtime registration"
                    primaryToolTip="Create a runtime registration"
                    secondaryToolTip="Runtime registrations is Loading"
                    secondaryToolTipCondition={props.loadEnabled}
                    onClick={handleCreateRuntimeRegistrationDialogOpen}
                />
                <SDKButton
                    data-testid="runtimeRegistration-delete-button"
                    disabled={!props.loadEnabled || props.selectedRuntimeRegistration === ''}
                    buttonlabel="Delete runtime registration"
                    primaryToolTip="Delete a runtime registration"
                    secondaryToolTip="Select a runtime registration to delete"
                    secondaryToolTipCondition={props.loadEnabled && props.selectedRuntimeRegistration !== ''}
                    onClick={deleteRuntimeRegistration}
                />
            </CardActions>
        </Card>
    );
}

function RuntimeRegistration(props) {
    const classes = useStyles();
    const [isLoading, setIsLoading] = useState(false);
    const [runtimeRegistration, setRuntimeRegistration] = useState({});
    const solutionManagerService = props.service;
    const solutionId = props.solutionId;
    const resourceId = props.selectedRuntimeRegistration;
    const deviceContext = useContext(DeviceContext);

    const [state, setState] = useState({
        showApiResponse: false,
        showButtons: false
    });

    useEffect(() => {
        console.log("useEffect triggered with loadEnabled:", props.loadEnabled, "and resourceId:", resourceId);
        if (props.loadEnabled && resourceId) {
            loadRuntimeRegistration();
        }
    }, [props.loadEnabled, resourceId]);

    async function handleRefreshClicked() {
        loadRuntimeRegistration();
    }

    async function loadRuntimeRegistration() {
        setState({ ...state, showButtons: false });
        setIsLoading(true);

        let response;
        try {
            response = await solutionManagerService.getRuntimeRegistration(solutionId, resourceId);
            console.log(JSON.stringify(response));

            if (response && 'record' in response && 'value' in response.record) {
                setRuntimeRegistration(response);
            } else {
                setRuntimeRegistration({});
            }
        } catch (error) {
            props.postAlert('error', 'Unable to enumerate RuntimeRegistrations - ' + error.cause.message);
        }
        setState({ ...state, showButtons: true });
        setIsLoading(false);
    }

    async function handleDialogClose() {
        setState({ ...state, showApiResponse: false });
    }

    async function handleShowApiResponse() {
        setState({ ...state, showApiResponse: true });
    }

    return (
        <Card>
        <CardContent>
            <Typography variant="h5" component="h2">Runtime Registration</Typography>
            <List component="nav" className={classes.root}>
                <List component="div" disablePadding>
                    { Object.keys(runtimeRegistration).length > 0 && (
                        <>
                        <PropertyItem primary="RecordId" secondary={runtimeRegistration.recordId} />
                        <Divider style={{ marginLeft: "40px" }} />
                        <PropertyItem primary="RecordTypeGun" secondary={runtimeRegistration.record.typeGUN} />
                        <Divider style={{ marginLeft: "40px" }} />
                        <PropertyHeader name="RecordValue"></PropertyHeader>
                        <Box style={{ marginLeft: "40px", borderRadius: '2px', border: '1px solid #C8C8C8' }} m={1}><pre className={classes.fit}>{JSON.stringify(runtimeRegistration.record.value, undefined, 2)}</pre></Box>
                        </>
                    )}
                </List>
            </List>
            <ApiResponseDialog title="Runtime Registration API Response" open={state.showApiResponse} apiResponse={runtimeRegistration} handleClose={handleDialogClose} />
        </CardContent>
        <CardActions>
            <LoadRefreshButton data-testid="runtime-registration-loadrefresh" onClick={handleRefreshClicked} isLoading={isLoading} location="Runtime Registration" />
            <ApiResponseButton data-testid="runtime-registration-showapiresponse" onClick={handleShowApiResponse} deviceContext={deviceContext} disabled={!state.showButtons} />
        </CardActions>
    </Card>

    );
}

function RuntimeRegistrationsTabContent(props) {
    const solutionId = props.solutionId;
    const [selectedRuntimeRegistration, setSelectedRuntimeRegistration] = useState('');

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <RuntimeRegistrations 
                    solutionId={solutionId} 
                    service={props.service} 
                    loadEnabled={true} 
                    postAlert={props.postAlert} 
                    setSelectedRuntimeRegistration={setSelectedRuntimeRegistration} 
                    selectedRuntimeRegistration={selectedRuntimeRegistration} 
                />
            </Grid>
            <Grid item xs={12}>
                <RuntimeRegistration 
                    solutionId={solutionId}
                    service={props.service}
                    loadEnabled={true}
                    postAlert={props.postAlert}
                    selectedRuntimeRegistration={selectedRuntimeRegistration}
                />
            </Grid>
        </Grid>
    )
}

function CreateRuntimeRegistrationsPopup(props) {
    const recordTypeGunOptions = [
        "com.hp.ext.service.application.version.1.type.applicationAgentRegistrationRecord",
        "com.hp.ext.service.application.version.1.type.i18nAssetRegistrationRecord",
    ]
    const [typeGun, setTypeGun] = useState(recordTypeGunOptions[0]);
    const [recordId, setRecordId] = useState(uuidv4());
    const [recordContent, setRecordContent] = useState("");

    useEffect(() => {
        if (props.open) {
            setTypeGun(recordTypeGunOptions[0]);
            setRecordId(uuidv4());
            setRecordContent("");
        }
    }, [props.open]);

    async function handleRegistrationRecordResultInputChanged(event) {
        let registrationRecordString = await ReadFileText(event.target.files[0]);
        if (registrationRecordString === "") {
            props.postAlert('error', 'Unable to read the file');
            return;
        }
        try {
            JSON.parse(registrationRecordString);
        } catch (error) {
            props.postAlert('error', 'Unable to parse the file');
            console.log(error);
            return;
        } finally {
            setRecordContent(registrationRecordString);
        }
    }

    async function createRuntimeRegistration() {
        let response;
        let queryParams = "";
        props.setIsLoading(true);
        
        try {
            let createRequest = {
                recordId: recordId,
                record: {
                    typeGUN: typeGun,
                    value: JSON.parse(recordContent),
                }
            };

            response = await props.solutionManagerService.createRuntimeRegistration(props.solutionId, createRequest, queryParams);
            console.log('CreateRuntimeRegistration response: ' + JSON.stringify(response));

            if (null !== response && 'resourceId' in response && null !== response.resourceId) {
                props.postAlert('success', 'Created runtime registration');
            }

            if (null !== props.onClose) {
                props.onClose();
            }
        }
        catch (error) {
            if (error.cause && error.cause.message) {
                props.postAlert('error', 'Unable to create runtime registration - ' + error.cause.message);
            } else {
                console.log(error);
                props.postAlert('error', 'Unable to parse record value');
            }
        }
        props.setIsLoading(false);
    }

    function handleCancelButtonPushed() {
        if (null !== props.onClose) {
            props.onClose();
        }
    }

    return (
        <Dialog fullWidth maxWidth="lg" open={props.open} onClose={props.onClose}>
            <DialogTitle>{"Create Runtime Registration"}</DialogTitle>
            <Grid container>
                <Grid item style={{paddingLeft: "20px", paddingRight: "20px", paddingBottom: "10px"}} xs={12}>
                    <TextField variant="outlined" required fullWidth
                        id="recordId"
                        label="Record Id"
                        type="string"
                        value={recordId}
                        style={{marginBottom: "10px"}}
                        onInput={e => setRecordId(e.target.value)}
                    />
                    <FormControl fullWidth>
                        <InputLabel variant="outlined" required shrink id="type-gun">TypeGun</InputLabel>
                        <Select variant="outlined" 
                            fullWidth
                            labelId="type-gun"
                            id="TypeGun"
                            value={typeGun}
                            label="TypeGun"
                            onChange={e => setTypeGun(e.target.value)}
                        >
                            <MenuItem value={recordTypeGunOptions[0]}>{recordTypeGunOptions[0]}</MenuItem>
                            <MenuItem value={recordTypeGunOptions[1]}>{recordTypeGunOptions[1]}</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField variant="outlined" required fullWidth
                        id="recordContent"
                        label="Value"
                        type="string"
                        value={recordContent}
                        multiline
                        rows={8}
                        placeholder="Registration Record that is of the given type."
                        style={{marginTop: "10px"}}
                        InputProps={{
                            style: {
                                height: "400px",
                                alignItems: "flex-start",
                            },
                        }}
                        inputProps={{
                            style: {
                                height: "100%",
                                overflow: "auto",
                            },
                        }}
                        onInput={e => setRecordContent(e.target.value)}
                    />
                    <>
                    </>
                </Grid>
            </Grid>
            <DialogActions>
                <Box style={{ paddingLeft: "15px", paddingRight: "15px", flex: 1, display: 'flex', justifyContent: 'space-between' }}>
                    <input
                        accept="*/*"
                        style={{ display: 'none' }}
                        id="registrationRecord-select"
                        type="file"
                        onChange={handleRegistrationRecordResultInputChanged}
                        disabled={false}
                    />
                    <Grid item>
                        <label htmlFor="registrationRecord-select">
                            <SDKButton
                                disabled={false}
                                buttonlabel="Import..."
                                primaryToolTip="Select a record from the file system"
                                secondaryToolTip="Unable to select a record"
                                secondaryToolTipCondition={true}
                                component="span"
                            />
                        </label>
                    </Grid>
                    <Box style={{ display: 'flex', gap: '10px' }}>
                        <SDKButton
                            disabled={false}
                            buttonlabel="Cancel"
                            primaryToolTip="Exit create runtime registration"
                            secondaryToolTipCondition={true}
                            onClick={handleCancelButtonPushed}
                        />
                        <SDKButton
                            disabled={recordId === "" || recordContent === ""}
                            buttonlabel="Create Runtime Registration"
                            primaryToolTip="Create a runtime registration from the given record"
                            secondaryToolTip="Missing Fields"
                            secondaryToolTipCondition={!(recordId === "" || recordContent === "")}
                            onClick={createRuntimeRegistration}
                        />
                    </Box>
                </Box>
            </DialogActions>
        </Dialog>)
}

export {
    RuntimeRegistrationsTabContent
};
