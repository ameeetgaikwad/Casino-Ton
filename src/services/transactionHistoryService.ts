export async function getEthFiatRate() {
    const url = "https://min-api.cryptocompare.com/data/price?fsym=DOGE&tsyms=USD,EUR";
    return fetch(url).then(res => res.json())
}