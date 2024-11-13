//const BASE_URL = "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies";
const BASE_URL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

const dropdown  = document.querySelectorAll(".dropdown select");
const button = document.querySelector("form button");
const fromCurrency = document.querySelector(".from select");
const toCurrency = document.querySelector(".to select");
 
for (let select of dropdown){
    for(currencyCode in countryList){
        let newOption = document.createElement("option");
        newOption.innerText = currencyCode;
        newOption.value = currencyCode;

        if(select.name === 'from' && currencyCode === 'USD'){
            newOption.selected = 'selected';
        }else if (select.name === 'to' && currencyCode === 'INR'){
            newOption.selected = 'selected';
        }
        select.append(newOption);
    }

    select.addEventListener("change",(e)=>{
        updateFlag(e.target)
    })
}

const updateFlag = (element) => {
    let currencyCode = element.value;
    let countryCode = countryList[currencyCode];
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`
    let img = element.parentElement.querySelector("img");
    img.src = newSrc;
}

button.addEventListener("click",async(e) =>{
    e.preventDefault();
    let amount = document.querySelector(".amount input");
    let amountValue = amount.value;
    if(amountValue === "" || amountValue < 1){
        amountValue = 1;
        amount.value = '1'
    }
    
    //console.log(fromCurrency.value,toCurrency.value);
    
    //const URL = `${BASE_URL}/${fromCurrency.value.toLowerCase()}/${toCurrency.value.toLowerCase()}.json`;
    const URL = `${BASE_URL}/${fromCurrency.value.toLowerCase()}.json`;
    
    let response = await fetch(URL)
    let data = await response.json();
    console.log(data.usd);
    const usdEntries = Object.entries(data.usd);
    const toCurrencyValue = toCurrency.value.toLowerCase();
    if (data.usd.hasOwnProperty(toCurrencyValue)) {
        const conversionRate = data.usd[toCurrencyValue];
        console.log(`Conversion rate for ${toCurrencyValue}:`, conversionRate);
    } else {
        console.log(`Currency ${toCurrencyValue} not found.`);
    }
    //console.log(usdEntries);
    
    
})
