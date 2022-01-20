pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./oracle.sol";
contract StableCoin is ERC20 {
    using SafeMath for uint256;

    address _owner;
    uint _swap_fee; // per thousand
    PriceConsumerV3 _bnb_price;
    constructor() ERC20("StableCoin", "DXS") {
        _owner = msg.sender;
        _swap_fee = 0;
        _bnb_price = new PriceConsumerV3();
    }

    //Modifier
    modifier onlyOwner(){
        require(msg.sender == _owner, "You are not contract owner");
        _;
    }

    function setSwapFee(uint swap_fee) external onlyOwner {
        _swap_fee = swap_fee;
    }

    function getBNBprice() public view returns(uint256){
      return _bnb_price.getThePrice();
    }
    function _getSlippageFee(uint256 burn_amount) public view returns(uint256){
        uint256 totalSupply = totalSupply();
        require(totalSupply>burn_amount, "Something went wrong.");
        uint256 slippage_fee = burn_amount.mul(1000).div(totalSupply.sub(burn_amount));
        return slippage_fee;
    }
    // burn BNB mint DXS
    function burnBNBmintDXS() public payable{
        require(msg.value>0, "Not enough BNB to burn.");
        uint256 price = getBNBprice();
        uint256 amount = uint256(msg.value).mul(price).div(10**8);
        uint256 fee = amount.mul(_swap_fee).div(1000);
        if(fee>0)
            _mint(_owner, fee);
        _mint(msg.sender, amount-fee);
    }

    //burn DXS mint BNB
    function BurnDXSmintBNB(uint256 amount) public {
        require(balanceOf(msg.sender)>= amount, "Not enough DXS.");
        _burn(msg.sender, amount);
        uint256 slippage_fee = _getSlippageFee(amount);
        require(slippage_fee<500, "Burn too much DXS.");
        uint256 price = getBNBprice();
        uint256 _amount = amount - amount.mul(slippage_fee).div(1000);
        require(address(this).balance>_amount.mul(price).div(10**8),"Not enough money.");

        uint256 fee = _amount.mul(_swap_fee).div(1000);
        (bool success, ) = msg.sender.call{value:_amount-fee}("");
        require(success, "Transfer to customer failed.");
        (success, ) = _owner.call{value:fee}("");
        require(success, "Transfer to owner failed.");
    }

}