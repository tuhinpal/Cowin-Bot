const { Telegraf, Markup } = require('telegraf')
const config = require('./config')
const { addUpdate, deleteData, allusers } = require('./helper/userhandler')
const pincodeDirectory = require('india-pincode-lookup')
const vaccine = require('./helper/vaccine')
const cron = require('node-cron')

const bot = new Telegraf(config.BOT_TOKEN)

bot.command('start', (ctx) => {
    if (ctx.message.chat.type === 'private') {
        try {
            ctx.replyWithHTML('Hello, This is a <b>Cowin update</b> Bot. It will send you a message if <b>Covid Vaccine</b> is available in your PinCode.\n\n<code>/set [Your-Pincode]</code> to set the bot for update.\n<b>Ex. </b><code>/set 731204</code>\n\nCheck /help for more options !')
        } catch (err) { }
    }
})

bot.command('delete', async (ctx) => {
    if (ctx.message.chat.type === 'private') {

        try {
            var deleteuser = await deleteData(ctx.message.from.id)
            ctx.reply(deleteuser.msg)
        } catch (err) { }
    }
})

bot.command('set', async (ctx) => {

    if (ctx.message.chat.type === 'private') {

        try {
            var lookup = pincodeDirectory.lookup(ctx.message.text.replace('/set ', ''))
            if (lookup.length === 0) {
                throw ''
            } else {

                var addupdateuser = await addUpdate(ctx.message.from.id, ctx.message.text.replace('/set ', ''))
                ctx.reply(addupdateuser.msg)

            }
        } catch (err) {
            try {
                ctx.replyWithHTML('Sorry this Pin code is invalid. Please send pincode again with correct format.\n\n<code>/set [Your-Pincode]</code>\n<b>Ex. </b><code>/set 731204</code>')
            } catch (e) { }
        }

    }
})


async function sendmessagetoall() {
    try {
        var result = await allusers()
        if (result.status) {
            var result = result.result
            result.forEach(async (user, i) => {
                setTimeout(async () => { // 3 sec wait time (Public api limitation 100 reqs in 5 mins)

                    try {
                        var sendmessagedata = await vaccine(user.pincode)
                        if (sendmessagedata.status) {
                            try {

                                for (var l = 0; l < sendmessagedata.text.length; l++) {

                                    await bot.telegram.sendMessage(user.uid, sendmessagedata.text[l], { parse_mode: 'HTML' }).catch(function (err) { })

                                }

                                await bot.telegram.sendMessage(user.uid, 'If you successfully booked an appointment you can stop updates by /delete command, so that other peoples can use this bot.', { parse_mode: 'HTML' }).catch(function (err) { })

                            } catch (e) { }
                        } else { }
                    } catch (err) { }

                }, 3000 * i)
            })
        }
    } catch (error) {
        console.log(error)
    }
}

cron.schedule(`*/${config.SCHEDULE_TIME} * * * *`, async () => {
    await sendmessagetoall()
});

bot.command('help', (ctx) => {
    if (ctx.message.chat.type === 'private') {
        try {
            ctx.replyWithHTML('<b>Co Commands:</b>\n\n<code>/set [Your-Pincode]</code> - Set Updates\n<code>/delete</code> - Cancel Updates\n',
                Markup.inlineKeyboard([
                    eval(Buffer.from('W01hcmt1cC5idXR0b24udXJsKCdEb25hdGUgaW4gQ292aWQgUmVsaWVmIEZ1bmQnLCAnaHR0cHM6Ly9jb3ZpZC5naXZlaW5kaWEub3JnLycpXQ==', 'base64').toString('utf-8')),
                    eval(Buffer.from('W01hcmt1cC5idXR0b24udXJsKCdNYWRlIGJ5JywgJ2h0dHBzOi8vdC5tZS90cHJvamVjdHMnKV0=', 'base64').toString('utf-8')),
                    eval(Buffer.from('W01hcmt1cC5idXR0b24udXJsKCdSZXBvc2l0b3J5JywgJ2h0dHBzOi8vZ2l0aHViLmNvbS9jYWNoZWNsZWFuZXJqZWV0L0Nvd2luLUJvdCcpXQ==', 'base64').toString('utf-8')),
                ])
            )
        } catch (err) { }
    }
})

bot.launch()
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))


/*
    Please note changing some codes and adding your name will not make you a developer

    Project Name: Cowin-Bot
    Project Url: https://github.com/cachecleanerjeet/Cowin-Bot
    Author: Tuhin Kanti Pal, https://github.com/cachecleanerjeet
    Email: tprojectsdevelopment@gmail.com

    You can only expect community support !

*/