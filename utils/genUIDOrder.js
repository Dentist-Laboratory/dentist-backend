exports.genUIDOrder = async (collection) => {
  const lastDoc = await collection.find().sort({ _id: -1 }).limit(1);
  if (lastDoc.length > 0) {
    const lastCustomId = lastDoc[0].UID;
    const lastNumber = parseInt(lastCustomId.substring(1));
    const newNumber = lastNumber + 1;
    return "O" + newNumber;
  } else {
    return "A1";
  }
};
