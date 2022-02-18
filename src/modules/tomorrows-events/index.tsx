import registerModule from '~/core/module';
import { UnloaderContext } from '~/core/module-loader';

import { fetchApi } from '~/utils/fetch';
import { createElement, waitForLoad, insertCss } from '~/utils/dom';
import { getUserId } from '~/utils/user';
import { isCurrentDay, addDayChangeListener } from '~/shared/schedule';

import style from './style.css';

const selectors = {
  label: style.locals.label,
};

function getTomorrowDateString() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return [date.getMonth() + 1, date.getDate(), date.getFullYear()].join('%2F');
}

function getAnnouncementWrap() {
  return document.querySelector('#schedule-header .alert.alert-info');
}

async function fetchData() {

  const id = await getUserId();

  const query = `mydayDate=${getTomorrowDateString()}&viewerId=${id}&viewerPersonaId=2`;
  const endpoint = `/api/schedule/ScheduleCurrentDayAnnouncmentParentStudent/?${query}`;

  return fetchApi(endpoint)
    .then(d => (
      d.filter((m: any) => m.Announcement !== '').map((m: any) => m.Announcement)
    ));
}

function createAlertBox() {
  const alertBox = (
    <div className="alert alert-info" style={{ marginTop: '10px' }}>
    </div>
  );
  document.getElementsByClassName('col-md-12')[3].children[1].appendChild(alertBox);
  return alertBox;
}

const domQuery = () => (
  getAnnouncementWrap()
  || (document.getElementsByClassName('pl-10')[0]
  && document.getElementsByClassName('pl-10')[0].textContent === 'There is nothing scheduled for this date.') // eslint-disable-line max-len
);

async function showTomorrowsEvents(unloaderContext: UnloaderContext) {
  await waitForLoad(domQuery);
  if (!(await isCurrentDay())) {
    return;
  }

  const announcements = await fetchData();
  if (!announcements.length) {
    return;
  }

  if (!getAnnouncementWrap()) {
    const alertBox = createAlertBox();
    unloaderContext.addRemovable(alertBox);
  }
  const label = (
      <div className={selectors.label}>
        <i>Tomorrow: { announcements.join('; ') }</i>
      </div>
  );
  getAnnouncementWrap().appendChild(label);
  unloaderContext.addRemovable(label);
}

function tomorrowsEventsMain(opts: void, unloaderContext: UnloaderContext) {
  const styles = insertCss(style.toString());
  unloaderContext.addRemovable(styles);

  showTomorrowsEvents(unloaderContext);
  const dayChangeListener = addDayChangeListener(() => {
    // there's a small delay between button click and date change in dom
    setTimeout(() => showTomorrowsEvents(unloaderContext), 100);
  });
  unloaderContext.addRemovable(dayChangeListener);
}

export default registerModule('{2b337dae-cb2f-4627-b3d6-bde7a5f2dc06}', {
  name: 'Tomorrow\'s Events',
  description: 'Show preview of the next day\'s events',
  main: tomorrowsEventsMain,
  defaultEnabled: false,
});
