function insertCustomData(encryptedData, iv, key) {
    const ivLength = iv.length;
    const keyLength = key.length;

    let modifiedData = encryptedData;

    const randomIndex1 = Math.floor(Math.random() * (modifiedData.length + 1));

    modifiedData = modifiedData.slice(0, randomIndex1)+ iv + modifiedData.slice(randomIndex1);
 

    var randomIndex2;
    do {
        randomIndex2 = Math.floor(Math.random() *(modifiedData.length + 1));
    } while (randomIndex1 <= randomIndex2 && randomIndex2 <= randomIndex1 + ivLength);

    modifiedData = modifiedData.slice(0, randomIndex2) + key + modifiedData.slice(randomIndex2);
    
    modifiedData=`${ivLength}.${keyLength}.${randomIndex1}.${randomIndex2}.${modifiedData}`

    // customDataArray.forEach(customData => {
    //     console.log(customData)
    //     // Get a random index to insert the custom data
    //     const randomIndex = Math.floor(Math.random() * (modifiedData.length + 1));
    //     console.log(randomIndex)

    //     // Insert the custom data at the random index
    //     modifiedData = modifiedData.slice(0, randomIndex) + customData + modifiedData.slice(randomIndex);
    // });

    return modifiedData;
}
module.exports = insertCustomData