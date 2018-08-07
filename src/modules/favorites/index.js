import createModule from '~/utils/module';
import { waitForLoad, insertCss } from '~/utils/dom';

import { createMenu, addListeners } from './favorites-ui';
import { getSavedFavorites } from './favorites-model';

import style from './style.css';

async function favorites() {
  await waitForLoad(() => document.querySelector('.topnav > .twoline.parentitem.last'));

  const menu = await createMenu(await getSavedFavorites());
  const directoriesMenu = document.querySelector('.topnav > .twoline.parentitem.last');

  directoriesMenu.before(menu);
  addListeners();
  insertCss(style.toString());
}

export default createModule('{a98c8f19-a6fc-449a-bc03-ca9dc0cc7550}', {
  name: 'Favorites',
  init: favorites,
});