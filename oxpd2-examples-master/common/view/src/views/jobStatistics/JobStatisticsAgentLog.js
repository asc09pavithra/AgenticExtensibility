import { Card, CardActions, CardContent, List, ListItem, ListItemText, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import { makeStyles } from '@mui/styles';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import React, { useEffect, useState } from 'react';
import ApiResponseDialog from '../../common/ApiResponseDialog';
import Loading from '../../common/Loading';
import { PropertyHeader, PropertyItem } from '../../common/ResponseTypes';
import SDKButton from '../../common/SDKButton';
import LogService from '../../services/LogService';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { grey } from '@mui/material/colors';
import { NestedObject } from '../../common/NestedObject';

function ArrayItem({ primary, secondary }) {
    let stringArray = secondary.join(", ");
    return (
        <ListItem style={{ paddingLeft: "40px" }}>
            <ListItemText disableTypography
                primary={<Typography type="body1" style={{ color: grey[600], fontSize: "14px" }}>{primary}</Typography>}
                secondary={<Typography type="body1" style={{ fontSize: "18px" }}>{stringArray}</Typography>}
            />
        </ListItem>
    )

}

function BuildProperty({ name, property }) {
    property = property.toString();
    if (property !== undefined || property !== null) {
        return (
            <PropertyItem style={{ paddingtop: "-40px" }} primary={name} secondary={property || ""} />
        );
    }
    return null;
}

function BuildSimpleObject({ object, name }) {
    if (object) {
        return (
            <React.Fragment>
                {name ? <PropertyHeader name={name} /> : null}
                <List style={{ paddingLeft: "40px" }} component="div" disablePadding >
                    {Object.entries(object).map(([key, value], i, { length }) => (
                        <React.Fragment >
                            <BuildProperty name={key} property={value} />
                        </React.Fragment>
                    ))
                    }
                </List>
            </React.Fragment>
        )
    }
    return null;
}

function JobInfo({ JobInfo }) {
    const [open, setOpen] = React.useState(false);
    const handleClick = () => {
        setOpen(!open);
    };

    if (!JobInfo) {
        return null;
    }

    return (
        <React.Fragment>
            <ListItem button onClick={handleClick} disablePadding={true} style={{ paddingLeft: "40px" }}>
                <ListItemText disableTypography
                    primary={
                        <Typography type="body1" style={{ color: grey[600], fontSize: "14px" }}>
                            {"jobInfo"}
                        </Typography>}
                /> {open ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding={true} style={{ paddingLeft: "40px" }}>
                    <PropertyItem primary="applicationName" secondary={JobInfo.applicationName} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <PropertyItem primary="deviceJobName" secondary={JobInfo.deviceJobName} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <PropertyItem primary="jobCategory" secondary={JobInfo.jobCategory} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <PropertyItem primary="jobDataSource" secondary={JobInfo.jobDataSource} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <ArrayItem primary="jobDestinations" secondary={JobInfo.jobDestinations} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <PropertyItem primary="jobDoneStatus" secondary={JobInfo.jobDoneStatus} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <BuildSimpleObject object={JobInfo.jobDoneTimestamp} name="jobDoneTimestamp" />
                    <Divider style={{ marginLeft: "40px" }} />
                    <PropertyItem primary="jobPaused" secondary={JobInfo.jobPaused} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <BuildSimpleObject object={JobInfo.jobStartedTimestamp} name="jobStartedTimestamp" />
                    <Divider style={{ marginLeft: "40px" }} />
                    <PropertyItem primary="parentJobId" secondary={JobInfo.parentJobId} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <PropertyItem primary="processedBy" secondary={JobInfo.processedBy} />
                </List>
            </Collapse>
        </React.Fragment>
    )
}

function PrintInfo({ PrintInfo }) {
    const [open, setOpen] = React.useState(false);
    const handleClick = () => {
        setOpen(!open);
    };

    if (!PrintInfo) {
        return null;
    }

    function Agent({ agent, index }) {
        const [open, setOpen] = React.useState(false);
        const handleClick = () => {
            setOpen(!open);
        };

        let name = "" + index;

        return (
            <React.Fragment >
                <List component="div" disablePadding={true} style={{ paddingLeft: "40px" }}>
                    <ListItem button onClick={handleClick} disablePadding={true} style={{ paddingLeft: "40px" }}>
                        <ListItemText disableTypography
                            primary={
                                <Typography type="body1" style={{ color: grey[600], fontSize: "14px" }}>
                                    {name}
                                </Typography>}
                        /> {open ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding={true} style={{ paddingLeft: "40px" }}>
                            <BuildSimpleObject object={agent.agentUsed} name="agentUsed" />
                            <PropertyItem primary="approximatePagesRemaining" secondary={agent.approximatePagesRemaining} />
                            <Divider style={{ marginLeft: "40px" }} />
                            <PropertyItem primary="approximatePagesRemainingSymbol" secondary={agent.approximatePagesRemainingSymbol} />
                            <Divider style={{ marginLeft: "40px" }} />
                            <PropertyItem primary="batchId" secondary={agent.batchId} />
                            <Divider style={{ marginLeft: "40px" }} />
                            <PropertyItem primary="brand" secondary={agent.brand} />
                            <Divider style={{ marginLeft: "40px" }} />
                            <BuildSimpleObject object={agent.capacity} name="capacity" />
                            <Divider style={{ marginLeft: "40px" }} />
                            <PropertyItem primary="cartridgeApplication" secondary={agent.cartridgeApplication} />
                            <Divider style={{ marginLeft: "40px" }} />
                            <ArrayItem primary="colors" secondary={agent.colors} />
                            <Divider style={{ marginLeft: "40px" }} />
                            <PropertyItem primary="firstInstallDate" secondary={agent.firstInstallDate} />
                            <Divider style={{ marginLeft: "40px" }} />
                            <PropertyItem primary="group" secondary={agent.group} />
                            <Divider style={{ marginLeft: "40px" }} />
                            <PropertyItem primary="healthGaugeLevel" secondary={agent.healthGaugeLevel} />
                            <Divider style={{ marginLeft: "40px" }} />
                            <PropertyItem primary="installDate" secondary={agent.installDate} />
                            <Divider style={{ marginLeft: "40px" }} />
                            <PropertyItem primary="lastErrorCode" secondary={agent.lastErrorCode} />
                            <Divider style={{ marginLeft: "40px" }} />
                            <PropertyItem primary="lastErrorTimestamp" secondary={agent.lastErrorTimestamp} />
                            <Divider style={{ marginLeft: "40px" }} />
                            <PropertyItem primary="lastRecoveryDate" secondary={agent.lastRecoveryDate} />
                            <Divider style={{ marginLeft: "40px" }} />
                            <PropertyItem primary="lastUsedDate" secondary={agent.lastUsedDate} />
                            <Divider style={{ marginLeft: "40px" }} />
                            <PropertyItem primary="levelState" secondary={agent.levelState} />
                            <Divider style={{ marginLeft: "40px" }} />
                            <PropertyItem primary="manufactureDate" secondary={agent.manufactureDate} />
                            <Divider style={{ marginLeft: "40px" }} />
                            <PropertyItem primary="percentLifeRemaining" secondary={agent.percentLifeRemaining} />
                            <Divider style={{ marginLeft: "40px" }} />
                            <PropertyItem primary="percentLifeRemainingSymbol" secondary={agent.percentLifeRemainingSymbol} />
                            <Divider style={{ marginLeft: "40px" }} />
                            <PropertyItem primary="productNumber" secondary={agent.productNumber} />
                            <Divider style={{ marginLeft: "40px" }} />
                            <PropertyItem primary="serialNumber" secondary={agent.serialNumber} />
                            <Divider style={{ marginLeft: "40px" }} />
                            <PropertyItem primary="slotId" secondary={agent.slotId} />
                            <Divider style={{ marginLeft: "40px" }} />
                            <PropertyItem primary="slotRole" secondary={agent.slotRole} />
                            <Divider style={{ marginLeft: "40px" }} />
                            <ArrayItem primary="slotsInGroup" secondary={agent.slotsInGroup} />
                            <Divider style={{ marginLeft: "40px" }} />
                            <PropertyItem primary="state" secondary={agent.state} />
                            <Divider style={{ marginLeft: "40px" }} />
                            <ArrayItem primary="stateReasons" secondary={agent.stateReasons} />
                            <Divider style={{ marginLeft: "40px" }} />
                            <PropertyItem primary="supplyAgentType" secondary={agent.supplyAgentType} />
                            <Divider style={{ marginLeft: "40px" }} />
                            <PropertyItem primary="supplyColor" secondary={agent.supplyColor} />
                            <Divider style={{ marginLeft: "40px" }} />
                            <PropertyItem primary="supplyDescription" secondary={agent.supplyDescription} />
                            <Divider style={{ marginLeft: "40px" }} />
                            <PropertyItem primary="supplyType" secondary={agent.supplyType} />
                            <Divider style={{ marginLeft: "40px" }} />
                            <PropertyItem primary="supplyUniqueId" secondary={agent.supplyUniqueId} />
                            <Divider style={{ marginLeft: "40px" }} />
                            <PropertyItem primary="usageTimeHours" secondary={agent.usageTimeHours} />
                        </List>
                    </Collapse>
                </List>
            </React.Fragment>
        )
    }
    function Agents({ Agents }) {
        const [open, setOpen] = React.useState(false);
        const handleClick = () => {
            setOpen(!open);
        };

        return (
            <React.Fragment>
                <ListItem button onClick={handleClick} disablePadding={true} style={{ paddingLeft: "40px" }}>
                    <ListItemText disableTypography
                        primary={
                            <Typography type="body1" style={{ color: grey[600], fontSize: "14px" }}>
                                {"agents"}
                            </Typography>}
                    /> {open ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    {Agents.map((agent, index) => {
                        return (
                            <Agent agent={agent} index={index} />
                        )
                    })
                    }
                </Collapse>
            </React.Fragment>
        )
    }

    function SheetSet({ sheetSet, index }) {
        const [open, setOpen] = React.useState(false);
        const handleClick = () => {
            setOpen(!open);
        };

        let name = "" + index;

        return (
            <React.Fragment >
                <List component="div" disablePadding={true} style={{ paddingLeft: "40px" }}>
                    <ListItem button onClick={handleClick} disablePadding={true} style={{ paddingLeft: "40px" }}>
                        <ListItemText disableTypography
                            primary={
                                <Typography type="body1" style={{ color: grey[600], fontSize: "14px" }}>
                                    {name}
                                </Typography>}
                        /> {open ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding={true} style={{ paddingLeft: "40px" }}>
                            <PropertyItem primary="backImpressionClassification" secondary={sheetSet.backImpressionClassification} />
                            <Divider style={{ marginLeft: "40px" }} />
                            <PropertyItem primary="count" secondary={sheetSet.count} />
                            <Divider style={{ marginLeft: "40px" }} />
                            <PropertyItem primary="frontImpressionClassification" secondary={sheetSet.frontImpressionClassification} />
                            <Divider style={{ marginLeft: "40px" }} />
                            <PropertyItem primary="logicalMediaOutputId" secondary={sheetSet.logicalMediaOutputId} />
                            <Divider style={{ marginLeft: "40px" }} />
                            <PropertyItem primary="mediaInputId" secondary={sheetSet.mediaInputId} />
                            <Divider style={{ marginLeft: "40px" }} />
                            <PropertyItem primary="mediaSizeId" secondary={sheetSet.mediaSizeId} />
                            <Divider style={{ marginLeft: "40px" }} />
                            <PropertyItem primary="mediaTypeId" secondary={sheetSet.mediaTypeId} />
                            <Divider style={{ marginLeft: "40px" }} />
                            <PropertyItem primary="physicalMediaOutputId" secondary={sheetSet.physicalMediaOutputId} />
                            <Divider style={{ marginLeft: "40px" }} />
                            <PropertyItem primary="plex" secondary={sheetSet.plex} />
                        </List>
                    </Collapse>
                </List>
            </React.Fragment>
        )
    }

    function SheetSets({ SheetSets }) {
        const [open, setOpen] = React.useState(false);
        const handleClick = () => {
            setOpen(!open);
        };
        return (
            <React.Fragment>
                <ListItem button onClick={handleClick} disablePadding={true} style={{ paddingLeft: "40px" }}>
                    <ListItemText disableTypography
                        primary={
                            <Typography type="body1" style={{ color: grey[600], fontSize: "14px" }}>
                                {"printedSheetInfo"}
                            </Typography>}
                    /> {open ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    {SheetSets.map((sheetSet, index) => {
                        return (
                            <SheetSet sheetSet={sheetSet} index={index} />
                        )
                    })
                    }
                </Collapse>
            </React.Fragment>
        )
    }

    function PrintedSheetInfo({ PrintedSheetInfo }) {
        const [open, setOpen] = React.useState(false);
        const handleClick = () => {
            setOpen(!open);
        };

        return (
            <React.Fragment>
                <ListItem button onClick={handleClick} disablePadding={true} style={{ paddingLeft: "40px" }}>
                    <ListItemText disableTypography
                        primary={
                            <Typography type="body1" style={{ color: grey[600], fontSize: "14px" }}>
                                {"printedSheetInfo"}
                            </Typography>}
                    /> {open ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding={true} style={{ paddingLeft: "40px" }}>
                        <PropertyItem primary="otherPrintedSheets" secondary={PrintedSheetInfo.otherPrintedSheets} />
                        <Divider style={{ marginLeft: "40px" }} />
                        <SheetSets SheetSets={PrintedSheetInfo.printedSheetSets} />
                    </List>
                </Collapse>
            </React.Fragment>
        )
    }

    return (
        <React.Fragment>
            <ListItem button onClick={handleClick} disablePadding={true} style={{ paddingLeft: "40px" }}>
                <ListItemText disableTypography
                    primary={
                        <Typography type="body1" style={{ color: grey[600], fontSize: "14px" }}>
                            {"printInfo"}
                        </Typography>}
                /> {open ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding={true} style={{ paddingLeft: "40px" }}>
                    <BuildSimpleObject object={PrintInfo.a4EquivalentBlankDeciSides} name="a4EquivalentBlankDeciSides" />
                    <Divider style={{ marginLeft: "40px" }} />
                    <BuildSimpleObject object={PrintInfo.a4EquivalentColorDeciImpressions} name="a4EquivalentColorDeciImpressions" />
                    <Divider style={{ marginLeft: "40px" }} />
                    <BuildSimpleObject object={PrintInfo.a4EquivalentDuplexDeciSheets} name="a4EquivalentDuplexDeciSheets" />
                    <Divider style={{ marginLeft: "40px" }} />
                    <BuildSimpleObject object={PrintInfo.a4EquivalentMonoChromeDeciImpressions} name="a4EquivalentMonoChromeDeciImpressions" />
                    <Divider style={{ marginLeft: "40px" }} />
                    <BuildSimpleObject object={PrintInfo.a4EquivalentSimplexDeciSheets} name="a4EquivalentSimplexDeciSheets" />
                    <Divider style={{ marginLeft: "40px" }} />
                    <BuildSimpleObject object={PrintInfo.a4EquivalentTotalDeciImpressions} name="a4EquivalentTotalDeciImpressions" />
                    <Divider style={{ marginLeft: "40px" }} />
                    <BuildSimpleObject object={PrintInfo.a4EquivalentTotalDeciSheets} name="a4EquivalentTotalDeciSheets" />
                    <Divider style={{ marginLeft: "40px" }} />
                    <Agents Agents={PrintInfo.agents} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <PropertyItem primary="blankSides" secondary={PrintInfo.blankSides} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <PropertyItem primary="colorImpressions" secondary={PrintInfo.colorImpressions} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <PropertyItem primary="duplexSheets" secondary={PrintInfo.duplexSheets} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <PropertyItem primary="monochromeImpressions" secondary={PrintInfo.monochromeImpressions} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <BuildSimpleObject object={PrintInfo.printSettings} name="printSettings" />
                    <Divider style={{ marginLeft: "40px" }} />
                    <PrintedSheetInfo PrintedSheetInfo={PrintInfo.printedSheetInfo} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <PropertyItem primary="simplexSheets" secondary={PrintInfo.simplexSheets} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <PropertyItem primary="totalImpressions" secondary={PrintInfo.totalImpressions} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <PropertyItem primary="totalSheets" secondary={PrintInfo.totalSheets} />
                    <Divider style={{ marginLeft: "40px" }} />
                </List>
            </Collapse>
        </React.Fragment>
    )
}

function DriverInfo({ DriverInfo }) {
    const [open, setOpen] = React.useState(false);
    const handleClick = () => {
        setOpen(!open);
    };

    if (!DriverInfo) {
        return null;
    }

    return (
        <React.Fragment>
            <ListItem button onClick={handleClick} disablePadding={true} style={{ paddingLeft: "40px" }}>
                <ListItemText disableTypography
                    primary={
                        <Typography type="body1" style={{ color: grey[600], fontSize: "14px" }}>
                            {"driverInfo"}
                        </Typography>}
                /> {open ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding={true} style={{ paddingLeft: "40px" }}>
                    <PropertyItem primary="applicationName" secondary={DriverInfo.applicationName} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <PropertyItem primary="clientHostName" secondary={DriverInfo.clientHostName} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <PropertyItem primary="fileName" secondary={DriverInfo.fileName} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <PropertyItem primary="jobAcct13" secondary={DriverInfo.jobAcct13} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <PropertyItem primary="jobAcct14" secondary={DriverInfo.jobAcct14} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <PropertyItem primary="jobAcct15" secondary={DriverInfo.jobAcct15} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <PropertyItem primary="jobAcct16" secondary={DriverInfo.jobAcct16} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <PropertyItem primary="jobId" secondary={DriverInfo.jobId} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <PropertyItem primary="userDomain" secondary={DriverInfo.userDomain} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <PropertyItem primary="userName" secondary={DriverInfo.userName} />
                    <Divider style={{ marginLeft: "40px" }} />
                </List>
            </Collapse>
        </React.Fragment>
    )
}

function ExtendedUserInfo({ ExtendedUserInfo }) {
    const [open, setOpen] = React.useState(false);
    const handleClick = () => {
        setOpen(!open);
    };

    if (!ExtendedUserInfo) {
        return null;
    }

    function KeyValuePairs({ KeyValuePairs }) {
        const [open, setOpen] = React.useState(false);
        const handleClick = () => {
            setOpen(!open);
        };

        return (
            <React.Fragment>
                <PropertyHeader name="KeyValuePairs" />
                <List style={{ paddingLeft: "40px" }} component="div" disablePadding >
                    {KeyValuePairs.map((value, index) => {
                        if (index > 0) {
                            return (
                                <React.Fragment>
                                    <Divider style={{ marginLeft: "40px" }} />
                                    <BuildSimpleObject style={{ paddingtop: "-40px" }} object={value} />
                                </React.Fragment>
                            )
                        }
                        else {
                            return (
                                <React.Fragment>
                                    <BuildSimpleObject style={{ paddingtop: "-40px" }} object={value} />
                                </React.Fragment>
                            )
                        }

                    })
                    }
                </List>
            </React.Fragment>
        )
    }

    function AuthenticatedUserInfo({ AuthenticatedUserInfo }) {
        const [open, setOpen] = React.useState(false);
        const handleClick = () => {
            setOpen(!open);
        };

        return (
            <React.Fragment>
                <PropertyHeader name="authenticatedUserInfo" />
                <List style={{ paddingLeft: "40px" }} component="div" disablePadding >
                    <PropertyItem primary="authenticationKind" secondary={AuthenticatedUserInfo.authenticationKind} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <PropertyItem primary="displayName" secondary={AuthenticatedUserInfo.displayName} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <PropertyItem primary="emailAddress" secondary={AuthenticatedUserInfo.emailAddress} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <PropertyItem primary="exchangeMailboxUri" secondary={AuthenticatedUserInfo.exchangeMailboxUri} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <PropertyItem primary="fullyQualifiedUserName" secondary={AuthenticatedUserInfo.fullyQualifiedUserName} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <PropertyItem primary="homeFolderPath" secondary={AuthenticatedUserInfo.homeFolderPath} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <KeyValuePairs KeyValuePairs={AuthenticatedUserInfo.keyValuePairs} />
                    <PropertyItem primary="ldapBindUser" secondary={AuthenticatedUserInfo.ldapBindUser} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <PropertyItem primary="ndsContext" secondary={AuthenticatedUserInfo.ndsContext} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <PropertyItem primary="ndsTreeName" secondary={AuthenticatedUserInfo.ndsTreeName} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <PropertyItem primary="sAMAccountName" secondary={AuthenticatedUserInfo.sAMAccountName} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <PropertyItem primary="sidString" secondary={AuthenticatedUserInfo.sidString} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <PropertyItem primary="userDomain" secondary={AuthenticatedUserInfo.userDomain} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <PropertyItem primary="userName" secondary={AuthenticatedUserInfo.userName} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <PropertyItem primary="userPrincipalName" secondary={AuthenticatedUserInfo.userPrincipalName} />

                </List>
            </React.Fragment>
        )
    }

    return (
        <React.Fragment>
            <ListItem button onClick={handleClick} disablePadding={true} style={{ paddingLeft: "40px" }}>
                <ListItemText disableTypography
                    primary={
                        <Typography type="body1" style={{ color: grey[600], fontSize: "14px" }}>
                            {"extendedUserInfo"}
                        </Typography>}
                /> {open ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding={true} style={{ paddingLeft: "40px" }}>
                    <AuthenticatedUserInfo AuthenticatedUserInfo={ExtendedUserInfo.authenticatedUserInfo} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <PropertyItem primary="authenticationAgentId" secondary={ExtendedUserInfo.authenticationAgentId} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <PropertyItem primary="authenticationAgentName" secondary={ExtendedUserInfo.authenticationAgentName} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <PropertyItem primary="authorizationAgentId" secondary={ExtendedUserInfo.authorizationAgentId} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <PropertyItem primary="authorizationAgentName" secondary={ExtendedUserInfo.authorizationAgentName} />
                </List>
            </Collapse>
        </React.Fragment>
    )
}

function NotificationRow({ log }) {
    const [open, setOpen] = React.useState(false);
    const [allExpanded, setAllExpanded] = useState(false);
    const handleClick = () => {
        setOpen(!open);
    };

    async function handleExpandAll() {
        setAllExpanded(true);
        
    }

    async function handleCollapseAll() {
        setAllExpanded(false);
        
    }

    function BuildNotificationStatistics({ statisticsCallbackPayload }) {
        const [open, setOpen] = React.useState(false);
        const handleClick = () => {
            setOpen(!open);
        };

        return (
            <React.Fragment>
            <PropertyItem primary="lastSequenceNumberNotified" secondary={statisticsCallbackPayload.lastSequenceNumberNotified} />
            <Divider style={{ marginLeft: "40px" }} />
            <PropertyItem primary="lastSequenceNumberProcessed" secondary={statisticsCallbackPayload.lastSequenceNumberProcessed} />
            <Divider style={{ marginLeft: "40px" }} />
            <BuildSimpleObject object={statisticsCallbackPayload.missingSequenceNumbers} name="missingSequenceNumbers" />
            <Divider style={{ marginLeft: "40px" }} />
            {statisticsCallbackPayload.jobDetails.map((jobDetail, index) => (
                <React.Fragment>
                <ListItem button onClick={handleClick} disablePadding={true} style={{ paddingLeft: "40px" }}>
                    <ListItemText disableTypography
                    primary={
                        <Typography type="body1" style={{ color: grey[600], fontSize: "14px" }}>
                        {"Job Details " + index}
                        </Typography>}
                    /> {open ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding={true} style={{ paddingLeft: "40px" }}>
                    <PropertyItem primary="jobId" secondary={jobDetail.jobId} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <PropertyItem primary="sequenceNumber" secondary={jobDetail.sequenceNumber} />
                    <Divider style={{ marginLeft: "40px" }} />
                    { jobDetail.jobInfo ? <NestedObject resource={jobDetail.jobInfo} name="jobInfo" expanded={allExpanded}/> : <></>}
                    { jobDetail.aFaxInInfo ? <NestedObject resource={jobDetail.aFaxInInfo} name="aFaxInInfo" expanded={allExpanded}/> : <></>}
                    { jobDetail.aFaxOutInfo ? <NestedObject resource={jobDetail.aFaxOutInfo} name="aFaxOutInfo" expanded={allExpanded}/> : <></>}
                    { jobDetail.driverInfo ? <NestedObject resource={jobDetail.driverInfo} name="driverInfo" expanded={allExpanded}/> : <></>}
                    { jobDetail.emailInfo ? <NestedObject resource={jobDetail.emailInfo} name="emailInfo" expanded={allExpanded}/> : <></>}
                    { jobDetail.extendedUserInfo ? <NestedObject resource={jobDetail.extendedUserInfo} name="extendedUserInfo" expanded={allExpanded}/> : <></>}
                    { jobDetail.folderInfo ? <NestedObject resource={jobDetail.folderInfo} name="folderInfo" expanded={allExpanded}/> : <></>}
                    { jobDetail.ftpInfo ? <NestedObject resource={jobDetail.ftpInfo} name="ftpInfo" expanded={allExpanded}/> : <></>}
                    { jobDetail.httpInfo ? <NestedObject resource={jobDetail.httpInfo} name="httpInfo" expanded={allExpanded}/> : <></>}
                    { jobDetail.ipFaxInInfo ? <NestedObject resource={jobDetail.ipFaxInInfo} name="ipFaxInInfo" expanded={allExpanded}/> : <></>}
                    { jobDetail.ipFaxOutInfo ? <NestedObject resource={jobDetail.ipFaxOutInfo} name="ipFaxOutInfo" expanded={allExpanded}/> : <></>}
                    { jobDetail.printInfo ? <NestedObject resource={jobDetail.printInfo} name="printInfo" expanded={allExpanded}/> : <></>}
                    { jobDetail.scanInfo ? <NestedObject resource={jobDetail.scanInfo} name="scanInfo" expanded={allExpanded}/> : <></>}
                    </List>
                </Collapse>
                </React.Fragment>
            ))
            }

            </React.Fragment>
        )
    }

    return (
        <React.Fragment>
            <TableRow>
                <TableCell component="th" scope="row">{log.timeStamp}</TableCell>
                <TableCell>
                    {(log.data != null && Object.keys(log.data.jobDetails).length > 0) ?
                        <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                        : 'NA'
                    }
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <BuildNotificationStatistics statisticsCallbackPayload={log.data} />

                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

function JobStatisticsNotificationLogs(props) {
    const logs = props.logs || [];

    return (
        <TableContainer style={{ maxHeight: 600 }} component={Paper}>
            <Table size='small' stickyHeader aria-label="Statistics Notifications Table">
                <TableHead>
                    <TableRow>
                        <TableCell>Date/TimeStamp</TableCell>
                        <TableCell align="left">Statistics</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {logs.map((log) => (
                        <NotificationRow key={log.timestamp} log={log} />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

function JobStatisticsAgentLogContent(props) {
    let logService = new LogService('http://localhost:5000/oxpd2-examples/api');
    const [isNotificationLoading, setNotificationLoading] = useState(false);

    const [notificationLog, setNotificationLog] = useState(null);
    const [showNotificationResponse, setShowNotificationResponse] = useState(false);

    useEffect(() => {
        loadJobStatisticsNotificationLogContent();
    }, []);

    async function loadJobStatisticsNotificationLogContent() {
        let response;
        console.log("in loadJobStatisticsNotificationLogContent");

        setNotificationLoading(true);
        try {
            response = await logService.getLog("jobStatisticsNotifications");
            console.log(JSON.stringify(response));

            if (null !== response) {
                setNotificationLog(response);
            }
        }
        catch (error) {
            props.postAlert('error', 'Unable to retrieve Job Statistics Notification logs - ' + error.cause.message);
        }
        setNotificationLoading(false);
    }

    async function clearJobStatisticsNotificationLog() {
        console.log("in clearJobStatisticsNotificationLog");

        setNotificationLoading(true);
        try {
            await logService.clearLog("jobStatisticsNotifications");
            setNotificationLog(null);
        }
        catch (error) {
            console.log("error" + error);
            props.postAlert('error', 'Unable to delete/clear Job Statistics Notification log data - ' + error.cause.message);
        }
        setNotificationLoading(false);
    }

    async function handleJobStatisticsNotificationDialogOpen() {
        setShowNotificationResponse(true);
    }

    async function handleJobStatisticsNotificationDialogClose() {
        setShowNotificationResponse(false);
    }

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Card>
                    <CardContent>
                        <Typography>Job Statistics Notifications</Typography>
                        {
                            isNotificationLoading ? <Loading message="Loading resource..." /> :
                                (notificationLog && <JobStatisticsNotificationLogs logs={notificationLog} />)
                        }
                    </CardContent>
                    <CardActions>
                        <SDKButton
                            disabled={false}
                            postAlert={props.postAlert}
                            buttonlabel="Refresh"
                            primaryToolTip="Refresh JobStatistics Notification Log"
                            secondaryToolTip="Log Unavailable"
                            secondaryToolTipCondition={true}
                            onClick={loadJobStatisticsNotificationLogContent}
                        />
                        <SDKButton
                            disabled={false}
                            postAlert={props.postAlert}
                            buttonlabel="Clear"
                            primaryToolTip="Clear JobStatistics Notification Log"
                            secondaryToolTip="Log Unavailable"
                            secondaryToolTipCondition={true}
                            onClick={clearJobStatisticsNotificationLog}
                        />
                        <SDKButton
                            disabled={!notificationLog}
                            postAlert={props.postAlert}
                            buttonlabel="Show Log"
                            primaryToolTip="Show JobStatistics Notification Log"
                            secondaryToolTip="Log Unavailable"
                            secondaryToolTipCondition={notificationLog != null}
                            onClick={handleJobStatisticsNotificationDialogOpen}
                        />
                        <ApiResponseDialog title="Job Statistics Log" open={showNotificationResponse} apiResponse={notificationLog} handleClose={handleJobStatisticsNotificationDialogClose} />
                    </CardActions>
                </Card>
            </Grid>
        </Grid>
    );
}
export {
    JobStatisticsAgentLogContent
};
