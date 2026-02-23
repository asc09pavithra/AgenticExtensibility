import { Box, List } from '@mui/material';
import Collapse from '@mui/material/Collapse';
import { grey } from '@mui/material/colors';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import React, { useState } from 'react';
import { useStyles } from '../../common/commonStyles';
import { BindableStringValue, PropertyHeader, PropertyItem } from '../../common/ResponseTypes';
import SolutionDescription from './SolutionDescription';

export default function SolutionDetails(props) {
    const classes = useStyles();
    const solutionJson = (props.solution ? props.solution : null);

    return (
        <List component="nav" className={classes.root}>
            <List component="div" disablePadding>
                {solutionJson.contextProfile &&
                    <React.Fragment>
                        <BuildContextProfile contextProfile={solutionJson.contextProfile || {}} />
                        <Divider style={{ marginLeft: "40px" }} />
                    </React.Fragment>
                }

                {solutionJson.dependencies && 
                    <React.Fragment>
                        <BuildDependencies dependencies={solutionJson.dependencies || {}} />
                        <Divider style={{ marginLeft: "40px" }} />
                    </React.Fragment>
                }

                {solutionJson.description && 
                    <React.Fragment>
                        <SolutionDescription description={solutionJson.description || {}} />
                        <Divider style={{ marginLeft: "40px" }} />
                    </React.Fragment>
                }
                

                {solutionJson.initializedState &&
                    <React.Fragment>
                        <PropertyItem primary="initializedState" secondary={solutionJson.initializedState || ""} />
                        <Divider style={{ marginLeft: "40px" }} />
                    </React.Fragment>
                }

                {solutionJson.installCodeState && 
                    <React.Fragment>
                        <PropertyItem primary="installCodeState" secondary={solutionJson.installCodeState || ""} />
                        <Divider style={{ marginLeft: "40px" }} />
                    </React.Fragment>
                }

                {solutionJson.installationDetails && 
                    <React.Fragment>
                        <PropertyHeader name={"installationDetails"} />
                        <List style={{ paddingLeft: "40px" }} component="div" disablePadding >
                            <PropertyItem primary="installationDate" secondary={solutionJson.installationDetails.installationDate || ""} />
                            <Divider style={{ marginLeft: "40px" }} />
                            <PropertyItem primary="packageName" secondary={solutionJson.installationDetails.packageName || ""} />
                        </List>
                        <Divider style={{ marginLeft: "40px" }} />
                    </React.Fragment>
                }

                {solutionJson.registrations && 
                    <React.Fragment>
                        <Registrations registrations={solutionJson.registrations || {}} />
                        <Divider style={{ marginLeft: "40px" }} />
                    </React.Fragment>
                }

                <PropertyItem primary="solutionId" secondary={solutionJson.solutionId || ""} />
                <Divider style={{ marginLeft: "40px" }} />

                {solutionJson.state && 
                    <React.Fragment>
                        <PropertyItem primary="state" secondary={solutionJson.state || ""} />
                        <Divider style={{ marginLeft: "40px" }} />
                    </React.Fragment>
                }

                {solutionJson.trustedSites && 
                    <BindableStringValue bindedValue={solutionJson.trustedSites.sites || {}} name="trustedSites" />
                }
            </List>
        </List>
    )
}

