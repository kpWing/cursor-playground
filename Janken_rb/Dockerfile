# Rubyの公式イメージを使用
FROM ruby:3.2-alpine

# 作業ディレクトリを設定
WORKDIR /app

# システムの依存関係をインストール
RUN apk add --no-cache build-base yaml-dev

# Bundlerのバージョンを指定してインストール
RUN gem install bundler -v 2.7.2

# GemfileとGemfile.lockをコピー
COPY Gemfile Gemfile.lock* ./

# 依存関係をインストール
RUN bundle install

# アプリケーションのファイルをコピー
COPY . .

# ポート6602（Webサーバー）と12345（デバッガー）を公開
EXPOSE 6602 12345

# デバッガーを有効にしてPumaでSinatraアプリケーションを起動
CMD ["bundle", "exec", "puma", "-b", "tcp://0.0.0.0:6602", "config.ru"]
# CMD ["sh", "-c", "RUBY_DEBUG_OPEN=rdbg://0.0.0.0:12345 bundle exec puma -b tcp://0.0.0.0:6602 config.ru"]