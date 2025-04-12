const getOrderedFilesArray = (filesArray) => {
    const newFilesArray = [];
    for (let x in filesArray) {
        for (let y of filesArray) {
            const z = y.filename
            console.log(z)
            if (z.at(-6) === x) newFilesArray.push(y.id);
        }
    }
    console.log('herethey')
    console.log(newFilesArray)
    return newFilesArray
};
 
module.exports = getOrderedFilesArray