import { calculateTileEffect, checkWinner, clampHp } from "./gameRules";
import type { Character, PlayerState } from "./types";

const dummyCharacter: Character = {
  id: "gambler",
  name: "博徒",
  description: "初期アイテム +1",
};

function createPlayer(overrides?: Partial<PlayerState>): PlayerState {
  return {
    hp: 3,
    maxHp: 5,
    items: [],
    character: dummyCharacter,
    pokerfaceActive: false,
    gaggedTurns: 0,
    freeMonocleUsed: false,
    ...overrides,
  };
}

describe("gameRules", () => {
  describe("calculateTileEffect", () => {
    it("attack マスは相手に -1 ダメージ", () => {
      // Arrange
      const player = createPlayer();
      const tileEffect = "attack";

      // Act
      const result = calculateTileEffect(tileEffect, player);

      // Assert
      expect(result).toEqual({
        selfHpDelta: 0,
        opponentHpDelta: -1,
        selfGetsItem: false,
        description: "攻撃マス：相手にダメージ",
      });
    });

    it("curse マスは自分に -1 ダメージ", () => {
      // Arrange
      const player = createPlayer();
      const tileEffect = "curse";

      // Act
      const result = calculateTileEffect(tileEffect, player);

      // Assert
      expect(result).toEqual({
        selfHpDelta: -1,
        opponentHpDelta: 0,
        selfGetsItem: false,
        description: "呪いマス：ダメージ",
      });
    });

    it("pokerfaceActive 時は curse でダメージなし", () => {
      // Arrange
      const player = createPlayer({ pokerfaceActive: true });
      const tileEffect = "curse";

      // Act
      const result = calculateTileEffect(tileEffect, player);

      // Assert
      expect(result).toEqual({
        selfHpDelta: 0,
        opponentHpDelta: 0,
        selfGetsItem: false,
        description: "呪いマス：ポーカーフェイスで無効化",
      });
    });

    it("ペテン師は curse でダメージなし", () => {
      // Arrange
      const player = createPlayer({
        character: { id: "swindler", name: "ペテン師", description: "" },
      });
      const tileEffect = "curse";

      // Act
      const result = calculateTileEffect(tileEffect, player);

      // Assert
      expect(result).toEqual({
        selfHpDelta: 0,
        opponentHpDelta: 0,
        selfGetsItem: false,
        description: "呪いマス：ペテン師の能力で無効化",
      });
    });

    it("pokerfaceActive とペテン師の両方時は pokerface 優先", () => {
      // Arrange
      const player = createPlayer({
        pokerfaceActive: true,
        character: { id: "swindler", name: "ペテン師", description: "" },
      });
      const tileEffect = "curse";

      // Act
      const result = calculateTileEffect(tileEffect, player);

      // Assert
      expect(result).toEqual({
        selfHpDelta: 0,
        opponentHpDelta: 0,
        selfGetsItem: false,
        description: "呪いマス：ポーカーフェイスで無効化",
      });
    });

    it("blessing マスは自分に +1 回復", () => {
      // Arrange
      const player = createPlayer();
      const tileEffect = "blessing";

      // Act
      const result = calculateTileEffect(tileEffect, player);

      // Assert
      expect(result).toEqual({
        selfHpDelta: 1,
        opponentHpDelta: 0,
        selfGetsItem: false,
        description: "加護マス：HP回復",
      });
    });

    it("treasure マスは selfGetsItem = true", () => {
      // Arrange
      const player = createPlayer();
      const tileEffect = "treasure";

      // Act
      const result = calculateTileEffect(tileEffect, player);

      // Assert
      expect(result).toEqual({
        selfHpDelta: 0,
        opponentHpDelta: 0,
        selfGetsItem: true,
        description: "宝物マス：アイテム獲得",
      });
    });

    it("empty マスは何も起こらない", () => {
      // Arrange
      const player = createPlayer();
      const tileEffect = "empty";

      // Act
      const result = calculateTileEffect(tileEffect, player);

      // Assert
      expect(result).toEqual({
        selfHpDelta: 0,
        opponentHpDelta: 0,
        selfGetsItem: false,
        description: "空きマス：何も起こらない",
      });
    });
  });

  describe("clampHp", () => {
    it("HPは0未満にならない", () => {
      // Arrange
      const hp = -5;
      const maxHp = 5;

      // Act
      const result = clampHp(hp, maxHp);

      // Assert
      expect(result).toBe(0);
    });

    it("HPはmaxHpを超えない", () => {
      // Arrange
      const hp = 10;
      const maxHp = 5;

      // Act
      const result = clampHp(hp, maxHp);

      // Assert
      expect(result).toBe(5);
    });
  });

  describe("checkWinner", () => {
    it("両者のHPが0以下なら引き分け", () => {
      // Arrange
      const player = createPlayer({ hp: 0 });
      const cpu = createPlayer({ hp: 0 });

      // Act
      const result = checkWinner(player, cpu);

      // Assert
      expect(result).toBe("draw");
    });

    it("プレイヤーのHPが0以下ならCPUの勝ち", () => {
      // Arrange
      const player = createPlayer({ hp: 0 });
      const cpu = createPlayer({ hp: 3 });

      // Act
      const result = checkWinner(player, cpu);

      // Assert
      expect(result).toBe("cpu");
    });

    it("CPUのHPが0以下ならプレイヤーの勝ち", () => {
      // Arrange
      const player = createPlayer({ hp: 3 });
      const cpu = createPlayer({ hp: 0 });

      // Act
      const result = checkWinner(player, cpu);

      // Assert
      expect(result).toBe("player");
    });

    it("両者のHPが0以上ならゲームは継続", () => {
      // Arrange
      const player = createPlayer({ hp: 3 });
      const cpu = createPlayer({ hp: 2 });

      // Act
      const result = checkWinner(player, cpu);

      // Assert
      expect(result).toBe("ongoing");
    });
  });
});
