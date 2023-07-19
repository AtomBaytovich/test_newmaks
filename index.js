const axios = require('axios');
const fs = require('fs');
async function fetchUrl() {
    let arr = []
    try {
        const response = await axios.get(`https://card.wb.ru/cards/detail?appType=1&curr=rub&dest=-1257786&regions=80,38,83,4,64,33,68,70,30,40,86,75,69,1,66,110,48,22,31,71,114&spp=0&nm=138590435;94340606;94339119;138593051;94340317;138607462;94339244`)
        const data = response.data;

        for await(item of data.data.products) {
            let sizes = []
            let mod_item = {
                artikul: Number,
                sizes
            }
            mod_item.artikul = item.id;
            for await (elem of item.sizes) {
                const id_size = elem.name;
                let count_size = 0;
                if (elem.stocks.length > 0) {
                    for await (el of elem.stocks) {
                        count_size += el.qty
                    }
                }
                sizes.push({
                    [id_size]: count_size
                })
            }
            arr.push(mod_item)
        }

        // показывает в консоли все данные, могу в файл
        arr.forEach(el =>{
            console.log(el)
        })

        fs.writeFile('data.json', (arr), err => {
            if (err) throw err; 
            console.log('Data written to file'); 
        })

    } catch (error) {
        console.error(error)
    }
    
}

fetchUrl().catch(err => console.log(err))