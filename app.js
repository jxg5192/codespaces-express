var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');



// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

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

// define entry
// Task model
// const Task = sequelize.define('Task', {
//   name: { type: DataTypes.STRING, allowNull: false },
//   description: { type: DataTypes.TEXT }
// });
// Hair routine rules table
// const RoutineRule = sequelize.define('RoutineRule', {
//   curlPattern: { type: DataTypes.STRING, allowNull: false },  // e.g. "2C"
//   porosity: { type: DataTypes.STRING },                       // e.g. "High"
//   profileSummary: { type: DataTypes.STRING },                 // text shown under "Your Hair Profile"
//   morning: { type: DataTypes.TEXT },                          // newline-separated steps
//   night: { type: DataTypes.TEXT },
//   weekly: { type: DataTypes.TEXT }
// });


// THE DATABASE
// creating hairproduct table
const HairProduct = sequelize.define('HairProduct', {
  name: { type: DataTypes.STRING, allowNull: false },        // product name (Lightweight Foaming Mousse, etc.) 
  category: { type: DataTypes.STRING, allowNull: false },    // what kind of product it is (cleanser, conditioner, styler, treatment, scalp)
  curlGroup: { type: DataTypes.STRING, allowNull: false },   // curl group (wavy, curly, coily)
  porosity: { type: DataTypes.STRING, allowNull: false },    // porosity type (low, high, med)
  density: { type: DataTypes.STRING, allowNull: false },     // desnity type (low, high, med)
  notes: { type: DataTypes.TEXT }                            //  description
});


// ensure database tables exist; don't block export - log result
// sequelize.sync().then(() => {
//   console.log('Database synced');
// }).catch(err => {
//   console.error('Unable to sync database:', err);
// });

// async function seedIfEmpty() {
//   const count = await RoutineRule.count();
//   if (count === 0) {
//     await RoutineRule.create({
//       curlPattern: '2C',
//       porosity: 'High',
//       profileSummary: '2C Curls, High Porosity, Medium Density, Dry Scalp',
//       morning: [
//         'Refresh | Water spray + sea salt spray | Scrunch gently to revive curls',
//         'Style & Define | Lightweight mousse | Scrunch upward from ends to roots'
//       ].join('\n'),
//       night: [
//         'Co-Wash | Cleansing conditioner or low-poo | Massage scalp gently to stimulate circulation',
//         'Deep Condition | Rich moisturizing conditioner | Apply from mid-lengths to ends, leave for 5–10 minutes',
//         'Protect | Satin pillowcase or silk bonnet | Use pineapple method to preserve curls overnight'
//       ].join('\n'),
//       weekly: [
//         'Deep Treatment | Intensive hair mask or hot oil treatment | Apply to clean hair, cover with shower cap for 20–30 minutes',
//         'Scalp Treatment | Scalp oil massage | Massage for 5 minutes to boost circulation',
//         'Clarify | Clarifying shampoo | Remove product buildup once every 2–4 weeks'
//       ].join('\n')
//     });
//   }
// }

// async function seedIfEmpty() {
//   const count = await HairProduct.count();
//   if (count > 0) return;

