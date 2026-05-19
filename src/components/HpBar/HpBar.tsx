import { HeartIcon } from "@phosphor-icons/react";

type HpBarProps = {
  hp: number;
  maxHp: number;
};

export function HpBar(props: HpBarProps) {
  const { hp, maxHp } = props;

  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: maxHp }).map((_, i) => {
        const filled = i < hp;
        return (
          <HeartIcon
            key={i}
            size={28}
            weight={filled ? "fill" : "regular"}
            className={filled ? "text-accent-blood" : "text-accent-gold-dim"}
          />
        );
      })}
      <span className="ml-2 font-title text-accent-gold-dim text-base">
        {hp}/{maxHp}
      </span>
    </div>
  );
}
