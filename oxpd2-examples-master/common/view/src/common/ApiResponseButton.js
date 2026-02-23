import React, { useState } from 'react';
import { Tooltip } from '@mui/material';
import MuiButton from '@mui/material/Button';
import { styled } from "@mui/material/styles";

// Enables tooltip to be visible even if child button is disabled
const Button = styled(MuiButton)({
    '&.Mui-disabled': {
        pointerEvents: 'auto'
    }
});

const ButtonWithToolTip = React.forwardRef(({ primaryToolTip, secondaryToolTip, secondaryToolTipCondition, buttonlabel, deviceContext, disabled, ...other }, ref) => {
    let isBound = (deviceContext && deviceContext.currentDevice && deviceContext.currentDevice.bindStatus === "bound");
    let isDisabled = false;

    if (disabled) {
        if (typeof disabled === 'boolean') {
            isDisabled = disabled;
        }
        else {
            isDisabled = disabled();
        }
    }

    let title = "";
    if (isBound) {
        title = isDisabled ? "No API response available" : "Show the most recent api response for this service";
    }
    else {
        title = "Device must be bound";
    }

    const buttonProps = {
        variant: "outlined",
        size: "medium",
        color: "primary",
        disabled: !isBound || isDisabled
    }

    const tooltipProps = {
        disabled: false,
        title: <h3>{title}</h3>
    }

    const [showTooltip, setShowTooltip] = useState(false);

    function HandleMouseIn() {
        setShowTooltip(true);
    }

    function HandleMouseOut() {
        setShowTooltip(false);
    }

    return (
        <div  onMouseOut={HandleMouseOut} onMouseOver={HandleMouseIn}>
            <Tooltip {...other} {...tooltipProps} ref={ref} open={showTooltip}>
                <Button {...other} {...buttonProps} ref={ref}>
                    {buttonlabel}
                </Button>
            </Tooltip>
        </div>
    );
});


export default function ApiResponseButton(props) {
    return (
        <ButtonWithToolTip {...props} {...{
            primaryToolTip: "Show the most recent device api response",
            secondaryToolTip: "Device must be bound",
            secondaryToolTipCondition: (props.deviceContext && props.deviceContext.currentDevice && props.deviceContext.currentDevice.bindStatus === "bound"),
            buttonlabel: "Show API Response",
        }} />
    );
}
