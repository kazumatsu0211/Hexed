import { type Item } from "../../core/types";
import { Icon } from "./_parts/Icon/Icon";
import { itemButtonVariants } from "./ItemButton.styles";

type ItemButtonProps = {
  item: Item;
  onClick: () => void;
  selected?: boolean;
  disabled?: boolean;
};

export function ItemButton(props: ItemButtonProps) {
  const { item, onClick, selected = false, disabled = false } = props;

  const title = `${item.name}: ${item.description}`;
  const className = itemButtonVariants({
    state: selected ? "selected" : "idle",
    disabled,
  });

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={item.name}
      className={className}
    >
      <Icon itemId={item.id} />
    </button>
  );
}
