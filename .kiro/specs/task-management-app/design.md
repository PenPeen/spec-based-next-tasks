# 設計書

## 概要

Next.js 15のApp Routerを使用したタスク管理アプリケーションの設計書です。クライアントサイドでローカルストレージを使用してデータを永続化し、シンプルで直感的なUIを提供します。

## アーキテクチャ

### 技術スタック

- **フレームワーク**: Next.js 15（App Router）
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **状態管理**: React Hooks（useState, useEffect）
- **データストレージ**: ブラウザのローカルストレージ

### ディレクトリ構造

```
app/
├── layout.tsx              # ルートレイアウト
├── page.tsx                # メインページ（タスク一覧）
├── globals.css             # グローバルスタイル
components/
├── TaskList.tsx            # タスク一覧コンポーネント
├── TaskItem.tsx            # 個別タスクコンポーネント
├── TaskForm.tsx            # タスク作成・編集フォーム
├── DeleteConfirmDialog.tsx # 削除確認ダイアログ
lib/
├── types.ts                # 型定義
├── storage.ts              # ローカルストレージ操作
└── utils.ts                # ユーティリティ関数
```

## コンポーネントとインターフェース

### データモデル

```typescript
interface Task {
  id: string;              // UUID
  title: string;           // タスクのタイトル（必須）
  description: string;     // タスクの説明（任意）
  completed: boolean;      // 完了状態
  createdAt: number;       // 作成日時（Unix timestamp）
  updatedAt: number;       // 更新日時（Unix timestamp）
}
```

### コンポーネント設計

#### 1. page.tsx（メインページ）
- **責務**: アプリケーション全体の状態管理とレイアウト
- **状態**:
  - `tasks: Task[]` - タスクの配列
  - `editingTask: Task | null` - 編集中のタスク
  - `isFormOpen: boolean` - フォームの表示状態
  - `deletingTaskId: string | null` - 削除確認中のタスクID
- **機能**:
  - 初回レンダリング時にローカルストレージからタスクを読み込む
  - タスクの作成、更新、削除、完了状態の切り替え
  - 子コンポーネントへのprops渡し

#### 2. TaskList.tsx
- **Props**:
  - `tasks: Task[]`
  - `onToggleComplete: (id: string) => void`
  - `onEdit: (task: Task) => void`
  - `onDelete: (id: string) => void`
- **責務**: タスクの一覧表示
- **機能**:
  - タスクが空の場合のメッセージ表示
  - 作成日時の降順でタスクをソート
  - 各タスクをTaskItemコンポーネントでレンダリング

#### 3. TaskItem.tsx
- **Props**:
  - `task: Task`
  - `onToggleComplete: (id: string) => void`
  - `onEdit: (task: Task) => void`
  - `onDelete: (id: string) => void`
- **責務**: 個別タスクの表示と操作
- **機能**:
  - タスク情報の表示（タイトル、説明、完了状態）
  - 完了チェックボックス
  - 編集ボタン
  - 削除ボタン
  - 完了タスクの視覚的な区別（取り消し線、薄い色）

#### 4. TaskForm.tsx
- **Props**:
  - `task: Task | null` - 編集時は既存タスク、新規作成時はnull
  - `onSave: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void`
  - `onCancel: () => void`
- **状態**:
  - `title: string`
  - `description: string`
  - `error: string | null`
- **責務**: タスクの作成・編集フォーム
- **機能**:
  - タイトルと説明の入力フィールド
  - バリデーション（タイトル必須）
  - 保存とキャンセルボタン
  - エラーメッセージの表示

#### 5. DeleteConfirmDialog.tsx
- **Props**:
  - `isOpen: boolean`
  - `onConfirm: () => void`
  - `onCancel: () => void`
- **責務**: 削除確認ダイアログ
- **機能**:
  - モーダルダイアログの表示
  - 確認とキャンセルボタン

## データモデル

### Task型の詳細

```typescript
interface Task {
  id: string;              // crypto.randomUUID()で生成
  title: string;           // 最大長: 100文字
  description: string;     // 最大長: 500文字
  completed: boolean;      // デフォルト: false
  createdAt: number;       // Date.now()で生成
  updatedAt: number;       // 更新時にDate.now()で更新
}
```

### ローカルストレージのキー

- キー名: `tasks`
- 形式: JSON文字列化されたTask配列

## エラーハンドリング

### バリデーションエラー

1. **タイトル未入力**
   - エラーメッセージ: "タイトルは必須です"
   - 表示場所: TaskFormコンポーネント内
   - 処理: 保存処理を中断

2. **ローカルストレージエラー**
   - エラーメッセージ: "データの保存に失敗しました"
   - 処理: コンソールにエラーログを出力し、ユーザーに通知

### エラー処理の実装

```typescript
// ローカルストレージの読み込みエラー
try {
  const data = localStorage.getItem('tasks');
  // 処理
} catch (error) {
  console.error('Failed to load tasks:', error);
  // 空の配列を返す
}

// ローカルストレージの書き込みエラー
try {
  localStorage.setItem('tasks', JSON.stringify(tasks));
} catch (error) {
  console.error('Failed to save tasks:', error);
  // ユーザーに通知（オプション）
}
```

## テスト戦略

### 単体テスト

1. **ユーティリティ関数**
   - ローカルストレージの読み書き関数
   - タスクのソート関数
   - バリデーション関数

2. **コンポーネント**
   - TaskFormのバリデーション
   - TaskItemの表示切り替え

### 統合テスト

1. **タスクのCRUD操作**
   - タスクの作成フロー
   - タスクの編集フロー
   - タスクの削除フロー
   - 完了状態の切り替え

2. **データ永続化**
   - ローカルストレージへの保存
   - ページリロード後のデータ復元

### E2Eテスト（オプション）

1. ユーザーフローの確認
   - タスク作成から削除までの一連の操作
   - 複数タスクの管理

## UI/UXデザイン

### レイアウト

- シングルページアプリケーション
- レスポンシブデザイン（モバイル対応）
- 最大幅: 800px（中央配置）

### カラースキーム

- プライマリカラー: Blue（ボタン、リンク）
- 成功: Green（完了タスク）
- 危険: Red（削除ボタン）
- グレー: 背景、ボーダー

### インタラクション

- ボタンのホバーエフェクト
- フォームのフォーカス状態
- 完了タスクのアニメーション（フェードイン/アウト）
- モーダルのオーバーレイ

## パフォーマンス考慮事項

1. **ローカルストレージの最適化**
   - タスク数の上限: 1000件（推奨）
   - データサイズの監視

2. **レンダリングの最適化**
   - React.memoの使用（必要に応じて）
   - useCallbackでコールバック関数をメモ化

3. **遅延読み込み**
   - 初回レンダリング時のみローカルストレージから読み込み
   - useEffectの依存配列を空にする

## セキュリティ考慮事項

1. **XSS対策**
   - Reactのデフォルトのエスケープ機能を使用
   - dangerouslySetInnerHTMLは使用しない

2. **データ検証**
   - クライアントサイドでのバリデーション
   - 型安全性の確保（TypeScript）

## 実装の優先順位

1. **フェーズ1: 基本機能**
   - データモデルとローカルストレージ操作
   - タスクの作成と表示
   - 基本的なスタイリング

2. **フェーズ2: CRUD操作**
   - タスクの編集
   - タスクの削除
   - 完了状態の切り替え

3. **フェーズ3: UI/UX改善**
   - レスポンシブデザイン
   - アニメーション
   - エラーハンドリングの改善
