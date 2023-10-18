exports.auth = async (client, database, req) => {

  const user = await database.collection('users').findOne({ email: req.body.email });

  if (!user) {
    return "user non trovato";
  }

  const passwordMatch = await bcrypt.compare(req.body.password, user.password);

  if (!passwordMatch) {
    return "password sbagliata";
  }

  return user.role;
};
