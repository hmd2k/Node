async (req, res) => {
    let RawPassword = null;
    let data =null;
    if (req.body.password.length == 0) {
      res.send("password is required ").status(500);
    } else if (req.body.email.length == 0) {
      res.send(" email is required").status(500);
    } else {
      try {
        const value = await query("select * from user where email = ?", [
          req.body.email,
        ]);
        if (value.length == 0) {
          res.status(500).send("User Not Found");
        } else {
          RawPassword = value[0].password;
          data=value;
        }
      } catch (err) {
        console.log(err);
      }
    }
    if (await bcrypt.compare(req.body.password, RawPassword)) {
      console.log(data[0].user_id);
      const accesstoken = jwt.sign(
          { user_id: data[0].user_id, user_role: data[0].roles, purpose: "ACCESS_TOKEN" },
          TOKEN_KEY,
          {
            expiresIn: "2h",
          }
        );
        const refreshToken = jwt.sign(
          { user_id: data.id, user_role: data.roles_id, purpose: "refreshToken" },
          TOKEN_KEY,
          {
            expiresIn: "1d",
          }
        );
      res.json({
          data,
          accesstoken,
          refreshToken
          
      }).status(200);
    } else {
      res.send("sorry passowrd").status(500);
    }
  });