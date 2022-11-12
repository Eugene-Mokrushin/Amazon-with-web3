const { expect } = require("chai")
const { ethers } = require("hardhat");

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether')
}


const ID = 1
const NAME = "Shoes"
const CATEGORY = "Clothing"
const IMAGE = "https://ipfs.io/ipfs/QmTYEboq8raiBs7GTUg2yLXB3PMz6HuBNgNfSZBx5Msztg/shoes.jpg"
const COST = tokens(1)
const RATING = 4
const STOCK = 5

describe("Cryptazon", () => {
    let cryptazon
    let deployer
    let buyer

    beforeEach(async () => {
        // Setup Accounts
        [deployer, buyer] = await ethers.getSigners()

        // Deploy contract
        const Cryptazon = await ethers.getContractFactory("Cryptazon")
        cryptazon = await Cryptazon.deploy()
    })

    describe("Deployment", () => {
        it('should set the owner', async () => {
            expect(await cryptazon.owner()).to.equal(deployer.address)
        });

    })

    describe("Listing", () => {
        let transaction

        beforeEach(async () => {
            transaction = await cryptazon.connect(deployer).list(
                ID,
                NAME,
                CATEGORY,
                IMAGE,
                COST,
                RATING,
                STOCK
            )
            await transaction.wait()
        })
        it('should return item attributes', async () => {
            const item = await cryptazon.items(1)
            expect(item.id).to.equal(ID)
            expect(item.name).to.equal(NAME)
            expect(item.category).to.equal(CATEGORY)
            expect(item.image).to.equal(IMAGE)
            expect(item.cost).to.equal(COST)
            expect(item.rating).to.equal(RATING)
            expect(item.stock).to.equal(STOCK)
        });
        it('should emit list events', () => {
            expect(transaction).to.emit(cryptazon, "List")
        });
    })

    describe('Buying', () => {
        let transaction

        beforeEach(async () => {
            transaction = await cryptazon.connect(deployer).list(
                ID,
                NAME,
                CATEGORY,
                IMAGE,
                COST,
                RATING,
                STOCK
            )
            await transaction.wait()
            transaction = await cryptazon.connect(buyer).buy(ID, { value: COST })
        })
        it('should update buyerS order count', async () => {
            const result = await cryptazon.orderCount(buyer.address)
            expect(result).to.equal(1)
        });
        it('should add the order', async () => {
            const order = await cryptazon.orders(buyer.address, 1)
            expect(order.time).to.be.greaterThan(0)
            expect(order.item.name).to.equal(NAME)
        });
        it('should update the contract balance', async () => {
            const result = await ethers.provider.getBalance(cryptazon.address)
            expect(result).to.equal(COST)
        });
        it('should emit buy event', () => {
            expect(transaction).to.emit(cryptazon, "Buy")
        });
    });

})
