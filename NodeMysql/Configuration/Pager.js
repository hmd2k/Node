const connection = require("./DbConnection");
const util = require("util");
const query = util.promisify(connection.query).bind(connection);

const pager = async (model, pageNo, count,keyWord) => {
  const page = parseInt(pageNo);
  const limit = parseInt(count);
  const startIndex =(page - 1) * limit;
  const endIndex = page * limit;
  const pagerQuery = 'select * from '+model+' where name like "%'+keyWord+'%" limit ?, ?'
  const pagerData = await query(pagerQuery, [startIndex,limit]);
  const result = {};
  result.paginatedData = pagerData;
  return result;
};

module.exports = { pager };
