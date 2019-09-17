import React, { useState, useEffect } from 'react'
import { Heading, Box, Card, Button, Image, Flex, ToastMessage } from "rimble-ui";
import FileInput from './FileInput'



const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) // leaving out the arguments will default to these values

function MemeCard(props) {


    const [selectFile, setFile] = useState("");
    const [isDisabled, setIsDisabled] = useState(true)
    const [memeHash, setMemeHash] = useState()

    const contract = props.contract
    const account = props.account


    useEffect(() => {
        console.log('MemeCard mounted: ')
        console.log("memecard props: ", props)
        console.log("memecard contract: ", contract)
        console.log("memecard account: ", account)
        loadBlockChainData()
    }, []);

    async function loadBlockChainData() {
        console.log("contract: ", contract)
        const IPFShash = await contract.methods.getMemeHash().call()
        setMemeHash(IPFShash)
    }


    const handleFile = e => {
        console.log(`Event: `, e)
        e.preventDefault();
        // process file for ipfs
        const file = e.target.files[0]
        const reader = new window.FileReader()
        reader.readAsArrayBuffer(file)
        reader.onloadend = () => {
            console.log('buffer', Buffer(reader.result))
            setFile({ buffer: Buffer(reader.result) })
        }
        setIsDisabled(false)
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        console.log('Submitting to IPFS....')
        ipfs.add(selectFile.buffer, async (error, result) => {
            try {
                const memeHash = await result[0].hash
                console.log('Ipfs result hash', memeHash)
                // step2: store file on blockchain

                contract.methods.setMemeHash(memeHash).send({ from: account })
                    .then((result) => {
                        this.setMemeHash(memeHash)
                    })

            } catch (error) {
                console.log('ERROR: ', error)
            }
        })


    }

    // example: "QmcEsejpGhrEKoNnFar4kvbCTaoFno2XhAXCWjEUq4ucJX"
    // example url: https://ipfs.io/ipfs/QmcEsejpGhrEKoNnFar4kvbCTaoFno2XhAXCWjEUq4ucJX/
    return (
        <>
            <ToastMessage.Provider ref={node => (window.toastProvider = node)} />
            <Card width={"40%"} mx={"auto"} my={5} p={0}>
                <Flex justifyContent={'center'}>
                    <Box py={2}>
                        <Image
                            borderRadius={8}
                            height="auto"
                            src={`https://ipfs.io/ipfs/${memeHash}`}
                            alt="Meme King's meme..."
                        />
                    </Box>
                </Flex>

                <Box px={4} py={3}>
                    <Heading.h2>Card title</Heading.h2>
                    <Heading.h5 color="#667">Card sub-title</Heading.h5>
                </Box>

                {/*  */}

                <Flex alignItems={"flex-end"} justifyContent={"space-between"}>

                    {/*  */}


                    <Box px={2} py={2}>
                        <FileInput type="file" onChange={handleFile} />
                    </Box>
                    <Box px={2} py={2}>
                        <Button
                            icon="Send"
                            iconpos="right"
                            disabled={isDisabled}
                            onClick={handleSubmit}
                        >
                            Submit
                        </Button>
                    </Box>

                </Flex>
            </Card>
        </>


    )
}

export default MemeCard
