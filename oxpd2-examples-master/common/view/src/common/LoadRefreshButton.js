import React, { useContext, useState } from 'react';
import { Tooltip } from '@mui/material';
import MuiButton from '@mui/material/Button';
import { styled } from "@mui/material/styles";
import { DeviceContext } from './DeviceContext';

// Enables tooltip to be visible even if child button is disabled
const Button = styled(MuiButton)({
    '&.Mui-disabled': {
        pointerEvents: 'auto'
    }
});

const ButtonWithToolTip = React.forwardRef(({ primaryToolTip, secondaryToolTip, secondaryToolTipCondition, isLoading, variant, color, ...other }, ref) => {
    const deviceContext = useContext(DeviceContext);
    let isBound = (deviceContext && deviceContext.currentDevice && deviceContext.currentDevice.bindStatus === "bound");
    let isDisabled = false;

    //checks if a boolean is passed in or a function
    if (isLoading) {
        if (typeof isLoading === 'boolean') {
            isDisabled = isLoading;
        }
        else {
            isDisabled = isLoading();
        }
    }

    let title = "";
    if (isBound) {
        title = isDisabled ? "Load/Refresh not available" : primaryToolTip;
    }
    else {
        title = secondaryToolTip;
    }

    // In the future disabled can be equal to !isBound || isDisabled but for now
    // unit tests are not designed with bind functionality in mind
    var buttonProps = {
        variant: "outlined",
        size: "medium",
        color: "primary",
        disabled: isDisabled
    }

    // Helps keep theme of device management page
    if (variant != null) {
        buttonProps.variant = variant;
    }

    if (color != null) {
        buttonProps.color = color;
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
        //...other passes the rest of the props passed in from the parent in case there is something specific
        <div  onMouseOut={HandleMouseOut} onMouseOver={HandleMouseIn}>
            <Tooltip {...other} {...tooltipProps} ref={ref} open={showTooltip}>
                <Button {...other} {...buttonProps} ref={ref}>
                    Load/Refresh
                </Button>
            </Tooltip>
        </div>
    );
});

//Removes location from the rest of the props
export default function LoadRefreshButton({location, ...props}) {
    return (
        <ButtonWithToolTip {...props} {...{
            primaryToolTip: "Load/Refresh " + location,
            secondaryToolTip: "Device must be bound",
            secondaryToolTipCondition: (props.deviceContext && props.deviceContext.currentDevice && props.deviceContext.currentDevice.bindStatus === "bound"),
        }} />
    );
}
