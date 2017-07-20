var connectdb=require('../connectdb');
function showAllMemberTodb(sqlcmd) {
  return  new Promise(function(resolve,reject){
    connectdb.query('SELECT * FROM member', function(err, rows){
      if(err){
        reject(err);
      }
      resolve(rows);
    });
  });
}
exports.showAllMemberTodb=showAllMemberTodb;

function showOneMember(id){
  return new Promise(function(resolve,reject){
    connectdb.query('SELECT * FROM member where id=?',[id],function(err,rows){
      if(err)
       reject(err);
      else
       resolve(rows[0]);
    });
  });
}
exports.showOneMember=showOneMember;
