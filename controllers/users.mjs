import { getHash } from '../utility.mjs';

export default function initUsersController(db) {
  // const home = async (request, response) => {
  //   response.render('games/index');
  // };

  const login = async (request, response) => {
    const loginData = request.body;
    const hashedPassword = getHash(loginData.password);
    try {
      // locate user name within database
      const user = await db.User.findOne({
        where: {
          name: loginData.name,
        },
      });
      console.log('user==>', user);
      // convert keyed-in password to hashed so as to auth with the one in db

      console.log('hashed password', hashedPassword);
      console.log('user.password :>> ', user.password);
      if (hashedPassword === user.password) {
        response.cookie('loggedIn', true);
        response.cookie('userId', user.id);
        response.send({ user });
      } else {
        throw Error('Wrong Login Details');
      }
    }
    catch (error) {
      console.log('login error')
      response.send({ error: error.message });
    }
  };

  
  const register = async (request, response) => {
    const user = request.body;
    try {
      const existingUser = await db.User.findOne({
        where: {
          name: user.name,
        },
      });
      if (!existingUser) {
        const hashedPassword = getHash(user.password);
        await db.User.create({
          name: user.name,
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        response.send('userCreated');
      } else {
        throw Error('Failed Registration');
      }
    } catch (error) {
      console.log('error in user registration');
      response.send({ error: error.message });
    }
  };

  const dashboard = async (request, response) => {
    console.log('userid', request.cookies.userId);

    try {
      const user = await db.User.findOne({
        where: {
          id: request.cookies.userId,
        },
      });
      console.log('user', user);
      response.send({ user });
    }
    catch (error) {
      console.log(error);
    }
  };


  return {
    // home,
     login, register, dashboard,
  };
}
