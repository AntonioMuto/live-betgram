const getMegaStorage = require('../config/mega').getMegaStorage;

const retrieveFolder = async (name) => {
    try {
        const storage = await getMegaStorage();
        const elements =  storage.root.children;
        const usersFolder =  elements.find(node => node.name === name);
        if (!usersFolder) {
            throw new Error('USERS folder not found');
        } else{
            return usersFolder;
        }
    } catch (error) {
        throw new Error(error);
    }
};


const checkIfElementAlredyExists = async (usersFolder,id) => {
    try {
        if (usersFolder.children && usersFolder.children?.find(node => node.name === `${id}.json`)) {
            return true;
        } else{
            return false;
        }
    } catch (error) {
        throw new Error(error);
    }
};

const findFile = async (usersFolder,id) => {
    try {
        const element = usersFolder.children && usersFolder.children?.find(node => node.name === `${id}.json`);
        if (!element) {
            throw new Error('File not found');
        } else{
            return element;
        }
    } catch (error) {
        throw new Error(error);
    }
};


module.exports = {
    retrieveFolder,
    checkIfElementAlredyExists,
    findFile
};