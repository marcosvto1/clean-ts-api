# commit linter
npm install -D git-commit-msg-linter
# add typescrpt
npm install -D typescript @types/node

# standert eslint
npm install --save-dev eslint@7 eslint-plugin-standard@4 eslint-plugin-promise@4 eslint-plugin-import@2 eslint-plugin-node@11 @typescript-eslint/eslint-plugin@3 eslint-config-standard-with-typescript

# add husky = vai definir hooks de git (Ex: colocar comandos para serem executados antes de serem comitados ou push)
npm install -D husky

# add lint state // Sao os arquivos que vao no proximo commit
npm install -D lint-staged

// Dicas
A versão mais nova do lint-staged (v10.0.0) não aceita mais que utilize o git add no fim do script. Ele já faz isso automaticamente. Basta remover do array de scripts do .lintstagedrc.json a linha do "git add".

A biblioteca eslint-config-standard-with-typescript deve ser usada com a versão ^16.0.0. Versões mais recentes dessa biblioteca estão dando conflito com o eslint.

A biblioteca @typescript-eslint/eslint-plugin deve ser usada na versão ^2.33.0.