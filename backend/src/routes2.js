const { Router } = require('express');
const axios = require('axios');
const Dev = require('./models/Dev');
const DevController = require('./controllers/DevController');
// const SearchController = require('./controllers/SearchController');

const routes = Router();

routes.post('/devs', async (request, response) => {
    const { github_username, techs } = request.body;

    const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);

    const { name = login, avatar_url, bio } = apiResponse.data;

    const techsArray = techs.split(',').map(tech => tech.trim());


    const dev = await Dev.create({
        github_username,
        name,
        avatar_url,
        bio,
        techs: techsArray        
    });

    // console.log(apiResponse.data);

    return response.json(dev);

});

// a route recebe a função store do controller
routes.get('/devs', DevController.index);
// routes.post('/devs', DevController.store);

// routes.get('/search', SearchController.index);

module.exports = routes;

// chunk