async function seedIfEmpty() {
  console.log("Clearing hair products...");
  await HairProduct.destroy({ where: {} }); // deletes old rows


  // creating products array (rows to be insert into database)
  const products = [
    //WAVY HAIR... use when curlPattern starts with "2" 
   // Low porosity – all densities (gentle cleanser)
  {
    name: 'Gentle Low-Poo Cleanser',
    category: 'cleanser',
    curlGroup: 'Wavy',
    porosity: 'Low',
    density: 'All',
    notes: 'Sulfate-free, light cleanser that won’t dry out fine waves.'
  },

  // Low porosity + LOW density – very light styler
  {
    name: 'Lightweight Foaming Mousse',
    category: 'styler',
    curlGroup: 'Wavy',
    porosity: 'Low',
    density: 'Low',
    notes: 'Adds volume and hold without weighing hair down.'
  },

  // Low porosity + HIGH density – richer styler for thick waves
  {
    name: 'Volumizing Curl Cream',
    category: 'styler',
    curlGroup: 'Wavy',
    porosity: 'Low',
    density: 'High',
    notes: 'Helps control thicker waves while keeping movement.'
  },
  // Medium porosity + LOW density
  {
    name: 'Soft Hold Wave Gel',
    category: 'styler',
    curlGroup: 'Wavy',
    porosity: 'Medium',
    density: 'Low',
    notes: 'Light gel that defines fine waves without crunch.'
  },

  // Medium porosity + HIGH density
  {
    name: 'Body Boost Wave Foam',
    category: 'styler',
    curlGroup: 'Wavy',
    porosity: 'Medium',
    density: 'High',
    notes: 'Adds lift at the roots for full, dense waves.'
  },

  // High porosity – any density, more moisture
  {
    name: 'Hydrating Wave Leave-In Spray',
    category: 'conditioner',
    curlGroup: 'Wavy',
    porosity: 'High',
    density: 'All',
    notes: 'Lightweight leave-in that adds moisture without heaviness.'
  },



     //CURLY HAIR... use when curlPattern starts with "3" 
    // Medium porosity + LOW density
  // Medium porosity – cleanser for any density
  {
    name: 'Creamy Hydrating Cleanser',
    category: 'cleanser',
    curlGroup: 'Curly',
    porosity: 'Medium',
    density: 'All',
    notes: 'Gentle cleanser that keeps curls hydrated.'
  },

  // Medium porosity – conditioner (any density)
  {
    name: 'Creamy Hydrating Conditioner',
    category: 'conditioner',
    curlGroup: 'Curly',
    porosity: 'Medium',
    density: 'All',
    notes: 'Adds slip and moisture.'
  },

  // Medium porosity + LOW density – lighter styler
  {
    name: 'Light Curl Defining Gel',
    category: 'styler',
    curlGroup: 'Curly',
    porosity: 'Medium',
    density: 'Low',
    notes: 'Defines curls without weighing them down.'
  },

  // Medium porosity + HIGH density – stronger styler
  {
    name: 'Curl Defining Gel',
    category: 'styler',
    curlGroup: 'Curly',
    porosity: 'Medium',
    density: 'High',
    notes: 'Medium hold to define curls and control frizz.'
  },

  // High porosity – richer conditioner
  {
    name: 'Moisture Lock Curl Conditioner',
    category: 'conditioner',
    curlGroup: 'Curly',
    porosity: 'High',
    density: 'All',
    notes: 'Helps seal in moisture for thirsty curls.'
  },

  // Low porosity – lighter conditioner
  {
    name: 'Weightless Curl Conditioner',
    category: 'conditioner',
    curlGroup: 'Curly',
    porosity: 'Low',
    density: 'All',
    notes: 'Moisturizes without causing buildup on low-porosity curls.'
  },

    //COILY HAIR... use when curlPattern starts with "4" 
   // High porosity – cleanser (any density)
  {
    name: 'Nourishing Co-Wash Cleanser',
    category: 'cleanser',
    curlGroup: 'Coily',
    porosity: 'High',
    density: 'All',
    notes: 'Creamy co-wash that gently cleanses and conditions.'
  },

  // High porosity – styler (any density)
  {
    name: 'Rich Butter Cream',
    category: 'styler',
    curlGroup: 'Coily',
    porosity: 'High',
    density: 'All',
    notes: 'Seals in moisture and protects coils.'
  },

  // High porosity – treatment (any density)
  {
    name: 'Intense Moisture Hair Mask',
    category: 'treatment',
    curlGroup: 'Coily',
    porosity: 'High',
    density: 'All',
    notes: 'Deep moisture treatment for dry, high-porosity hair.'
  },

  // Low/Medium porosity – lighter styler
  {
    name: 'Curl Softening Cream',
    category: 'styler',
    curlGroup: 'Coily',
    porosity: 'Medium',
    density: 'All',
    notes: 'Softens coils without too much weight.'
  },

  // Medium porosity – treatment
  {
    name: 'Elasticity Repair Mask',
    category: 'treatment',
    curlGroup: 'Coily',
    porosity: 'Medium',
    density: 'All',
    notes: 'Helps restore bounce and elasticity to coils.'
  },


  //  WEEKLY
{
  name: 'Soothing Scalp Serum',
  category: 'scalp',
  curlGroup: 'All',
  porosity: 'All',
  density: 'All',
  notes: 'Light, calming serum for dry or irritated scalps.'
},
{
  name: 'Gentle Clarifying Shampoo',
  category: 'cleanser',
  curlGroup: 'All',
  porosity: 'All',
  density: 'All',
  notes: 'Use occasionally to remove buildup.'
},

// plus these NEW weekly masks:
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



  // helper to pick items by product categoy type (cleanser, styler, etc)
  const choose = (category) =>
    products.filter(p => p.category === category);

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
      // note: `Apply to damp hair and scrunch to enhance your ${curlGroup.toLowerCase()} pattern.`
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
      // note: 'Focus on the scalp, use lukewarm water.'
    });
  }

  if (conditioners.length > 0) {
    night.push({
      title: 'Condition',
      main: `Apply ${conditioners[0].name}`,
      note: conditioners[0].notes || ''
      // note: 'Detangle gently with fingers or a wide-tooth comb.'
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
      // note: 'Leave on for 15–30 minutes with a cap for extra penetration.'
    });
  }

  if (scalpProds.length > 0) {
    weekly.push({
      title: 'Scalp Care',
      main: `Apply ${scalpProds[0].name}`,
      note: scalpProds[0].notes || ''
      // note: 'Massage gently with fingertips for a few minutes.'
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


app.get('/', function(req, res, next) {
  res.render('index', { title: 'Curly Care Coach' });
});

app.get('/quiz', function(req,res,next){
  res.render('quiz', {title:'Curly Care Coach - Quiz'});
});

// app.get('/routine', function(req,res,next){
//   res.render('routine', {title:'Curly Care Coach - Your Routine'});
// });
// app.get('/routine', async function(req, res, next) {
//   const { curlPattern, porosity, density, scalp, humidity } = req.query;

//   try {
//     // try to find a rule that matches the curlPattern (you can refine this later)
//     const rule = await RoutineRule.findOne({
//       where: { curlPattern: curlPattern || '2C' }
//     });

//     // fallback text if DB rule missing
//     const profileSummary =
//       rule?.profileSummary ||
//       `${curlPattern || '2C'} Curls, ${porosity || 'Unknown'} Porosity, ${density || 'Unknown'} Density, ${scalp || 'Unknown'} Scalp`;

//     // convert newline string into arrays of "step objects"
//     function parseSteps(text) {
//       if (!text) return [];
//       // each line: "Title | main text | note"
//       return text.split('\n').map(line => {
//         const [title, main, note] = line.split('|').map(s => s.trim());
//         return { title, main, note };
//       });
//     }

//     const morningSteps = parseSteps(rule?.morning);
//     const nightSteps = parseSteps(rule?.night);
//     const weeklySteps = parseSteps(rule?.weekly);

//     res.render('routine', {
//       title: 'Curly Care Coach - Your Routine',
//       profileSummary,
//       curlPattern,
//       porosity,
//       density,
//       scalp,
//       humidity,
//       morningSteps,
//       nightSteps,
//       weeklySteps
//     });
//   } catch (err) {
//     next(err);
//   }
// });

app.get('/routine', async function(req, res, next) {
  const { name, curlPattern, porosity, density, scalp, humidity } = req.query;
  let goals = req.query.goals || [];
  if (!Array.isArray(goals)) goals = [goals];

  try {
    const { profileSummary, curlGroup, proTip, morning, night, weekly } =
      await buildRoutineFromProducts({ curlPattern, porosity, density });

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


// app.get('/', function(req,res,next){
//   res.render('index', {title:'Express'});
// });

app.get('/page2', function(req,res,next){
  res.render('index', {title:'page2'});
});


// can use this to personalize data/page for each user based on the URL 
// can grab things from lists in your database
app.get('/user/:name', function(req,res,next){
  res.render('index', {title:req.params.name});
});

// DATABASE
// GET: show "Add Task" form
app.get('/addtask', function(req, res, next) {
  res.render('addtask', { title: 'Add Task' });
});

// POST: create Task in database
app.post('/addtask', async function(req, res, next) {
  try {
    const created = await Task.create({
      name: req.body.name,
      description: req.body.description
    });

    res.render('task_submitted', {
      title: 'Task Saved',
      task: created
    });
  } catch (err) {
    next(err);
  }
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
