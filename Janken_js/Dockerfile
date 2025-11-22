# Node.jsの公式イメージを使用
FROM node:20-alpine

# 作業ディレクトリを設定
WORKDIR /app

# package.jsonとpackage-lock.jsonをコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm install

# アプリケーションのファイルをコピー
COPY index.html janken.js style.css ./

# ポート6601を公開
EXPOSE 6601

# http-serverを起動
CMD ["npx", "http-server", "-p", "6601", "-a", "0.0.0.0"]

