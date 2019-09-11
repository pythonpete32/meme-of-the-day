const Meme = artifacts.require("Meme");

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Meme', (accounts) => {
    // write tests here
    let meme;

    before(async () => {
        meme = await Meme.deployed()
    })

    describe('Deployment', async () => {
        it('deploys Meme contract', async () => {
            // Act
            const address = await meme.address

            // Assert
            assert.notEqual(address, "")
            assert.notEqual(address, null)
            assert.notEqual(address, undefined)
            assert.notEqual(address, 0x0)
        })
    })

    describe('Set state', async () => {
        it('should set the state of the hash var', async () => {
            // Arange
            const testHash = '0xSomeHash'
            // Act
            const result = await meme.getState()
            // Assert
            assert.equal(result, testHash)
        })
    })
})