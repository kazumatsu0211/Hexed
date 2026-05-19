import {
  DiamondIcon,
  type Icon,
  type IconWeight,
  LightningIcon,
  LockIcon,
  SparkleIcon,
  SwordIcon,
} from "@phosphor-icons/react";

import type { TileEffect } from "../../../core/types";

const TILE_ICONS: Record<Exclude<TileEffect, "empty">, Icon> = {
  attack: SwordIcon,
  curse: LightningIcon,
  blessing: SparkleIcon,
  treasure: DiamondIcon,
};

type IconProps = {
  weight: IconWeight;
  tileEffect: TileEffect;
  isHidden?: boolean;
};

export function Icon(props: IconProps) {
  const { weight, tileEffect, isHidden = false } = props;

  if (isHidden) {
    return (
      <LockIcon size={32} weight={weight} className="text-accent-gold-dim" />
    );
  }

  if (tileEffect === "empty") return null;

  const TileIcon = TILE_ICONS[tileEffect];
  return <TileIcon size={32} weight={weight} />;
}
