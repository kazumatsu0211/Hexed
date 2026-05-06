# Coding Conventions

このドキュメントは HEXED プロジェクトのコーディング規約と運用ルールを定めます。
CLAUDE.md からこのファイルを参照する形で運用します。

---

## 1. TypeScript

### 型定義
- `interface` ではなく `type` を優先（拡張が必要な場合のみ `interface`）
- 関数の引数の型は常に明示（推論できないため必須）
- export 関数の戻り値の型は明示（公開 API の契約として）
- 内部ヘルパー関数の戻り値の型は推論で OK（短く自明な場合）
- `any` 禁止。代わりに `unknown` を使い、型ガードで絞り込む
- `as` キャストは最小限。可能な限り型ガードで対応

### 命名
- 型名・interface名：`PascalCase`（例：`GameState`, `CellType`）
- 変数・関数：`camelCase`（例：`createBoard`, `playerHp`）
- 定数：`UPPER_SNAKE_CASE`（例：`BOARD_ROWS`, `INITIAL_HP`）
- ファイル名：`camelCase.ts`（例：`gameRules.ts`, `cellEffects.ts`）
- React コンポーネントファイル：`PascalCase.tsx`（例：`Board.tsx`, `HpBar.tsx`）

### Import / Export
- **named export を使用**（`export default` は原則禁止）
- 1ファイル1責務。複数の関連エクスポートはOK
- 外部ライブラリ → 内部モジュール の順でインポート
- 相対パスは `../` の連続を3階層までに抑える

```typescript
// ✅ 良い例
import { useState } from 'react';
import { motion } from 'framer-motion';

import { Cell } from './Cell';
import { useGameStore } from '../store/gameStore';
import { calculateCellEffect } from '../core/gameRules';

export function Board({ ... }: BoardProps) { ... }
```

---

## 2. React

### コンポーネント
- 関数コンポーネントのみ
- props は型を必ず定義（`Props` という命名の type を別途定義）
- 1コンポーネント1ファイル
- ファイル名 = コンポーネント名

### Hooks
- カスタムフックは `src/hooks/` に配置
- カスタムフックの命名は `use` プレフィックス
- 副作用は `useEffect` 内に閉じ込める

### 状態管理
- ローカル状態 → `useState`
- グローバル状態 → Zustand ストア
- サーバー状態（将来的に） → 別途検討

---

## 3. ファイル構成の原則

### `src/core/` の制約
- React, Framer Motion などの UI ライブラリの import 禁止
- DOM 操作、`window`、`document` 参照禁止
- 全関数を pure に保つ（副作用なし、引数のみで結果が決まる）
- これは Unity 移植時の C# 翻訳を容易にするため

```typescript
// ❌ src/core/gameRules.ts 内では禁止
import { useState } from 'react';  // NG: React 依存

export function calculateEffect(state) {
  console.log('debug');  // NG: 副作用
  state.hp -= 1;        // NG: 引数を変更する副作用
}

// ✅ 推奨パターン
export function calculateEffect(state: GameState): EffectResult {
  return { hpDelta: -1, message: '...' };  // 純粋関数
}
```

### `src/store/` の役割
- core 層を呼び出して状態を更新
- React に状態を提供
- core と React の橋渡し役

### `src/components/` の役割
- UI の描画とユーザー入力の処理
- ロジックは store / core に委譲
- スタイリングと演出に責任を持つ

---

## 4. テスト

### テスト方針
- `src/core/` 配下は **テスト必須**（pure 関数なのでテストしやすい）
- store, components のテストは余裕があれば追加
- カバレッジは目指さない。重要なロジックを確実にテストする方針

### ファイル配置
- テストファイルは対象と同じディレクトリに `*.spec.ts` で配置
- 例：`src/core/board.ts` のテストは `src/core/board.spec.ts`
- BDD（Behavior-Driven Development）の慣習に従い、`.spec`（仕様）を採用

### テスト記述
- `describe` でグループ化
- `it` で1テスト1検証
- 「何をしたら何が起きるか」を表現する文言

```typescript
// ✅ 良い例
describe('createBoard', () => {
  it('returns a 5x5 grid', () => { ... });
  it('contains exactly the specified distribution of cells', () => { ... });
});
```

