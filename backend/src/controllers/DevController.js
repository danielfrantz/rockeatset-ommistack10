const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');

//index, show, store, update, destroy

module.exports = {
    async index(request, response) {
        const devs = await Dev.find();

        return response.json(devs);
    },

    async store(request, response) {

        // dados do corpo da requisção
        const { github_username, techs, latitude, longitude } = request.body;

        // verificar se já existe um dev com este nome na base de dados
        let dev = await Dev.findOne({ github_username });

        // se não existir o dev, cadastre
        if (!dev) {

            const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);

            // dados vindos da api do github
            // desestruturação, buscar só os dados que eu quero
            const {
                name = login, avatar_url, bio
            } = apiResponse.data;

            // recebe as tecnologias, split separa cada strings onde tem virgula
            // map percorre o array retirando os espaços com a função trim
            // https: //rocketseat.com.br/week-10/aulas?aula=2
            const techsArray = parseStringAsArray(techs);

            const location = {
                type: 'Point',
                coordinates: [longitude, latitude],
            };

            // avariável dev recebe o retorno da base de dados
            dev = await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techsArray,
                location,
            });
        }

        return response.json(dev);
    }
};