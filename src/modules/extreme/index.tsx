import registerModule from '~/core/module';

import { insertCss } from '~/utils/dom';

import procrastinate from './procrastinate';
import style from './style.css';
import cancelClass from './cancel-class';
import setAllImages from './set-images';

function isAprilFirst() {
  const date = new Date();
  return date.getDate() === 1 && date.getMonth() === 3;
}

let initRun = false;

const ELI_BENNET = 'https://bbk12e1-cdn.myschoolcdn.com/ftpimages/591/user/large_user4321840_2403859_930.JPG?resize=200,200';

function extremeInit() {
  insertCss(style.toString());
  if (!isAprilFirst()) {
    return;
  }

  initRun = true;
  setAllImages(ELI_BENNET);
}

function extremeMain() {
  if (!isAprilFirst()) {
    return;
  }
  if (!initRun) {
    // if it is now april first but on page load it wasn't
    extremeInit();
  }

  switch (window.location.hash) {
    case '#studentmyday/assignment-center':
      procrastinate();
      break;
    case '#studentmyday/schedule':
      cancelClass();
      break;
    default:
  }
}

export default registerModule('{508be51e-75e5-41da-afeb-d7b5cad20e94}', {
  name: 'easteregg.extreme',
  main: extremeMain,
  init: extremeInit,
  defaultEnabled: true,
  showInOptions: false,
});