---

## 5. Git 運用

### ブランチ戦略
- 個人開発のためシンプルに：
  - `main` — 常に動作する状態
  - `feature/xxx` — 大きな機能を作るとき
- 小さな変更は `main` に直接コミットしてOK

### コミットの粒度
- 機能単位で1コミット
- 1コミットで複数のことを混ぜない（型追加 + バグ修正 + リファクタ → 3コミット）

### コミットメッセージ
[Conventional Commits](https://www.conventionalcommits.org/) に準拠：

```
<type>: <短い要約>

<本文：なぜこの変更が必要か、どう実装したか、補足>
```

### type の種類
- `feat` — 新機能
- `fix` — バグ修正
- `refactor` — 機能変更を伴わない改善
- `docs` — ドキュメントのみ
- `test` — テスト追加・修正
- `style` — フォーマット・空白の変更
- `chore` — ビルド設定など

### 例

```
feat: Add expected value calculation for CPU AI

Implemented probability-based decision system in src/core/ai.ts.
For each unrevealed cell, calculate expected value across all
possible cell types weighted by remaining distribution.

Refs: SPEC.md Section 10
```

```
fix: Pokerface flag not consumed after curse cell

The pokerface boolean was set true but never reset to false
after blocking a curse. Fixed by clearing it in cellEffect().
```

---

## 6. コミット前チェック

PR/コミット前に以下を確認：

- [ ] `npm run lint` がパスする
- [ ] `npm test` がパスする
- [ ] `npm run build` が成功する
- [ ] 新しい機能には適切なテストを追加した
- [ ] `src/core/` に React 依存を入れていない
- [ ] コミットメッセージが Conventional Commits に従っている

---

## 7. ドキュメント

### コードコメント
- **何を**ではなく**なぜ**を書く
- 自明なコメントは書かない
- 複雑なロジックには簡潔な説明を

```typescript
// ❌ 悪い例（自明）
// HPを1減らす
hp -= 1;

// ✅ 良い例（理由を説明）
// ペテン師の能力で呪いダメージを無効化
const damage = self.character.id === 'swindler' ? 0 : -1;
```

### 設計判断は DECISIONS.md へ
- 重要な技術選定（ライブラリ、アーキテクチャ）は DECISIONS.md に記録
- 「なぜ Zustand？」「なぜ Web を先に？」のような判断を残す
- 後で振り返る時、面接で説明する時の宝になる

---

## 8. 演出・UI（ゲーム特有）

### アニメーション
- Framer Motion を優先使用
- 過剰な演出は避ける（プレイテンポを損なわない）
- `transition` は 0.1〜0.3秒を目安に

### 配色
- Tailwind の設定で定義したテーマカラーを使用
- ハードコードしたカラーコード（`#FFFFFF` 等）は禁止
- 例：`bg-bg-mid`, `text-accent-gold`

### レスポンシブ
- まずデスクトップ（1280px+）で完成させる
- モバイル対応は後回しでOK（プロト段階）

---

## 9. パフォーマンス

### 当面の方針
- プロト段階では過度な最適化はしない
- React DevTools で明らかなムダな再レンダリングがあれば対応
- `useMemo`、`useCallback` は本当に必要な時だけ使う

### 将来検討（β版以降）
- Zustand のセレクタを細かく分ける
- 大きなリストには仮想スクロール
- アニメーション最適化

---

## 10. AIツール（Claude Code, Cursor等）の活用

このプロジェクトでは AI コード支援を積極的に使います。ただし以下のスタンス：

### 任せていい領域
- ボイラープレート（型定義の雛形、コンポーネントの骨組み）
- スタイリング（Tailwind クラスの組み合わせ）
- 設定ファイル（vite.config, tsconfig 等）
- ドキュメントの下書き

### 自分で書く領域
- ゲームロジックの中核（`src/core/` のすべて）
- 状態管理の設計
- 重要なアルゴリズム（AI、確率計算等）

### コミット前のセルフチェック
- このコードを1行ずつ説明できるか？
- 設計判断の理由を言えるか？
- バグが出たら自分で直せるか？

---

## 更新履歴

- v0.1: 初版。TypeScript / React / Git / テスト / ドキュメント / AI 活用方針を定義。
