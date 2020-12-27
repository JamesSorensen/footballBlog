const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const models = require('../models');


// POST is register
router.post('/register', async (req, res) => {
  const login = req.body.login;
  const password = req.body.password;
  const passwordConfirm = req.body.passwordConfirm;

  if ( !login || !password || !passwordConfirm ) {
  	const fields = [];
  	if (!login) fields.push(login);
  	if (!password) fields.push(password);
  	if (!passwordConfirm) fields.push(passwordConfirm);
  	res.json({
      ok: false,
      error: 'Все поля должны быть заполнены!',
      fields
    });
  } else if (!/^[a-zA-Z0-9]+$/.test(login)) {
  	res.json({
      ok: false,
      error: 'Только латинские буквы и цифры!',
      fields: ['login']
    });
  } else if ( login.length < 3 || login.length > 16 ) {
    res.json({
      ok: false,
      error: 'Длина логина от 3 до 16 символов!',
      fields: ['login']
    });
  } else if ( password !== passwordConfirm ) {
    res.json({
      ok: false,
      error: 'Пароли не совпадают!',
      fields: ['password', 'passwordConfirm']
    });
  } else if (password.length < 5) {
    res.json({
      ok: false,
      error: 'Минимальная длина пароля 5 символов!',
      fields: ['password']
    });
  } else {
  	models.User.findOne({
  		login
  	}).then(async user => {
  		if ( !user ) {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);    

        try {
          const user = await models.User.create({
            login,
            password: hash
          });
          if (user) {
            req.session.userId = user.id;
            req.session.userLogin = user.login;

            res.json({
              ok: true
            });
          }
        } catch (error) {
          console.log(error);
          res.json({
            ok: false,
            error: 'Ошибка'
          });
        } 
  		} else {
  		  res.json({
    	  	ok: false,
    	  	error: 'Имя занято',
    	  	fields: ['login']
	      });
  		}
  	});
  }
});

// POST is login
router.post('/login', (req, res) => {
  const login = req.body.login;
  const password = req.body.password;

  if (!login || !password) {
    const fields = [];
    if (!login) fields.push('login');
    if (!password) fields.push('password');

    res.json({
      ok: false,
      error: 'Все поля должны быть заполнены!',
      fields
    });
  } else {
    models.User.findOne({
      login
    })
      .then(user => {
        if (!user) {
        	
          res.json({
            ok: false,
            error: 'Логин и пароль неверны!',
            fields: ['login', 'password']
          });
        } else {
          console.log('this is work' + user.password );
          bcrypt.compare(password, user.password, function(err, result) {
              if (!result) {
              console.log('result == false');
              res.json({
                ok: false,
                error: 'Логин и пароль неверны!',
                fields: ['login', 'password']
              });
            } else {
              req.session.userId = user.id;
              req.session.userLogin = user.login;
              req.session.userRole = user.role;
              
              res.json({
                ok: true
              });
            }
          });
        }
      })
      .catch(err => {
        console.log(err);
        res.json({
          ok: false,
          error: 'Ошибка, попробуйте позже!'
        });
      });
  }
});

// GET for logout
router.get('/logout', (req, res) => {
  if (req.session) {
    // delete session object
    req.session.destroy(() => {
      res.redirect('/');
    });
  } else {
    res.redirect('/');
  }
});

module.exports = router;