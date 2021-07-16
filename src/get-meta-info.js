const fse = require('fs-extra');

const {findNearestFile} = require('./find-nearest-file');

/**
 * @param {string[]} changedFiles
 * @param {string} filename
 * @returns {string[]}
 */
const getMetaFiles = async (changedFiles, filename) => {
    const queue = changedFiles.map(async (filePath) => {
        return await findNearestFile(filename, filePath);
    });

    const results = await Promise.all(queue);

    return [...new Set(results)];
};

/**
 * @param {string[]} labelFiles
 * @returns {string[]}
 */
const getMetaInfoFromFiles = async (labelFiles) => {
    const labels = [];

    await Promise.all(...[labelFiles.map(async (file) => {
        if (!file) {
            return;
        }

        try {
            const fileData = await fse.readFile(file, 'utf8');
            const fileLabels = fileData.split('\n');
            labels.push(...fileLabels);
        } catch (e) {
            console.error(`file: ${file} errored while reading data: ${e}`);
            return Promise.resolve();
        }
    })]);

    return [...new Set(labels)].filter(Boolean);
};


module.exports = {
     getMetaFiles,
    getMetaInfoFromFiles,
};
