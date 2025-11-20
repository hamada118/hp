# 株式会社ハマコー ホームページ

## 天気情報の設定

このホームページには鹿児島市の天気情報を表示する機能が含まれています。

### OpenWeatherMap APIキーの取得方法

1. [OpenWeatherMap](https://openweathermap.org/api) の公式サイトにアクセス
2. 無料アカウントを作成（Sign Up）
3. アカウント作成後、API Keys セクションに移動
4. APIキーをコピー
5. `script.js` ファイルを開き、以下の行を編集：

```javascript
const WEATHER_API_KEY = 'YOUR_API_KEY_HERE'; // ここにAPIキーを入力してください
```

例：
```javascript
const WEATHER_API_KEY = 'abc123def456ghi789'; // 取得したAPIキーを貼り付け
```

### APIキーが設定されていない場合

APIキーが設定されていない場合、デモデータ（気温: 25°C、湿度: 65%、天気: 晴れ）が表示されます。

### 機能

- 鹿児島市の現在の天気情報を表示
- 気温（摂氏）
- 湿度（%）
- 天気アイコン（天気に応じて自動変更）
- 天気の説明（日本語）
- 30分ごとに自動更新
- ダークモード対応

## 使用方法

1. ブラウザで `index.html` を開く
2. トップ画面の右上に天気ウィジェットが表示されます

