import React, { useState } from 'react';
import Web3 from 'web3';
import SneakTag from './SneakTag.json';
import '../css/App.css';

function Price() {
    const [tokenId, setTokenId] = useState('');
    const [price, setPrice] = useState('');
    const [connectedAccount, setConnectedAccount] = useState(null);
    const [Displaymsg, setDisplaymsg] = useState(''); 
//done using selected adddress seperate address not defined for testing purposes switched in demonstration.
    const connectMetamask = async (e) => {
        e.preventDefault();
        if (window.ethereum) {
            try {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                setConnectedAccount(window.ethereum.selectedAddress);
            } catch (error) {
                console.error(error);
            }
        }
    };
// changing the price of the sneaktag with the sneakid to the prices mapping stored in the SC
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (window.ethereum) {
          const web3 = new Web3(window.ethereum);
          // use the usecontract for interacting with the ABI saved in sneaktag.json
          const address = '0xc225b7FFAFC8A13117149901DbA2a63BfeaB4423';
          const contract = new web3.eth.Contract(SneakTag, address);
  
          // Convert the price to Wei as the price will be entered in string.
          const priceInWei = web3.utils.toWei(price, 'ether');
  // changing and displaying the changed price of the nft after the price change has been completed subject to presence of the tokenid.
          try {
              await contract.methods
                  .changeSneakerTagprice(window.ethereum.selectedAddress, tokenId, priceInWei)
                  .send({ from: window.ethereum.selectedAddress });
              console.log(`Price of token ID ${tokenId} has been changed to ${price}`);
              setDisplaymsg(`Price of token ID ${tokenId} has been changed to ${price}`); // final success message to change the price
          } catch (error) {
              console.error('Error changing price:', error.message);
          }
      } else {
          console.error('Please connect your own MetaMask');
      }
  };
// return elements for interaction with the dapp.
    return (
        <div className="auth-form-container">
            <h2>Change the Price</h2>
            <form className="Authenticate-form" onSubmit={handleSubmit}>
                <button className="button1" type="button" onClick={connectMetamask}>Connect Metamask</button>
                {connectedAccount && (
                    <p>
                        Connected Account:{" "}
                        <span className="connected-account">{connectedAccount}</span>
                    </p>
                )}
                <label htmlFor="TokenId">Token ID</label>
                <input value={tokenId} onChange={(e) => setTokenId(e.target.value)} type="text" placeholder="Enter your Token ID" id="TokenId" name="TokenId" />
                <label htmlFor="Price">Price Change</label>
                <input value={price} onChange={(e) => setPrice(e.target.value)} type="text" placeholder="Price to be changed" id="Price" name="Price" />
                <button type="submit">Finalize</button>
            </form>
            {Displaymsg && ( // Add this block
                <div className="success-message">
                    {Displaymsg}
                </div>
            )}
        </div>
    )
}

export default Price;
