import registerModule from '~/module';

import { createElement, waitForLoad, constructButton, insertCss } from '~/utils/dom';
import DropdownMenu from '~/utils/dropdown-menu';
import Dialog from '~/utils/dialog';

import style from './style.css';

const selectors = {
  emailList: style.locals['email-list'],
  copyButton: style.locals['copy-button'],
};

function copyEmails(e, emails) {
  const { target: button } = e;
  button.blur();
  navigator.clipboard.writeText(emails.join('\n'))
    .then(() => {
      button.classList.add('disabled');
      button.textContent = 'Copied';
      setTimeout(() => {
        button.classList.remove('disabled');
        button.textContent = 'Copy';
      }, 1000);
    })
    .catch(() => {
      button.classList.add('disabled');
      button.textContent = 'Could not copy';
    });
}

function getEmails(includeTeachers) {
  const emailWraps = document.querySelectorAll('.contactCardP');
  const emails = Array.from(emailWraps)
    .map(elem => elem.firstElementChild.href.split('mailto:')[1])
    .filter(email => {
      if (!includeTeachers) {
        return !Number.isNaN(Number(email[0])); // student emails start with graduation year number
      }
      return true;
    });
  return emails;
}

function showDialog(includeTeachers) {
  const emails = getEmails(includeTeachers);
  const copyButton = constructButton(
    'Copy', '', '',
    e => copyEmails(e, emails), selectors.copyButton,
  );
  const dialogBody = (
    <div>
      Copy-and-paste into Outlook&apos;s &quot;to&quot; field:
      { copyButton }
      <textarea rows="10" className={ selectors.emailList }>
        { emails.join('\n') }
      </textarea>
    </div>
  );
  const dialog = new Dialog('Send E-Mail', dialogBody, {
    leftButtons: [Dialog.buttons.CLOSE],
  });
  dialog.open();
}

function generateDropdown() {
  const dropdown = new DropdownMenu([
    {
      title: 'Students',
      onclick: () => showDialog(false),
    },
    {
      title: 'Students and Teachers', // TODO: "all" or "students and teacher"
      onclick: () => showDialog(true),
    },
  ], {
    buttonText: 'Send Email to ',
    buttonClassname: 'btn btn-default btn-sm dropdown-toggle',
    buttonIconClassname: '',
  });

  const button = dropdown.getDropdownButton();
  const caret = <span className="caret"></span>;
  button.appendChild(caret);
  button.style.color = '';
  return dropdown;
}

const domQuery = () => document.querySelector('#roster-reports');

async function classMessage(opts, unloaderContext) {
  const styles = insertCss(style.toString());
  unloaderContext.addRemovable(styles);

  const searchbar = await waitForLoad(domQuery);
  const dropdown = generateDropdown();
  searchbar.before(dropdown.getDropdownWrap());
  unloaderContext.addRemovable(dropdown.getDropdownWrap());
}

export default registerModule('{eb8d1fe3-70c4-473e-804c-5edc7f81a04b}', {
  name: 'Class Email',
  description: 'Quickly send an email to members of a class',
  main: classMessage,
});
