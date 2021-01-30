# Term Frequency SRI

Trabalho feito para a disciplina de Organização e Recuperação da Informação: calcula a frequência de termos de um determinado corpus.

Um corpus de exemplo pode ser encontrado em [CRPC sub-corpus oral espontÉneo.zip]()

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

Após a computação dos documentos do corpus, o sistema permite a realização do download de um arquivo em `.xlsx` para futuras analises do conjunto de termos.

Para o corpus [CRPC sub-corpus oral espontÉneo.zip]() foi possivel gerar o seguinte gráfico, utilizando o [Google Spreadsheet](https://docs.google.com/spreadsheets/):

![Gráfico]()

Sendo um conjunto extenso percebe-se...

## License
[MIT](https://choosealicense.com/licenses/mit/)