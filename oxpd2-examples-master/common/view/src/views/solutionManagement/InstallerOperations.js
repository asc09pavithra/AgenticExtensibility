import { Card, CardActions, CardContent, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Collapse from '@mui/material/Collapse';
import { blue, green, grey, indigo, orange, red } from '@mui/material/colors';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import { makeStyles } from '@mui/styles';
import Typography from '@mui/material/Typography';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import React, { useEffect, useState } from 'react';
import Loading from '../../common/Loading';
import LoadRefreshButton from '../../common/LoadRefreshButton';
import { PropertyItem } from '../../common/ResponseTypes';
import SolutionDescription from './SolutionDescription';
import { createTheme } from '@mui/material/styles';

const theme = createTheme();

const useStyles = makeStyles((theme) => ({
    root: {
    },
    viewTitle: {
    },
    loading: {
        marginTop: 10,
        display: 'flex',
        '& > * + *': {
            marginLeft: theme.spacing(2),
        }
    },
    table: {
        minWidth: 450,
    },
    operationDetailsLabel: {
        minWidth: 170
    },
    row: {
        cursor: "pointer",
    },
    selected: {
        backgroundColor: indigo[50] + '!important',
        color: "#fff !important",
        "&:hover": {
            backgroundColor: "transparent !important",
        },
    },
    hoverx: {
        "&:hover": {
            backgroundColor: grey[50] + "!important",
            color: " #fff !important",
        },
    },
    column: {
        color: "inherit !important",
    },
}), { defaultTheme: theme });

const statusColors = {
    good: 'rgb(76, 175, 80)',
    bad: 'rgb(244, 67, 54)',
    neutral: 'rgb(97, 97, 97)',
    transition: 'rgb(30, 136, 229)'
};

const baseChipStyles = {
    minWidth: '80px',
    color: '#fff',
    verticalAlign: 'middle'
};


function ArchiveTypeChip(props) {

    let label = 'Unknown';
    if (props.archiveType === 'atSolutionArchive') {
        label = 'Solution';
    }
    else if (props.archiveType === 'atRemoteArchive') {
        label = 'Remote'
    }
    else if (props.archiveType === 'atModificationArchive') {
        label = 'Modification'
    }

    return (
        <span>{label}</span>
    )
}

function OperationTypeChip(props) {
    const classes = useStyles();

    let label = 'Unknown';
    if (props.operationType === 'iotInstall') {
        label = 'Install';
    }
    else if (props.operationType === 'iotUninstall') {
        label = 'Uninstall'
    }

    return (
        <Chip sx={{ ...baseChipStyles, backgroundColor: statusColors.neutral }} label={label} />
    )
}

function OperationStateChip(props) {
    const classes = useStyles();

    let label = 'Unknown';
    let chipStyles = { ...baseChipStyles, backgroundColor: statusColors.neutral };

    if (props.operationState === 'iosScheduled') {
        label = 'Scheduled';
        chipStyles = { ...baseChipStyles, backgroundColor: statusColors.transition };
    }
    else if (props.operationState === 'iosInProgress') {
        label = 'In Progress';
        chipStyles = { ...baseChipStyles, backgroundColor: statusColors.transition };
    }
    else if (props.operationState === 'iosRebootRequired') {
        label = 'Reboot Required';
        chipStyles = { ...baseChipStyles, backgroundColor: statusColors.transition };
    }
    else if (props.operationState === 'iosSucceeded') {
        label = 'Succeeded';
        chipStyles = { ...baseChipStyles, backgroundColor: statusColors.good };
    }
    else if (props.operationState === 'iosFailed') {
        label = 'Failed';
        chipStyles = { ...baseChipStyles, backgroundColor: statusColors.bad };
    }
    else if (props.operationState === 'iosPartialSuccess') {
        label = 'Partial Success';
        chipStyles = { ...baseChipStyles, backgroundColor: statusColors.good };
    }
    else if (props.operationState === 'iosPermissionsPrompt') {
        label = 'Permissions Prompt';
        chipStyles = { ...baseChipStyles, backgroundColor: statusColors.transition };
    }

    return (
        <Chip sx={chipStyles} label={label} />
    )
}

function InstallerOperationDetails(props) {

    const operation = props.operation || {};

    return (
        <List component="nav">
            <List component="div" disablePadding>
                <PropertyItem primary="operationId" secondary={operation.operationId || ""} />
                <Divider style={{ marginLeft: "40px" }} />

                <PropertyItem primary="operationState" secondary={operation.operationState || ""} />
                <Divider style={{ marginLeft: "40px" }} />

                <PropertyItem primary="operationType" secondary={operation.operationType || ""} />
                <Divider style={{ marginLeft: "40px" }} />

                <PropertyItem primary="archiveType" secondary={operation.archiveType || ""} />
                <Divider style={{ marginLeft: "40px" }} />

                <PropertyItem primary="packageName" secondary={operation.packageName || ""} />
                <Divider style={{ marginLeft: "40px" }} />

                <PropertyItem primary="solutionId" secondary={operation.solutionId || ""} />
                <Divider style={{ marginLeft: "40px" }} />

                <SolutionDescription description={operation.solutionDescription || {}} />
                <Divider style={{ marginLeft: "40px" }} />

                {operation.scheduledTime &&
                    <>
                        <PropertyItem primary="scheduledTime" secondary={operation.scheduledTime || ""} />
                        <Divider style={{ marginLeft: "40px" }} />
                    </>
                }

                <PropertyItem primary="createdTimestamp" secondary={operation.createdTimestamp || ""} />
                <Divider style={{ marginLeft: "40px" }} />

                <PropertyItem primary="completedTimestamp" secondary={operation.completedTimestamp || ""} />
                <Divider style={{ marginLeft: "40px" }} />

                {operation.installEventDetails &&
                    <>
                        <InstallEventDetails operation={operation || {}} />
                        <Divider style={{ marginLeft: "40px" }} />
                    </>
                }
            </List>
        </List>
    );
}

function InstallEventDetails({ operation }) {
    const [open, setOpen] = useState(false);
    const handleClick = () => {
        setOpen(!open);
    };

    if (operation) {
        return (
            <React.Fragment>
                <List style={{ paddingLeft: "40px" }} component="div" disablePadding >
                    <ListItem button onClick={handleClick} style={{ paddingLeft: "0px", paddingTop: "8px", paddingBottom: "8px" }}>
                        <ListItemText disableTypography
                            primary={
                                <Typography type="body1" style={{ color: grey[600], fontSize: "14px" }}>
                                    installEventDetails
                                </Typography>}
                        /> {open ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding={true}>
                            <PropertyItem primary="eventCode" secondary={operation.installEventDetails.eventCode || ""} />
                            <Divider style={{ marginLeft: "40px" }} />
                            <PropertyItem primary="eventDescription" secondary={operation.installEventDetails.eventDescription || ""} />
                            <Divider style={{ marginLeft: "40px" }} />
                        </List>
                    </Collapse>
                </List>
            </React.Fragment> 
        );
    }
    return null;
}

function InstallerOperation(props) {
    const solutionManagerService = props.service;

    const [isLoading, setIsLoading] = useState(false);
    const [currentOperation, setCurrentOperation] = useState(null);

    useEffect(() => {
        loadInstallerOperation(props.operationId);
    }, [props.operationId]);

    async function handleLoadClicked() {
        loadInstallerOperation(props.operationId);
    }

    async function loadInstallerOperation(operationId) {
        let response;

        console.log(operationId);

        if (!operationId || operationId.length === 0) {
            return;
        }

        setIsLoading(true);
        try {
            response = await solutionManagerService.getInstallerOperation(operationId);
            console.log(JSON.stringify(response));

            if (null !== response) {
                setCurrentOperation(response);
            }
        }
        catch (error) {
            props.postAlert('error', 'Unable to retrieve InstallerOperation ' + operationId + ' - ' + error.cause.message);
        }
        setIsLoading(false);
    }

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" component="h2">Installer Operation</Typography>
                {
                    isLoading ? <Loading message="Loading resource..." /> :
                        (currentOperation && <InstallerOperationDetails operation={currentOperation} />)
                }
            </CardContent>
            <CardActions>
                <LoadRefreshButton data-testid="installer-operations-details-refresh-button" onClick={handleLoadClicked} isLoading={currentOperation === null} location="Installer Operation" />
            </CardActions>
        </Card>
    );
}

function InstallerOperations(props) {

    const classes = useStyles();
    const [isLoading, setIsLoading] = useState(false);
    const [installerOperations, setInstallerOperations] = useState([]);
    const solutionManagerService = props.service;


    useEffect(() => {
        if(props.isLoaded){
            loadInstallerOperations();   
        }
    }, [props.installerEnabled]);

    async function handleLoadClicked() {
        loadInstallerOperations();
    }

    async function loadInstallerOperations() {
        let response;
        setIsLoading(true);
        try {
            const contentFilter = '["members/(operationId, operationType, operationState, archiveType)", "memberIds"]';
            // encoding the contentFilter, the java example will flag [ and " as invalid characters.
            response = await solutionManagerService.enumerateInstallerOperations('includeMembers=true&contentFilter=' + encodeURIComponent(contentFilter));
            console.log(JSON.stringify(response));

            if (null !== response && 'members' in response && null !== response.members) {
                setInstallerOperations(response.members);
            }
        }
        catch (error) {
            props.postAlert('error', 'Unable to enumerate InstallerOperations - ' + error.cause.message);
        }
        setIsLoading(false);
    }

    function handleRowClicked(e, operationId) {
        props.setSelectedOperation(operationId);
    }

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" component="h2">Installer Operations</Typography>
                {
                    isLoading ? <Loading message="Loading resource..." /> :
                        <TableContainer style={{ maxHeight: 300 }} component={Paper}>
                            <Table data-testid="installer-operations-table" className={classes.table} size='small' stickyHeader aria-label="Installer Operations Table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Operation ID</TableCell>
                                        <TableCell align="left">Archive Type</TableCell>
                                        <TableCell align="left">Operation Type</TableCell>
                                        <TableCell align="left">Operation State</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody deselectOnClickaway={false}>
                                    {installerOperations.map((operation) => (
                                        <TableRow classes={{ root: classes.row, hover: classes.hover, selected: classes.selected }} key={operation.operationId} hover onClick={(event) => handleRowClicked(event, operation.operationId)} selected={operation.operationId === props.selectedOperation}>
                                            <TableCell component="th" scope="operation">
                                                {operation.operationId}
                                            </TableCell>
                                            <TableCell align="left">{<ArchiveTypeChip archiveType={operation.archiveType} />}</TableCell>
                                            <TableCell align="left">{<OperationTypeChip operationType={operation.operationType} />}</TableCell>
                                            <TableCell align="left">{<OperationStateChip operationState={operation.operationState} />}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                }
            </CardContent>
            <CardActions>
                <LoadRefreshButton data-testid='installer-operations-refresh-button' onClick={handleLoadClicked} isLoading={isLoading} location="Installer Operations"/>
            </CardActions>
        </Card>
    );
}

export {
    InstallerOperation,
    InstallerOperations
};

