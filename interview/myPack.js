const fs = require('fs');
const path = require('path');
const { parse } = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const babel = require('@babel/core');
const { js_beautify } = require('js-beautify');

let ID = 0;

const createAssets = (fileName) => {
    const content = fs.readFileSync(fileName, { encoding: 'utf-8' });
    const dependencies = [];

    const ast = parse(content, {
        sourceType: "module",
    });

    traverse(ast, {
        ImportDeclaration: ({ node }) => {
            // console.log(node.source.value);
            dependencies.push(node.source.value);
        },
    });

    // console.log(dependencies);
    const { code } = babel.transformFromAstSync(ast, null, {
        presets: ["@babel/preset-env"]
    });

    // console.log(code);

    const assets = {
        id: ID++,
        fileName,
        code,
        dependencies,
    };

    return assets;
};

const createGraph = (entry) => {
    const entryAsset = createAssets(entry);
    const assets = [entryAsset];

    for (let asset of assets) {
        const dependencies = asset.dependencies;
        const dirname = path.dirname(asset.fileName);

        asset.mapping = {};

        dependencies.forEach(relativePath => {
            const absolutePath = path.join(dirname, relativePath);
            const dAsset = createAssets(absolutePath);
            asset.mapping[relativePath] = dAsset.id;
            assets.push(dAsset);
        });
    }

    return assets;
};

const createBundle = (graphs) => {
    let modules = '';
    
    graphs.forEach(module => {
        modules += `${module.id}: [
            function(module, require, exports) {
                ${module.code}
            },
            ${JSON.stringify(module.mapping)}
        ],`;
    });

    const result = `
        (function(modules) {
            function require(id) {
                function localRequire(relativePath) {
                    return require(mapping[relativePath]);
                }

                var [ fn, mapping ] = modules[id];
                var module = { exports: {} };
                fn(module, localRequire, module.exports);

                return module.exports;
            }

            require(0);
        })({${modules}})
    `;

    return js_beautify(result);
};

// const assets = createAssets('./src/index.js');
// console.log(assets);

const graph = createGraph('./src/index.js');
const bundle = createBundle(graph);
console.log(bundle);

// let entry = path.dirname('./src/index.js');
// entry = path.resolve(entry, './log.js');
// console.log(entry);