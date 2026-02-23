import LabelledOutline from './LabelledOutline';

export default function Links(props) {
    return (
        <LabelledOutline label="links">
            {props.links.map(link => (
                <p><LabelledOutline label={link.rel}>{link.href || link.hrefTemplate}</LabelledOutline></p>
            ))}
        </LabelledOutline>
    );
}
