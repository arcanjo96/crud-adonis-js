'use strict'

const User = use('App/Models/User');

class UserController {
    async index() {
        const users = await User.all();
        return users;
    }

    async create({ request }) {
        const data = request.only(['username', 'email', 'password']);
        const user = await User.create(data);

        return user;
    }

    async update({ request, params }) {
       // const user = await User.find(id);
        const user = await User.find(params.id);

        if(!user) {
            return { message: "usuário não encontrado." };
        }

        const { email, password, username } = request.all();

        user.email = email;
        user.password = password;
        user.username = username;

        const result = await user.save();

        return result;
    }

    async destroy({ params }) {
        const user = await User.find(params.id);
        if(!user) {
            return { message: "usuário não encontrado." };
        }
        const result = await user.delete();
        return result;
    }

    async auth({ request, auth, response }) {
        try {
            return await auth.getUser()
          } catch (error) {
            const { email, password } = request.all();

            const token = await auth.attempt(email, password);
    
            return token;
          }
    }

    async logout({ auth }) {
       const result = await auth.logout();
       return result;
    }

    async   ({ auth, response }) {
        try {
            return await auth.getUser()
          } catch (error) {
            response.send('You are not logged in')
          }
    }
}

module.exports = UserController
