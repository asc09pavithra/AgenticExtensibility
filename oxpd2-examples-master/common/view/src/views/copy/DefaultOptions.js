import { Card, CardActions, CardContent } from '@mui/material';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import React, { useContext, useEffect, useState } from 'react';
import ApiResponseButton from '../../common/ApiResponseButton';
import ApiResponseDialog from '../../common/ApiResponseDialog';
import DefaultOption from '../../common/DefaultOption';
import { DeviceContext } from '../../common/DeviceContext';
import LoadRefreshButton from '../../common/LoadRefreshButton';
import Loading from '../../common/Loading';
import { NestedObject } from '../../common/NestedObject';

export function BuildOptions({ option, name }) {
    if (option) {
        return (
            <List component="div" disablePadding={true}>
                {Object.entries(option).map(([key, value]) => (
                    typeof value === 'object' && value !== null ?
                        key !== "links" && key !== "$opMeta" ?
                        <React.Fragment key={key}>
                            <NestedObject excludeDivider={true} excludeTopBar={true} resource={value} name={key} expanded={true} />
                            <Divider style={{ marginLeft: "40px" }} />
                        </React.Fragment> : <></>
                        :
                        <React.Fragment key={key}>
                            <DefaultOption key1={key} value={value} />
                        </React.Fragment>
                ))
                }
            </List>
        );
    }
    return null
}

function DefaultOptions(props) {
    const deviceContext = useContext(DeviceContext);
    const copyService = props.service;
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
            response = await copyService.getDefaultOptions();
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
                        (currentDefaultOptions && <BuildOptions option={currentDefaultOptions} />)
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

