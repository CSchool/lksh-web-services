
export function MultilineText(props) {
    return props.text.split('\n').map((str, idx) => <p key={idx}>{str}</p>);
}
