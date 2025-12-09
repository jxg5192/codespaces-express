var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');




var app = express();

var hbs = require('hbs');


// Sequelize (sqlite) - define model inline so no external models/ files are required
const { Sequelize, DataTypes } = require('sequelize');
const storage = require('path').join(__dirname, 'data', 'database.sqlite');


const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage,
  logging: false
});


// THE DATABASE
// creating HairProduct table
const HairProduct = sequelize.define('HairProduct', {
  name: { type: DataTypes.STRING, allowNull: false },        // product name (Lightweight Foaming Mousse, etc.) 
  category: { type: DataTypes.STRING, allowNull: false },    // what kind of product it is (cleanser, conditioner, styler, treatment, scalp)
  curlGroup: { type: DataTypes.STRING, allowNull: false },   // curl group (wavy, curly, coily)
  porosity: { type: DataTypes.STRING, allowNull: false },    // porosity type (low, high, med)
  density: { type: DataTypes.STRING, allowNull: false },     // desnity type (low, high, med)
  notes: { type: DataTypes.TEXT }                            //  description
});


// to clear table before inserting new products
async function seedIfEmpty() {
  console.log("Clearing hair products...");
  await HairProduct.destroy({ where: {} }); // deletes old hair products from the table


  // creating products array (rows to be insert into database)
  const products = [
    //WAVY HAIR... use when curlPattern starts with "2" 
   // Low porosity and all densities, a gentle cleanser
  {
    name: 'Gentle Low-Poo Cleanser',
    category: 'cleanser',
    curlGroup: 'Wavy',
    porosity: 'Low',
    density: 'All',
    notes: 'Sulfate-free, light cleanser that won’t dry out fine waves.'
  },

  // Low porosity and low density, a  light styler
  {
    name: 'Lightweight Foaming Mousse',
    category: 'styler',
    curlGroup: 'Wavy',
    porosity: 'Low',
    density: 'Low',
    notes: 'Adds volume and hold without weighing hair down.'
  },

  // Low porosity and high density, a richer styler for thick hair
  {
    name: 'Volumizing Curl Cream',
    category: 'styler',
    curlGroup: 'Wavy',
    porosity: 'Low',
    density: 'High',
    notes: 'Helps control thicker waves while keeping movement.'
  },
  // Medium porosity and low density, a light gel
  {
    name: 'Soft Hold Wave Gel',
    category: 'styler',
    curlGroup: 'Wavy',
    porosity: 'Medium',
    density: 'Low',
    notes: 'Light gel that defines fine waves without crunch.'
  },

  // Medium porosity and high density, a foam
  {
    name: 'Body Boost Wave Foam',
    category: 'styler',
    curlGroup: 'Wavy',
    porosity: 'Medium',
    density: 'High',
    notes: 'Adds lift at the roots for full, dense waves.'
  },

  // High porosity and any density, something with moisture
  {
    name: 'Hydrating Wave Leave-In Spray',
    category: 'conditioner',
    curlGroup: 'Wavy',
    porosity: 'High',
    density: 'All',
    notes: 'Lightweight leave-in that adds moisture without heaviness.'
  },



     //CURLY HAIR... use when curlPattern starts with "3" 
   
  // Medium porosity and any desnity, just cleanser
  {
    name: 'Creamy Hydrating Cleanser',
    category: 'cleanser',
    curlGroup: 'Curly',
    porosity: 'Medium',
    density: 'All',
    notes: 'Gentle cleanser that keeps curls hydrated.'
  },

  // Medium porosity conditioner for any density
  {
    name: 'Creamy Hydrating Conditioner',
    category: 'conditioner',
    curlGroup: 'Curly',
    porosity: 'Medium',
    density: 'All',
    notes: 'Adds slip and moisture.'
  },

  // Medium porosity and low density - a lighter styler
  {
    name: 'Light Curl Defining Gel',
    category: 'styler',
    curlGroup: 'Curly',
    porosity: 'Medium',
    density: 'Low',
    notes: 'Defines curls without weighing them down.'
  },

  // Medium porosity and high density, a stronger styler
  {
    name: 'Curl Defining Gel',
    category: 'styler',
    curlGroup: 'Curly',
    porosity: 'Medium',
    density: 'High',
    notes: 'Medium hold to define curls and control frizz.'
  },

  // High porosity , use richer conditioner
  {
    name: 'Moisture Lock Curl Conditioner',
    category: 'conditioner',
    curlGroup: 'Curly',
    porosity: 'High',
    density: 'All',
    notes: 'Helps seal in moisture for thirsty curls.'
  },

  // Low porosity, use a lighter conditioner
  {
    name: 'Weightless Curl Conditioner',
    category: 'conditioner',
    curlGroup: 'Curly',
    porosity: 'Low',
    density: 'All',
    notes: 'Moisturizes without causing buildup on low-porosity curls.'
  },

    //COILY HAIR... use when curlPattern starts with "4" 
   // High porosity cleanser (any density)
  {
    name: 'Nourishing Co-Wash Cleanser',
    category: 'cleanser',
    curlGroup: 'Coily',
    porosity: 'High',
    density: 'All',
    notes: 'Creamy co-wash that gently cleanses and conditions.'
  },

  // High porosity styler (any density)
  {
    name: 'Rich Butter Cream',
    category: 'styler',
    curlGroup: 'Coily',
    porosity: 'High',
    density: 'All',
    notes: 'Seals in moisture and protects coils.'
  },

  // High porosity treatment (any density)
  {
    name: 'Intense Moisture Hair Mask',
    category: 'treatment',
    curlGroup: 'Coily',
    porosity: 'High',
    density: 'All',
    notes: 'Deep moisture treatment for high-porosity hair.'
  },

  // Low/Medium porosity - lighter styler
  {
    name: 'Curl Softening Cream',
    category: 'styler',
    curlGroup: 'Coily',
    porosity: 'Medium',
    density: 'All',
    notes: 'Softens coils without too much weight.'
  },

  // Medium porosity – user a treatment or mask
  {
    name: 'Elasticity Repair Mask',
    category: 'treatment',
    curlGroup: 'Coily',
    porosity: 'Medium',
    density: 'All',
    notes: 'Helps restore bounce and elasticity to coils.'
  },


  //  WEEKLY and to be used for any hair types
{
  name: 'Soothing Scalp Serum',
  category: 'scalp',
  curlGroup: 'All',
  porosity: 'All',
  density: 'All',
  notes: 'Light, calming serum for a healthy scalp.'
},
{
  name: 'Gentle Clarifying Shampoo',
  category: 'cleanser',
  curlGroup: 'All',
  porosity: 'All',
  density: 'All',
  notes: 'Use occasionally to remove buildup.'
},

// weekly masks based on curl group and porosity
{
  name: 'Protein Repair Mask',
  category: 'treatment',
  curlGroup: 'Wavy',
  porosity: 'Low',
  density: 'All',
  notes: 'Strengthens fine wavy strands prone to over-hydration.'
},
{
  name: 'Hydration Recovery Mask',
  category: 'treatment',
  curlGroup: 'Curly',
  porosity: 'Medium',
  density: 'All',
  notes: 'Replenishes moisture balance for curly hair.'
},
{
  name: 'Heavy Butter Mask',
  category: 'treatment',
  curlGroup: 'Coily',
  porosity: 'High',
  density: 'All',
  notes: 'Deep moisture delivery for porous coils.'
}

    

  ];
  // loop through all obejcts in the products array to add them to the DB
 for (const product of products) {
    await HairProduct.create(product);
  }

  console.log("Seeded hair products");
}
sequelize.sync()
  .then(() => {
    console.log('Database synced');
    return seedIfEmpty();
  })
  .catch(err => {
    console.error('Unable to sync database:', err);
  });









// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// to reference header and footer
hbs.registerPartials(path.join(__dirname, 'views', 'partials'))
hbs.registerPartial('partial_name', 'partial value');

hbs.registerHelper('eq', function(a,b){
  return a === b;
});

hbs.registerHelper('inc', function(value) {
  return parseInt(value) + 1;
});

function getCurlGroup(curlPattern) {

  // if nothing selected use CURLY
  if (!curlPattern) return 'Curly'; 

  // if 2s... classify as WAVY 
  if (curlPattern.startsWith('2')) return 'Wavy'; 

  // if 3s... classify as CURLY 
  if (curlPattern.startsWith('3')) return 'Curly';

  // if 4s... classify as COILY 
  return 'Coily';
}


// for the pro tip section at the bottom of the routine pg
// grabbing the curl group to determine what pro tip rec to show user
function buildProTip(curlGroup) { 
  if (curlGroup === 'Wavy') {
    return 'Waves love lightweight products! Avoid heavy creams that can weigh down your natural texture. Start with small amounts and build up only where needed.';
  }
  if (curlGroup === 'Curly') {
    return 'Curls need balanced moisture. Use enough product to coat each curl, and avoid touching your hair while it dries to reduce frizz.';
  }
  return 'Coils need rich moisture and gentle handling. Layer hydrating products and avoid harsh towels. Use a T-shirt or microfiber instead.';
}


