const pager = async (model, pageNo, count, keyWord) => {
  const page = parseInt(pageNo);
  const limit = parseInt(count);
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const getEmployee = await model
    .find({
      $or: [{ firstName: { $regex: keyWord } }],
    })
    .limit(limit)
    .skip(startIndex)
    .exec();

  const result = {};
  const totalCount = await model.countDocuments().exec();
  result.totalCount = totalCount;
  result.paginatedData = getEmployee;
  return result;
};

module.exports = { pager };
