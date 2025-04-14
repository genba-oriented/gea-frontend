# Good Enough Architecture ~ Frontend

## 本リポジトリについて

本リポジトリは、弊社([合同会社 現場指向](https://www.genba-oriented.com))が「十分に良い(Good Enough)」と考える、フロントエンドのアーキテクチャとそのサンプルプログラムを公開したものです。フリーマーケットを題材にしたサンプルプログラム（フリマアプリという名前）を実装しています。フリマアプリの要件定義は、 [こちらのリポジトリ](https://github.com/genba-oriented/fleamarket-requirements) をご参照ください。

公開しているプログラムやドキュメントは自由にご利用いただいて構いません。本リポジトリをベースにして、個別の開発プロジェクトで適宜カスタマイズして利用することを想定しています。ただし、ご利用によって何かしらの不都合が生じた場合は自己責任となることをご了承ねがいます。また、内容は時間とともに変更していく予定です。

もし、プログラムにおかしなところがありましたら、Issueでご連絡いただけると大変ありがたいです。

## コンセプト

アプリケーションを開発する際の設計思想や技術には、さまざまなものが存在します。新規の開発プロジェクトでは、高度な設計思想や最新の技術を採用したくなるものです。

しかし、高度な設計思想や最新の技術を採用すれば、プロジェクトが円滑に進むという訳ではありません。逆に学習コストがあがったり、ブラックボックスな部分が多くなって、問題が起きたときにハマるリスクがあります。

本リポジトリのアーキテクチャは、できるだけ分かりやすく、ハマりにくいアーキテクチャをコンセプトに作成しています。

## インストール＆実行方法

### パッケージのインストール

    npm install

### 環境変数用のファイルを用意

OIDCを用いたログインのための設定値などを環境変数で用意します。プロジェクト直下に「.env」ファイルを作成すれば自動的に読み込まれます。以下の項目を設定します。

<table>
<colgroup>
<col style="width: 33%" />
<col style="width: 33%" />
<col style="width: 33%" />
</colgroup>
<thead>
<tr class="header">
<th style="text-align: left;">環境変数名</th>
<th style="text-align: left;">説明</th>
<th style="text-align: left;">サンプル値</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td style="text-align: left;"><p>OIDC_ISSUER_URL</p></td>
<td style="text-align: left;"><p>OIDCのIdpのURL。本リポジトリは、IdpのプロバイダとしてGoogleで動作確認しています。他のプロバイダでもある程度動作すると思いますが、ソースコードの微修正が必要になるかもしれません。</p></td>
<td style="text-align: left;"><p><a href="https://accounts.google.com">https://accounts.google.com</a></p></td>
</tr>
<tr class="even">
<td style="text-align: left;"><p>OIDC_CLIENT_ID</p></td>
<td style="text-align: left;"><p>OIDCのクライントID</p></td>
<td style="text-align: left;"><p>-</p></td>
</tr>
<tr class="odd">
<td style="text-align: left;"><p>OIDC_CLIENT_SECRET</p></td>
<td style="text-align: left;"><p>OIDCのクライントシークレット</p></td>
<td style="text-align: left;"><p>-</p></td>
</tr>
<tr class="even">
<td style="text-align: left;"><p>OIDC_REDIRECT_URL</p></td>
<td style="text-align: left;"><p>OIDCのリダイレクトURL。本リポジトリは「/auth-callback」というエンドポイントを使用する想定になっています。</p></td>
<td style="text-align: left;"><p><a href="http://localhost:3000/auth-callback">http://localhost:3000/auth-callback</a></p></td>
</tr>
<tr class="odd">
<td style="text-align: left;"><p>SESSION_PASSWORD</p></td>
<td style="text-align: left;"><p>本リポジトリでは、Idpから取得したトークンをセッションで保持します。セッションデータは、暗号化してブラウザのクッキーで保持します。ライブラリとして、IronSession( <a href="https://github.com/vvo/iron-session">https://github.com/vvo/iron-session</a> )を使用しています。本環境変数で暗号時のパスワードを設定します。パスワードの値は最低32桁必要です。</p></td>
<td style="text-align: left;"><p>12345678901234567890123456789012</p></td>
</tr>
<tr class="even">
<td style="text-align: left;"><p>API_BASE_URL</p></td>
<td style="text-align: left;"><p>バックエンドのAPIのURL(バックエンドのAPIは、別リポジトリで公開する予定です)。スタブを有効にして起動する場合は本環境変数の指定は不要です。</p></td>
<td style="text-align: left;"><p><a href="http://localhost:8080">http://localhost:8080</a></p></td>
</tr>
<tr class="odd">
<td style="text-align: left;"><p>API_STUB</p></td>
<td style="text-align: left;"><p>APIのスタブを有効・無効にするためのフラグ</p></td>
<td style="text-align: left;"><p>true</p></td>
</tr>
</tbody>
</table>

### ローカル(dev server)で実行

    npm run dev

### ブラウザでアクセス

「 <http://localhost:3000> 」にアクセスします。スタブのAPIを使用している場合、表示されるデータは固定です。

### ビルドして実行

    npm run build
    npx tsx --env-file=.env src-server/server.ts

## 特徴

### SSRを使用しないピュアなSPA

昨今のフロントエンド開発では、Next.jsやNuxtといった、Server Side Rendering(SSR)に対応したフレームワークが人気です。しかし、ハイドレーションなど、裏で行われる処理がブラックボックスになってしまい、問題が起きたときにハマるリスクがあります。

本リポジトリは、SSRを一切行わず、UIコンポーネントの処理はすべてブラウザ上で行います。これにより、問題が起きたときの切り分けがしやすくなります。

### API Gatewayの処理をNode.js上で行う

フロントエンドとバックエンドのAPIの通信は、通常API Gateway(Backend For Frontendと呼ばれたりもします)が仲介します。

API Gatewayは、Reverse Proxyの機能や、OpenID Connectのような認証の機能を持ったりします。API Gatewayをどう実現するかはさまざまですが、本リポジトリでは、フロントエンドのプログラムをホスティングするNode.js上でAPI Gatewayの処理を行っています。これにより以下の利点があります。

-   ローカルでフロントエンドを開発する際のNode.jsのサーバ(dev serverと呼ばれたりします)で動かすことができるため、開発時に別途API Gatewayのプロセスを立ち上げる手間がない

-   デプロイして動かす際、フロントエンドのプログラムのホスティングとAPI GatewayをNode.jsのサーバが兼務するため、サーバインスタンスを少なくできる

## アーキテクチャ

### システムアーキテクチャ

![architecture.drawio](./doc/architecture.drawio.svg)

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<thead>
<tr class="header">
<th style="text-align: left;">役割名</th>
<th style="text-align: left;">説明</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td style="text-align: left;"><p>SPA</p></td>
<td style="text-align: left;"><p>ブラウザ上で動作するJavaScriptアプリケーション</p></td>
</tr>
<tr class="even">
<td style="text-align: left;"><p>Node.jsサーバ</p></td>
<td style="text-align: left;"><p>SPAをホスティングしつつ、API Gatewayの役割を担うサーバ</p></td>
</tr>
<tr class="odd">
<td style="text-align: left;"><p>APIサーバ</p></td>
<td style="text-align: left;"><p>バックエンドのAPIサーバ。本リポジトリにはプログラムは含まれていません。 <a href="https://github.com/genba-oriented/good-enough-architecture-backend-api">こちらのリポジトリ</a>に含まれています。</p></td>
</tr>
<tr class="even">
<td style="text-align: left;"><p>IdP</p></td>
<td style="text-align: left;"><p>GoogleなどのIdentity Provider</p></td>
</tr>
</tbody>
</table>

### (SPAの)ソフトウェアアーキテクチャ

![sw architecture.drawio](./doc/sw-architecture.drawio.svg)

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<thead>
<tr class="header">
<th style="text-align: left;">役割名</th>
<th style="text-align: left;">説明</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td style="text-align: left;"><p>Page</p></td>
<td style="text-align: left;"><p>画面を表す(「出品登録画面」「出品詳細画面」など)。React Routerでルーティングする単位となる</p></td>
</tr>
<tr class="even">
<td style="text-align: left;"><p>Component</p></td>
<td style="text-align: left;"><p>Page内で描画する画面のコンポーネント</p></td>
</tr>
<tr class="odd">
<td style="text-align: left;"><p>Model</p></td>
<td style="text-align: left;"><p>データの保持と、描画以外の処理に特化したクラス。基本的にMobXを使ってデータを公開し、そのデータをPageやComponentが描画で使用する。</p></td>
</tr>
<tr class="even">
<td style="text-align: left;"><p>Dto</p></td>
<td style="text-align: left;"><p>バックエンドAPIから取得するデータを表すクラス</p></td>
</tr>
<tr class="odd">
<td style="text-align: left;"><p>Util</p></td>
<td style="text-align: left;"><p>ユーティリティ</p></td>
</tr>
</tbody>
</table>

## 技術スタック

### UI周り

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<tbody>
<tr class="odd">
<td style="text-align: left;"><p>React <a href="https://react.dev/">https://react.dev/</a></p></td>
<td style="text-align: left;"><p>UIのレンダリングをするライブラリとして、現在主流となっている</p></td>
</tr>
<tr class="even">
<td style="text-align: left;"><p>Material UI <a href="https://mui.com">https://mui.com</a></p></td>
<td style="text-align: left;"><p>UIコンポーネントライブラリとしてシェアが高い</p></td>
</tr>
<tr class="odd">
<td style="text-align: left;"><p>React Router <a href="https://reactrouter.com">https://reactrouter.com</a></p></td>
<td style="text-align: left;"><p>画面をルーティングする知名度の高いライブラリ。バージョン7からは、SSRの機能をもつRemixというライブラリと融合したが、本リポジトリではSSRの機能は使っていない。</p></td>
</tr>
</tbody>
</table>

### ステート管理

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<tbody>
<tr class="odd">
<td style="text-align: left;"><p>MobX <a href="https://mobx.js.org">https://mobx.js.org</a></p></td>
<td style="text-align: left;"><p>主流というわけではなが、昔から存在するステート管理のライブラリ。オブジェクトのプロパティを更新しただけで自動的に再描画(render関数の呼び出し)してくれる。</p></td>
</tr>
</tbody>
</table>

### API Gateway周り

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<tbody>
<tr class="odd">
<td style="text-align: left;"><p>Express <a href="https://expressjs.com">https://expressjs.com</a></p></td>
<td style="text-align: left;"><p>サーバーサイドのWebフレームワーク</p></td>
</tr>
<tr class="even">
<td style="text-align: left;"><p>openid-client <a href="https://github.com/panva/openid-client">https://github.com/panva/openid-client</a></p></td>
<td style="text-align: left;"><p>OpenID ConnectのClientを作成するための機能を提供するライブラリ。特定のIdpに依存しない。</p></td>
</tr>
<tr class="odd">
<td style="text-align: left;"><p>iron-session <a href="https://github.com/vvo/iron-session">https://github.com/vvo/iron-session</a></p></td>
<td style="text-align: left;"><p>セッションデータをブラウザーのCookieで保持するためのライブラリ。Cookieに保持するデータは暗号化される</p></td>
</tr>
</tbody>
</table>

### ビルドツール

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<tbody>
<tr class="odd">
<td style="text-align: left;"><p>Rsbuild <a href="https://rsbuild.dev">https://rsbuild.dev</a></p></td>
<td style="text-align: left;"><p>処理速度が速いとされるビルドツール</p></td>
</tr>
</tbody>
</table>

## ディレクトリ構成

### トップレベル

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<thead>
<tr class="header">
<th style="text-align: left;">ディレクトリ名</th>
<th style="text-align: left;">説明</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td style="text-align: left;"><p>doc</p></td>
<td style="text-align: left;"><p>ドキュメント</p></td>
</tr>
<tr class="even">
<td style="text-align: left;"><p>pw-tests</p></td>
<td style="text-align: left;"><p>Playwrightのテスト</p></td>
</tr>
<tr class="odd">
<td style="text-align: left;"><p>src</p></td>
<td style="text-align: left;"><p>SPAのソースコード</p></td>
</tr>
<tr class="even">
<td style="text-align: left;"><p>src-server</p></td>
<td style="text-align: left;"><p>Node.js上で動くサーバサイドのプログラムのソースコード</p></td>
</tr>
</tbody>
</table>

### src内(SPAのソースコード)のディレクトリ構成

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<thead>
<tr class="header">
<th style="text-align: left;">ディレクトリ名</th>
<th style="text-align: left;">説明</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td style="text-align: left;"><p>components</p></td>
<td style="text-align: left;"><p>Componentを格納</p></td>
</tr>
<tr class="even">
<td style="text-align: left;"><p>dto</p></td>
<td style="text-align: left;"><p>Dtoを格納</p></td>
</tr>
<tr class="odd">
<td style="text-align: left;"><p>model</p></td>
<td style="text-align: left;"><p>Modelを格納</p></td>
</tr>
<tr class="even">
<td style="text-align: left;"><p>pages</p></td>
<td style="text-align: left;"><p>Pageを格納</p></td>
</tr>
<tr class="odd">
<td style="text-align: left;"><p>util</p></td>
<td style="text-align: left;"><p>Utilを格納</p></td>
</tr>
</tbody>
</table>

## テストについて

### テスティングフレームワーク

テスティングフレームワークとして、Vitestを使用します。ただし、Playwrightを用いたテストではVitestは使用しません。

### Express周りのサーバサイドのテスト

SuperTestを用いてリクエストを送信しながらテストします。

SuperTestは、ランダムなポートを使ってサーバプログラムを自動的に起動し、テストできるライブラリです。 <https://github.com/ladjs/supertest>

### IdPと連携したOIDCの認証のテスト

Playwrightを用いてブラウザを自動操作しながらテストします。

### UIコンポーネントのテスト

React Testing Libraryを使用します。バックエンドのAPIの呼び出しは、MSWを使用してAPIをモック化します。

MSWは、APIをモック化できるライブラリです。 <https://mswjs.io>

Modelや関数をモック化する場合は、Vitestのviでモック化します。 <https://vitest.dev/guide/mocking.html>

### Modelのテスト

APIを呼び出している場合は、MSWを使用してAPIをモック化します。

### E2Eテスト

APIサーバと結合してテストするため、本リポジトリとは別のリポジトリ(特に公開はしていません)で作成します。

## 語彙集

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<thead>
<tr class="header">
<th style="text-align: left;">単語</th>
<th style="text-align: left;">意味</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td style="text-align: left;"><p>UIコンポーネント</p></td>
<td style="text-align: left;"><p>ReactのUIコンポーネント。PageやComponentが該当する</p></td>
</tr>
<tr class="even">
<td style="text-align: left;"><p>dev server</p></td>
<td style="text-align: left;"><p>Rsbuildが提供する開発用のNode.jsサーバ</p></td>
</tr>
</tbody>
</table>