// grabbing the curl pattern, porosity, and density from user input to make routine
async function buildRoutineFromProducts({ curlPattern, porosity, density }) {

  // determing curl group based on selected curl pattern
  const curlGroup = getCurlGroup(curlPattern);

  // get matching products from the DB based on selected user curl group and porosity and keep in array
  const products = await HairProduct.findAll({
    where: {
      curlGroup: [curlGroup, 'All'],
      porosity: [porosity || 'Medium', 'All'],
      density: [density || 'Medium', 'All']
    }
  });



 

  function choose(category) {
  return products.filter(function (p) {
    return p.category === category;
  });
}

  // creating arrays to organzie all possible products into  groups
  const cleansers    = choose('cleanser'); // all cleanser products
  const conditioners = choose('conditioner'); // all conditioners
  const stylers      = choose('styler');   // all styling products
  const treatments   = choose('treatment');  // deep treatments/masks
  const scalpProds   = choose('scalp');   // scalp serums and oils

  //  list to build  morning routine
  const morning = [];

  // if styler is found, user product, otherwise use generic
  if (stylers.length > 0) {
    morning.push({
      title: 'Refresh & Style',
      main: `Use ${stylers[0].name}`,
      note: stylers[0].notes || ''
    });
  } else {
    morning.push({
      title: 'Refresh',
      main: 'Lightly mist hair with water or refresher spray',
      note: `Scrunch gently to wake up your ${curlGroup.toLowerCase()} texture.`
    });
  }

  const night = [];

  if (cleansers.length > 0) {
    night.push({
      title: 'Cleanse (as needed)',
      main: `Wash with ${cleansers[0].name}`,
      note: cleansers[0].notes || ''
    });
  }

  if (conditioners.length > 0) {
    night.push({
      title: 'Condition',
      main: `Apply ${conditioners[0].name}`,
      note: conditioners[0].notes || ''
    });
  }

  night.push({
    title: 'Protect',
    main: 'Use a satin pillowcase or bonnet',
    note: 'Pineapple or loosely braid hair to reduce friction overnight.'
  });

  const weekly = [];

  if (treatments.length > 0) {
    weekly.push({
      title: 'Deep Treatment',
      main: `Use ${treatments[0].name} once a week`,
      note: treatments[0].notes || ''
    });
  }

  if (scalpProds.length > 0) {
    weekly.push({
      title: 'Scalp Care',
      main: `Apply ${scalpProds[0].name}`,
      note: scalpProds[0].notes || ''
    });
  }

  weekly.push({
    title: 'Clarify (Occasionally)',
    main: 'Use a clarifying shampoo every 2–4 weeks',
    note: 'Helps remove buildup so your pattern shows clearly.'
  });

  const profileSummary =
    `${curlPattern || 'N/A'} ${curlGroup} hair, ` +
    `${(porosity || 'Medium')} porosity, ` +
    `${(density || 'Medium')} density`;

  const proTip = buildProTip(curlGroup);

  return { profileSummary, curlGroup, proTip, morning, night, weekly };
}


// app.use('/', indexRouter);
// app.use('/users', usersRouter);


// home page
app.get('/', function(req, res, next) {
  res.render('index', { title: 'Curly Care Coach' });
});

// quiz page
app.get('/quiz', function(req,res,next){
  res.render('quiz', {title:'Curly Care Coach - Quiz'});
});

// routine page
app.get('/routine', async function(req, res, next) {
  const { name, curlPattern, porosity, density, scalp, humidity } = req.query; // pull quiz/user answers from the url
  let goals = req.query.goals || []; // if user selects goals, store them, otherwise keep empty
  if (!Array.isArray(goals)) goals = [goals]; // show goal aas string


  // build the users personalized routine using the helper function
  try {
    const { profileSummary, curlGroup, proTip, morning, night, weekly } =
      await buildRoutineFromProducts({ curlPattern, porosity, density });


      // redner the results/routine page
    res.render('routine', {
      title: 'Curly Care Coach - Your Routine',
      name,
      profileSummary,
      curlPattern,
      porosity,
      density,
      scalp,
      humidity,
      goals,
      curlGroup,
      proTip,
      morningSteps: morning,
      nightSteps: night,
      weeklySteps: weekly
    });
  } catch (err) {
    next(err);
  }
});




app.get('/page2', function(req,res,next){
  res.render('index', {title:'page2'});
});


// can use this to personalize data/page for each user based on the URL 
// can grab things from lists in your database
app.get('/user/:name', function(req,res,next){
  res.render('index', {title:req.params.name});
});




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
