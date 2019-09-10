# IPFS Prokect

1. create a form

```html
<form onSubmit={this.submitFile}>
    <input type='file' />
    <input type='submit' />
</form>
```

2. create an event listner

```html
<input type='file' onChange={this.captureFile} />
```

3. patern for processing file for storage

```js
captureFile = (event) => {
    event.preventDefault()
    // process file for ipfs
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
        console.log('buffer', Buffer(reader.result))
        this.setState({ buffer: Buffer(reader.result) })
    }
}
```

4. install ipfs and add to project
```sh
npm i --save ipfs-http-client
```

import into project
```js
var ipfsClient = require('ipfs-http-client')
```