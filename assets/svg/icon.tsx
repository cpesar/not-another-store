import React, { CSSProperties } from "react";

export interface IconProps {
  fill?: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  style?: CSSProperties | undefined;
  viewBok?: string;
  onClickEvent?: React.MouseEventHandler<HTMLButtonElement>;
  children?: React.ReactNode;
}

interface Props extends IconProps {
  viewBox?: string;
  svgPath?: string | undefined;
  custom?: React.ReactNode | undefined;
  polygon?: boolean;
}

const commonWidth = "1em";
const commonHeight = "1em";
const commonColor = "currentColor";

export const SiteIcon: React.FC<Props> = ({
  fill = commonColor,
  width = commonWidth,
  height = commonHeight,
  viewBox = "0 0 48 48",
  polygon = false,
  svgPath = "",
  style,
  className,
  custom,
}) => {
  const paths: string[] = Array.isArray(svgPath) ? svgPath : [svgPath];

  return (
    <span role="img" className={`antIcon ${className}`} style={style}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={viewBox}
        fill={fill}
        width={width}
        height={height}
      >
        {custom
          ? custom
          : paths.map((path: string, index: number) => {
              return polygon ? (
                <polygon points={path} key={index} />
              ) : (
                <path key={index} d={path} />
              );
            })}
      </svg>
    </span>
  );
};

export const SystemIcon: React.FC<Props> = ({
  fill = commonColor,
  width = commonWidth,
  height = commonHeight,
  viewBox = "0 0 32 32",
  polygon = false,
  svgPath = "",
  style,
  className,
  custom,
  onClickEvent,
}) => {
  const paths: string[] = Array.isArray(svgPath) ? svgPath : [svgPath];

  return (
    <span
      role="img"
      className={`antIcon ${className}`}
      style={style}
      onClick={onClickEvent}
    >
      <svg viewBox={viewBox} fill={fill} width={width} height={height}>
        {custom
          ? custom
          : paths.map((path: string, index: number) => {
              return polygon ? (
                <polygon points={path} key={index} />
              ) : (
                <path key={index} d={path} />
              );
            })}
      </svg>
    </span>
  );
};
