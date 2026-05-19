import {
  EyeIcon,
  type Icon,
  MagnifyingGlassIcon,
  MaskHappyIcon,
  MicrophoneSlashIcon,
  ShuffleIcon,
} from "@phosphor-icons/react";

import type { ItemId } from "../../../../core/types";

const ITEM_ICONS: Record<ItemId, Icon> = {
  monocle: MagnifyingGlassIcon,
  peephole: EyeIcon,
  pokerFace: MaskHappyIcon,
  cheatingSleeve: ShuffleIcon,
  gag: MicrophoneSlashIcon,
};

type IconProps = {
  itemId: ItemId;
};

export function Icon(props: IconProps) {
  const { itemId } = props;

  const ItemIcon = ITEM_ICONS[itemId];

  return <ItemIcon size={26} weight="regular" />;
}
