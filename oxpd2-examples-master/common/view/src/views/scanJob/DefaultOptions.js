import { Card, CardActions, CardContent } from '@mui/material';
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { grey } from '@mui/material/colors';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import React, { useContext, useEffect, useState } from 'react';
import ApiResponseButton from '../../common/ApiResponseButton';
import ApiResponseDialog from '../../common/ApiResponseDialog';
import DefaultOption from '../../common/DefaultOption';
import { DeviceContext } from '../../common/DeviceContext';
import LoadRefreshButton from '../../common/LoadRefreshButton';
import Loading from '../../common/Loading';

export function BuildOptions({ option, name }) {
    const [open, setOpen] = useState(false);
    const handleClick = () => {
        setOpen(!open);
    };
    if (option) {
        return (
            <List disablePadding>
                <ListItem button onClick={handleClick} style={{ paddingLeft: "40px", paddingTop: "8px", paddingBottom: "8px" }}>
                    <ListItemText disableTypography
                        primary={
                            <Typography type="body1" style={{ color: grey[600], fontSize: "14px" }}>
                                {name}
                            </Typography>}
                    /> {open ? <ExpandLess /> : <ExpandMore />}
                </ListItem>

                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding={true} style={{ paddingLeft: "40px" }}>
                        {Object.entries(option).map(([key, value]) => (
                            <React.Fragment>
                                <DefaultOption key1={key} value={value} />
                            </React.Fragment>
                        ))
                        }
                    </List>
                </Collapse>

            </List>
        );

    }
    return null
}

function DefaultOptionsDetails({ defaultOptions }) {
    if (defaultOptions) {
        return (
            <List component="nav" >
                <List component="div" disablePadding>
                    <BuildOptions option={defaultOptions.email} name="email" />
                    <BuildOptions option={defaultOptions.ftp} name="ftp" />
                    <BuildOptions option={defaultOptions.http} name="http" />
                    <BuildOptions option={defaultOptions.jobStorage} name="jobStorage" />
                    <BuildOptions option={defaultOptions.localFolder} name="localFolder" />
                    <BuildOptions option={defaultOptions.networkFolder} name="networkFolder" />
                </List>
            </List>
        );
    }
}

function DefaultOptions(props) {
    const deviceContext = useContext(DeviceContext);
    const scanJobService = props.service;
    const [isLoading, setIsLoading] = useState(false);
    const [currentDefaultOptions, setCurrentDefaultOptions] = useState(null);

    const [state, setState] = useState({
        showApiResponse: false,
        showButtons: false
    });

    useEffect(() => {
        loadDefaultOptions(props.defaultOptions);
    }, [props.defaultOptions]);

    async function handleLoadClicked() {
        loadDefaultOptions(props.defaultOptions);
    }

    async function loadDefaultOptions(defaultOptions) {
        let response;

        console.log("loadDefaultOptions");

        setIsLoading(true);
        try {
            response = await scanJobService.getDefaultOptions();
            console.log("getDefaultOptions response:" + JSON.stringify(response));

            if (null !== response) {
                setCurrentDefaultOptions(response);
                setState({ ...state, showButtons: true });
            }
        }
        catch (error) {
            props.postAlert('error', 'Unable to retrieve DefaultOptions - ' + error.cause.message);
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
        <Card>
            <CardContent>
                <Typography variant="h5" component="h2">
                    {"Default Options"}
                </Typography>
                {
                    isLoading ? <Loading message="Loading resource..." /> :
                        (currentDefaultOptions && <DefaultOptionsDetails defaultOptions={currentDefaultOptions} />)
                }
                <ApiResponseDialog title="Default Options API Response" open={state.showApiResponse} apiResponse={currentDefaultOptions} handleClose={handleDialogClose} />
            </CardContent>
            <CardActions>
                <LoadRefreshButton onClick={handleLoadClicked} isLoading={isLoading} location="DefaultOptions" />
                <ApiResponseButton onClick={handleShowApiResponse} deviceContext={deviceContext} disabled={!state.showButtons} />
            </CardActions>
        </Card>
    );
}

export {
    DefaultOptions
};

