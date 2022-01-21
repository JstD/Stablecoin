import {React, useState,} from 'react';
import styled from "styled-components";
import {useSelector} from 'react-redux';
import {setAddress} from '../../store/store';
export const Header = function(){
    const address = useSelector(state=>state.address);
    return (
    <TopBar>
        <Button onClick ={()=>window.location.reload()}>{address||"Connect Wallet"}</Button>
    </TopBar>);
}
const TopBar = styled.div`
    height: 50px;
`
const Button = styled.button`
    background-color: rgb(253, 234, 241);
    color: rgb(213, 0, 102);
    border: 2px solid white;
    font-weight: bold;
    font-size: 1.2em;
    border-radius:14px;
    float: right;
    padding:5px;
    margin:10px;
    margin-right:20px;
    cursor:pointer;
`