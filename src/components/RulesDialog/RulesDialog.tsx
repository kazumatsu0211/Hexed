import { QuestionIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";

import { CHARACTERS } from "../../core/characters";
import { ITEMS } from "../../core/items";
import type { CharacterId, ItemId, TileEffect } from "../../core/types";
import { ItemButton } from "../ItemButton/ItemButton";
import { TileButton } from "../TileButton/TileButton";

type TabId = "overview" | "flow" | "tiles" | "items" | "characters";

const TABS: { id: TabId; label: string }[] = [
  { id: "overview", label: "概要" },
  { id: "flow", label: "流れ" },
  { id: "tiles", label: "マス" },
  { id: "items", label: "アイテム" },
  { id: "characters", label: "キャラ" },
];

const TILE_DESCRIPTIONS: Record<TileEffect, { name: string; text: string }> = {
  attack: { name: "攻撃", text: "相手に 1 ダメージを与える" },
  curse: {
    name: "呪い",
    text: "自分が 1 ダメージを受ける。ポーカーフェイスや能力で軽減可",
  },
  blessing: { name: "加護", text: "自分の HP を 1 回復" },
  treasure: { name: "宝物", text: "アイテムを 1 個獲得" },
  empty: { name: "空", text: "何も起こらない" },
};

const ITEM_DESCRIPTIONS: Record<ItemId, string> = {
  monocle: "任意の 1 マスの効果を覗く（開封しない）",
  peephole: "未開封の呪いマスを 1 つランダムに露出",
  pokerFace: "次に踏む呪いマスのダメージを無効化",
  cheatingSleeve: "任意の 2 マスの効果を入れ替える（ターンを消費）",
  gag: "相手の次のアイテム使用を封じる",
};

const CHARACTER_FLAVOR: Record<CharacterId, string> = {
  gambler: "無謀な賭け師。手数の多さで押し切る",
  swindler: "仕掛ける詐欺師。呪いを物ともしない",
  connoisseur: "見抜く鑑定士。一度だけ盤面の秘密を覗ける",
};

function mockTile(effect: TileEffect) {
  return {
    effect,
    position: { row: 0, col: 0 },
    isRevealed: true,
  };
}

function OverviewTab() {
  return (
    <div className="space-y-4 text-accent-gold-dim leading-relaxed">
      <p>
        <span className="font-title text-accent-gold text-xl tracking-wider">
          HEXED
        </span>{" "}
        は 5×5 の盤面を巡る、1v1 の心理戦カードゲームです。
      </p>
      <ul className="list-disc list-inside space-y-2">
        <li>互いに HP 3（最大 5）を持って対峙する</li>
        <li>マスには 5 種の効果（攻撃 / 呪い / 加護 / 宝物 / 空）が隠されている</li>
        <li>アイテムやキャラ能力を駆使し、相手の HP を 0 にした方が勝者</li>
        <li>逃げ場のないターン制。一手の選択が命運を分ける</li>
      </ul>
    </div>
  );
}

function FlowTab() {
  return (
    <div className="space-y-5 text-accent-gold-dim leading-relaxed">
      <p>各ターンは、以下の手順で進行します。</p>
      <ol className="space-y-3">
        <li className="flex gap-3">
          <span className="text-accent-gold font-bold">1.</span>
          <span>
            <span className="text-accent-gold">アイテム使用（任意・複数可）</span>
            <br />
            手札のアイテムを 0 個以上使用できる。多くはターンを消費しない
          </span>
        </li>
        <li className="flex gap-3">
          <span className="text-accent-gold font-bold">2.</span>
          <span>
            <span className="text-accent-gold">マスを 1 つ開封</span>
            <br />
            盤面の未開封マスを 1 つクリック。効果が即座に発動し、ターン終了
          </span>
        </li>
        <li className="flex gap-3">
          <span className="text-accent-gold font-bold">3.</span>
          <span>
            <span className="text-accent-gold">相手のターンへ</span>
            <br />
            HP が 0 になっていなければ、相手が同様に行動する
          </span>
        </li>
      </ol>
      <div className="border-2 border-dashed border-accent-gold-dim/40 rounded p-4 text-center text-sm">
        ［ターン進行のスクリーンショット予定地］
      </div>
    </div>
  );
}

function TilesTab() {
  const tileOrder: TileEffect[] = [
    "attack",
    "curse",
    "blessing",
    "treasure",
    "empty",
  ];

  return (
    <div className="space-y-3 text-accent-gold-dim leading-relaxed">
      <p>盤面のマスは 5 種類。開封すると効果が発動します。</p>
      <ul className="space-y-2">
        {tileOrder.map((effect) => {
          const info = TILE_DESCRIPTIONS[effect];
          return (
            <li
              key={effect}
              className="flex items-center gap-4 p-2 border border-accent-gold-dim/30 rounded"
            >
              <div className="shrink-0">
                <TileButton tile={mockTile(effect)} onClick={() => {}} disabled />
              </div>
              <div>
                <div className="text-accent-gold font-bold">{info.name}</div>
                <div className="text-sm">{info.text}</div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function ItemsTab() {
  const itemOrder: ItemId[] = [
    "monocle",
    "peephole",
    "pokerFace",
    "cheatingSleeve",
    "gag",
  ];

  return (
    <div className="space-y-3 text-accent-gold-dim leading-relaxed">
      <p>アイテムは 5 種類。宝物マスや初期手札から入手します。</p>
      <ul className="space-y-2">
        {itemOrder.map((id) => {
          const item = ITEMS[id];
          return (
            <li
              key={id}
              className="flex items-center gap-4 p-2 border border-accent-gold-dim/30 rounded"
            >
              <div className="shrink-0">
                <ItemButton item={item} onClick={() => {}} disabled />
              </div>
              <div>
                <div className="text-accent-gold font-bold">{item.name}</div>
                <div className="text-sm">{ITEM_DESCRIPTIONS[id]}</div>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="border-2 border-dashed border-accent-gold-dim/40 rounded p-4 text-center text-sm">
        ［アイテム使用シーンのスクリーンショット予定地］
      </div>
    </div>
  );
}

function CharactersTab() {
  const ids: CharacterId[] = ["gambler", "swindler", "connoisseur"];

  return (
    <div className="space-y-3 text-accent-gold-dim leading-relaxed">
      <p>キャラは 3 種類。固有の能力が勝負を分けます。</p>
      <ul className="space-y-3">
        {ids.map((id) => {
          const character = CHARACTERS[id];
          return (
            <li
              key={id}
              className="flex items-center gap-4 p-3 border border-accent-gold-dim/30 rounded"
            >
              <img
                src={`/characters/${id}.png`}
                alt={character.name}
                className="w-20 h-20 object-cover rounded shrink-0"
              />
              <div>
                <div className="text-accent-gold font-bold text-lg">
                  {character.name}
                </div>
                <div className="text-sm italic">{CHARACTER_FLAVOR[id]}</div>
                <div className="text-sm text-accent-gold mt-1">
                  能力: {character.description}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function renderTab(tabId: TabId) {
  switch (tabId) {
    case "overview":
      return <OverviewTab />;
    case "flow":
      return <FlowTab />;
    case "tiles":
      return <TilesTab />;
    case "items":
      return <ItemsTab />;
    case "characters":
      return <CharactersTab />;
  }
}

export function RulesDialog() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [direction, setDirection] = useState<1 | -1>(1);

  const activeIndex = TABS.findIndex((t) => t.id === activeTab);

  function open() {
    dialogRef.current?.showModal();
  }

  function close() {
    dialogRef.current?.close();
  }

  function goToTab(id: TabId) {
    const newIndex = TABS.findIndex((t) => t.id === id);
    setDirection(newIndex > activeIndex ? 1 : -1);
    setActiveTab(id);
  }

  function goPrev() {
    if (activeIndex === 0) return;
    setDirection(-1);
    setActiveTab(TABS[activeIndex - 1].id);
  }

  function goNext() {
    if (activeIndex === TABS.length - 1) return;
    setDirection(1);
    setActiveTab(TABS[activeIndex + 1].id);
  }

  return (
    <>
      <div className="fixed bottom-6 right-6 group z-40">
        <button
          type="button"
          onClick={open}
          aria-label="ルールを表示"
          className="w-12 h-12 rounded-full border-2 border-accent-gold-dim text-accent-gold-dim hover:border-accent-gold hover:text-accent-gold transition-colors flex items-center justify-center bg-bg-mid"
        >
          <QuestionIcon size={24} weight="bold" />
        </button>
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1 bg-bg-mid border border-accent-gold text-accent-gold text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          ルール
        </span>
      </div>

      <dialog
        ref={dialogRef}
        className="w-full max-w-2xl bg-bg-mid border-2 border-accent-gold rounded-lg p-0 [&::backdrop]:bg-black/80"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-accent-gold-dim/40">
          <h2 className="text-3xl font-title text-accent-gold tracking-wider">
            ルール
          </h2>
          <button
            type="button"
            onClick={close}
            aria-label="閉じる"
            className="text-accent-gold-dim hover:text-accent-gold text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="flex gap-1 px-6 pt-4 border-b border-accent-gold-dim/40">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => goToTab(tab.id)}
              className={`px-4 py-2 text-sm transition-colors border-b-2 -mb-px ${
                tab.id === activeTab
                  ? "text-accent-gold border-accent-gold"
                  : "text-accent-gold-dim border-transparent hover:text-accent-gold/70"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative px-6 py-5 overflow-hidden min-h-[420px]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={activeTab}
              custom={direction}
              initial={{ x: direction * 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: direction * -40, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {renderTab(activeTab)}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-between px-6 py-3 border-t border-accent-gold-dim/40">
          <button
            type="button"
            onClick={goPrev}
            disabled={activeIndex === 0}
            className="text-accent-gold-dim hover:text-accent-gold disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            ◀ 前へ
          </button>
          <span className="text-accent-gold-dim text-sm">
            {activeIndex + 1} / {TABS.length}
          </span>
          <button
            type="button"
            onClick={goNext}
            disabled={activeIndex === TABS.length - 1}
            className="text-accent-gold-dim hover:text-accent-gold disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            次へ ▶
          </button>
        </div>
      </dialog>
    </>
  );
}
