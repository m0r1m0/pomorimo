type Props = {
  className?: string;
};

export function Logo({ className }: Props) {
  return (
    <svg
      width="85"
      height="85"
      viewBox="0 0 85 85"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <ellipse cx="42.5" cy="45.3177" rx="42.5" ry="39.6823" fill="#FF4848" />
      <rect
        width="44.6349"
        height="9.3989"
        transform="matrix(0.935036 0.354554 -0.358001 0.933721 23.9251 1.74927)"
        fill="#4CFF48"
      />
      <ellipse
        cx="4.71892"
        cy="4.69945"
        rx="4.71892"
        ry="4.69945"
        transform="matrix(0.935036 0.354554 -0.358001 0.933721 61.4514 15.9316)"
        fill="#4CFF48"
      />
      <ellipse
        cx="4.71892"
        cy="4.69945"
        rx="4.71892"
        ry="4.69945"
        transform="matrix(0.935036 0.354554 -0.358001 0.933721 19.4235 0.0328369)"
        fill="#4CFF48"
      />
      <rect
        width="44.6363"
        height="9.39861"
        transform="matrix(0.938049 -0.346502 0.349892 0.93679 20.5747 17.5525)"
        fill="#10DC0C"
      />
      <ellipse
        cx="4.71907"
        cy="4.6993"
        rx="4.71907"
        ry="4.6993"
        transform="matrix(0.938049 -0.346502 0.349892 0.93679 58.1918 3.61035)"
        fill="#10DC0C"
      />
      <ellipse
        cx="4.71907"
        cy="4.6993"
        rx="4.71907"
        ry="4.6993"
        transform="matrix(0.938049 -0.346502 0.349892 0.93679 16.0522 19.2136)"
        fill="#10DC0C"
      />
    </svg>
  );
}
