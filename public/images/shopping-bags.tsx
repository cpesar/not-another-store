export const ShoppingBagIcon = ({
  className = "h-12 w-12",
  primaryColor = "#99ecff",
  secondaryColor = "#ffc2c2",
  strokeColor = "#333",
  strokeWidth = "2",
  ...props
}) => (
  <svg
    viewBox="0 -0.96 65 65"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <g transform="translate(-455 -458)">
      <path
        d="M475,520.083h44l-4-52H473Z"
        fill={primaryColor}
        stroke={strokeColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
      />
      <path
        d="M511,520.083H469l4-52h42Z"
        fill={primaryColor}
        stroke={strokeColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
      />
      <path
        d="M463.167,520.083h22l-2-34h-21Z"
        fill={secondaryColor}
        stroke={strokeColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
      />
      <path
        d="M481,520.083H456l2-34h25Z"
        fill={secondaryColor}
        stroke={strokeColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
      />
      <path
        d="M464.663,492.333v2a5,5,0,0,0,5,5h0a5,5,0,0,0,5-5l-.007-2"
        fill="none"
        stroke={strokeColor}
        strokeMiterlimit="10"
        strokeWidth={strokeWidth}
      />
      <g>
        <path
          d="M502,477l0-9a9,9,0,0,0-9-9h0a9,9,0,0,0-9,9v9"
          fill="none"
          stroke={strokeColor}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={strokeWidth}
        />
        <line
          x2="6"
          transform="translate(481 478)"
          fill="#ffffff"
          stroke={strokeColor}
          strokeMiterlimit="10"
          strokeWidth={strokeWidth}
        />
        <line
          x2="6"
          transform="translate(499 478)"
          fill="#ffffff"
          stroke={strokeColor}
          strokeMiterlimit="10"
          strokeWidth={strokeWidth}
        />
      </g>
    </g>
  </svg>
);
