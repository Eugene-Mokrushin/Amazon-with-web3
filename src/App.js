import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

// Components
import Navigation from './components/Navigation'
import Section from './components/Section'
import Product from './components/Product'

// ABIs
import Cryptazon from './abis/Cryptazon.json'

// Config
import config from './config.json'

function App() {

    const [account, setAccount] = useState(null)
    const [provider, setProvider] = useState(null)
    const [cryptazon, setCryptazon] = useState(null)

    const [electronics, setElectonics] = useState(null)
    const [clothing, setClothing] = useState(null)
    const [toys, setToys] = useState(null)

    const [item, setItem] = useState(null)
    const [toggle, setToggle] = useState(null)

    const togglePop = (item) => {
        setItem(item)
        setToggle(prev => !prev)
    }

    const blockChainData = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        setProvider(provider)

        const network = await provider.getNetwork()
        const cryptazon = new ethers.Contract(
            config[network.chainId].cryptazon.address,
            Cryptazon,
            provider
        )
        setCryptazon(cryptazon)

        const items = []
        for (let index = 0; index < 9; index++) {
            const item = await cryptazon.items(index + 1)
            items.push(item)
        }
        const electronics = items.filter((item) => item.category === "electronics")
        const clothing = items.filter((item) => item.category === "clothing")
        const toys = items.filter((item) => item.category === "toys")
        setElectonics(electronics)
        setClothing(clothing)
        setToys(toys)
    }

    useEffect(() => {
        blockChainData()
    }, [])

    return (
        <div>
            <Navigation account={account} setAccount={setAccount} />
            <h2>Best Sellers</h2>
            {electronics && clothing && toys && (
                <>
                    <Section title={"Clothing & Jewelry"} items={clothing} togglePop={togglePop} />
                    <Section title={"Electronics & Gadgets"} items={electronics} togglePop={togglePop} />
                    <Section title={"Toys & Gaming"} items={toys} togglePop={togglePop} />
                </>
            )}

            {toggle && (
                <Product
                    item={item}
                    provider={provider}
                    account={account}
                    cryptazon={cryptazon}
                    togglePop={togglePop}
                />
            )}

        </div>
    );
}

export default App;
