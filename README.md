# Term Frequency SRI

Trabalho feito para a disciplina de Organização e Recuperação da Informação: calcula a frequência de termos de um determinado corpus.

Um corpus de exemplo pode ser encontrado em [CRPC sub-corpus oral espontÉneo.zip](https://github.com/AlexandreNS/term-frequency-sri/blob/main/CRPC%20sub-corpus%20oral%20espont%C3%89neo.zip?raw=true)

## Requisitos

- NodeJS v14.0.0
- npm 6.14.4

## Instalação e Execução

Para instalação é necessario executar o comando padrão de instalação de pacotes do NPM:

```bash
# backend
# A partir da pasta raiz execute:

cd backend
npm i
```

```bash
# frontend
# A partir da pasta raiz execute:

cd frontend
npm i
```

Para executar os projetos execute `npm run start` dentro das pastas frontend e backend.

Talvez seja necessario configurar a url do backend, ela está configurada em `frontend/src/config/index.js`

## Projeto de Construção

Foi utilizado para o projeto o [Express](https://expressjs.com/) para a parte do Backend e o [ReactJS](https://reactjs.org/) para o Frontend

Para o refinamento dos documentos foram utilizadas as seguintes abordagens:

- [html-entities](https://www.npmjs.com/package/html-entities) --> caracteres especiais do HTML
- Regex `/(<([^>]+)>)/ig` para a remoção de tags no arquivo
- Regex `/([^A-Za-zÀ-ÖØ-öø-ÿ]+)/ig` para manter apenas caracteres de texto
- Remoção de palavras com menos de 3 caracteres ou que estão na lista das [Stopwords](https://github.com/AlexandreNS/term-frequency-sri/blob/main/backend/src/resources/stopwords.js)
- Função de Stemming do pacote [natural](https://www.npmjs.com/package/natural)

## Exemplo de Execução

Após a computação dos documentos do corpus, o sistema permite a realização do download de um arquivo em `.xlsx` - [exemplo](https://github.com/AlexandreNS/term-frequency-sri/blob/main/lista-termos.xlsx) - para futuras analises do conjunto de termos.

Para o corpus [CRPC sub-corpus oral espontÉneo.zip](https://github.com/AlexandreNS/term-frequency-sri/blob/main/CRPC%20sub-corpus%20oral%20espont%C3%89neo.zip?raw=true) foi possível gerar o seguinte gráfico, utilizando o [Google Spreadsheet](https://docs.google.com/spreadsheets/):

![Gráfico](https://github.com/AlexandreNS/term-frequency-sri/blob/main/grafico.png?raw=true)

Sendo o corpus composto por um conjunto extenso de termos, podemos visualizar no gráfico que uma grande parte dos termos aparece pouquíssimas vezes no corpus, menos de 25 ocorrências em cerca de 4600 termos ou 94% dos termos do acervo.

Portanto, pode-se concluir que o corpus analisado é composto por uma vasta quantidade de assuntos, porém não é possível afirmar como essa variedade está distribuída entre os documentos do acervo.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://github.com/AlexandreNS/term-frequency-sri/blob/main/LICENSE)