// For a future release when packages are added
function Packages({ packages }) {
    const [open, setOpen] = useState(false);
    const handleClick = () => {
        setOpen(!open);
    };

    if (packages && packages.length > 0) {
        return (
            <List style={{ paddingLeft: "40px" }} component="div" disablePadding>
                <ListItem button onClick={handleClick} style={{ paddingLeft: "0px", paddingTop: "8px", paddingBottom: "8px" }}>
                        <ListItemText disableTypography
                            primary={
                                <Typography type="body1" style={{ color: grey[600], fontSize: "14px" }}>
                                    packages
                                </Typography>}
                        /> {open ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding={true} style={{ paddingLeft: "0px" }}>
                        {packages.map(packageData => (
                            <Package packageData={packageData} />
                        ))}
                    </List>
                </Collapse>
            </List>
        );
    }
    return null;
}

// For a future release when packages are added
function Package({ packageData }) {
    const [open, setOpen] = useState(false);
    const handleClick = () => {
        setOpen(!open);
    };

    if (packageData && packageData.oxpdPlatformPackage) {
        return (
            <List style={{ paddingLeft: "40px" }} component="div" disablePadding>
                <ListItem button onClick={handleClick} style={{ paddingLeft: "0px", paddingTop: "8px", paddingBottom: "8px" }}>
                    <ListItemText disableTypography
                        primary={
                            <Typography type="body1" style={{ color: grey[600], fontSize: "14px" }}>
                                OXPd platform package currently unsupported
                            </Typography>}
                    />
                </ListItem>
            </List>
        );
    } else if (packageData && packageData.workpathPlatformPackage && packageData.workpathPlatformPackage.workpathPackagePath) {
        return (
            <List style={{ paddingLeft: "40px" }} component="div" disablePadding>
                <ListItem button onClick={handleClick} style={{ paddingLeft: "0px", paddingTop: "8px", paddingBottom: "8px" }}>
                    <ListItemText disableTypography
                        primary={
                            <Typography type="body1" style={{ color: grey[600], fontSize: "14px" }}>
                                {packageData.workpathPlatformPackage.workpathPackagePath}
                            </Typography>}
                    />
                </ListItem>
            </List>
        );
    } else if (packageData && packageData.containerPlatformPackage && packageData.containerPlatformPackage.containerPackagePath) {
        return (
            <List style={{ paddingLeft: "40px" }} component="div" disablePadding>
                <ListItem button onClick={handleClick} style={{ paddingLeft: "0px", paddingTop: "8px", paddingBottom: "8px" }}>
                        <ListItemText disableTypography
                            primary={
                                <Typography type="body1" style={{ color: grey[600], fontSize: "14px" }}>
                                    {packageData.containerPlatformPackage.containerPackagePath}
                                </Typography>}
                        /> {open ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding={true} style={{ paddingLeft: "40px" }}>
                        <PropertyItem primary="description" secondary={packageData.containerPlatformPackage.description || ""} />
                        <Divider style={{ marginLeft: "40px" }} />
                        <IntegerList data={packageData.containerPlatformPackage.externalPorts} name="externalPorts" />
                        <Divider style={{ marginLeft: "40px" }} />
                        <PropertyItem primary="rootfsVersion" secondary={packageData.containerPlatformPackage.rootfsVersion || ""} />
                        <Divider style={{ marginLeft: "40px" }} />
                        <PropertyItem primary="usbAccessNeeded" secondary={packageData.containerPlatformPackage.usbAccessNeeded+"" || ""} />
                    </List>
                </Collapse>
            </List>
        );
    }
    return null;
}

function IntegerList({ data, name }) {
    const [open, setOpen] = useState(false);
    const handleClick = () => {
        setOpen(!open);
    };

    if (data) {
        return(
            <List style={{ paddingLeft: "40px" }} component="div" disablePadding>
            <ListItem button onClick={handleClick} style={{ paddingLeft: "0px", paddingTop: "8px", paddingBottom: "8px" }}>
                    <ListItemText disableTypography
                        primary={
                            <Typography type="body1" style={{ color: grey[600], fontSize: "14px" }}>
                                {name}
                            </Typography>}
                    /> {open ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding={true} >
                    {data.map(value => (
                        <React.Fragment>
                            <PropertyItem secondary={value || ""} />
                        </React.Fragment>
                    ))}
                </List>
            </Collapse>
        </List>
        );
    }
    return null;
}

function Registrations({ registrations }) {
    const [open, setOpen] = useState(false);
    const handleClick = () => {
        setOpen(!open);
    };

    if (registrations && registrations.length > 0) {
        return (
            <List style={{ paddingLeft: "40px" }} component="div" disablePadding>
                <ListItem button onClick={handleClick} style={{ paddingLeft: "0px", paddingTop: "8px", paddingBottom: "8px" }}>
                        <ListItemText disableTypography
                            primary={
                                <Typography type="body1" style={{ color: grey[600], fontSize: "14px" }}>
                                    registrations
                                </Typography>}
                        /> {open ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding={true} style={{ paddingLeft: "40px" }}>
                        {registrations.map(registration => (
                            <Registration registration={registration}/>
                        ))}
                    </List>
                </Collapse>
            </List>
        );
    }
    return null;
}

function Registration({ registration }) {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const handleClick = () => {
        setOpen(!open);
    };

    if (registration && registration.record && registration.record.typeGUN) {
        return (
            <List component="div" disablePadding={true}>
                <ListItem button onClick={handleClick} style={{ paddingLeft: "0px", paddingTop: "8px", paddingBottom: "8px" }}>
                    <ListItemText disableTypography
                        primary={
                            <Typography type="body1" style={{ color: grey[600], fontSize: "14px" }}>
                                {registration.record.typeGUN}
                            </Typography>}
                    /> {open ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding={true}>
                        {registration.record.value && 
                            <Box className={classes.json} m={1}><pre className={classes.fit}>{JSON.stringify(registration.record.value, undefined, 2)}</pre></Box>
                        }
                    </List>
                    <Divider style={{ marginLeft: "40px" }} />
                </Collapse>
            </List>
        );
    }
    return null;
}

// For a future release when host sets are added
function BuildHostSets({ hostSets }) {
    const [open, setOpen] = useState(false);
    const handleClick = () => {
        setOpen(!open);
    };

    if (hostSets) {
        return (
            <React.Fragment>
                <List style={{ paddingLeft: "40px" }} component="div" disablePadding >
                    <ListItem button onClick={handleClick} style={{ paddingLeft: "0px", paddingTop: "8px", paddingBottom: "8px" }}>
                        <ListItemText disableTypography
                            primary={
                                <Typography type="body1" style={{ color: grey[600], fontSize: "14px" }}>
                                    hostSets
                                </Typography>}
                        /> {open ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <React.Fragment>
                            {hostSets.length > 0 &&
                                <List component="div" disablePadding={true}>
                                    {hostSets.map(hostSet => (
                                        <React.Fragment>
                                            <PropertyHeader name={hostSet.name || ""} />
                                            <List component="div" disablePadding={true} style={{ paddingLeft: "40px" }}>
                                                <BuildHealthTarget healthTarget={hostSet.healthTarget || {}} />
                                                <Divider style={{ marginLeft: "40px" }} />

                                                <BuildHosts hosts={hostSet.hosts || {}} />
                                            </List>
                                        </React.Fragment>
                                    ))}
                                </List>
                            }
                        </React.Fragment>
                    </Collapse>
                </List>
            </React.Fragment>
        );
    }
    return null;
}

// For a future release when host sets are added
function BuildHosts({ hosts }) {
    const [open, setOpen] = useState(false);
    const handleClick = () => {
        setOpen(!open);
    };

    if (hosts && hosts.expression) {
        return (
            <React.Fragment>
                <List component="div" disablePadding={true} style={{ paddingLeft: "40px" }}>
                    <ListItem button onClick={handleClick} style={{ paddingLeft: "0px", paddingTop: "8px", paddingBottom: "8px" }}>
                        <ListItemText disableTypography
                            primary={
                                <Typography type="body1" style={{ color: grey[600], fontSize: "14px" }}>
                                    hosts
                                </Typography>}
                        /> {open ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <PropertyHeader name={"expression"} />
                        
                        <List component="div" disablePadding={true} style={{ paddingLeft: "40px" }}>
                            <PropertyHeader name={"expressedValue"} />
                            {hosts.expression.expressedValue && hosts.expression.expressedValue.length > 0 &&
                                <List component="div" disablePadding={true} style={{ paddingLeft: "40px" }}>
                                    {hosts.expression.expressedValue.map(value => (
                                        <React.Fragment>
                                            <PropertyItem secondary={value || ""} />
                                        </React.Fragment> 
                                    ))}
                                </List>
                            }
                            <PropertyItem primary="expressionPattern" secondary={hosts.expression.expressionPattern || ""} />
                        </List>
                    </Collapse>
                </List>
            </React.Fragment>
        );
    } else if (hosts && hosts.explicit) {
        return (
            <List component="div" disablePadding={true} style={{ paddingLeft: "40px" }}>
                <ListItem button onClick={handleClick} style={{ paddingLeft: "0px", paddingTop: "8px", paddingBottom: "8px" }}>
                    <ListItemText disableTypography
                        primary={
                            <Typography type="body1" style={{ color: grey[600], fontSize: "14px" }}>
                                hosts
                            </Typography>}
                    /> {open ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <PropertyHeader name={"explicit"} />
                    <List component="div" disablePadding={true} style={{ paddingLeft: "40px" }}>
                        <PropertyHeader name={"explicitValue"} />
                        {hosts.explicit.explicitValue && hosts.explicit.explicitValue.length > 0 &&
                            <List component="div" disablePadding={true} style={{ paddingLeft: "40px" }}>
                                {hosts.explicit.explicitValue.map(value => (
                                    <React.Fragment>
                                        <PropertyItem style={{ paddingtop: "-20px" }} secondary={value || ""} />
                                    </React.Fragment> 
                                ))}
                            </List>
                        }
                    </List>
                </Collapse>
            </List>
        );
    }
    return null;
}

// Builds health target for hostSets
// For a future release when host sets are added
function BuildHealthTarget({ healthTarget }) {
    const [open, setOpen] = useState(false);
    const handleClick = () => {
        setOpen(!open);
    };

    if (healthTarget) {
        return (
            <React.Fragment>
                <List style={{ paddingLeft: "40px" }} component="div" disablePadding >
                    <ListItem button onClick={handleClick} style={{ paddingLeft: "0px", paddingTop: "8px", paddingBottom: "8px" }}>
                        <ListItemText disableTypography
                            primary={
                                <Typography type="body1" style={{ color: grey[600], fontSize: "14px" }}>
                                    healthTarget
                                </Typography>}
                        /> {open ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <BindableStringValue bindedValue={healthTarget.healthCheckIntervalSeconds || {}} name="healthCheckIntervalSeconds" />
                        <Divider style={{ marginLeft: "40px" }} />

                        <BindableStringValue bindedValue={healthTarget.healthyThreshold || {}} name="healthyThreshold" />
                        <Divider style={{ marginLeft: "40px" }} />

                        <BindableStringValue bindedValue={healthTarget.path || {}} name="path" />
                        <Divider style={{ marginLeft: "40px" }} />

                        <BuildAuthorization authData={healthTarget.authorization || {}} />
                        <Divider style={{ marginLeft: "40px" }} />

                        <PropertyHeader name={"headers"} />
                        {healthTarget.headers && healthTarget.headers.length > 0 && 
                            <List component="div" disablePadding={true} style={{ paddingLeft: "40px" }}>
                            {healthTarget.headers.map(header => (
                                <React.Fragment>
                                    <PropertyHeader name={header.headerName || ""} />
                                    <List component="div" disablePadding={true} style={{ paddingLeft: "40px" }}>
                                        <BindableStringValue bindedValue={header.headerValue || {}} name="headerValue" />
                                    </List>
                                    <Divider style={{ marginLeft: "40px" }} />
                                </React.Fragment> 
                            ))
                            }
                        </List>
                        }
                    </Collapse>
                </List>
            </React.Fragment> 
        );
    }
    return null;
}

// Build a bearer or basic authorization JSON React output
function BuildAuthorization({ authData }) {
    const [open, setOpen] = useState(false);
    const handleClick = () => {
        setOpen(!open);
    };

    if (authData && authData.basic) {
        return (
            <React.Fragment>
                <List style={{ paddingLeft: "40px" }} component="div" disablePadding={true} >
                    <ListItem button onClick={handleClick} disablePadding={true} style={{ paddingleft: "0px" }}>
                        <ListItemText disableTypography
                            primary={
                                <Typography type="body1" style={{ color: grey[600], fontSize: "14px" }}>
                                    authorization
                                </Typography>}
                        /> {open ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <PropertyHeader name={"basic"} />
                        <List component="div" disablePadding={true} style={{ paddingLeft: "40px" }}>
                            <BindableStringValue bindedValue={authData.basic.password || {}} name="password" />
                            <Divider style={{ marginLeft: "40px" }} />
                            <BindableStringValue bindedValue={authData.basic.username || {}} name="username" />
                        </List>
                    </Collapse>
                </List>
            </React.Fragment>   
        );
    } else if (authData && authData.bearer) {
        <List style={{ paddingLeft: "40px" }} component="div" disablePadding={true} >
            <ListItem button onClick={handleClick} disablePadding={true} style={{ paddingleft: "0px" }}>
                <ListItemText disableTypography
                    primary={
                        <Typography type="body1" style={{ color: grey[600], fontSize: "14px" }}>
                            authorization
                        </Typography>}
                /> {open ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <PropertyHeader name={"bearer"} />
                <List component="div" disablePadding={true} style={{ paddingLeft: "40px" }}>
                    <BindableStringValue bindedValue={authData.bearer.token || {}} name="token" />
                </List>
            </Collapse>
        </List>
    }
    return null;
}

function BuildContextProfile({ contextProfile }){
    const [open, setOpen] = useState(false);
    const handleClick = () => {
        setOpen(!open);
    };

    if (contextProfile && contextProfile.contextDefinitions) {
        return (
            <React.Fragment>
                <PropertyHeader name={"contextProfile"} />
                <List style={{ paddingLeft: "80px" }} component="div" disablePadding >
                    <ListItem button onClick={handleClick} style={{ paddingLeft: "0px", paddingTop: "8px", paddingBottom: "8px" }}>
                        <ListItemText disableTypography
                            primary={
                                <Typography type="body1" style={{ color: grey[600], fontSize: "14px" }}>
                                    contextDefinitions
                                </Typography>}
                        /> {open ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    {contextProfile.contextDefinitions.length > 0 &&
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding={true}>
                                {contextProfile.contextDefinitions.map(context => (
                                    <BuildContextItem context={ context } />
                                ))
                                }
                            </List>
                        </Collapse>
                    }
                </List>
            </React.Fragment>   
        );
    }
    return null;
}

function BuildContextItem({ context }) {
    const [open, setOpen] = useState(false);
    const handleClick = () => {
        setOpen(!open);
    };

    if (context) {
        return (
            <React.Fragment>
                <List style={{ paddingLeft: "40px" }} component="div" disablePadding >
                    <ListItem button onClick={handleClick} style={{ paddingLeft: "0px", paddingTop: "8px", paddingBottom: "8px" }}>
                        <ListItemText disableTypography
                            primary={
                                <Typography type="body1" style={{ color: grey[600], fontSize: "14px" }}>
                                    {context.key}
                                </Typography>}
                        /> {open ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding={true} style={{ paddingLeft: "40px" }}>
                            <PropertyItem primary="defaultValue" secondary={context.defaultValue || ""} />
                            <Divider style={{ marginLeft: "40px" }} />
                            <PropertyHeader name={"description"} />
                            {context.description && 
                                <List component="div" disablePadding={true} style={{ paddingLeft: "40px" }}>
                                    <PropertyItem primary="i18nAssetId" secondary={context.description.i18nAssetId || ""} />
                                    <Divider style={{ marginLeft: "40px" }} />
                                    <PropertyItem primary="stringId" secondary={context.description.stringId || ""} />
                                </List>
                            }

                            {!context.description && 
                                <List component="div" disablePadding={true} style={{ paddingLeft: "40px" }}>
                                    <PropertyItem primary="i18nAssetId" secondary={""} />
                                    <Divider style={{ marginLeft: "40px" }} />
                                    <PropertyItem primary="stringId" secondary={""} />
                                </List>
                            }
                            <PropertyItem primary="isSensitive" secondary={context.isSensitive+"" || ""} />
                            <Divider style={{ marginLeft: "40px" }} />
                            <PropertyHeader name={"typeInformation"} />
                            <List component="div" disablePadding={true} style={{ paddingLeft: "40px" }}>
                                <PropertyItem primary="schema" secondary={context.typeInformation ? (context.typeInformation.schema || "") : ""} />
                            </List>
                        </List>
                        <Divider style={{ marginLeft: "40px" }} />   
                    </Collapse>
                </List>                  
            </React.Fragment> 
        )
    }
    return null;
}

function BuildDependencies({ dependencies }) {
    const [open, setOpen] = useState(false);
    const handleClick = () => {
        setOpen(!open);
    };

    if(dependencies) {
        return (
            <React.Fragment>
                <List style={{ paddingLeft: "40px" }} component="div" disablePadding >
                    <ListItem button onClick={handleClick} style={{ paddingLeft: "0px", paddingTop: "8px", paddingBottom: "8px" }}>
                        <ListItemText disableTypography
                            primary={
                                <Typography type="body1" style={{ color: grey[600], fontSize: "14px" }}>
                                    dependencies
                                </Typography>}
                        /> {open ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding={true}>
                            <PropertyItem primary="fwRevision" secondary={dependencies.fwRevision || ""} />
                            <Divider style={{ marginLeft: "40px" }} />

                            <PropertyHeader name={"platformRequirements"} />
                            {dependencies.platformRequirements && dependencies.platformRequirements.length > 0 &&
                                <List component="div" disablePadding={true} style={{ paddingLeft: "40px" }}>
                                    {dependencies.platformRequirements.map(requirement => (
                                        <React.Fragment>
                                            <PropertyHeader name={requirement.key} />
                                            <List style={{ paddingLeft: "40px" }} component="div" disablePadding >
                                                <PropertyItem primary="value" secondary={requirement.value || ""} />
                                            </List>
                                        </React.Fragment>
                                    ))}
                                </List>
                            }

                            {!dependencies.platformRequirements &&
                                <List component="div" disablePadding={true} style={{ paddingLeft: "40px" }}>
                                    <p></p>
                                </List>
                            }
                            <Divider style={{ marginLeft: "40px" }} />
                            
                            <PropertyHeader name={"requiredSolutions"} />
                            {dependencies.requiredSolutions && dependencies.requiredSolutions.length > 0 &&
                                <List component="div" disablePadding={true} style={{ paddingLeft: "40px" }}>
                                    {dependencies.requiredSolutions.map(solution => (
                                        <PropertyItem secondary={solution || ""} />
                                    ))}
                                </List>
                            }
                            {!dependencies.requiredSolutions &&
                                <List component="div" disablePadding={true} style={{ paddingLeft: "40px" }}>
                                    <p></p>
                                </List>
                            }

                        </List>
                    </Collapse>
                </List>
            </React.Fragment> 
        );
    }
    return null;
}
