import { Icon } from "./_parts/Icon/Icon";
import { buildHeartStates } from "./_utils/buildHeartStates";

type HpBarProps = {
  hp: number;
  maxHp: number;
  label: string;
};

export function HpBar(props: HpBarProps) {
  const { hp, maxHp, label } = props;

  const states = buildHeartStates(hp, maxHp);

  return (
    <div className="flex items-center gap-3">
      <span className="font-title text-accent-gold min-w-[80px]">{label}</span>
      <div className="flex gap-1">
        {states.map((state, i) => (
          <Icon key={i} state={state} />
        ))}
      </div>
      <span className="text-accent-gold/60 ml-2 text-sm">
        {hp}/{maxHp}
      </span>
    </div>
  );
}
