
export function MultilineText(props) {
    return props.text.split('\n').map(str => <p>{str}</p>);
}
