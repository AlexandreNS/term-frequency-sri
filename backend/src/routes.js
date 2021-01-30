const routes = require("express").Router();
const fs = require('fs');
const xlsx = require('json-as-xlsx')
const List = require('./resources/data/list.json') || [];
const Utils = require('./utils/utils')
const multer = require("multer");
const path = require('path')
const multerConfig = require("./config/multer");
const termFrequency = require("./utils/term-frequency");

const resultsPath = path.resolve(__dirname, "resources", "data", "results");
const listPath = path.resolve(__dirname, "resources", "data");
const docsPath = path.resolve(__dirname, "..", "tmp", "uploads");

const EXTENSION_FILE = ['html', 'txt'];

const ENCONDE_FILE = [ 'utf8', 'ascii', 'latin1' ]

routes.get("/result-save-xlsx/:filename", async (req, res) => {
  try {
    if (!req.params.filename) {
      return res.status(400).send({error: 'Failed'});
    }
    const searchFile = List.filter(({ file }) => file === req.params.filename);

    if (searchFile.length > 0) {
      let resultData = fs.readFileSync(`${resultsPath}/${req.params.filename}`, "utf8");
      resultData = JSON.parse(resultData);

      let corpusResult = []
      for (let key in resultData.corpus) {
        corpusResult.push({key, quantidade: resultData.corpus[key]})
      }
      
      corpusResult.sort((a, b) => {
        if (b.quantidade !== a.quantidade) return b.quantidade - a.quantidade;
        else if (a.key > b.key) return 1;
        else if (a.key < b.key) return -1;
        else return 0;
      });

      corpusResult = corpusResult.map((value, idx) => {
        value.index = idx+1
        return value
      });

      const columns = [
        { label: 'Index', value: 'index' },
        { label: 'Quantidade', value: 'quantidade' },
        { label: 'Termo', value: 'key' }
      ]
      
      const settings = {
        sheetName: resultData.name,
        fileName: req.params.filename.replace('.json', '')
      }
      
      let buffer = xlsx(columns, corpusResult, settings, false)
      res.writeHead(200, {
        'Content-Type': 'application/octet-stream',
        'Content-disposition': `attachment; filename=${settings.fileName}.xlsx`
      });

      return res.end(buffer)
    } else {
      return res.status(400).send({error: 'Failed'});
    }
  } catch (err) {
    console.log(err);
    return res.status(400).send({error: 'Failed'});
  }
});

routes.get("/result/:filename", async (req, res) => {
  try {
    if (!req.params.filename) {
      return res.status(400).send({error: 'Failed'});
    }
    const searchFile = List.filter(({ file }) => file === req.params.filename);

    if (searchFile.length > 0) {
      let resultData = fs.readFileSync(`${resultsPath}/${req.params.filename}`, "utf8");
      resultData = JSON.parse(resultData);

      const corpusResult = []
      for (let key in resultData.corpus) {
        corpusResult.push({termo: key, quantidade: resultData.corpus[key]})
      }

      resultData.corpus = corpusResult

      return res.json(resultData);
    } else {
      return res.status(400).send({error: 'Failed'});
    }
  } catch (err) {
    console.log(err);
    return res.status(400).send({error: 'Failed'});
  }
});

routes.get("/list", async (req, res) => {
  const retorno = List || [];
  
  return res.json(retorno);
});

routes.post("/list", async (req, res) => {
  const listData = List || [];
  
  const infoCounter = {
    name: req.body.name || 'Relação do Corpus',
    encode: req.body.encode || 'utf8',
    type: req.body.type || 'html',
    timestamp: new Date().toISOString(),
    file: `dadosRelacao${new Date().getTime()}.json`
  }

  listData.push(infoCounter)
  
  try {
    await Promise.all([
      Utils.writeFile(JSON.stringify(listData), `${listPath}/list.json`, fs),
      Utils.writeFile(JSON.stringify({...infoCounter, corpus: {}})
        , `${resultsPath}/${infoCounter.file}`, fs),
    ]);
    
    return res.json(infoCounter);
  } catch (err) {
    console.log(err);
    return res.status(400).send({error: 'Registration failed'});
  }
});

routes.post("/save-doc", multer(multerConfig).single("file"), async (req, res) => {
  try {
    const { originalname: name, size, key, location: url = "" } = req.file;
    if (!req.body.filename) {
      return res.status(400).send({error: 'Failed'});
    }

    const searchFile = List.filter(({ file }) => file === req.body.filename);

    if (searchFile.length > 0) {
      let resultData = fs.readFileSync(`${resultsPath}/${req.body.filename}`, "utf8");
      resultData = JSON.parse(resultData);

      let docData = fs.readFileSync(`${docsPath}/${key}`, 
        (ENCONDE_FILE.includes(req.body.encode)) ? req.body.encode : 'utf8'
      );

      const termsInfo = termFrequency.generate(docData, 
        (EXTENSION_FILE.includes(req.body.mode)) ? req.body.mode : 'txt',
        (req.body.stemming === 'true') ? true : false
      );
      
      for (let key in termsInfo) {
        resultData.corpus[key] = (resultData.corpus[key] || 0) + termsInfo[key];
      }

      await Utils.writeFile(JSON.stringify(resultData)
        , `${resultsPath}/${req.body.filename}`, fs);
      
      return res.json({ name: key, terms: termsInfo });
    } else {
      return res.status(400).send({error: 'Failed'});
    }
  } catch (err) {
    console.log(err);
    return res.status(400).send({error: 'Failed'});
  }
});

module.exports = routes;
