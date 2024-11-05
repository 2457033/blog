// module.exports = function (io) {
//     var users = {};
//     io.on("connection", (socket) => {
//         console.log('连接成功');
//         socket.on('login', (id, toUid) => {
//             console.log(socket.id);
//             // 回复客户端
//             socket.name = id;
//             users[id] = socket.id
//             socket.emit('login', socket.id, users[toUid]);
//         });
//         // 用户一对一消息发送
//         socket.on('msg', (msgs, uid, toUid) => {
//             console.log(msgs);

//             socket.emit('toMeMsg', msgs, uid, toUid)
//             // 发送给对方
//             socket.to(users[toUid]).emit('msg', msgs, uid, toUid);
//         });
//         // 用户离开
//         socket.on('disconnecting', () => {
//             console.log(users);
//             if (users.hasOwnProperty(socket.name)) {
//                 delete users[socket.name]
//                 console.log(socket.id + '离开');
//             }
//         })
//     });
// }
const db = require("../db/index");
const uuid = require("uuid");
const { utcNow } = require("../utils/common");

module.exports = function (io) {
	var users = {};
	var rooms = {}

	const sql = ((uId, toUID, content, msgType, contentType) => {
		const insertReadSql = `insert into chats (id, uId, toUID, content, msgType, sendTime, contentType) values ('${uuid.v4()}', '${uId}', '${toUID}', '${content}', ${msgType}, '${utcNow()}', ${contentType});`
		return insertReadSql
	})
	io.on("connection", (socket) => {
		console.log('连接成功');
		socket.on('login', (id, room) => {
			console.log(id);
			// 回复客户端
			socket.name = id;
			users[id] = socket.id
			socket.emit('login', id, room);
			rooms[id] = room
		});

		// 用户一对一消息发送
		socket.on('msg', (msgs, uid, toUid, contentType) => {
			console.log(rooms[uid]);
			if (rooms[uid] === rooms[toUid]) {
				db(sql(uid, toUid, msgs, 1, contentType), (err, results) => {
					if (!err) {
						console.log('聊天记录插入成功');
					} else {
						console.error('聊天记录插入失败', err);
					}
				})
			} else {
				db(sql(uid, toUid, msgs, 0, contentType), (err, results) => {
					if (!err) {
						console.log('聊天记录插入成功');
					} else {
						console.error('聊天记录插入失败', err);
					}
				})
			}

			// console.log(uid);
			socket.emit('toMeMsg', msgs, uid, toUid)
			// 发送给对方
			socket.to(users[toUid]).emit('msg', msgs, uid, toUid);
		});
		// 用户离开
		socket.on('disconnecting', () => {
			console.log(users);
			if (users.hasOwnProperty(socket.name)) {
				delete users[socket.name]
				console.log(socket.id + '离开');
			}
		})
	});
}