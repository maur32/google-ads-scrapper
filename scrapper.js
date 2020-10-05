const puppeter = require("puppeteer")
const readline = require("readline-sync")


async function scrap(pesquisa) {
    const browser = await puppeter.launch({headless: false})
    const page = await browser.newPage()
    await page.setViewport({
        width: 1280,
        height: 768
    })
    await page.goto('https://www.google.com/')
    const InputFiled = await page.$(
        "#tsf > div:nth-child(2) > div.A8SBwf > div.RNNXgb > div > div.a4bIc > input"
    );
    await InputFiled.type(pesquisa)
    await page.keyboard.press("Enter")
    await page.waitForSelector(".d5oMvf")
    const results = await page.evaluate(()=>{
        const searchResults = document.querySelectorAll(".d5oMvf")
        const temp = [];
        searchResults.forEach(searchItem => {
            let item ={
                heading: searchItem.querySelector("a .cfxYMc.JfZTW.c4Djg.MUxGbd.v0nnCb span").innerHTML,
                link: searchItem.querySelector("a").href,
            }
            temp.push(item)
        })
        return temp;
    })   
    require("fs").writeFile("result.json",JSON.stringify(results), ()=>{});
    browser.close()
}

const pesquisa = readline.question("Procurar por: \n")
scrap(pesquisa)