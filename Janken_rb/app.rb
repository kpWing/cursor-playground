require 'sinatra/base'
require 'json'
require 'debug'

class JankenApp < Sinatra::Base
  set :public_folder, File.dirname(__FILE__) + '/public'
  set :bind, '0.0.0.0'
  set :port, 6602

  # CORS設定
  before do
    headers 'Access-Control-Allow-Origin' => '*',
            'Access-Control-Allow-Methods' => 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers' => 'Content-Type'
  end

  options '*' do
    response.headers['Allow'] = 'HEAD,GET,POST,PUT,DELETE,OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Cache-Control, Accept'
    200
  end

  # ジャンケンの選択肢
  CHOICES = {
    'rock' => { emoji: '🪨', name: 'グー' },
    'scissors' => { emoji: '✂️', name: 'チョキ' },
    'paper' => { emoji: '📄', name: 'パー' }
  }.freeze

  get '/' do
    send_file File.join(settings.public_folder, 'index.html')
  end

  # ジャンケンゲームのAPIエンドポイント
  post '/api/play' do
    content_type :json

    # リクエストボディをパース
    request.body.rewind
    data = JSON.parse(request.body.read)
    player_choice = data['choice']

    # デバッグ用ブレークポイント
    # binding.break

    # バリデーション
    unless CHOICES.key?(player_choice)
      status 400
      return { error: 'Invalid choice' }.to_json
    end

    # コンピューターの選択をランダムに生成
    computer_choice = generate_computer_choice

    # 勝敗を判定
    result = determine_winner(player_choice, computer_choice)

    # 結果を返す
    {
      player_choice: player_choice,
      computer_choice: computer_choice,
      result: result,
      choices: CHOICES
    }.to_json
  end

  private

  # コンピューターの選択をランダムに生成
  def generate_computer_choice
    CHOICES.keys.sample
  end

  # 勝敗を判定
  def determine_winner(player, computer)
    return 'draw' if player == computer

    win_conditions = {
      'rock' => 'scissors',
      'scissors' => 'paper',
      'paper' => 'rock'
    }

    win_conditions[player] == computer ? 'win' : 'lose'
  end
end

