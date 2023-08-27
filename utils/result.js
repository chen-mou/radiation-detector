function text(content, from, to) {
    return {
        "ToUserName": to,
        "FromUserName": from,
        "CreateTime": new Date().getTime(),
        "MsgType": "text",
        "Content": content
    }
}


module.exports = {
    text
}