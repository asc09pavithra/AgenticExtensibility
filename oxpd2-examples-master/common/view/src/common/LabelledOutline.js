import React from "react";
import ReactDOM from "react-dom";
import InputLabel from "@mui/material/InputLabel";
import { styled } from "@mui/material/styles";

const Root = styled('div')({
    position: "relative",
    marginTop: "8px"
});

const ContentWrapper = styled('div')({
    position: "relative",
});

const Content = styled('div')({
    padding: "18.5px 14px",
});

const StyledInputLabel = styled(InputLabel)({
    position: "absolute",
    color: "black",
    left: 0,
    top: 0,
    transform: "translate(0, -6px) scale(1)",
    fontFamily: 'Monospace',
    fontSize: '11pt',
    marginLeft: '10px'
});

const StyledNotchedOutline = styled('fieldset')({
    borderRadius: '5px',
    width: '160px',
    borderColor: 'rgba(0, 0, 0, 0.23)',
    borderStyle: 'solid',
    borderWidth: '1px',
    margin: 0,
    padding: '0 8px',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    pointerEvents: 'none',
    '& legend': {
        padding: '0 4px',
        fontSize: '0.75em',
        visibility: 'hidden',
        width: 'auto',
        height: '11px',
        display: 'block',
        maxWidth: '0.01px',
        transition: 'max-width 50ms cubic-bezier(0.0, 0, 0.2, 1) 0ms',
        whiteSpace: 'nowrap',
        '&.notched': {
            maxWidth: '1000px',
            transition: 'max-width 100ms cubic-bezier(0.0, 0, 0.2, 1) 50ms'
        }
    }
});

const LabelledOutline = ({ id, label, children, className }) => {
    const [labelWidth, setLabelWidth] = React.useState(0);
    const labelRef = React.useRef(null);
    React.useEffect(() => {
        const labelNode = ReactDOM.findDOMNode(labelRef.current);
        setLabelWidth(labelNode != null ? labelNode.offsetWidth : 0);
    }, [label]);
    if (label != null) {
        return (
            <Root className={className}>
                <StyledInputLabel
                    ref={labelRef}
                    htmlFor={id}
                    variant="outlined"
                    shrink
                >
                    {label}
                </StyledInputLabel>
                <ContentWrapper>
                    <Content id={id}>
                        {children}
                        <StyledNotchedOutline>
                            <legend className={labelWidth > 0 ? 'notched' : ''} style={{ width: labelWidth > 0 ? `${labelWidth + 10}px` : 'auto' }}>
                                <span style={{ paddingLeft: '5px', paddingRight: '5px' }}>
                                    {label}
                                </span>
                            </legend>
                        </StyledNotchedOutline>
                    </Content>
                </ContentWrapper>
            </Root>
        );
    }
    return null;
};
export default LabelledOutline;
