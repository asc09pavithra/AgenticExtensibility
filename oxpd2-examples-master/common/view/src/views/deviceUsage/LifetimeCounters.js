import { Card, CardActions, CardContent, Collapse, Divider, Grid, ListItem, ListItemText, Paper } from '@mui/material';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import { grey } from '@mui/material/colors';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import React, { useContext, useEffect, useState } from 'react';
import ApiResponseButton from '../../common/ApiResponseButton';
import ApiResponseDialog from '../../common/ApiResponseDialog';
import { DeviceContext } from '../../common/DeviceContext';
import LoadRefreshButton from '../../common/LoadRefreshButton';
import Loading from '../../common/Loading';
import { NestedObject } from '../../common/NestedObject';
import { PropertyHeader, PropertyItem } from '../../common/ResponseTypes';

function SheetsByMediaInput({ sheetsByMediaInput }) {
    const [open, setOpen] = useState(false);
    const handleClick = () => {
        setOpen(!open);
    };

    if (sheetsByMediaInput) {
        return (
            <List disablePadding>
                <ListItem button onClick={handleClick} style={{ paddingLeft: "40px", paddingTop: "8px", paddingBottom: "8px" }}>
                    <ListItemText disableTypography
                        primary={
                            <Typography type="body1" style={{ color: grey[600], fontSize: "14px" }}>
                                {"sheetsByMediaInput"}
                            </Typography>}
                    /> {open ? <ExpandLess /> : <ExpandMore />}
                </ListItem>

                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding={true} style={{ paddingLeft: "40px" }}>
                        {sheetsByMediaInput.map((mediaInput) => (
                            <>
                                <OptionalValue usage={mediaInput} valueName={"mediaInput"} includeDivider={false} />
                                <OptionalValue usage={mediaInput} valueName={"total"} />
                            </>
                        ))}
                    </List>
                </Collapse>
            </List>
        );
    } else {
        return (<></>);
    }
}

function SheetsByMediaOutput({ sheetsByMediaOutput }) {
    const [open, setOpen] = useState(false);
    const handleClick = () => {
        setOpen(!open);
    };

    if (sheetsByMediaOutput) {
        return (
            <List disablePadding>
                <ListItem button onClick={handleClick} style={{ paddingLeft: "40px", paddingTop: "8px", paddingBottom: "8px" }}>
                    <ListItemText disableTypography
                        primary={
                            <Typography type="body1" style={{ color: grey[600], fontSize: "14px" }}>
                                {"sheetsByMediaOutput"}
                            </Typography>}
                    /> {open ? <ExpandLess /> : <ExpandMore />}
                </ListItem>

                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding={true} style={{ paddingLeft: "40px" }}>
                        {sheetsByMediaOutput.map((mediaOutput) => (
                            <>
                                <OptionalValue usage={mediaOutput} valueName={"faceDown"} includeDivider={false} />
                                <OptionalValue usage={mediaOutput} valueName={"faceUp"} includeDivider={false} />
                                <OptionalValue usage={mediaOutput} valueName={"mediaOutput"} includeDivider={false} />
                                <OptionalValue usage={mediaOutput} valueName={"total"} />
                            </>
                        ))}
                    </List>
                </Collapse>
            </List>
        );
    } else {
        return (<></>);
    }
}

