exports.auth = async (client,database,req)=>{

  const collection = database.collection('users');
  
  const result = await collection.findOne({email: req.headers['email']});
  
  if(result){
  
  const bcrypt = require ('bcrypt');
  
  const compareToken = await bcrypt.compare(req.headers['password'],result.password);

  if (compareToken){   
  
      return result.role;
  
  } else {
  
      return null;
  }
}
}