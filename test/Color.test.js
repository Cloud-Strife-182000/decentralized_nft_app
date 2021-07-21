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

    })
})