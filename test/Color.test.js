const { assert } = require('chai')

const Color = artifacts.require('./Color.sol')

require('chai').use(require('chai-as-promised')).should()

contract('Color', (accounts) => {

    let contract

    before(async() => {

        contract = await Color.deployed()
    })

    describe("Deployment", async() => {

        it("Somehow manages to deploy...", async() => {

            const address = contract.address
            assert.notEqual(address, undefined)
            assert.notEqual(address, 0x0)
            assert.notEqual(address, '')
            assert.notEqual(address, null)
        })
        
        it("Actually has a name!", async() => {

            const name = await contract.name()
            assert.equal(name, "Color")

        })

        it("Has a symbol!", async() => {

            const symbol = await contract.symbol()
            assert.equal(symbol, "COLOR")

        })

    })

    describe("Minting stuff...", async() => {

        it("Creates a new token!", async() => {

            //test whether color has been minted
            const result = await contract.mint('#EC058E')
            const totalSupply = await contract.totalSupply()
            assert.equal(totalSupply, 1)
            const event = result.logs[0].args
            assert.equal(event.tokenId.toNumber(), 1, 'Correct ID!')
            assert.equal(event.from, '0x0000000000000000000000000000000000000000', 'From address is accurate.')
            assert.equal(event.to, accounts[0], 'To address is accurate')

            //avoid minting same color twice
            await contract.mint('#EC058E').should.be.rejected;
        })
    })

    describe("Indexing...", async() => {

        it("List colours!", async() => {

            await contract.mint('5386E4')
            await contract.mint('FFFFFF')
            await contract.mint('000000')

            const totalSupply = await contract.totalSupply()

            let color
            let result = []

            for(var i=0; i < totalSupply; i++){

                color = await contract.colors(i)
                result.push(color)
            }

            let expected_result = ['#EC058E','5386E4','FFFFFF','000000']

            assert.equal(result.join(','), expected_result.join(','))
        })
    })
})