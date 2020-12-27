const faker = require('faker');
const tr = require('transliter');

const models = require('./models');

const owner = '5fd9f55177bd882b9c07006c';

module.exports = async () => {
  try {
     const post = await models.Post.remove();

    Array.from({ length: 20 }).forEach(async  () => {
      const title = faker.lorem.words(5);
      const url = `${tr.slugify(title)}-${Date.now().toString(36)}`;
      const post = await models.Post.create({
        title,
        body: faker.lorem.words(100),
        url,
        owner
      })
        .then(console.log)
        .catch(console.log);
    });
  } catch (error) {
    console.log(error);
  }
  console.log(post);
};