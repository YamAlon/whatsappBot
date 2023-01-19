const qrcode = require('qrcode-terminal');
const { Client } = require('whatsapp-web.js');

const client = new Client();

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Client is ready!');
    main();
});

async function getGroupMembers(chatName){
    var members = await client.getChats().then((chats) => chats.find((chat) => chat.name === chatName)).then(group => group.participants);
    return members;
}

async function sendMsgToGroupMembersPrivately(groupName, msg){
   var targets = await getGroupMembers(groupName).then(members => members.map(m => m.id._serialized));
   console.log(targets);
   targets.forEach(target => client.sendMessage(target, msg));
}



async function main(){
	const args = require('args-parser')(process.argv);
	if(Object.entries(args).length === 0 || args["help"] || args["h"]){
		help();
		return;
	}
	else if(args["sendMsgToGroupMembersPrivately"] && args["GroupName"]!= null && args["MSG"]!= null){
		console.log(`[+]Sending the message:'${args["MSG"]}' to all the members in the group:${args["GroupName"]}`)
		sendMsgToGroupMembersPrivately(args["GroupName"], args["MSG"]);
		return;
	}
}

function help(){
	console.log("the code is not secure or stable, for personal use only!");
	console.log("[+]bot.js sendMsgToGroupMembersPrivately -GroupName='group name' -MSG='hello'");
}

client.initialize();
