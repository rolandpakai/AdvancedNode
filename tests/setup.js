jest.setTimeout(30000);

const { mongoConnect } = require('../services/mongo')
require('../models/User');

mongoConnect();
