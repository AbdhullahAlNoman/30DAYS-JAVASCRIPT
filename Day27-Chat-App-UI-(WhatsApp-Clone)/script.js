const contactsData = [
  {
    id: 1,
    name: 'Alice Rahman',
    color: '#FF7043',
    last: 'Are we meeting today?',
    ts: '10:12 AM',
    messages: [
      { from: 'them', text: 'Hey! Are you free later?', time: '10:10 AM' },
      { from: 'me', text: 'Yes — around 6pm works for me.', time: '10:11 AM' }
    ]
  },
  {
    id: 2,
    name: 'Bob Hasan',
    color: '#42A5F5',
    last: 'Sent a photo',
    ts: '9:03 AM',
    messages: [
      { from: 'them', text: 'Check this out', time: '9:02 AM' }
    ]
  },
  {
    id: 3,
    name: 'Cathy',
    color: '#66BB6A',
    last: 'Typing...',
    ts: 'Yesterday',
    messages: [
      { from: 'me', text: 'Good night!', time: 'Yesterday' }
    ]
  },
  {
    id: 4,
    name: 'Dev Team',
    color: '#AB47BC',
    last: 'Project update',
    ts: 'Mon',
    messages: [
      { from: 'them', text: 'Deployed to staging.', time: 'Mon 14:22' }
    ]
  }
];

const contactsEl = document.getElementById('contacts');
const messagesEl = document.getElementById('messages');
const headerName = document.getElementById('headerName');
const headerStatus = document.getElementById('headerStatus');
const headerAvatar = document.getElementById('headerAvatar');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const searchInput = document.getElementById('search');

let activeContact = null;

function timeNow() {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function renderContacts(filter = '') {
  contactsEl.innerHTML = '';
  contactsData
    .filter(c => c.name.toLowerCase().includes(filter.toLowerCase()))
    .forEach(c => {
      const div = document.createElement('div');
      div.className = 'contact';
      div.dataset.id = c.id;
      div.innerHTML = `
        <div class="avatar" style="background:${c.color}">${initials(c.name)}</div>
        <div class="meta">
          <div class="name">${c.name}</div>
          <div class="last">${c.last}</div>
        </div>
        <div class="time">${c.ts}</div>
      `;
      div.addEventListener('click', () => selectContact(c.id, div));
      contactsEl.appendChild(div);
    });
}

function initials(name) {
  return name
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function selectContact(id, elem) {
  document.querySelectorAll('.contact').forEach(x => x.classList.remove('active'));
  if (elem) elem.classList.add('active');
  activeContact = contactsData.find(c => c.id === id);
  headerName.textContent = activeContact.name;
  headerStatus.textContent = activeContact.messages?.slice(-1)[0]?.time || 'Online';
  headerAvatar.style.background = activeContact.color;
  headerAvatar.textContent = initials(activeContact.name);
  renderMessages();
}

function renderMessages() {
  messagesEl.innerHTML = '';
  if (!activeContact) {
    messagesEl.innerHTML = '<div class="daybreak">Select a chat to view messages</div>';
    return;
  }
  activeContact.messages.forEach(m => {
    const div = document.createElement('div');
    div.className = 'message ' + (m.from === 'me' ? 'out' : 'in');
    div.innerHTML = `<div>${escapeHtml(m.text)}</div><div class="metaSmall">${m.time}</div>`;
    messagesEl.appendChild(div);
  });
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, t =>
    ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[t])
  );
}

function sendMessage() {
  const text = messageInput.value.trim();
  if (!text || !activeContact) return;
  const now = timeNow();

  // Add new message
  activeContact.messages.push({ from: 'me', text, time: now });
  activeContact.last = text.length > 30 ? text.slice(0, 27) + '...' : text;
  activeContact.ts = now;
  messageInput.value = '';

  renderMessages();
  renderContacts(searchInput.value);

  // Mock auto reply
  setTimeout(() => {
    activeContact.messages.push({ from: 'them', text: 'Thanks — got it!', time: timeNow() });
    activeContact.last = 'Thanks — got it!';
    activeContact.ts = timeNow();
    renderMessages();
    renderContacts(searchInput.value);
  }, 900);
}

document.getElementById('newChatBtn').addEventListener('click', () => {
  const name = prompt('New contact name');
  if (!name) return;
  const color = ['#FF7043', '#42A5F5', '#66BB6A', '#AB47BC'][Math.floor(Math.random() * 4)];
  const c = { id: Date.now(), name, color, last: 'No messages yet', ts: 'Now', messages: [] };
  contactsData.unshift(c);
  renderContacts(searchInput.value);
  document.querySelectorAll('.contact')[0].click();
});

sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') sendMessage();
});
searchInput.addEventListener('input', () => renderContacts(searchInput.value));

// Initial render
renderContacts();
setTimeout(() => {
  const first = document.querySelector('.contact');
  if (first) first.click();
}, 50);
