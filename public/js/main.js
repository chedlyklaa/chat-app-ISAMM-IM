const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

const socket = io();

//get username and room from url
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

//join chatRoom
socket.emit('joinRoom', { username, room });


//get room and users
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
});

//message from server
socket.on('message', message => {
    console.log(message);
    outputMessage(message);

    //scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;

})

//message submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    //get message text
    const msg = e.target.elements.msg.value;
    //emit message to the server
    socket.emit('chatMessage', msg);
    //clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

function outputMessage(Message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${Message.username} <span>${Message.time}</span></p>
    <p class="text">
        ${Message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}


//add room name to dom
function outputRoomName(room) {
    roomName.innerText = room;
}
//add users to dom
function outputUsers(users) {
    userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}