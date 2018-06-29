import mongoose from 'mongoose';

import { City } from '../models/cities';

mongoose.connect('mongodb://localhost/cities')
  .then(() => console.log('MongoDB has started!!!'))
  .catch(e => console.log(e));

const brest = new City ({
  name: 'Brest',
  country: 'Belarus',
  capital: false,
  location:
    {
      lat: 52.097621,
      long: 23.734050
    }
});

brest.save((e) => {
  if (e) {
    throw e;
  }
  console.log('Brest saved successfully!!!');
});

/*mongoose.connection.dropCollection('City')
  .then(() => console.log('City was deleted!!!'))
  .catch(e => console.log(e));*/

// City.collection.drop(); //working!!!

City.find({}, (err, cities) => {
  if (err) {
    throw err;
  }
  console.log('---------------All');
  console.log(cities);
});

City.findOne({country: 'Belarus'}, (err, city) => {
  if (err) {
    throw err;
  }
  console.log('---------------One');
  console.log(city);
});

City.findById('5b35f0ef96f7243c8c550d59', (err, city) => {
  if (err) {
    throw err;
  }
  console.log('---------------By id');
  console.log(city);
});

//Example qwery syntax

// get any admin that was created in the past month

// get the date 1 month ago
/*
var monthAgo = new Date();
monthAgo.setMonth(monthAgo.getMonth() - 1);

User.find({ admin: true }).where('created_at').gt(monthAgo).exec(function(err, users) {
  if (err) throw err;
  
  // show the admins in the past month
  console.log(users);
});*/

//Updating data

City.findById('5b35f0ef96f7243c8c550d59', (err, city) => {
  if (err) {
    throw err;
  }
  console.log('---------------Updating');
  
  city.name = 'Gomel';
  
  city.save((err) => {
    if (err) {
      throw err;
    }
    console.log('City successfully update!!!');
  });
  console.log(city);
});

//Find and update

City.findOneAndUpdate({ _id: '5b35f0ef96f7243c8c550d59' }, { name: 'NewGomel' }, (err, city) => {
  if (err) {
    throw err;
  }
  console.log('----------------FindAndUpdate');
  console.log(city);
});

//Also we have methods
/*
* City.findByIdAndUpdate()
*
* For deleting
*
* city.remove
* City.findOneAndRemove
* City.findByIdAndRemove
*
* */




