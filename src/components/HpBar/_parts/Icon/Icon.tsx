import { HeartIcon } from "@phosphor-icons/react";

import type { HeartState } from "../../_utils/buildHeartStates";
import { iconVariants } from "./Icon.styles";

type HpBarIconProps = {
  state: HeartState;
};

export function Icon(props: HpBarIconProps) {
  const { state } = props;

  const weight = state === "filled" ? "fill" : "regular";
  const className = iconVariants({ state });

  return <HeartIcon size={24} weight={weight} className={className} />;
}
