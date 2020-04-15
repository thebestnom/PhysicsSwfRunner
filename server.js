const express = require('express');
const fs = require('fs');
const path = require('path');

function dirTreeSwf(filename) {
    const stats = fs.lstatSync(filename);
    const info = {
        name: path.basename(filename)
    };

    if (stats.isDirectory()) {
        info.children = [];
		for( let child of fs.readdirSync(filename)) {
            fileInfo = dirTreeSwf(filename + '/' + child);
			if(fileInfo.children || fileInfo.name.endsWith(".swf")) {
				info.children.push(fileInfo);
			}
        }
    } else {
		info.paths = [filename.replace("Public/", "")]
	}

    return info;
}
const app = express();
const port = 3000;

app.use(express.static('Public'));
const swfs = dirTreeSwf("Public");

app.get('/directory', (req, res) => res.json(swfs));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));