const axios = require("axios"),
    cheerio = require("cheerio"),
    https = require("https"),
    client = axios.create({
        httpsAgent: new https.Agent({
            rejectUnauthorized: false
        })
    });

let data = {}


function flushData() {
    client.get("https://data.rmtc.org.cn/gis/listtype0M.html", {
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36"
        }
    }).then(res => {
        res = res.data.replace("\t", "")
        const $ = cheerio.load(res, {
            normalizeWhitespace: false,
            xmlMode: false,
            decodeEntities: true
        })

        $('li[class=datali]').each(function (i) {
            let val = $(this).find('div[class=divval]').text().trim(),
                name = $(this).find('div[class=divname]').text().trim().split(" ")[0];
            val = val.replace("\t", "").split("\n");
            data[name] = {
                value: val[0],
                date: val[1].trim()
            }
        })
        console.log(data)
    }).catch(err => {
        console.log(err.message)
        // flushData()
    })

    axios.get("https://www.baidu.com").then(res => {
        console.log("成功")
    }).catch(res => {
        console.log("失败")
    })
}

function getAreaRadiation(name) {
    return data[name];
}


// console.log(data)


flushData()

module.exports = {
    flushData,
    getAreaRadiation
}