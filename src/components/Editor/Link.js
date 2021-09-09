// Component to create clickable links inside editor
const Link = (props) => {
  const { url } = props.contentState.getEntity(props.entityKey).getData();
  return (
    <a
      style={{ color: "blue", fontStyle: "italic", cursor: "pointer" }}
      href={url}
      target="_blank"
      rel="noreferrer"
      onClick={(e) => {
        window.open(url, "_blank");
      }}
    >
      {props.children}
    </a>
  );
};

export default Link;
