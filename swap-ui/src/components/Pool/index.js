import styled from "styled-components";
import { ArrowDownOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { dxsAbi, dxsAddress } from "../../contracts/stablecoin";

import Web3 from 'web3';

export const Pool = function () {
    const [pharse, setPharse] = useState(true); // BNB to DXS 
    const [from, setFrom] = useState();
    const [to, setTo] = useState();
    const [slippage,setSlippage] = useState(0)
    const price = useSelector(state => state.price);
    const swapFee = useSelector(state => state.swapFee);
    const totalSupply = useSelector(state => state.totalSupply);
    const address = useSelector(state => state.address);
    useEffect(() => {
        setFrom(from);
        handleFromChange(from);
    }, [pharse])
    useEffect(() => {
        if(pharse)
            setSlippage(0);
        else{
            if(totalSupply>from*10**18)
                setSlippage(parseFloat((from/(totalSupply/10**18-from)*100).toFixed(4)));
            else{
                setSlippage('NaN')
            }
        }
    },[from,to])
    const clickChangePharseHandle = () => {
        setPharse(!pharse);
    };
    const handleFromChange = async (value) => {
        setFrom(value);
        if(value){
            if (pharse) {
                setTo(parseFloat((value * price / 10 ** 8).toFixed(4)))
            }
            else {
                setTo(parseFloat((value / (price / 10 ** 8)).toFixed(4)))
            }
        }
        else{
            setTo('');
        }
    }
    const handleToChange = async (value) => {
        setTo(value);
        if(value){
            if (pharse) {
                setFrom(parseFloat((value / (price / 10 ** 8)).toFixed(4)))
            }
            else {
                setFrom(parseFloat((value * price / 10 ** 8).toFixed(4)))
            }
        }
        else{
            setFrom('');
        }
        
    }
    const handleClickSwap = async () => {
        if(from>0){
            const web3 = new Web3(window.ethereum);
            const contract = new web3.eth.Contract(dxsAbi, dxsAddress);
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            console.log(accounts[0]);
            if(pharse) {
                contract.methods.burnBNBmintDXS()
                .send({
                    from: accounts[0],
                    value : web3.utils.toWei(from,'ether'),
                })                
            }
            else{
                contract.methods.burnDXSmintBNB(web3.utils.toWei(from,'ether'))
                .send({from: accounts[0]})
            }
        }
    }
    return (
        <PoolWrapper>
            <Text>Swap</Text>
            <InputWrapper >
                <Input placeholder="0.0" value={from} onChange={(event) => handleFromChange(event.target.value)}></Input>
                <Label>{pharse ? "BNB" : "DXS"}</Label>
            </InputWrapper>
            <IconWrapper>
                <ChangeButton onClick={clickChangePharseHandle}>
                    <ArrowDownOutlined />
                </ChangeButton>
            </IconWrapper>
            <InputWrapper>
                <Input placeholder="0.0" value={to} onChange={(event) => handleToChange(event.target.value)}></Input>
                <Label>{pharse ? "DXS" : "BNB"}</Label>
            </InputWrapper>
            <InfoWrapper>
            <SwapFeeWrapper>Swap Fee: {swapFee}%    </SwapFeeWrapper>
            <SlippageWrapper>Slippage: {slippage}%  </SlippageWrapper>
            </InfoWrapper>
            <SwapWrapper>
                <SwapButton onClick={handleClickSwap}>Swap</SwapButton>
            </SwapWrapper>
        </PoolWrapper>
    );
}
const PoolWrapper = styled.div`
    padding:15px;
    background-color: white;
    max-width: 480px;
    width: 100%;
    min-width: 480px;
    box-shadow: rgb(0 0 0 / 1%) 0px 0px 1px;
    border-radius: 24px;
    margin-top: 10rem;
    margin-left: auto;
    margin-right: auto;
    z-index: 1;
`;
const Text = styled.div`
    font-size: 1.2em;
    font-weight: bold;
    margin-bottom: 10px;
`;
const InputWrapper = styled.div`
    width: 97%;
    align: center;
    background-color: rgb(247, 248, 250);
    border: 1px solid rgb(255, 255, 255);
    border-radius: 20px;
    margin:10px;
    margin-bottom:0;
    height:90px;
    
`;
const SwapButton = styled.button`
    background-color: rgb(253, 234, 241);
    color: rgb(213, 0, 102);
    border: 2px solid white;
    font-weight: bold;
    font-size: 1.2em;
    border-radius:14px;
    margin:auto;
    margin-top:0;
    width:100%;
    line-height:2em;
    font-size: 1.5em;
    cursor:pointer;
`;
const SwapWrapper = styled.div`
    width:97%;
    margin:10px;
    text-align: center;
`
const Input = styled.input`
    background-color: rgb(247, 248, 250);
    width:70%;
    display:inline-block;
    padding:10px;
    margin:5px;
    border:none;
    font-size: 2.2em;
    &:focus {
        outline: none;
    }
`;
const Label = styled.div`
    display: inline-block;
    font-size:1.3em;
    font-weight: bold;
    color: rgb(86, 90, 105);
    width:25%;
    background-color: rgb(237, 238, 242);
    text-align: center;
    border-radius: 20px;
    box-shadow: rgb(0 0 0 / 8%) 0px 6px 10px;
    &:hover{
        background-color: rgb(206, 208, 217);
    }
`
const IconWrapper = styled.div`
    height:0;
    text-align: center;
    position: relative;
    top:-10px;
    margin:0;
`;
const ChangeButton = styled.button`
    border: 4px solid rgb(255, 255, 255);
    width:32px;
    cursor:pointer;
    border-radius:10px;
`;
const SwapFeeWrapper = styled.div`
    display:inline-block;
    float: left;
`
const InfoWrapper = styled.div`
    margin:10px;
    margin-bottom:10px;
    color:rgb(213, 0, 102);
`;
const SlippageWrapper = styled.div`
    display:inline-block;
    float: right;
`;