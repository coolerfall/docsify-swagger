import { install } from "./docsify-swagger";

if (!window.$docsify) {
    window.$docsify = {}
}

window.$docsify.plugins = (window.$docsify.plugins || []).concat(install)
