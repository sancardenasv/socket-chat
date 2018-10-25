const createMessage = (user, msg) => {
    return {
        user,
        msg,
        date: new Date().getTime()
    }
}

module.exports = {
    createMessage
}