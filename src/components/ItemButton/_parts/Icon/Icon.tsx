import {
  EyeIcon,
  HandIcon,
  type Icon,
  MagnifyingGlassIcon,
  MaskHappyIcon,
  MicrophoneSlashIcon,
} from "@phosphor-icons/react";

import type { ItemId } from "../../../../core/types";

const ITEM_ICONS: Record<ItemId, Icon> = {
  monocle: MagnifyingGlassIcon,
  peephole: EyeIcon,
  pokerFace: MaskHappyIcon,
  cheatingSleeve: HandIcon,
  gag: MicrophoneSlashIcon,
};

type IconProps = {
  itemId: ItemId;
};

export function Icon(props: IconProps) {
  const { itemId } = props;

  const ItemIcon = ITEM_ICONS[itemId];

  return <ItemIcon size={28} weight="regular" />;
}