function SheetsByMediaSize({ sheetsByMediaSize }) {
    const [open, setOpen] = useState(false);
    const handleClick = () => {
        setOpen(!open);
    };

    if (sheetsByMediaSize) {
        return (
            <List disablePadding>
                <ListItem button onClick={handleClick} style={{ paddingLeft: "40px", paddingTop: "8px", paddingBottom: "8px" }}>
                    <ListItemText disableTypography
                        primary={
                            <Typography type="body1" style={{ color: grey[600], fontSize: "14px" }}>
                                {"sheetsByMediaSize"}
                            </Typography>}
                    /> {open ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding={true} style={{ paddingLeft: "40px" }}>
                        {sheetsByMediaSize.map((mediaSize) => (
                            <>
                                <OptionalValue usage={mediaSize} valueName={"mediaSize"} includeDivider={false} />
                                {mediaSize.sheets ? 
                                    <>
                                        <PropertyHeader name="sheets" />
                                        <List style={{ paddingLeft: "40px" }} component="div" disablePadding >
                                            <OptionalValue usage={mediaSize.sheets} valueName={"duplex"} />
                                            <OptionalValue usage={mediaSize.sheets} valueName={"simplex"} />
                                            <OptionalValue usage={mediaSize.sheets} valueName={"total"} includeDivider={false}/>
                                        </List>
                                        <Divider style={{ marginLeft: "40px" }} />
                                    </>
                                : <></>}
                            </>
                        ))}
                    </List>
                </Collapse>
            </List>
        );
    } else {
        return (<></>);
    }
}

function SheetsByMediaType({ sheetsByMediaType }) {
    const [open, setOpen] = useState(false);
    const handleClick = () => {
        setOpen(!open);
    };

    if (sheetsByMediaType) {
        return (
            <List disablePadding>
                <ListItem button onClick={handleClick} style={{ paddingLeft: "40px", paddingTop: "8px", paddingBottom: "8px" }}>
                    <ListItemText disableTypography
                        primary={
                            <Typography type="body1" style={{ color: grey[600], fontSize: "14px" }}>
                                {"sheetsByMediaType"}
                            </Typography>}
                    /> {open ? <ExpandLess /> : <ExpandMore />}
                </ListItem>

                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding={true} style={{ paddingLeft: "40px" }}>
                        {sheetsByMediaType.map((mediaType) => (
                            <>
                                <OptionalValue usage={mediaType} valueName={"mediaType"} includeDivider={false} />
                                <OptionalValue usage={mediaType} valueName={"total"} />
                            </>
                        ))}
                    </List>
                </Collapse>
            </List>
        );
    } else {
        return (<></>);
    }
}

function PrintCategory({ printCategory }) {
    const [open, setOpen] = useState(false);
    const handleClick = () => {
        setOpen(!open);
    }

    if (printCategory) {
        return (
            <List component="div" style={{ paddingLeft: "40px", paddingTop: "8px", paddingBottom: "8px" }}>
                <ListItem button onClick={handleClick} style={{ paddingLeft: "40px", paddingTop: "8px", paddingBottom: "8px" }}>
                    <ListItemText disableTypography
                        primary={
                            <Typography type="body1" style={{ color: grey[600], fontSize: "14px" }}>
                                {"printCategory: " + printCategory.printCategory}
                            </Typography>}
                    /> {open ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <>
                        <OptionalCountUnit base={printCategory} value="imagedArea" includeCenterDivider={true} />
                        <Divider style={{ marginLeft: "40px" }} />

                        <OptionalCountUnit base={printCategory} value="inkUsage" includeCenterDivider={true} />
                        <Divider style={{ marginLeft: "40px" }} />

                        <OptionalCountUnit base={printCategory} value="pageCount" />

                        <OptionalCountUnit base={printCategory} value="printedArea" includeCenterDivider={true} />
                        <OptionalCountUnit base={printCategory} value="usedArea" includeCenterDivider={true} />
                        <OptionalCountUnit base={printCategory} value="usedLength" includeCenterDivider={true} />

                        <Divider style={{ marginLeft: "40px" }} />
                    </>
                </Collapse>
                <Divider />
            </List>
        );
    } else {
        return (<></>);
    }
}

function UsageByPrintCategory({ usageByPrintCategory }) {
    const [open, setOpen] = useState(false);
    const handleClick = () => {
        setOpen(!open);
    };

    if (usageByPrintCategory) {
        return (
            <List disablePadding>
                <ListItem button onClick={handleClick} style={{ paddingLeft: "40px", paddingTop: "8px", paddingBottom: "8px" }}>
                    <ListItemText disableTypography
                        primary={
                            <Typography type="body1" style={{ color: grey[600], fontSize: "14px" }}>
                                {"usageByPrintCategory"}
                            </Typography>}
                    /> {open ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding={true}>
                        {usageByPrintCategory.map((printCategory) => (
                            <PrintCategory printCategory={printCategory} />
                        ))}
                    </List>
                </Collapse>
            </List>
        );
    } else {
        return (<></>);
    }
}

function MediaSize({ mediaSize }) {
    const [open, setOpen] = useState(false);
    const handleClick = () => {
        setOpen(!open);
    }

    if (mediaSize) {
        return (
            <List component="div" style={{ paddingLeft: "40px", paddingTop: "8px", paddingBottom: "8px" }}>
                <ListItem button onClick={handleClick} style={{ paddingLeft: "40px", paddingTop: "8px", paddingBottom: "8px" }}>
                    <ListItemText disableTypography
                        primary={
                            <Typography type="body1" style={{ color: grey[600], fontSize: "14px" }}>
                                {"mediaSize: " + mediaSize.mediaSize}
                            </Typography>}
                    /> {open ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <>
                        <OptionalImpressions base={mediaSize} value={"copyImpressions"} />
                        <OptionalImpressions base={mediaSize} value={"faxInImpressions"} />
                        <OptionalImpressions base={mediaSize} value={"printImpressions"} />
                        <OptionalImpressions base={mediaSize} value={"printOtherImpressions"} />
                        <Divider style={{ marginLeft: "40px" }} />
                    </>
                </Collapse>
                <Divider />
            </List>
        );
    } else {
        return (<></>);
    }
}

function OptionalImpressions({ base, value }) {
    if (base[value]) {
        return (
            <>
                <PropertyHeader name={value} />
                <List style={{ paddingLeft: "40px" }} component="div" disablePadding >
                    <PropertyItem primary="blank" secondary={(base[value] && base[value].blank + "") || ""} />
                    <PropertyItem primary="color" secondary={(base[value] && base[value].color + "") || ""} />
                    <PropertyItem primary="monochrome" secondary={(base[value] && base[value].monochrome + "") || ""} />
                    <PropertyItem primary="total" secondary={(base[value] && base[value].total + "") || ""} />
                </List>
            </>
        )
    } else {
        return (
            <></>
        );
    }
}

function ImpressionsByMediaSize({ impressionsByMediaSize }) {
    const [open, setOpen] = useState(false);
    const handleClick = () => {
        setOpen(!open);
    };

    if (impressionsByMediaSize) {
        return (
            <List disablePadding>
                <ListItem button onClick={handleClick} style={{ paddingLeft: "40px", paddingTop: "8px", paddingBottom: "8px" }}>
                    <ListItemText disableTypography
                        primary={
                            <Typography type="body1" style={{ color: grey[600], fontSize: "14px" }}>
                                {"impressionsByMediaSize"}
                            </Typography>}
                    /> {open ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding={true}>
                        {impressionsByMediaSize.map((mediaSize) => (
                            <MediaSize mediaSize={mediaSize} />
                        ))}
                    </List>
                </Collapse>
            </List>
        );
    } else {
        return (<></>);
    }
}

function MediaKey({ mediaKey }) {
    const [open, setOpen] = useState(false);
    const handleClick = () => {
        setOpen(!open);
    }

    if (mediaKey) {
        return (
            <List component="div" style={{ paddingLeft: "40px", paddingTop: "8px", paddingBottom: "8px" }}>
                <ListItem button onClick={handleClick} style={{ paddingLeft: "40px", paddingTop: "8px", paddingBottom: "8px" }}>
                    <ListItemText disableTypography
                        primary={
                            <Typography type="body1" style={{ color: grey[600], fontKey: "14px" }}>
                                {"mediaKey: " + mediaKey.mediaKeyId}
                            </Typography>}
                    /> {open ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <>
                        <OptionalCountUnit base={mediaKey} value="imagedArea" />
                        <Divider style={{ marginLeft: "40px" }} />

                        <OptionalValue usage={mediaKey} valueName={"mediaCategoryClass"} includeDivider={true} />
                        <OptionalValue usage={mediaKey} valueName={"mediaFamily"} includeDivider={true} />
                        <OptionalValue usage={mediaKey} valueName={"mediaName"} includeDivider={true} />
                        <OptionalValue usage={mediaKey} valueName={"mediaType"} includeDivider={true} />
                        <OptionalValue usage={mediaKey} valueName={"parentMediaFamily"} includeDivider={true} />
                        <OptionalValue usage={mediaKey} valueName={"parentMediaId"} includeDivider={true} />
                        <OptionalValue usage={mediaKey} valueName={"parentMediaName"} includeDivider={true} />

                        <OptionalCountUnit base={mediaKey} value="thickness" />
                        <Divider style={{ marginLeft: "40px" }} />
                        <OptionalCountUnit base={mediaKey} value="usedArea" />
                        <Divider style={{ marginLeft: "40px" }} />
                        <OptionalCountUnit base={mediaKey} value="usedLength" />
                        <Divider style={{ marginLeft: "40px" }} />
                    </>
                </Collapse>
                <Divider />
            </List>
        );
    } else {
        return (<></>);
    }
}

function DimensionalUsageByMediaKey({ dimensionalUsageByMediaKey }) {
    const [open, setOpen] = useState(false);
    const handleClick = () => {
        setOpen(!open);
    };

    if (dimensionalUsageByMediaKey) {
        return (
            <List disablePadding>
                <ListItem button onClick={handleClick} style={{ paddingLeft: "40px", paddingTop: "8px", paddingBottom: "8px" }}>
                    <ListItemText disableTypography
                        primary={
                            <Typography type="body1" style={{ color: grey[600], fontSize: "14px" }}>
                                {"dimensionalUsageByMediaKey"}
                            </Typography>}
                    /> {open ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding={true}>
                        {dimensionalUsageByMediaKey.map((mediaKey) => (
                            <MediaKey mediaKey={mediaKey} />
                        ))}
                    </List>
                </Collapse>
            </List>
        );
    } else {
        return (<></>);
    }
}

function FaxUsage({ faxUsage }) {
    const [open, setOpen] = useState(false);
    const handleClick = () => {
        setOpen(!open);
    };

    if (faxUsage) {
        return (
            <List component="div" disablePadding={true}>
                <ListItem button onClick={handleClick} style={{ paddingLeft: "40px", paddingTop: "10px", paddingBottom: "10px" }}>
                    <ListItemText disableTypography
                        primary={
                            <Typography type="body1" style={{ color: grey[600], fontSize: "14px" }}>
                                faxUsage
                            </Typography>}
                    /> {open ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding={true} style={{ paddingLeft: "40px", paddingTop: '0px', paddingBottom: '10px' }}>
                        <OptionalValue usage={faxUsage} valueName={"archivedAnalogRecievedImages"} />
                        <OptionalValue usage={faxUsage} valueName={"receivedAnalogImages"} />
                        <OptionalValue usage={faxUsage} valueName={"receivedFromPcImages"} />
                        <OptionalValue usage={faxUsage} valueName={"sentAnalogImages"} includeDivider={false} />
                    </List>
                </Collapse>
            </List>
        );
    } else {
        return (<></>);
    }
}

function PrintUsage({ printUsage }) {
    const [open, setOpen] = useState(false);
    const handleClick = () => {
        setOpen(!open);
    };

    if (printUsage) {
        return (
            <List component="div" disablePadding={true}>
                <ListItem button onClick={handleClick} style={{ paddingLeft: "40px", paddingTop: "10px", paddingBottom: "10px" }}>
                    <ListItemText disableTypography
                        primary={
                            <Typography type="body1" style={{ color: grey[600], fontSize: "14px" }}>
                                printUsage
                            </Typography>}
                    /> {open ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding={true} style={{ paddingLeft: "40px", paddingTop: '10px', paddingBottom: '10px' }}>
                        <NestedObject resource={printUsage.a4EquivalentCopyImpressions} excludeDivider={true} excludeTopBar={true} excludeSecondaryTopBar={true} reducedSpacing={true} name="a4EquivalentCopyImpressions" />
                        <NestedObject resource={printUsage.a4EquivalentFaxInImpressions} excludeDivider={true} excludeSecondaryTopBar={true} reducedSpacing={true} name="a4EquivalentFaxInImpressions" />
                        <NestedObject resource={printUsage.a4EquivalentPrintImpressions} excludeDivider={true} excludeSecondaryTopBar={true} reducedSpacing={true} name="a4EquivalentPrintImpressions" />
                        <NestedObject resource={printUsage.a4EquivalentPrintOtherImpressions} excludeDivider={true} excludeSecondaryTopBar={true} reducedSpacing={true} name="a4EquivalentPrintOtherImpressions" />
                        <NestedObject resource={printUsage.copyImpressions} excludeDivider={true} excludeSecondaryTopBar={true} reducedSpacing={true} name="copyImpressions" />
                        <NestedObject resource={printUsage.dimensionalUsage} excludeDivider={true} excludeSecondaryTopBar={true} reducedSpacing={true} name="dimensionalUsage" />
                        <Divider style={{ marginLeft: "40px" }} />
                        <DimensionalUsageByMediaKey dimensionalUsageByMediaKey={printUsage.dimensionalUsageByMediaKey} />
                        <NestedObject resource={printUsage.faxInImpressions} excludeDivider={true} excludeSecondaryTopBar={true} reducedSpacing={true} name="faxInImpressions" />
                        <Divider style={{ marginLeft: "40px" }} />
                        <ImpressionsByMediaSize impressionsByMediaSize={printUsage.impressionsByMediaSize} />
                        <NestedObject resource={printUsage.printImpressions} excludeDivider={true} excludeSecondaryTopBar={true} reducedSpacing={true} name="printImpressions" />
                        <NestedObject resource={printUsage.printOtherImpressions} excludeDivider={true} excludeSecondaryTopBar={true} reducedSpacing={true} name="printOtherImpressions" />
                        <NestedObject resource={printUsage.printSheets} excludeDivider={true} excludeSecondaryTopBar={true} reducedSpacing={true} name="printSheets" />
                        <Divider style={{ marginLeft: "40px" }} />
                        <SheetsByMediaInput sheetsByMediaInput={printUsage.sheetsByMediaInput} />
                        <Divider style={{ marginLeft: "40px" }} />
                        <SheetsByMediaOutput sheetsByMediaOutput={printUsage.sheetsByMediaOutput} />
                        <Divider style={{ marginLeft: "40px" }} />
                        <SheetsByMediaSize sheetsByMediaSize={printUsage.sheetsByMediaSize} />
                        <Divider style={{ marginLeft: "40px" }} />
                        <SheetsByMediaType sheetsByMediaType={printUsage.sheetsByMediaType} />
                        <Divider style={{ marginLeft: "40px" }} />
                        <UsageByPrintCategory usageByPrintCategory={printUsage.usageByPrintCategory} />
                    </List>
                </Collapse>
            </List>
        );
    } else {
        return (<></>);
    }
}

function ImagesByMediaSize ({ imagesByMediaSize }) {
    const [open, setOpen] = useState(false);
    const handleClick = () => {
        setOpen(!open);
    };

    if (imagesByMediaSize) {
        return (
            <List disablePadding>
                <ListItem button onClick={handleClick} style={{ paddingLeft: "40px", paddingTop: "8px", paddingBottom: "8px" }}>
                    <ListItemText disableTypography
                        primary={
                            <Typography type="body1" style={{ color: grey[600], fontSize: "14px" }}>
                                {"imagesByMediaSize"}
                            </Typography>}
                    /> {open ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Divider style={{ marginLeft: "40px" }} />
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding={true} style={{ paddingLeft: "40px" }}>
                        {imagesByMediaSize.map((mediaSize) => (
                            <>
                                <OptionalValue usage={mediaSize} valueName={"images"} includeDivider={false} />
                                <OptionalValue usage={mediaSize} valueName={"mediaSize"} />
                            </>
                        ))}
                    </List>
                </Collapse>
            </List>
        );
    } else {
        return (<></>);
    }
}


function ScanUsage({ scanUsage }) {
    const [open, setOpen] = useState(false);
    const handleClick = () => {
        setOpen(!open);
    };

    if (scanUsage) {
        return (
            <List component="div" disablePadding={true}>
                <ListItem button onClick={handleClick} style={{ paddingLeft: "40px", paddingTop: "10px", paddingBottom: "10px" }}>
                    <ListItemText disableTypography
                        primary={
                            <Typography type="body1" style={{ color: grey[600], fontSize: "14px" }}>
                                scanUsage
                            </Typography>}
                    /> {open ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding={true} style={{ paddingLeft: "40px", paddingTop: '10px', paddingBottom: '10px' }}>
                        <OptionalValue usage={scanUsage} valueName={"adfDuplexImages"} />
                        <OptionalValue usage={scanUsage} valueName={"adfDuplexSheets"} />
                        <OptionalValue usage={scanUsage} valueName={"adfImages"} />
                        <OptionalValue usage={scanUsage} valueName={"adfSheets"} />
                        <OptionalValue usage={scanUsage} valueName={"adfSimplexImages"} />
                        <OptionalValue usage={scanUsage} valueName={"adfSimplexSheets"} />
                        <OptionalValue usage={scanUsage} valueName={"copyImages"} />

                        { scanUsage.dimensionalUsage ? 
                            <>
                                <PropertyHeader name="dimensionalUsage" />
                                <List style={{ paddingLeft: "40px" }} component="div" disablePadding >
                                    <OptionalCountUnit base={scanUsage.dimensionalUsage} value="totalScanArea" />
                                    <Divider style={{ marginLeft: "40px" }} />
                                    <OptionalCountUnit base={scanUsage.dimensionalUsage} value="totalScanLength" />
                                </List>
                                <Divider style={{ marginLeft: "40px" }} />
                            </>
                            : <></>
                        }

                        <OptionalValue usage={scanUsage} valueName={"faxImages"} />
                        <OptionalValue usage={scanUsage} valueName={"flatbedImages"} />
                        <OptionalValue usage={scanUsage} valueName={"flatbedSheets"} />
                        
                        <ImagesByMediaSize imagesByMediaSize={scanUsage.imagesByMediaSize} />

                        <OptionalValue usage={scanUsage} valueName={"sendImages"} />
                        <OptionalValue usage={scanUsage} valueName={"totalImages"} includeDivider={false} />
                    </List>
                </Collapse>
            </List>
        );
    } else {
        return (<></>);
    }
}

function OptionalValue({ usage, valueName, includeDivider=true }) {
    return (
        <>
        { usage[valueName] || usage[valueName] == 0 ? <>
            <PropertyItem primary={valueName} secondary={usage[valueName] + "" || ""} />
            {includeDivider ? <Divider style={{ marginLeft: "40px" }} /> : <></>}
            </> : <></>
        }
        </>
    );
}

function OptionalCountUnit({ base, value, includeCenterDivider=false }) {
    if (base[value]) {
        return (
            <>
                <PropertyHeader name={value} />
                <List style={{ paddingLeft: "40px" }} component="div" disablePadding >
                    <PropertyItem primary="count" secondary={(base[value] && base[value].count + "") || ""} />
                    {includeCenterDivider ? <Divider style={{ marginLeft: "40px" }} /> : <></>}
                    <PropertyItem primary="unit" secondary={(base[value] && base[value].unit + "") || ""} />
                </List>
            </>
        )
    } else {
        return (
            <></>
        );
    }
}

function LifetimeCountersDetails({ lifetimeCounters }) {

    if (lifetimeCounters) {
        return (
            <List component="nav" >
                <List component="div" disablePadding>
                    <FaxUsage faxUsage={lifetimeCounters.faxUsage} />
                    <NestedObject resource={lifetimeCounters.jobUsage} excludeDivider={true} name="jobUsage" />
                    <Divider style={{ marginLeft: "40px" }} />
                    <PrintUsage printUsage={lifetimeCounters.printUsage} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <ScanUsage scanUsage={lifetimeCounters.scanUsage} />
                </List>
            </List>
        );
    }
    return (<></>);
}

export default function LifetimeCounters(props) {
    const deviceContext = useContext(DeviceContext);
    const suppliesService = props.service;
    const [isLoading, setIsLoading] = useState(false);
    const [currentLifetimeCounters, setCurrentLifetimeCounters] = useState(null);

    const [state, setState] = useState({
        showApiResponse: false,
        showButtons: false
    });

    useEffect(() => {
        loadLifetimeCounters(props.agentId);
    }, [props.agentId]);

    async function handleLoadClicked() {
        loadLifetimeCounters(props.agentId);
    }

    async function loadLifetimeCounters(agentId) {
        let response;

        console.log("loadLifetimeCounters.agentId: " + agentId);

        if (!agentId || agentId.length === 0) {
            return;
        }

        setIsLoading(true);
        try {
            response = await suppliesService.getLifetimeCounters(agentId);
            console.log("getLifetimeCounters response:" + JSON.stringify(response));

            if (null !== response) {
                setCurrentLifetimeCounters(response);
                setState({ ...state, showButtons: true });
            }
        }
        catch (error) {
            props.postAlert('error', 'Unable to retrieve LifetimeCounters ' + agentId + ' - ' + error.cause.message);
        }
        setIsLoading(false);
    }


    async function handleDialogClose() {
        setState({ ...state, showApiResponse: false });
    }

    async function handleShowApiResponse() {
        setState({ ...state, showApiResponse: true });
    }

    return (
        <Grid container>
            <Grid item xs={12}>
                <Paper elevation={0}>
                    <Card data-testid="lifetime-counters-card">
                        <CardContent>
                            <Typography variant="h5" component="h2">Lifetime Counters</Typography>
                            {
                                isLoading ? <Loading message="Loading resource..." /> :
                                    (currentLifetimeCounters && <LifetimeCountersDetails lifetimeCounters={currentLifetimeCounters} />)
                            }
                            <ApiResponseDialog title="Lifetime Counters API Response" open={state.showApiResponse} apiResponse={currentLifetimeCounters} handleClose={handleDialogClose} />
                        </CardContent>
                        <CardActions>
                            <LoadRefreshButton data-testid="lifetime-counters-loadrefresh" onClick={handleLoadClicked} isLoading={currentLifetimeCounters === null} location="Lifetime Counters" />
                            <ApiResponseButton data-testid="lifetime-counters-showapiresponse" onClick={handleShowApiResponse} deviceContext={deviceContext} disabled={!state.showButtons} />
                        </CardActions>
                    </Card>
                </Paper>
            </Grid>
        </Grid>
    );
}
