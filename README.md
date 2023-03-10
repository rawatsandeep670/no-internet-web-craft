# no-internet-web-craft
If you want to craft the browser default no-internet page according to your design, You can use this libaray. This will library make sure to show your crafted page whenever any document page will not loaded.

## Pre-requirements:
1. Download the [sw.js](https://www.unpkg.com/no-internet-web-craft@1.0.6/sw.js) file
2. Put this file inside your project root directory, the name must be same as **sw.js**
3. Create and design a html file which you want to show when internet issue or server unavaialbe. (like no-internet.html)
4. Put this file inside your project root directory.

## How to use
Install the package using npm or script:
[npm install](https://www.npmjs.com/package/no-internet-web-craft)
##### NPM
Install using npm:
```
 npm i no-internet-web-craft
```
#### Initialisation in ESM style
```
import NoInternetWebCraft from 'no-internet-web-craft';

const wc = new NoInternetWebCraft('/no-internet.html', '1.0.1')
wc.initWebSocket().then((res) => {
    if (res.status === 'success') {
        console.log('Service worker activated')
    } else {
        console.log('Service worker activation failed')
    }
})
```
##### UMD
Put this script tag inside your <head> tag:
```
<script src="https://www.unpkg.com/no-internet-web-craft@1.0.7/umd/no-internet-web-craft.min.js"></script>
```
#### Initialisation in UMD style
The **NoInternetWebCraft** constructor function will available at the global lavel.
```
const wc = new NoInternetWebCraft('/no-internet.html', '1.0.1')
wc.initWebSocket().then((res) => {
    if (res.status === 'success') {
        console.log('Service worker activated')
    } else {
        console.log('Service worker activation failed')
    }
})
```

## License
[MIT](LICENSE)

## Keywords
[rollup](https://www.npmjs.com/package/rollup) [typescript](https://www.npmjs.com/package/typescript) [Babel](https://www.npmjs.com/package/@babel/core) [promises](https://www.npmjs.com/search?q=keywords:promise)
