import express from 'express';
import routes from '@routes/index';
import morgan from 'morgan';

const app = express();

app.use(morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev'));

// Routes
app.use(routes);

app.listen(process.env.PORT, () => {
  console.log('Server is listening at port %s', process.env.PORT);
});
