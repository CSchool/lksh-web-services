
export function ShopItemLink(props) {
    return (
        <a href={"shopitem/" + props.id}>{props.text}</a>
    );
}

export function UserLink(props) {
    return (
        <a href={"user/" + props.id}>{props.text}</a>
    );
}
