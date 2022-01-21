import {Header} from '../../components/Header';
import {Pool} from '../../components/Pool';
import { useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import Web3 from 'web3';
import { dxsAbi, dxsAddress } from "../../contracts/stablecoin";
import {setAddress, setPrice, setSwapFee,setTotalSupply} from '../../store/store';
/* global parseInt */

export const HomePage = function(){    
    const dispatch = useDispatch();
    useEffect(async()=>{
        try{
            if (window.ethereum) {
                try {
                    const web3 = new Web3(window.ethereum);
                    const contract = new web3.eth.Contract(dxsAbi, dxsAddress);
                    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                    dispatch(setAddress(accounts[0]));
                    const price = await contract.methods.getBNBprice().call();
                    dispatch(setPrice(parseInt(price)));
                    const totalSupply = await contract.methods.totalSupply().call();
                    dispatch(setTotalSupply(parseInt(totalSupply)));
                    const swapFee = await contract.methods.getSwapFee().call();
                    dispatch(setSwapFee(parseInt(swapFee)));
                    
                } catch (error) {
                    console.log(error);
                }
              }
        }catch(e){

        }
        
    },[])
    return(
        <div>
            <Header/>
            <Pool/>
        </div>
    );
}