const path = require('path')
const fs = require('fs-extra')
const _ = require('lodash')
const postcss = require('postcss')
const autoprefixer = require('autoprefixer')
const sass = require('node-sass')
const pug = require('pug')

var cleaner  = postcss([ autoprefixer({ add: true, browsers: [] }) ])
var prefixer = postcss([ autoprefixer ])

const src = path.resolve(__dirname, '..', 'src')
const srcPug = path.join(src, 'index.pug')

const www = path.resolve(__dirname, '..')
const wwwCss = path.join(www, 'index.css')
const wwwHtml = path.join(www, 'index.html')

const nav = require('../src/nav.json')

function renderSass(destPath, options) {
  return new Promise((resolve, reject) => {
    sass.render(options, (err, result) => {
      if(err) return reject(err)
      cleaner.process(result.css)
        .then(cleaned => prefixer.process(cleaned.css))
        .then(prefixed => fs.outputFile(destPath, prefixed.css))
        .then(() => resolve())
        .catch(err => reject(err))
    })
  })
}

function renderPug(srcPath, destPath, options) {
  return new Promise((resolve, reject) => {
    let html
    try {
      html = pug.renderFile(srcPath, options)
    } catch(e) {
      return reject(e)
    }
    fs.outputFile(destPath, html)
      .then(() => resolve())
      .catch(err => reject(err))
  })
}

function renderJs(srcPath, destPath, options) {
  return new Promise((resolve, reject) => {
    fs.copy(path.join(srcPath, 'index.js'), path.join(destPath, 'index.js'))
      .then(() => fs.copy(path.join(srcPath, 'fonts'), path.join(destPath, 'fonts')))
  })
}

renderSass(wwwCss, {
  file: path.join(src, 'index.sass'),
  indentedSyntax: true,
  includePaths: [],
  outputStyle: "expanded"
})
.then(() => renderPug(srcPug, wwwHtml, { nav: nav }))
.then(() => renderJs(src, www))
.then(() => {
  console.log('Success')
})
.catch(err => {
  console.log(err)
})
