import {
  CircleIcon,
  DiamondIcon,
  HeartIcon,
  type Icon,
  type IconWeight,
  LockIcon,
  SkullIcon,
  SwordIcon,
} from "@phosphor-icons/react";

import type { TileEffect } from "../../../core/types";

const TILE_ICONS: Record<TileEffect, Icon> = {
  attack: SwordIcon,
  curse: SkullIcon,
  blessing: HeartIcon,
  treasure: DiamondIcon,
  empty: CircleIcon,
};

type IconProps = {
  weight: IconWeight;
  tileEffect: TileEffect;
  isHidden?: boolean;
};

export function Icon(props: IconProps) {
  const { weight, tileEffect, isHidden = false } = props;

  const TileIcon = TILE_ICONS[tileEffect];

  if (isHidden)
    return (
      <LockIcon size={32} weight={weight} className="text-accent-gold-dim" />
    );

  return <TileIcon size={32} weight={weight} />;
}
