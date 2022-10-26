/*
 * All routes for Widget Data are defined here
 * Since this file is loaded in server.js into api/widgets,
 *   these routes are mounted onto /api/widgets
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const db = require('../db/connection');


router.use((req, res, next) => {
  // if (!req.session.user_id) {
  //   return res.redirect('/login');
  // }
  console.log('inside owner11 router');

  next();
});

//owner
//GET restaurants orders/
router.get('/', (req, res) => {
  const query = `SELECT orders.id, clients.name, start_time, end_time, confirm, ready
  FROM orders
  JOIN clients ON clients.id = client_id
  ORDER BY start_time DESC
  ;`;
  console.log(query);
  db.query(query)
    .then(data => {
      const widgets = data.rows;
      const templateVars = {urls:widgets};
      //res.json(widgets );
      res.render("restaurantOrders", templateVars);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

// GET /restaurants  orders/:id/
router.get('/:id', (req, res) => {
  db.query(`SELECT orders.id, clients.name, start_time, end_time, confirm,ready
  FROM orders
  JOIN clients ON clients.id = client_id
  WHERE orders.id = $1;`,[req.params.id])
    .then(data => {
      const widgets = data.rows[0];
      const templateVars = { order: widgets};
      //res.json(widgets );
      res.render("restaurantOrderDetails", templateVars);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

//take the order, start cooking
//Edit  POST /orders/:id
router.post('/:id', (req, res) => {
  return db.query(`UPDATE orders
  SET end_time = start_time + $1
  WHERE orders.id = $2
  RETURNING *;`,[req.body.fulfillTime*60, req.params.id])
    .then((result) => {
      console.log(result.rows[0]);
      const widgets = result.rows[0];
      const templateVars = { order: widgets};
      //res.json(widgets );
      res.render("restaurantOrderDetails", templateVars);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    })
});




//finish the order
//Delete  POST/orders/:id/delete




////login
//app.get('/login/:id', (req, res) => {
//  // using encrypted cookies
//  req.session.user_id = req.params.id;

//  // or using plain-text cookies
//  res.cookie('user_id', req.params.id);

//  // send the user somewhere
//  res.redirect('/');
//});

module.exports = router;
