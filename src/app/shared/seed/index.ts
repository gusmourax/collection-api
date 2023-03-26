import componentsSeeder from './components';
import usersSeeder from './users';

(async () => {
  await componentsSeeder();
  await usersSeeder();
})();
