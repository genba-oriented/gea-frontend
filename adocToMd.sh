# Githubは、Asciidocファイルのincludeが使えないため、以下のコマンドでMarkdown形式に変換します。
# https://github.com/github/markup/issues/1095

asciidoctor -b docbook -a leveloffset=+1 -o - _README.adoc | pandoc  --markdown-headings=atx --wrap=preserve -t markdown_strict -f docbook - > README.md