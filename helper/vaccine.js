const { calendarByPin } = require('cowin')

async function checkbypin(pin) {
    try {
        const data = await calendarByPin(pin, getformatteddate())

        if (!data.status) {
            throw ''
        } else {
            var available = []

            data.result.forEach(center => {
                var centeravail = center.sessions.filter(session => session.available_capacity > 0)
                if (centeravail.length !== 0) {
                    available.push({
                        name: center.name,
                        address: center.address,
                        state: center.state_name,
                        district: center.district_name,
                        block_name: center.block_name,
                        pincode: center.pincode,
                        block_name: center.block_name,
                        price: center.fee_type,
                        centers: centeravail
                    })
                }
            })
        }

        if (available.length !== 0) {
            let text = `<b>Found ${available.length} available vaccination center${(available.length === 1) ? '' : 's'}</b>\n\n`

            let alltextdata = []

            available.forEach((center, i) => {
                text += `<b>${i + 1}.</b> <i>${center.name}, ${center.block_name}, ${center.state} (${center.pincode})</i>\n\n<b>Address: </b>${center.address}\n<b>Pricing: </b>${center.price}\n<b>Sessions 👇</b>\n\n`
                center.centers.forEach(session => {
                    text += `📅 <u>Date:</u> (${session.date})\n👨‍👩‍👧‍👦 <u>Capacity:</u> ${session.available_capacity}\n👴 <u>Min Age Limit:</u> ${session.min_age_limit}\n💉 <u>Vaccine Name:</u> ${session.vaccine}\n⏰ <u>Slots:</u>${session.slots.map(time => {
                        return ' ' + time
                    })}\n\n`
                })
                alltextdata.push(text)
                text = ''
            })

            return {
                status: true,
                text: alltextdata
            }
        } else {
            throw ''
        }

    } catch (err) {
        return {
            status: false
        }
    }
}

function getformatteddate() {
    var currentTime = new Date();
    var currentOffset = currentTime.getTimezoneOffset();
    var ISTOffset = 330;
    var ISTTime = new Date(currentTime.getTime() + (ISTOffset + currentOffset) * 60000);
    var dateIST = ISTTime.getDate()
    var monthIST = ISTTime.getMonth() + 1
    var yearIST = ISTTime.getFullYear()
    return `${dateIST}-${monthIST}-${yearIST}`
}

module.exports = checkbypin

/*
    Please note changing some codes and adding your name will not make you a developer

    Project Name: Cowin-Bot
    Project Url: https://github.com/cachecleanerjeet/Cowin-Bot
    Author: Tuhin Kanti Pal, https://github.com/cachecleanerjeet
    Email: tprojectsdevelopment@gmail.com

    You can only expect community support !

*/