import Auth from './auth';
import Library from './library';
import Categories from './categories';
import Users from './users';
import Anime from './anime';
import Mappings from './mappings';

export default class KitsuApi {
  auth = new Auth();

  library = new Library();

  categories = new Categories();

  users = new Users();

  anime = new Anime();

  mappings = new Mappings();
}
