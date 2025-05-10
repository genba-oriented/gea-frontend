# Good Enough Architecture ~ Frontend

## 本リポジトリについて

本リポジトリは、弊社([合同会社 現場指向](https://www.genba-oriented.com))が「十分に良い(Good Enough)」と考える、フロントエンドのアーキテクチャとそのサンプルプログラムを公開したものです。フリーマーケットを題材にしたサンプルプログラム（フリマアプリという名前）を実装しています。フリマアプリの要件定義は、 [こちらのリポジトリ](https://github.com/genba-oriented/gea-requirements) をご参照ください。また、バックエンドAPIのアーキテクチャは [こちらのリポジトリ](https://github.com/genba-oriented/gea-backend-api) をご参照ください。APIの仕様書は [こちら](https://htmlpreview.github.io/?https://github.com/genba-oriented/gea-backend-api/blob/main/doc/rest-api/index.html)で確認できます。

公開しているプログラムやドキュメントは [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0) ライセンスとしますので、自由にご利用いただいて構いません。本リポジトリをベースにして、個別の開発プロジェクトで適宜カスタマイズして利用することを想定しています。ただし、ご利用によって何かしらの不都合が生じた場合は自己責任となることをご了承ねがいます。また、内容は時間とともに変更していく予定です。

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
<td style="text-align: left;"><p>https://accounts.google.com</p></td>
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
<td style="text-align: left;"><p>http://localhost:3000/auth-callback</p></td>
</tr>
<tr class="odd">
<td style="text-align: left;"><p>SESSION_PASSWORD</p></td>
<td style="text-align: left;"><p>本リポジトリでは、Idpから取得したトークンをセッションで保持します。セッションデータは、暗号化してブラウザのクッキーで保持します。ライブラリとして、 <a href="https://github.com/vvo/iron-session">iron-session</a> を使用しています。本環境変数で暗号時のパスワードを設定します。パスワードの値は最低32桁必要です。</p></td>
<td style="text-align: left;"><p>12345678901234567890123456789012</p></td>
</tr>
<tr class="even">
<td style="text-align: left;"><p>API_BASE_URL</p></td>
<td style="text-align: left;"><p>バックエンドのAPIのURL(バックエンドのAPIは、別リポジトリで公開する予定です)。スタブを有効にして起動する場合は本環境変数の指定は不要です。</p></td>
<td style="text-align: left;"><p>http://localhost:8080</p></td>
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

フロントエンドとバックエンドのAPIの通信は、通常API Gateway(もしくは、Backend For Frontend)が仲介します。

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
<td style="text-align: left;"><p>バックエンドのAPIサーバ。本リポジトリにはプログラムは含まれていません。 <a href="https://github.com/genba-oriented/gea-backend-api">こちらのリポジトリ</a>に含まれています。</p></td>
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
<td style="text-align: left;"><p><a href="https://react.dev">React</a></p></td>
<td style="text-align: left;"><p>UIのレンダリングをするライブラリとして、現在主流となっている</p></td>
</tr>
<tr class="even">
<td style="text-align: left;"><p><a href="https://mui.com">Material UI</a></p></td>
<td style="text-align: left;"><p>UIコンポーネントライブラリとしてシェアが高い</p></td>
</tr>
<tr class="odd">
<td style="text-align: left;"><p><a href="https://reactrouter.com">React Router</a></p></td>
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
<td style="text-align: left;"><p><a href="https://mobx.js.org">MobX</a></p></td>
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
<td style="text-align: left;"><p><a href="https://expressjs.com">Express</a></p></td>
<td style="text-align: left;"><p>サーバーサイドのWebフレームワーク</p></td>
</tr>
<tr class="even">
<td style="text-align: left;"><p><a href="https://github.com/panva/openid-client">openid-client</a></p></td>
<td style="text-align: left;"><p>OpenID ConnectのClientを作成するための機能を提供するライブラリ。特定のIdpに依存しない。</p></td>
</tr>
<tr class="odd">
<td style="text-align: left;"><p><a href="https://github.com/vvo/iron-session">iron-session</a></p></td>
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
<td style="text-align: left;"><p><a href="https://rsbuild.dev">Rsbuild</a></p></td>
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

テスティングフレームワークとして、 [Vitest](https://vitest.dev)を使用します。ただし、Playwrightを用いたテストではVitestは使用しません。

### Express周りのサーバサイドのテスト

[SuperTest](https://github.com/ladjs/supertest)を用いてリクエストを送信しながらテストします。

SuperTestは、ランダムなポートを使ってサーバプログラムを自動的に起動し、テストできるライブラリです。

### IdPと連携したOIDCの認証のテスト

[Playwright](https://playwright.dev)を用いてブラウザを自動操作しながらテストします。

### UIコンポーネントのテスト

[React Testing Library](https://github.com/testing-library/react-testing-library)を使用します。バックエンドのAPIの呼び出しは、 [Mock Service Worker (MSW)](https://mswjs.io)を使用してAPIをモック化します。

MSWは、APIをモック化できるライブラリです。

Modelや関数をモック化する場合は、Vitestの [vi](https://vitest.dev/guide/mocking.html)でモック化します。

### Modelのテスト

APIを呼び出している場合は、MSWを使用してAPIをモック化します。

### E2Eテスト

APIサーバと結合してテストすることから、フロントエンドの範疇を超えるため本リポジトリでは作成しません。

## 備忘録

### Modelについて

特にこの単位で作るといったルールはありません。以下のようなケースで作成します。

-   PageやComponentで、useStateで管理するデータが多くなった場合

-   PageやComponentで、描画以外の処理が複雑になった場合

-   複数のPageやComponentで、複数のデータや処理を共有したい場合

### MobXの利用シーン

基本的に、Modelを作った際にMobXを使用します。MobXを使ってModelのデータを公開すれば、useStateを使わなくても、データ更新時に自動的に再描画(renderメソッドの呼び出し)が行われます。

### (Reactの)Contextの利用シーン

UIコンポーネント間でデータを受け渡す場合は、基本的にはPropsを使用します。しかし、Propsの受け渡しが煩雑になったり、親子関係に関わらず様々なUIコンポーネントで共通して使用するデータだったりする場合は、Contextを使用したほうがよいです。
また、Page間でデータを共有する場合は、共通のLayoutを作成し、React Routerが提供する [useOutletContext](https://reactrouter.com/6.30.0/hooks/use-outlet-context#useoutletcontext)を使用すると便利です。

### OIDCのClientの役割をどこで担うか

OIDCのClientの役割は、SPAで担った方が、サーバサイドでトークンの管理をしなくてよいのでシンプルだと個人的には思います。しかし、以下のようなデメリットがあります。

-   基本的に各Idpが提供するライブラリを使用するため、各Idpに依存した作りになってしまう(Idpに依存しないライブラリを使うこともできるが、Idpが提供するものに比べると敷居が高くなる)

-   Authorization CodeフローでClientシークレットの指定を必須とするIdpに対応できない(ClientシークレットをSPAのプログラム内で保持するとセキュリティ的に問題なため)。例えばGoogleの場合、調べた限りだと [Clientシークレットの指定が必須](https://developers.google.com/identity/openid-connect/openid-connect#exchangecode)となっています

-   トークンをブラウザで保持するため、漏洩のリスクが上がる

本リポジトリでは、上記のデメリットを回避するため、API GatewayがOIDCのClientの役割を担っています。

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
