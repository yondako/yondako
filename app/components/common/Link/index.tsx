export default function Link(props: JSX.IntrinsicElements["a"]) {
  const style = "underline hover:text-tako transition-colors";

  return (
    <a
      {...props}
      className={`${style} ${props.className}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      {props.children}
    </a>
  );
}
