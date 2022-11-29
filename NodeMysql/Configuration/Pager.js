const connection = require("./DbConnection");
const util = require("util");
const query = util.promisify(connection.query).bind(connection);

const pager = async (model, pageNo, count, keyWord) => {
  const page = parseInt(pageNo);
  const limit = parseInt(count);
  const startIndex =(page - 1) * limit;
  const endIndex = page * limit;
  const countQuery = 'select count(*) as count from '+model+' where name like "%'+keyWord+'%"'
  const countData = await query(countQuery, [startIndex,limit]);

  const pagerQuery = 'select * from '+model+' where name like "%'+keyWord+'%" limit ?, ?'
  const pagerData = await query(pagerQuery, [startIndex,limit]);
  const result = {};
  result.dataCount = countData[0].count;
  result.paginatedData = pagerData;
  return result;
};

module.exports = { pager };
