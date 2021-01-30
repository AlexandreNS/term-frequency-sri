const fs = require('fs');
const { decode: decodeHtml } = require('html-entities')
const stopwords = require('./../resources/stopwords')
const natural = require('natural');

natural.PorterStemmerPt.attach();

const termFrequency = {};

function sanitizeHtml(textData){
  textData = decodeHtml(textData);
  textData = textData.replace(/(<([^>]+)>)/ig, ' ');
  return textData;
}

termFrequency.generate = (textData, mode = 'html', stemming = true) => {
  if (mode === 'html') {
    textData = sanitizeHtml(textData)
  }

  textData = textData.replace(/([^A-Za-zÀ-ÖØ-öø-ÿ]+)/ig, ' ').toLowerCase().trim()
  
  let bagWords = textData.split(/\s+/).filter(
    (word) => stopwords.indexOf(word) === -1 && word.length > 2)

  if (stemming) {
    bagWords = bagWords.map(v => v.stem());
  } 
    
  const countWords = {}
    
  bagWords.forEach(function (i) {
    countWords[i] = (countWords[i] || 0) + 1;
  });

  return countWords;
}

module.exports = termFrequency;